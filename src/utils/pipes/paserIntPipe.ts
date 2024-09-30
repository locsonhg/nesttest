import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

// Pipe này sẽ chuyển đổi một chuỗi thành một số nguyên. Nếu giá trị không phải là một số nguyên, nó sẽ ném một BadRequestException.
@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(`${value} phải là một số thực`);
    }
    return val;
  }
}
