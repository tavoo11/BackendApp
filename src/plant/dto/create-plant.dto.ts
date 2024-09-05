export class CreatePlantDto {
    tag: string;  // Código alfanumérico de la planta
    species: string;  // Especie de la planta
    germinationDate: Date;  // Fecha de germinación
    initialConditions?: string;  // Condiciones iniciales de crecimiento
    growthStage?: string;  // Etapa de crecimiento actual
    healthStatus?: string;  // Estado de salud actual
  }
  