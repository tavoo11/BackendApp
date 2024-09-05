import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto);
  }

  @Patch(':id')
  async updateTask(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: number) {
    return this.taskService.deleteTask(id);
  }

  @Get('user/:userId')
  async getTasksForUser(@Param('userId') userId: number) {
    return this.taskService.getTasksForUser(userId);
  }

  @Get('plant/:plantId')
  async getTasksForPlant(@Param('plantId') plantId: number) {
    return this.taskService.getTasksForPlant(plantId);
  }
}
