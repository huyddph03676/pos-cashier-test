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

  @Column({ nullable: true })
  totalPrice: number;

  @Column()
  totalPaid: number;

  @Column({ nullable: true })
  totalReturn: number;

  @Column({ nullable: true })
  receiptId: string;

  @ManyToOne(() => Cashier, (cashiers) => cashiers.orderIds)
  cashier: Cashier;

  @Column({ nullable: true })
  cashierId: number;

  @ManyToOne(() => Payment, (payment) => payment.orderIds)
  payment: Payment;

  @Column()
  paymentId: number;

  @OneToMany(() => SubOrder, (suborder) => suborder.order)
  suborderIds: SubOrder[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
