import { Cashier } from 'src/cashier/entities/cashier.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { SubOrder } from './sub-order.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  orderId: number;

  @Column()
  totalPrice: number;

  @Column()
  totalPaid: number;

  @Column()
  totalReturn: number;

  @Column()
  receiptId: string;

  @ManyToOne(() => Cashier, (cashiers) => cashiers.orderIds)
  cashier: Cashier;

  @Column()
  cashierId: number;

  @ManyToOne(() => Payment, (payment) => payment.orderIds)
  payment: Payment;

  @Column()
  paymentId: number;

  @OneToMany(() => SubOrder, (suborder) => suborder.order)
  suborderIds: SubOrder[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
