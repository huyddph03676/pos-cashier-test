import { Cashier } from 'src/cashier/entities/cashier.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubOrder } from './sub-order.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  orderId: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  totalPrice: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  totalPaid: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  totalReturn: number;

  @Column({ nullable: true })
  receiptId: string;

  @ManyToOne(() => Cashier, (cashiers) => cashiers.orders)
  @JoinColumn({ name: 'cashierId' })
  cashier: Cashier;

  @ManyToOne(() => Payment, (payment) => payment.orders)
  @JoinColumn({ name: 'paymentId' })
  payment: Payment;

  @Column({ nullable: true })
  isDownload: boolean;

  @OneToMany(() => SubOrder, (suborder) => suborder.order)
  suborders: SubOrder[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
