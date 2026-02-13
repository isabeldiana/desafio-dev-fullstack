import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { InformacaoDaFaturaDto } from '../leads/dto/create-simulacao.dto';

const url= process.env.MAGIC_PDF_URL;

@Injectable()
export class MagicPdfService {
  async decodificarPdf(file: Express.Multer.File): Promise<InformacaoDaFaturaDto[]> {
    if (!file || !file.buffer) {
      throw new BadRequestException('Arquivo inválido para decodificação');
    }

    const form = new FormData();
    form.append('file', file.buffer, {
      filename: file.originalname || 'file.pdf',
      contentType: file.mimetype || 'application/pdf',
      knownLength: file.size,
    } as any);

    try {
      const response = await axios.post(url!, form, {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
      });

      const result = response.data;

      if (!result || !result.unit_key || !Array.isArray(result.invoice)) {
        throw new Error('Formato de resposta inválido da API de decodificação');
      }

  
      const ultimosMeses = result.invoice
        .sort((a: any, b: any) => new Date(b.consumo_date).getTime() - new Date(a.consumo_date).getTime())
        .slice(0, 12)
        .sort((a: any, b: any) => new Date(a.consumo_date).getTime() - new Date(b.consumo_date).getTime());

      const informacao: InformacaoDaFaturaDto = {
        codigoDaUnidadeConsumidora: result.unit_key,
        modeloFasico: result.phaseModel,
        enquadramento: result.chargingModel,
        mesDeReferencia: ultimosMeses[ultimosMeses.length - 1]?.consumo_date || new Date().toISOString(),
        consumoEmReais: result.valor,
        historicoDeConsumoEmKWH: ultimosMeses.map((item: any) => ({
          consumoForaPontaEmKWH: item.consumo_fp,
          mesDoConsumo: item.consumo_date,
        })),
      } as InformacaoDaFaturaDto;

      return [informacao];
    } catch (err: any) {
       if (err instanceof BadRequestException) {
    throw err; 
  }

throw new InternalServerErrorException('Erro interno ao processar a fatura PDF');
    }
  }
}
