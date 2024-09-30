import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsIntString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isIntString',
      target: object.constructor, // DTO sử dung decorator này
      propertyName: propertyName, // trường mà decorator được áp dụng
      options: validationOptions, // các tuỳ được truyền vào tại thời điểm sử dụng decorator
      validator: {
        validate(value: any) {
          // lấy giá trị của trường thì dùng value
          // lấy dữ liệu của DTO thì dùng ValidationArguments
          const parsedValue = parseInt(value, 10);
          return !isNaN(parsedValue) && Number.isInteger(parsedValue);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} phải là một số nguyên hợp lệ, nhưng nhận được giá trị ${args.value}`;
        },
      },
    });
  };
}
