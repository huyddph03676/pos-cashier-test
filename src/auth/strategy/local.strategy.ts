import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { CashierService } from 'src/cashier/cashier.service';
import { Cashier } from 'src/cashier/entities/cashier.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private cashierService: CashierService) {
    super({ usernameField: 'passcode', passwordField: 'passcode', passReqToCallback: true });
  }

  async validate(req: any, passcode: string): Promise<Cashier> {
    const { cashierId } = req.params;
    if (isNaN(cashierId)) return null;
    return this.cashierService.validate(cashierId, passcode);
  }
}
