import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { LocalStrategy } from 'src/auth/strategy/local.strategy';
import { CashierController } from './cashier.controller';
import { CashierService } from './cashier.service';
import { Cashier } from './entities/cashier.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cashier]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_KEY,
        signOptions: {
          expiresIn: `${process.env.JWT_TIME}s`,
        },
      }),
    }),
  ],
  controllers: [CashierController],
  providers: [CashierService, LocalStrategy, JwtStrategy],
  exports: [CashierService]
})
export class CashierModule {}
