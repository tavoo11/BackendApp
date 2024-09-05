import { Test, TestingModule } from '@nestjs/testing';
import { AutoTaskSchedulerService } from './auto-task-scheduler.service';
import { TaskService } from './task.service';
import { PlantNeedsService } from '../plant-needs/plant-needs.service';
import { WeatherService } from '../api-meteomatics';
import { NotificationsGateway } from '../notifications/notification.gateway';

describe('AutoTaskSchedulerService', () => {
  let autoTaskSchedulerService: AutoTaskSchedulerService;
  let taskService: TaskService;
  let plantNeedsService: PlantNeedsService;
  let weatherService: WeatherService;
  let notificationsGateway: NotificationsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutoTaskSchedulerService,
        {
          provide: TaskService,
          useValue: {
            createTask: jest.fn(),
          },
        },
        {
          provide: PlantNeedsService,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: WeatherService,
          useValue: {
            getWeatherData: jest.fn(),
          },
        },
        {
          provide: NotificationsGateway,
          useValue: {
            sendNotificationToUser: jest.fn(),
          },
        },
      ],
    }).compile();

    autoTaskSchedulerService = module.get<AutoTaskSchedulerService>(AutoTaskSchedulerService);
    taskService = module.get<TaskService>(TaskService);
    plantNeedsService = module.get<PlantNeedsService>(PlantNeedsService);
    weatherService = module.get<WeatherService>(WeatherService);
    notificationsGateway = module.get<NotificationsGateway>(NotificationsGateway);
  });

  it('should be defined', () => {
    expect(autoTaskSchedulerService).toBeDefined();
  });

  it('should create tasks and send notifications based on weather data', async () => {
    // Mock data
    const mockPlantNeeds = [
      {
        plant: { id: 1, tag: 'Plant1', species: 'Species1' },
        maxTemperature: 30,
        minTemperature: 20,
      },
      {
        plant: { id: 2, tag: 'Plant2', species: 'Species2' },
        maxTemperature: 25,
        minTemperature: 15,
      },
    ];

    const mockWeatherData = {
      data: [
        {
          parameter: 't_2m:C',
          coordinates: [
            {
              dates: [
                { value: '32' }, // Asegúrate de que el valor sea una cadena para evitar errores de conversión
              ],
            },
          ],
        },
      ],
    };

    const mockTask = {
      id: 1,
      description: 'Task Description',
      dueDate: new Date(),
      plantId: 1,
      isCompleted: false,
      userId: 2,
    };

    // Mock implementations
    jest.spyOn(plantNeedsService, 'findAll').mockResolvedValue(mockPlantNeeds as any);
    jest.spyOn(weatherService, 'getWeatherData').mockResolvedValue(mockWeatherData as any);
    jest.spyOn(taskService, 'createTask').mockResolvedValue(mockTask as any);
    jest.spyOn(notificationsGateway, 'sendNotificationToUser').mockImplementation();

    // Execute the method
    await autoTaskSchedulerService.handleCron();

    // Assertions
    expect(taskService.createTask).toHaveBeenCalledTimes(2);
    expect(notificationsGateway.sendNotificationToUser).toHaveBeenCalledTimes(2);

    // Verifica que las tareas se crean con las descripciones correctas
    expect(taskService.createTask).toHaveBeenCalledWith(expect.objectContaining({
      description: expect.stringContaining('regar las plantas Plant1 - Species1'),
    }));
    expect(taskService.createTask).toHaveBeenCalledWith(expect.objectContaining({
      description: expect.stringContaining('regar las plantas Plant2 - Species2'),
    }));
  });
});
