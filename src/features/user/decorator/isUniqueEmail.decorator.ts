import { registerDecorator, ValidationOptions } from 'class-validator';
import { UniqueEmailValidator } from '../validators/unique-email.validator'; // Đường dẫn tới file chứa class

export function IsUniqueEmail(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueEmailValidator,
    });
  };
}
