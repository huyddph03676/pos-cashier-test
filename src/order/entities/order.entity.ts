import { Cashier } from 'src/cashier/entities/cashier.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
