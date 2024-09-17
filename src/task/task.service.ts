import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/entities/user.entity';
import { Plant } from '../plant/entities/plant.entity';
import { PlantNeeds } from '../plant-needs/entities/plant-need.entity';
import { WeatherService } from '../api-meteomatics'; // Asegúrate de importar el servicio correctamente
import { NotificationsService } from '../notifications/notification.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Plant)
    private plantRepository: Repository<Plant>,
    @InjectRepository(PlantNeeds)
    private plantNeedsRepository: Repository<PlantNeeds>,  // Añadido el repositorio de PlantNeeds
    private readonly weatherService: WeatherService,  // Inyectamos WeatherService
    private notificationsService: NotificationsService, 
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { description, dueDate, userId, plantId, plantNeedsId } = createTaskDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const plant = plantId ? await this.plantRepository.findOne({ where: { id: plantId } }) : null;
    const plantNeeds = plantNeedsId ? await this.plantNeedsRepository.findOne({ where: { id: plantNeedsId } }) : null;

    // Obtén la fecha actual en el formato requerido por la API de Meteomatics
    const currentDate = new Date().toISOString();

    // Define los parámetros que deseas obtener de la API de Meteomatics
    const parameters = 't_2m:C,precip_1h:mm,wind_speed_10m:ms'; // Temperatura, precipitación y velocidad del viento

    // Obtén los datos meteorológicos
    const weatherData = await this.weatherService.getWeatherData(currentDate, parameters);

    // Aquí puedes usar los datos meteorológicos para determinar la descripción o los detalles de la tarea
    // Por ejemplo, ajustar la descripción de la tarea en base a la temperatura y otras condiciones climáticas
    const dynamicDescription = `${description} - Condiciones meteorológicas: ${JSON.stringify(weatherData)}`;

    const task = this.taskRepository.create({
      description: dynamicDescription,  // Usamos la descripción dinámica
      dueDate,
      user,
      plant,
      plantNeeds,  // Añadido plantNeeds
    });

    const savedTask = await this.taskRepository.save(task);

    // Crear una notificación para el usuario cuando se crea una nueva tarea
    const notificationMessage = `Nueva tarea asignada: ${dynamicDescription}`;
    await this.notificationsService.createNotification({
      message: notificationMessage,
      userId: userId,
    });

    return savedTask;
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new Error('Task not found');
    }

    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async deleteTask(id: number): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new Error('Task not found');
    }

    await this.taskRepository.remove(task);
  }

  async getTasksForUser(userId: number): Promise<Task[]> {
    return this.taskRepository.find({ where: { user: { id: userId } }, relations: ['user', 'plant', 'plantNeeds'], order: { createdAt: 'DESC' }, });
  }

  async getTasksForPlant(plantId: number): Promise<Task[]> {
    return this.taskRepository.find({ where: { plant: { id: plantId } }, relations: ['user', 'plant', 'plantNeeds'], order: { createdAt: 'DESC' }, });
  }
}