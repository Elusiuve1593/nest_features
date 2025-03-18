import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { User } from '../auth/user.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './tasks.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findTask(id: string, user: User): Promise<Task> {
    const task: Task | null = await this.taskRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!task) {
      throw new NotFoundException(`Invalid id: { ${id} }.Task was not found`);
    }

    return task;
  }

  async createTask(body: CreateTaskDto, user: User): Promise<Task> {
    const createdTask: Task = this.taskRepository.create({ ...body, user });
    await this.taskRepository.save(createdTask);

    return plainToClass(Task, createdTask);
  }

  async getTasks(user: User): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { user: { id: user.id } },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async updateTask(id: string, body: UpdateTaskDto, user: User): Promise<Task> {
    const task: Task = await this.findTask(id, user);

    task.isActive = body.isActive;
    task.message = body.message;

    await this.taskRepository.save(task);

    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const { id: userId } = await this.findTask(id, user);
    await this.taskRepository.delete(userId);
  }
}
