import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'; // Importa HttpService desde @nestjs/axios
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  private readonly baseUrl = 'https://api.meteomatics.com';
  private readonly username = 'universidaddecordoba_macea_gustavo';
  private readonly password = '3EHEEap2e1';
  private readonly location = '5.2666638888889,-74.166669444444'; // Coordenadas de paramo de guerrero

  constructor(private readonly httpService: HttpService) {}  // Usa HttpService correctamente

  async getWeatherData(date: string, parameters: string, format: string = 'json'): Promise<any> {
    const url = `${this.baseUrl}/${date}/${parameters}/${this.location}/${format}`;
    
    try {
      const response = await lastValueFrom(
        this.httpService.get(url, {
          auth: {
            username: this.username,
            password: this.password,
          },
        }),
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      throw new Error('Failed to fetch weather data');
    }
  }
}
