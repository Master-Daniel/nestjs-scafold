/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  provider: string;

  @IsString()
  providerId: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
