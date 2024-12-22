import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Task } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TodoService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async getTasks(userId: number): Promise<Task[]> {
    return await this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTaskById(userId: number, taskId: number) {
    return this.prisma.task.findFirst({ where: { userId, id: taskId } });
  }

  async createTask(userId: number, dto: CreateTaskDto): Promise<Task> {
    const task = await this.prisma.task.create({ data: { ...dto, userId } });
    return task;
  }

  async updateTask(
    userId: number,
    taskId: number,
    dto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!task || task.userId !== userId) {
      throw new ForbiddenException('No Permission to update');
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: { ...dto },
    });
  }

  async deleteTask(userId: number, taskId: number): Promise<void> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!task || task.userId !== userId) {
      throw new ForbiddenException('No Permission to delete');
    }

    await this.prisma.task.delete({ where: { id: taskId } });
  }
}
