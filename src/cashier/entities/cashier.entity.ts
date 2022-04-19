import { Order } from 'src/order/entities/order.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Cashier {
  @PrimaryGeneratedColumn()
  cashierId: number;

  @Column()
  name: string;

  @Column()
  passcode: string;

  @Column({ default: false, name: 'isDeleted' })
  @Column({ select: false })
  isDeleted: boolean;

  @OneToMany(() => Order, (order) => order.cashier)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
