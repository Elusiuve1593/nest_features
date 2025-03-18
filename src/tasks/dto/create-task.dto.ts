import { IsBoolean, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  message: string;

  @IsBoolean()
  isActive: boolean;
}
