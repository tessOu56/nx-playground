import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ enum: ['admin', 'organizer', 'user'], default: 'user' })
  @IsEnum(['admin', 'organizer', 'user'])
  @IsOptional()
  role?: string;

  @ApiProperty({ enum: ['active', 'inactive', 'suspended'], default: 'active' })
  @IsEnum(['active', 'inactive', 'suspended'])
  @IsOptional()
  status?: string;
}
