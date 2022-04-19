import { DISCOUNT_TYPE } from 'src/shared/constants';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Discount {
  @PrimaryGeneratedColumn()
  discountId: number;

  @Column()
  qty: number;

  @Column({
    type: 'enum',
    enum: DISCOUNT_TYPE,
    default: null,
  })
  type: DISCOUNT_TYPE;

  @Column('decimal', { precision: 12, scale: 2 })
  result: number;

  @Column({ type: 'datetime' })
  expiredAt: Date;

  @Column()
  expiredAtFormat: string;

  @Column()
  stringFormat: string;
}
