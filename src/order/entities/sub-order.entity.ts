import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class SubOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.suborders)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.subOrder)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  qty: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  normalPrice: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  finalPrice: number;
}
