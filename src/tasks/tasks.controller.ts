import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './tasks.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private readonly tasksService: TasksService) {}

  @Post('create')
  createTask(
    @Body() body: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.log(user.username + ' created his task succesfully');

    return this.tasksService.createTask(body, user);
  }

  @Get()
  getTasks(@GetUser() user: User): Promise<Task[]> {
    this.logger.log(user.username + ' got his tasks succesfully');

    return this.tasksService.getTasks(user);
  }

  @Put('update/:id')
  updateTask(
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.log(user.username + ' update his task succesfully');

    return this.tasksService.updateTask(id, body, user);
  }

  @Delete('delete/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    this.logger.log(user.username + ' delete his task succesfully');

    return this.tasksService.deleteTask(id, user);
  }
}
