import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  private readonly apiKey = '6a4fb1e3eb28407ab4f12851242109';
  private readonly baseUrl = 'http://api.weatherapi.com/v1';
  private readonly location = '5.2666638888889,-74.166669444444'; // Coordenadas del paramo de guerrero

  constructor(private readonly httpService: HttpService) {}

  // Método actualizado para obtener el clima actual
  async getCurrentWeather(): Promise<any> {
    const url = `${this.baseUrl}/current.json?key=${this.apiKey}&q=${this.location}`;

    try {
      const response = await lastValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      console.error('Error fetching current weather data:', error.message);
      throw new Error('Failed to fetch current weather data');
    }
  }

  // Método para obtener el pronóstico
  async getForecast(days: number): Promise<any> {
    const url = `${this.baseUrl}/forecast.json?key=${this.apiKey}&q=${this.location}&days=${days}`;

    try {
      const response = await lastValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      console.error('Error fetching weather forecast:', error.message);
      throw new Error('Failed to fetch weather forecast');
    }
  }
}
