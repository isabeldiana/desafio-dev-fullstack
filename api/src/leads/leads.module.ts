import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { MagicPdfService } from '../magic-pdf/magic-pdf.service';

@Module({
  controllers: [LeadsController],
  providers: [LeadsService, MagicPdfService],
  exports: [LeadsService],
})
export class LeadsModule {}
