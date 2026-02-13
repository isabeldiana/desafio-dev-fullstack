import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CriarSimulacaoDto,
  CriarSimulacaoUploadDto,
} from './dto/create-simulacao.dto';
import { MagicPdfService } from '../magic-pdf/magic-pdf.service';
import { FiltroSimulacoesDto } from './dto/filter-simulacoes.dto';

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly magicPdfService: MagicPdfService,
  ) {}


  async createSimulation(input: CriarSimulacaoDto) {
    try {
      this.validateSimulationInput(input);

      const unitsData = await this.prepareUnitsData(input);

      const data: Prisma.LeadCreateInput = {
        nomeCompleto: input.nomeCompleto.trim(),
        email: input.email.trim().toLowerCase(),
        telefone: input.telefone.trim(),
        unidades: { create: unitsData },
      };

      return await this.prisma.$transaction(async (tx) => {
        await this.ensureEmailIsUnique(tx, data.email);
        return this.createLead(tx, data);
      });
    } catch (error) {
      throw error instanceof BadRequestException
        ? error
        : new InternalServerErrorException('Falha ao criar a simulação');
    }
  }

  async createSimulationWithFiles(
    upload: CriarSimulacaoUploadDto,
    files: Express.Multer.File[],
  ) {
    if (!files?.length) {
      throw new BadRequestException('Não foram fornecidos arquivos de faturas.');
    }

    const invoices = await this.decodeFiles(files);

    return this.createSimulation({
      ...upload,
      informacoesDaFatura: invoices,
    } as CriarSimulacaoDto);
  }

  async listSimulations(filter: FiltroSimulacoesDto) {
    const { page = 1, limit = 20 } = filter;
    const skip = (page - 1) * limit;
    const where = this.buildFilterWhere(filter);

    const [data, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        include: this.defaultInclude(),
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.lead.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    if (!id) throw new BadRequestException('É necessário o ID da simulação.');

    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: this.defaultInclude(),
    });

    if (!lead) {
      throw new NotFoundException(`Simulação com ID ${id} não encontrada.`);
    }

    return lead;
  }

 
  private validateSimulationInput(input: CriarSimulacaoDto) {
    if (!input.informacoesDaFatura?.length) {
      throw new BadRequestException(
        'É necessário pelo menos um quadro de distribuição.',
      );
    }

  
  }

  private async ensureEmailIsUnique(
    tx: Prisma.TransactionClient,
    email: string,
  ) {
    const existing = await tx.lead.findUnique({ where: { email } });
    if (existing) {
      throw new BadRequestException('E-mail já cadastrado.');
    }
  }

  private async prepareUnitsData(input: CriarSimulacaoDto) {
    const codes = input.informacoesDaFatura.map((f) =>
      f.codigoDaUnidadeConsumidora.trim(),
    );

    if (new Set(codes).size !== codes.length) {
      throw new BadRequestException('Códigos de unidade duplicados detectados.');
    }

    const existingUnits = await this.prisma.unidade.findMany({
      where: { codigoDaUnidadeConsumidora: { in: codes } },
      select: { codigoDaUnidadeConsumidora: true },
    });

    if (existingUnits.length) {
      throw new BadRequestException(
        `Unidades já registradas: ${existingUnits
          .map((u) => u.codigoDaUnidadeConsumidora)
          .join(', ')}`,
      );
    }

    return input.informacoesDaFatura.map((invoice) =>
      this.mapUnit(invoice),
    );
  }

  private mapUnit(
    invoice: CriarSimulacaoDto['informacoesDaFatura'][number],
  ): Prisma.UnidadeCreateWithoutLeadInput {
    if (invoice.historicoDeConsumoEmKWH.length !== 12) {
      throw new BadRequestException(
        `A unidade ${invoice.codigoDaUnidadeConsumidora} deve conter 12 meses de consumo.`,
      );
    }

    const months = new Set<string>();

    const history = invoice.historicoDeConsumoEmKWH.map((item) => {
      const date = new Date(item.mesDoConsumo);
      if (isNaN(date.getTime())) {
        throw new BadRequestException(
          `Data inválida para a unidade ${invoice.codigoDaUnidadeConsumidora}`,
        );
      }

      const monthKey = date.toISOString().slice(0, 7);
      if (months.has(monthKey)) {
        throw new BadRequestException(
          `Detecção de mês duplicado para a unidade ${invoice.codigoDaUnidadeConsumidora}`,
        );
      }

      months.add(monthKey);

      const consumption = Number(item.consumoForaPontaEmKWH);
      if (isNaN(consumption)) {
        throw new BadRequestException(
          `Valor de consumo inválido para a unidade ${invoice.codigoDaUnidadeConsumidora}`,
        );
      }

      return {
        consumoForaPontaEmKWH: consumption,
        mesDoConsumo: date,
      };
    });

    return {
      codigoDaUnidadeConsumidora:
        invoice.codigoDaUnidadeConsumidora.trim(),
      modeloFasico: invoice.modeloFasico,
      enquadramento: invoice.enquadramento,
      historicoDeConsumoEmKWH: { create: history },
    };
  }

  private async decodeFiles(files: Express.Multer.File[]) {
    const invoices: CriarSimulacaoDto['informacoesDaFatura'] = [];

    for (const file of files) {
      try {
        const decoded = await this.magicPdfService.decodificarPdf(file);

        if (!Array.isArray(decoded) || !decoded.length) {
          throw new Error('Resultado decodificado inválido');
        }

        invoices.push(...decoded);
      } catch (err) {
        throw new BadRequestException(
            err?.message || err
          ,
        );
      }
    }

    return invoices;
  }

  private buildFilterWhere(
    filter: FiltroSimulacoesDto,
  ): Prisma.LeadWhereInput {
    const { name, email, codigoDaUnidadeConsumidora } = filter;

    return {
      nomeCompleto: name ? { contains: name.trim(), mode: 'insensitive' } : undefined,
      email: email ? { contains: email.trim(), mode: 'insensitive' } : undefined, 
      unidades: codigoDaUnidadeConsumidora
        ? {
            some: {
              codigoDaUnidadeConsumidora: {
                contains: codigoDaUnidadeConsumidora.trim(),
              },
            },
          }
        : undefined, 
    };
  }

  private createLead(
    tx: Prisma.TransactionClient,
    data: Prisma.LeadCreateInput,
  ) {
    return tx.lead.create({
      data,
      include: this.defaultInclude(),
    });
  }

private defaultInclude(): Prisma.LeadInclude {
  return {
    unidades: {
      include: {
        historicoDeConsumoEmKWH: {
          orderBy: {
            mesDoConsumo: 'desc',
          },
        },
      },
    },
  };
}
} 