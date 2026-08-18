import { Module } from '@nestjs/common';
import { AuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { ImageProcessorService } from './image/image-processor.service';

@Module({
  imports: [JwtModule],
  providers: [AuthGuard, RolesGuard, ImageProcessorService],
  exports: [AuthGuard, RolesGuard, ImageProcessorService],
})
export class CommonModule {}
