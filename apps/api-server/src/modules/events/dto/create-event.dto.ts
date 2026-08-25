import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  maxAttendees?: number;

  @ApiProperty({ enum: ['draft', 'published'], default: 'draft', required: false })
  @IsEnum(['draft', 'published'])
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  formId?: string;

  @ApiProperty({
    required: false,
    type: 'object',
    additionalProperties: true,
    description:
      'Catalog extras. kind: talk | auction | line_commerce; auction may include plinthLotUrl. Also sessions, tickets, content, speakers, venue.',
  })
  @IsOptional()
  data?: Record<string, unknown>;
}
