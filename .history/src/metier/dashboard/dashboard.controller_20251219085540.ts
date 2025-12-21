import { Body, Controller, Get, Post } from '@nestjs/common';
import { DashboardMetierService } from './dashboard.service';

@Controller('metier/dashboard')
export class DashboardMetierController {
  constructor(
    private readonly dashboardMetierService: DashboardMetierService,
  ) { }


}

