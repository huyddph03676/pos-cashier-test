import { Order } from 'src/order/entities/order.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PAYMENT_TYPE } from '../enum/payment.enum';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  paymentId: number;

  @Column()
  name: string;

  @Column()
  type: PAYMENT_TYPE;

  @Column({ nullable: true })
  logo: string;

  @OneToMany(() => Order, (order) => order.payment)
  orderIds: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
