import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('cms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CmsController {

  @Get('admin-only')
  @Roles('admin')
  adminOnly() {
    return { message: 'Admin access granted' };
  }

  @Get('editor')
  @Roles('admin', 'editor')
  editorAccess() {
    return { message: 'Editor access granted' };
  }

  @Get('viewer')
  @Roles('admin', 'editor', 'viewer')
  viewerAccess() {
    return { message: 'Viewer access granted' };
  }
}
