import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  @InjectRepository(Task)
  private readonly taskRepository: Repository<Task>;

  constructor() {}

  getAllTasks() {
    return this.taskRepository.find({ relations: ['user'] }); // This fetches all tasks from the database with user relation
  }

  async create(title: string, description: string, user: any): Promise<Task> {
    console.log("🚀 ~ TasksService ~ create ~ user:", user)
    console.log('🚀 ~ TasksService ~ create ~ description:', description);
    console.log('🚀 ~ TasksService ~ create ~ title:', title);
    const newTask = this.taskRepository.create({ title, description, user }); // Create a new task instance
    console.log('🚀 ~ TasksService ~ create ~ newTask:', newTask);
    return await this.taskRepository.save(newTask);
  }
}
