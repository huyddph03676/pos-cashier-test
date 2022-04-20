import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ReportService } from './report.service';

@ApiTags('Reports')
@UseGuards(JwtAuthGuard)
@Controller('revenues')
export class RevenuesController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  revenues() {
    return this.reportService.getRevenues();
  }
}

@ApiTags('Reports')
@UseGuards(JwtAuthGuard)
@Controller('solds')
export class SoldsController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  solds() {
    return this.reportService.getSolds();
  }
}
