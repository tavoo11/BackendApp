import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Task } from './task/entities/task.entity';
import { Plant } from './plant/entities/plant.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite3', // El nombre de tu archivo SQLite
  entities: [User, Task, Plant],
  synchronize: true, // Cambia a false para producción y usa migraciones
});
