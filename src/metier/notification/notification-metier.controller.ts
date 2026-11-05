import { Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { NotificationMetierService } from './notification-metier.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('metier/notification')
export class NotificationMetierController {
  constructor(
    private readonly notificationMetierService: NotificationMetierService,
  ) {}

  /**
   * GET /metier/notification/mes-notifications?limit=20&offset=0
   * ✅ Pagination obligatoire côté client — voir le service pour le détail.
   */
  @Get('mes-notifications')
  @UseGuards(JwtAuthGuard)
  async mesNotifications(
    @CurrentUser() user: any,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.notificationMetierService.mesNotifications(
      user.id,
      limit ? Number(limit) : undefined,
      offset ? Number(offset) : undefined,
    );
  }

  /**
   * GET /metier/notification/nombre-non-lues
   */
  @Get('nombre-non-lues')
  @UseGuards(JwtAuthGuard)
  async nombreNonLues(@CurrentUser() user: any) {
    return this.notificationMetierService.nombreNonLues(user.id);
  }

  /**
   * PUT /metier/notification/marquer-lu/:id
   */
  @Put('marquer-lu/:id')
  @UseGuards(JwtAuthGuard)
  async marquerCommeLue(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.notificationMetierService.marquerCommeLue(Number(id), user.id);
  }

  /**
   * PUT /metier/notification/marquer-tout-lu
   */
  @Put('marquer-tout-lu')
  @UseGuards(JwtAuthGuard)
  async marquerToutCommeLu(@CurrentUser() user: any) {
    return this.notificationMetierService.marquerToutCommeLu(user.id);
  }
}