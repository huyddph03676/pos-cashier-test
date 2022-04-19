import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { DISCOUNT_TYPE } from './constants';

export function processResponse(status: boolean, data = null) {
  const response = {
    success: status,
    message: status ? 'Success' : 'Fail',
    ...(data && { data }),
  };
  return response;
}

export const generateOrderId = (length: number) => {
  let result = '';

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result.toUpperCase();
};

export class FilterCommonDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  skip?: number;
}

export function generatorSku(pattern: string, id: number, numberOfSku: number) {
  const idString = id.toString();
  let numberSku = idString;
  if (idString.length < numberOfSku) {
    const numberOfZero = numberOfSku - idString.length;
    numberSku = `${generatorZeroNumber(numberOfZero)}${idString}`;
  }
  return `${pattern}${numberSku}`;
}

function generatorZeroNumber(count: number) {
  let zero = '';
  for (let index = 0; index < count; index++) {
    zero += '0';
  }
  return zero;
}

function currencyFomat(n, currency) {
  return new Intl.NumberFormat('', {
    style: 'currency',
    currency: currency,
  }).format(n);
}

export function getStringFormat(number1: number, number2: number, type: string) {
  return type === DISCOUNT_TYPE.BUY_N
    ? `Buy ${number1} only Rp. ${currencyFomat(2, number2)}`
    : `Discount ${number1}% Rp. ${number2}`;
}
