import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
  Max,
  IsArray,
  ValidateNested,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
  CARTA = 'CARTA',
}

export class OrderOptionsDto {
  @IsEnum(PaperSize)
  @IsNotEmpty()
  size: PaperSize;

  @IsBoolean()
  @IsNotEmpty()
  isColor: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isDuplex: boolean;

  @IsInt()
  @Min(1)
  @Max(1000)
  quantity: number;
}

export class FileInfoDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  fileName: string;

  @IsNotEmpty()
  originalName: string;

  @IsNotEmpty()
  fileUrl: string;

  @IsInt()
  @Min(1)
  pages: number;
}

export class CreateOrderDto {
  @IsEmail()
  @IsNotEmpty()
  userEmail: string;

  @ValidateNested()
  @Type(() => OrderOptionsDto)
  @IsNotEmpty()
  options: OrderOptionsDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileInfoDto)
  files: FileInfoDto[];

  @IsOptional()
  @IsString()
  comment?: string;
}
