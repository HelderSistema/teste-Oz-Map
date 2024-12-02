import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsCoordinates(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCoordinates',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Verifica se é um array com dois números
          if (!Array.isArray(value) || value.length !== 2) {
            return false;
          }
          const [lat, lng] = value;
          // Valida os valores de latitude e longitude
          return (
            typeof lat === 'number' && typeof lng === 'number' //&&
            // lat >= -90 &&
            // lat <= 90 &&
            // lng >= -180 &&
            // lng <= 180
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ser um array com duas coordenadas válidas [latitude, longitude]`;
        },
      },
    });
  };
}
