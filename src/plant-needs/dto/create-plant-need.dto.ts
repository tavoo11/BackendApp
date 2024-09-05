// dto: create-plant-need.dto.ts
export class CreatePlantNeedsDto {
  waterRequirement: number; // en litros por semana o por riego
  minTemperature: number; // temperatura mínima en grados Celsius
  maxTemperature: number; // temperatura máxima en grados Celsius
  humidityRequirement: number; // requisito de humedad en porcentaje
  minLight: number; // luz mínima requerida en horas por día
  maxLight: number; // luz máxima tolerada en horas por día
  minWindSpeed: number; // velocidad mínima del viento en km/h
  maxWindSpeed: number; // velocidad máxima del viento en km/h
  maxPrecipitation: number; // precipitación máxima tolerada en mm
  plantId: number; // ID de la planta a la que pertenecen estas necesidades
}
