import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  eventId: string;

  @ApiProperty({
    required: false,
    description: 'LIFF/LINE attendee id (`line_<LINE userId>`) or demo `user_demo`',
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ enum: ['pending', 'confirmed', 'cancelled'], required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    required: false,
    type: 'object',
    additionalProperties: true,
    description: 'Checkout payload stored as JSON (session, tickets, payment)',
  })
  @IsObject()
  @IsOptional()
  data?: Record<string, unknown>;
}
