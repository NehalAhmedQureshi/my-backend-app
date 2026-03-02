import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks() {
    return this.tasksService.getAllTasks();
  }

  @UseGuards(AuthGuard)
  @Post()
  async createTask(
    @Body('title') title: string,
    @Body('description') description: string,
    @Request() req: any
  ) {
    const task = await this.tasksService.create(title, description, req.user.sub);

    return {
      message: 'Task created successfully',
      status: 'success',
      data: task,
    };
  }
}
