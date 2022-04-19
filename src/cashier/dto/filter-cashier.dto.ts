import { PickType } from '@nestjs/swagger';
import { FilterCommonDto } from 'src/shared/common';

export class FilterCashierDto extends PickType(FilterCommonDto, ['limit', 'skip'] as const) {}
