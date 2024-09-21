import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TaskService } from './task.service';
import { PlantNeedsService } from '../plant-needs/plant-needs.service';
import { WeatherService } from '../api-meteomatics';  // Cambia al nuevo WeatherService
import { NotificationsGateway } from '../notifications/notification.gateway';
import { TaskGateway } from './task.gateway';

@Injectable()
export class AutoTaskSchedulerService {
  constructor(
    private readonly taskService: TaskService,
    private readonly plantNeedsService: PlantNeedsService,
    private readonly weatherService: WeatherService,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly taskGateway: TaskGateway,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    console.log('Ejecutando tarea programada para verificar y asignar tareas automáticamente');
    await this.scheduleTasks();
  }

  async scheduleTasks() {
    const allPlantNeeds = await this.plantNeedsService.findAll();

    // Cambia a la nueva llamada a WeatherAPI para obtener el clima actual
    const weatherData = await this.weatherService.getCurrentWeather();

    if (!weatherData || !weatherData.current) {
      console.error('No se pudo obtener los datos meteorológicos.');
      return;
    }

    const currentTemperature = weatherData.current.temp_c;
    const currentPrecipitation = weatherData.current.precip_mm;
    const currentWindSpeed = weatherData.current.wind_kph;
    const currentHumidity = weatherData.current.humidity;

    // Aquí podrías tener una lógica para asignar tareas a todos los usuarios conectados o a usuarios específicos
    const allSocketIds = [...this.notificationsGateway.getAllSocketIds()]; // Reemplaza con el método adecuado para obtener todos los socketIds

    for (const socketId of allSocketIds) {
      const userId = this.notificationsGateway.getUserIdBySocketId(socketId);

      if (!userId) {
        console.error(`No se pudo obtener el userId para el socketId ${socketId}`);
        continue;
      }

      for (const plantNeeds of allPlantNeeds) {
        let taskDescription = '';

        if (currentTemperature > plantNeeds.maxTemperature) {
          taskDescription = `¡La temperatura es alta! Es momento de ubicarlas en la sombra ${plantNeeds.plant.tag} - ${plantNeeds.plant.species}`;
        } else if (currentTemperature < plantNeeds.minTemperature) {
          taskDescription = `¡La temperatura bajó! Proporcionar luz a las plantas ${plantNeeds.plant.tag} - ${plantNeeds.plant.species}`;
        } else if (currentHumidity < plantNeeds.humidityRequirement) {
          taskDescription += ` Necesitamos aumentar la luminosidad para las plantas ${plantNeeds.plant.tag} - ${plantNeeds.plant.species}.`;
        }

        if (currentPrecipitation < plantNeeds.maxPrecipitation) {
          taskDescription += ` No es buen momento para regar las plantas manualmente debido a alta luminosidad para ${plantNeeds.plant.tag} - ${plantNeeds.plant.species}.`;
        }

        if (currentWindSpeed > plantNeeds.maxWindSpeed) {
          taskDescription += ` Proteger las plantas ${plantNeeds.plant.tag} - ${plantNeeds.plant.species} debido a alta velocidad del viento.`;
        }

        if (taskDescription) {
          const task = await this.taskService.createTask({
            description: taskDescription,
            dueDate: new Date(),
            plantId: plantNeeds.plant.id,
            isCompleted: false,
            userId: parseInt(userId),
            plantNeedsId: plantNeeds.id, // Aquí se agrega plantNeedsId
          });

          console.log('Tarea creada:', task);
          this.notificationsGateway.sendNotificationToUser(parseInt(userId), `Se ha creado una nueva tarea: ${task.description}`);
          this.taskGateway.sendTaskToUser(parseInt(userId), task);
        }
      }
    }
  }
}
