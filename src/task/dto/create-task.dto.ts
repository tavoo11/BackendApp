export class CreateTaskDto {
    description: string;
    dueDate?: Date;
    userId?: number;
    plantId?: number;  // Si la tarea está asociada con una planta específica
    isCompleted?: boolean;
  }
  