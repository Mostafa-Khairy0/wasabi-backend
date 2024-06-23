// src/common/validators/is-phone-number.ts
import { registerDecorator, ValidationOptions } from 'class-validator';
import parsePhoneNumber from 'libphonenumber-js';

function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const phoneNumber = parsePhoneNumber(value);
          return phoneNumber && phoneNumber.isValid();
        },
        defaultMessage() {
          return 'Phone number ($value) is not valid!';
        },
      },
    });
  };
}

export class RegisterUserDto {
  @IsPhoneNumber({ message: 'Invalid phone number format' })
  phoneNumber: string;
}
export class VerifyUserDto {
  @IsPhoneNumber({ message: 'Invalid phone number format' })
  phoneNumber: string;

  otp: number;
}
