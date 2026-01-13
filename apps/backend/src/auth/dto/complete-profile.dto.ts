import { IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator';

export class CompleteProfileDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(50)
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es requerido' })
  @MaxLength(50)
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: 'El número de teléfono es requerido' })
  @Matches(/^(?:(?:\+54\s?)?(?:9\s?)?\d{2,4}\s?\d{3,4}[-\s]?\d{4}|\d{10})$/, {
    message:
      'Formato de teléfono inválido. Ej: +54 9 11 1234-5678 o 1112345678',
  })
  phoneNumber: string;
}
