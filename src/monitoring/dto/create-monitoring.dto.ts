export class CreateMonitoringDto {
    userId: number;  // ID del usuario que realiza el monitoreo
    plantId: number;  // ID de la planta monitoreada
    observations: string;  // Observaciones generales
    height?: number;  // Altura de la planta (cm)
    healthStatus?: string;  // Estado de salud de la planta
    growthStage?: string;  // Etapa de crecimiento
  }
  