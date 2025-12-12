import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.interface';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(): Task[] {
    return this.tasksService.findAll();
  }

  @Post()
  create(@Body() task: Omit<Task, 'id'>): Task {
    return this.tasksService.create(task);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() task: Partial<Task>): Task | null {
    return this.tasksService.update(id, task);
  }

  @Delete(':id')
  delete(@Param('id') id: string): { success: boolean } {
    const success = this.tasksService.delete(id);
    return { success };
  }
}
