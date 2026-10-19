import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
} from 'class-validator';

import { EXHIBITION_REGIONS } from '../exhibition-region';

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
      'Catalog extras. kind: talk | auction | line_commerce | exhibition; auction may include plinthLotUrl. Also sessions, tickets, content, speakers, venue.',
  })
  @IsOptional()
  data?: Record<string, unknown>;

  @ApiProperty({ enum: EXHIBITION_REGIONS, required: false })
  @IsEnum(EXHIBITION_REGIONS)
  @IsOptional()
  region?: (typeof EXHIBITION_REGIONS)[number];

  @ApiProperty({
    required: false,
    example: 'Asia/Taipei',
    description: 'IANA timezone (e.g. Asia/Taipei, Asia/Tokyo)',
  })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiProperty({ required: false, example: 'sample' })
  @IsString()
  @IsOptional()
  source?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  sourceUrl?: string;

  @ApiProperty({
    required: false,
    description: 'Unique together with source for collector upserts',
  })
  @IsString()
  @IsOptional()
  externalId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  contentHash?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    required: false,
    example: 'NT$30',
    description: 'Free-text price for exhibitions (currency varies by region)',
  })
  @IsString()
  @IsOptional()
  priceText?: string;

  @ApiProperty({ required: false, format: 'date-time' })
  @IsDateString()
  @IsOptional()
  lastSeenAt?: string;
}
