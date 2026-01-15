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
  Matches,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
  CARTA = 'CARTA',
}

// Custom validator for pickup date (Monday-Saturday only, max 7 days from now)
function IsWeekday(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isWeekday',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return true; // Optional field
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const date = new Date(value);
          const dayOfWeek = date.getDay();

          // 0 = Sunday, 6 = Saturday. We want 1-6 (Monday-Saturday)
          if (dayOfWeek < 1 || dayOfWeek > 6) {
            return false;
          }

          // Check if date is more than 7 days in the future
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const maxDate = new Date(today);
          maxDate.setDate(maxDate.getDate() + 7);

          const pickupDate = new Date(date);
          pickupDate.setHours(0, 0, 0, 0);

          if (pickupDate > maxDate) {
            return false;
          }

          return true;
        },
        defaultMessage() {
          return 'La fecha de retiro debe ser de lunes a sábado y no mayor a 7 días desde hoy';
        },
      },
    });
  };
}

// Custom validator for pickup time (08:00-17:00)
function IsBusinessHours(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isBusinessHours',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return true; // Optional field

          const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          if (!timeRegex.test(value)) return false;

          const [hours] = value.split(':').map(Number);
          return hours >= 8 && hours < 19; // 8 AM to 7 PM (19:00)
        },
        defaultMessage() {
          return 'La hora de retiro debe ser entre 08:00 y 19:00 (7 PM) en formato HH:mm';
        },
      },
    });
  };
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

  @IsOptional()
  @IsWeekday()
  pickupDate?: Date;

  @IsOptional()
  @IsString()
  @IsBusinessHours()
  @Matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'El formato de hora debe ser HH:mm',
  })
  pickupTime?: string;
}
