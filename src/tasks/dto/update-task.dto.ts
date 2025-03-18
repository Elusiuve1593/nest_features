import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  message: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
