import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Task } from './tasks.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository: jest.Mocked<Partial<Repository<Task>>>;

  const mockUser: User = {
    id: 'ae45e493-dc06-419b-ac7e-ea6ba1b08bc5',
    username: 'Dima',
  } as User;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    taskRepository = module.get(getRepositoryToken(Task));
  });

  describe('getTasks', () => {
    it('should return array of tasks for the given user', async () => {
      const mockTasks: Task[] = [
        {
          id: 'f11820ef-89e3-41e2-833e-2e197fb2ccc5',
          message: 'Task 1',
          isActive: false,
          user: mockUser,
        } as Task,
        {
          id: 'ae45e493-dc06-419b-ac7e-ea6ba1b08bc5',
          message: 'Task 2',
          isActive: false,
          user: mockUser,
        } as Task,
      ];

      (taskRepository.find as jest.Mock).mockResolvedValue(mockTasks);

      const result = await tasksService.getTasks(mockUser);

      expect(taskRepository.find).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
        order: { createdAt: 'DESC' },
      });

      expect(result).toEqual(mockTasks);
    });
  });

  describe('updateTask', () => {
    it('should update and return the updated task', async () => {
      const mockTask: Task = {
        id: 'ae45e493-dc06-419b-ac7e-ea6ba1b08bc5',
        message: 'Old message',
        isActive: false,
        user: mockUser,
      } as Task;

      const updateDto = {
        message: 'Updated message',
        isActive: true,
      };

      tasksService.findTask = jest.fn().mockResolvedValue(mockTask);

      (taskRepository.save as jest.Mock).mockResolvedValue({
        ...mockTask,
        ...updateDto,
      });

      const result = await tasksService.updateTask(
        mockTask.id,
        updateDto,
        mockUser,
      );

      expect(tasksService.findTask).toHaveBeenCalledWith(mockTask.id, mockUser);
      expect(taskRepository.save).toHaveBeenCalledWith({
        ...mockTask,
        ...updateDto,
      });

      expect(result.message).toEqual(updateDto.message);
      expect(result.isActive).toEqual(updateDto.isActive);
    });
  });

  describe('deleteTask', () => {
    it('should delete task for given user and id', async () => {
      const mockTask: Task = {
        id: 'ae45e493-dc06-419b-ac7e-ea6ba1b08bc5',
        message: 'Test task',
        isActive: true,
        user: mockUser,
      } as Task;

      tasksService.findTask = jest.fn().mockResolvedValue(mockTask);

      await tasksService.deleteTask(mockTask.id, mockUser);

      expect(tasksService.findTask).toHaveBeenCalledWith(mockTask.id, mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith(mockTask.id);
    });
  });

  describe('findTask', () => {
    it('should return task when found', async () => {
      const mockTask: Task = {
        id: 'ae45e493-dc06-419b-ac7e-ea6ba1b08bc5',
        message: 'Test task',
        isActive: true,
        user: mockUser,
      } as Task;

      (taskRepository.findOne as jest.Mock).mockResolvedValue(mockTask);

      const result = await tasksService.findTask(mockTask.id, mockUser);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: mockTask.id,
          user: { id: mockUser.id },
        },
      });

      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when task not found', async () => {
      (taskRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        tasksService.findTask('not-exist-id', mockUser),
      ).rejects.toThrow(NotFoundException);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'not-exist-id', user: { id: mockUser.id } },
      });
    });
  });
});
