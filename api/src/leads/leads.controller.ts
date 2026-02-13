import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { LeadsService } from './leads.service';
import {
  CriarSimulacaoUploadDto,
} from './dto/create-simulacao.dto';
import { FiltroSimulacoesDto } from './dto/filter-simulacoes.dto';

@Controller()
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post('simular')
  @UseInterceptors(FilesInterceptor('faturas'))
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createSimulation(
    @Body() body: CriarSimulacaoUploadDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.leadsService.createSimulationWithFiles(body, files);
  }

  @Get('listagem')
  findAll(@Query() query: FiltroSimulacoesDto) {
    return this.leadsService.listSimulations(query);
  }

  @Get('listagem/:id')
  findById(@Param('id') id: string) {
    return this.leadsService.getById(id);
  }
}
