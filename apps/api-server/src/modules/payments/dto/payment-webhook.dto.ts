import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PaymentWebhookDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  merchantTradeNo?: string;

  @ApiProperty({ required: false, description: 'ECPay form field' })
  @IsString()
  @IsOptional()
  MerchantTradeNo?: string;

  @ApiProperty({ required: false, description: '1 = paid, anything else = failed' })
  @IsOptional()
  rtnCode?: string | number;

  @ApiProperty({ required: false, description: 'ECPay form field' })
  @IsOptional()
  RtnCode?: string | number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  CheckMacValue?: string;
}
