// task.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/entities/user.entity';
import { Plant } from '../plant/entities/plant.entity';
import { PlantNeeds } from '../plant-needs/entities/plant-need.entity';
import { WeatherService } from '../api-meteomatics';
import { NotificationsService } from '../notifications/notification.service';
import { TaskGateway } from './task.gateway'; // Importar TaskGateway

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
    private plantNeedsRepository: Repository<PlantNeeds>,
    private readonly weatherService: WeatherService,
    private notificationsService: NotificationsService,
    private taskGateway: TaskGateway,  // Inyectar TaskGateway
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { description, dueDate, userId, plantId, plantNeedsId } = createTaskDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const plant = plantId ? await this.plantRepository.findOne({ where: { id: plantId } }) : null;
    const plantNeeds = plantNeedsId ? await this.plantNeedsRepository.findOne({ where: { id: plantNeedsId } }) : null;

    const weatherData = await this.weatherService.getCurrentWeather();
    const dynamicDescription = `${description} - Condiciones meteorológicas: ${JSON.stringify(weatherData)}`;

    const task = this.taskRepository.create({
      description: dynamicDescription,
      dueDate,
      user,
      plant,
      plantNeeds,
    });

    const savedTask = await this.taskRepository.save(task);

    const notificationMessage = `Nueva tarea asignada: ${dynamicDescription}`;
    await this.notificationsService.createNotification({
      message: notificationMessage,
      userId: userId,
    });

    // Emitir el evento de nueva tarea a través de Socket.IO
    this.taskGateway.sendTaskToUser(userId, savedTask);

    return savedTask;
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new Error('Task not found');
    }

    Object.assign(task, updateTaskDto);
    const updatedTask = await this.taskRepository.save(task);

    // Emitir evento de tarea actualizada
    this.taskGateway.sendUpdatedTask(updatedTask);

    return updatedTask;
  }

  async deleteTask(id: number): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new Error('Task not found');
    }

    await this.taskRepository.remove(task);

    // Emitir evento de tarea eliminada
    this.taskGateway.sendDeletedTask(id);
  }

  async getTasksForUser(userId: number): Promise<Task[]> {
    return this.taskRepository.find({ where: { user: { id: userId } }, relations: ['user', 'plant', 'plantNeeds'], order: { createdAt: 'DESC' }, });
  }

  async getTasksForPlant(plantId: number): Promise<Task[]> {
    return this.taskRepository.find({ where: { plant: { id: plantId } }, relations: ['user', 'plant', 'plantNeeds'], order: { createdAt: 'DESC' }, });
  }
}
