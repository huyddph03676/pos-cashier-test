import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { UpdateProductDto } from 'src/product/dto/update-product.dto';
import { getStringFormat } from 'src/shared/common';
import { DATE_FORMAT, DISCOUNT_TYPE, DISCOUNT_TYPE_ARRAY } from 'src/shared/constants';
import { Repository } from 'typeorm';
import { Discount } from './entities/discount.entity';
@Injectable()
export class DiscountService {
  constructor(@InjectRepository(Discount) private discountService: Repository<Discount>) {}

  async createWithProduct(productDto: CreateProductDto) {
    const createDiscountDto = productDto.discount;
    const type = createDiscountDto.type;
    if (DISCOUNT_TYPE_ARRAY.indexOf(type) === -1) {
      throw new NotFoundException('Type not match');
    }

    const expiredAt = new Date(createDiscountDto.expiredAt * 1000);
    const expiredAtFormat = moment(expiredAt).format(DATE_FORMAT);
    let stringFormat = '';
    if (createDiscountDto.type === DISCOUNT_TYPE.BUY_N) {
      stringFormat = getStringFormat(createDiscountDto.qty, createDiscountDto.result, createDiscountDto.type);
    } else {
      const priceDiscount = (productDto.price * createDiscountDto.result) / 100;
      stringFormat = getStringFormat(createDiscountDto.result, priceDiscount, createDiscountDto.type);
    }
    const discount = this.discountService.create({
      ...createDiscountDto,
      expiredAt,
      expiredAtFormat,
      stringFormat,
    });
    return this.discountService.save(discount);
  }

  async updateDiscountByProduct(discountId: number, productDto: UpdateProductDto) {
    const discount = await this.discountService.findOne({
      where: {
        discountId,
      },
    });
    if (!discount) return;
    let stringFormat = '';
    if (discount.type === DISCOUNT_TYPE.BUY_N) {
      stringFormat = getStringFormat(discount.qty, discount.result, discount.type);
    } else {
      const priceDiscount = productDto.price - (productDto.price * discount.result) / 100;
      stringFormat = getStringFormat(discount.result, priceDiscount, discount.type);
    }
    await this.discountService.update({ discountId }, { stringFormat });
  }
}
