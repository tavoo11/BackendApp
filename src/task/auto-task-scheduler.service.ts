import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TaskService } from './task.service';
import { PlantNeedsService } from '../plant-needs/plant-needs.service';
import { WeatherService } from '../api-meteomatics';
import { NotificationsGateway } from '../notifications/notification.gateway';

@Injectable()
export class AutoTaskSchedulerService {
  constructor(
    private readonly taskService: TaskService,
    private readonly plantNeedsService: PlantNeedsService,
    private readonly weatherService: WeatherService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    console.log('Ejecutando tarea programada para verificar y asignar tareas automáticamente');
    await this.scheduleTasks();
  }

  async scheduleTasks() {
    const allPlantNeeds = await this.plantNeedsService.findAll();
    const weatherData = await this.weatherService.getWeatherData('now', 't_2m:C,precip_1h:mm,wind_speed_10m:ms,relative_humidity_2m:p');

    if (!weatherData || !weatherData.data) {
      console.error('No se pudo obtener los datos meteorológicos.');
      return;
    }

    const currentTemperature = this.extractWeatherParameter(weatherData, 't_2m:C');
    const currentPrecipitation = this.extractWeatherParameter(weatherData, 'precip_1h:mm');
    const currentWindSpeed = this.extractWeatherParameter(weatherData, 'wind_speed_10m:ms');
    const currentHumidity = this.extractWeatherParameter(weatherData, 'relative_humidity_2m:p');

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
        } else  if (currentHumidity < plantNeeds.humidityRequirement) {
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
            plantNeedsId: (plantNeeds.id) // Aquí se agrega plantNeedsId
          });

          console.log('Tarea creada:', task);
          this.notificationsGateway.sendNotificationToUser(parseInt(userId), `Se ha creado una nueva tarea: ${task.description}`);
        }
      }
    }
  }

  extractWeatherParameter(weatherData: any, parameter: string): number {
    const data = weatherData.data.find((d) => d.parameter === parameter);
    if (data && data.coordinates.length > 0 && data.coordinates[0].dates.length > 0) {
      return data.coordinates[0].dates[0].value;
    }
    console.error(`No se pudo encontrar el parámetro de clima: ${parameter}`);
    return 0;
  }
}
