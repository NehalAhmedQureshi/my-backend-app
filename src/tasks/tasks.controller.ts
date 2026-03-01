import { Body, Controller, Get, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks() {
    return this.tasksService.getAllTasks();
  }

  @Post()
  async createTask(
    @Body('taskName') title: string,
    @Body('description') description: string,
  ) {
    const task = await this.tasksService.create(title, description);

    return {
      message: 'Task created successfully',
      status: 'success',
      data: task,
    };
  }
}
