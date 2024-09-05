// src/tasks/auto-task-scheduler.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TaskService } from './task.service';
import { PlantNeedsService } from '../plant-needs/plant-needs.service';
import { WeatherService } from '../api-meteomatics';
import { NotificationsGateway } from '../notifications/notification.gateway';  // Asegúrate de importar el gateway correctamente

@Injectable()
export class AutoTaskSchedulerService {
  constructor(
    private readonly taskService: TaskService,
    private readonly plantNeedsService: PlantNeedsService,
    private readonly weatherService: WeatherService,
    private readonly notificationsGateway: NotificationsGateway,  // Inyectamos NotificationsGateway
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES) // Configuración para ejecutarse cada hora
  async handleCron() {
    console.log('Ejecutando tarea programada para verificar y asignar tareas automáticamente');
    await this.scheduleTasks();
  }
// // Obtener datos meteorológicos actuales
    // const weatherData = await this.weatherService.getWeatherData(
    //   'now', // Utiliza 'now' para obtener datos actuales
    //   't_2m:C', // Solo necesitamos la temperatura
    // );

    // // Obtener la temperatura actual
    // const currentTemperature = weatherData.data.find((d) => d.parameter === 't_2m:C').coordinates[0].dates[0].value;
    async scheduleTasks() {
      // Obtener todas las necesidades de las plantas
      const allPlantNeeds = await this.plantNeedsService.findAll();
      
      // Obtener datos meteorológicos actuales
      const weatherData = await this.weatherService.getWeatherData(
        'now', // Utiliza 'now' para obtener datos actuales
        't_2m:C', // Solo necesitamos la temperatura
      );
    
      // Obtener la temperatura actual
      const currentTemperature = weatherData.data.find((d) => d.parameter === 't_2m:C').coordinates[0].dates[0].value;
    
      for (const plantNeeds of allPlantNeeds) {
        let taskDescription = '';
    
        if (currentTemperature > plantNeeds.maxTemperature) {
          taskDescription = `¡La temperatura es alta!, es momento de regar las plantas ${plantNeeds.plant.tag} - ${plantNeeds.plant.species}`;
        } else if (currentTemperature < plantNeeds.minTemperature) {
          taskDescription = `¡La temperatura bajó! Proporcionar luz a las plantas ${plantNeeds.plant.tag} - ${plantNeeds.plant.species}`;
        }
    
        if (taskDescription) {
          // Obtener el userId del usuario asignado a la planta
          const userId = 2; // Asegúrate de que este campo esté disponible en `plantNeeds.plant`
    
          // Crear una tarea automáticamente con el usuario asignado
          const task = await this.taskService.createTask({
            description: taskDescription,
            dueDate: new Date(),
            plantId: plantNeeds.plant.id,
            isCompleted: false,
            userId: userId, // Asigna el ID del usuario aquí
          });
    
          console.log('Tarea creada:', task);
    
          // Enviar notificación al usuario conectado
          this.notificationsGateway.sendNotificationToUser(userId, `Se ha creado una nueva tarea: ${task.description}`);
        }
      }
    }
    
}
