import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  @InjectRepository(Task)
  private readonly taskRepository: Repository<Task>;

  constructor() {}

  getAllTasks() {
    return this.taskRepository.find(); // This fetches all tasks from the database
  }
  
  create(title: string,description:string): Promise<Task> {
    console.log("🚀 ~ TasksService ~ create ~ description:", description)
    console.log("🚀 ~ TasksService ~ create ~ title:", title)
    const newTask = this.taskRepository.create({ title, description }); // Create a new task instance
    return this.taskRepository.save(newTask);
  }
}
