import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; // Importa HttpModule desde @nestjs/axios
import { WeatherService } from './api-meteomatics';

@Module({
  imports: [HttpModule], // Registra HttpModule
  providers: [WeatherService],
  exports: [WeatherService], // Exporta WeatherService para usarlo en otros módulos
})
export class WeatherModule {}
