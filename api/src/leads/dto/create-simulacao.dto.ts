import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class HistoricoDeConsumoDto {
  @IsNumber()
  consumoForaPontaEmKWH: number;

  @IsDateString()
  mesDoConsumo: string;
}

export class InformacaoDaFaturaDto {
  @IsString()
  @IsNotEmpty()
  codigoDaUnidadeConsumidora: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['monofasico', 'bifasico', 'trifasico'])
  modeloFasico: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['AX', 'B1', 'B2', 'B3'])
  enquadramento: string;

  @IsDateString()
  mesDeReferencia: string;

  @IsNumber()
  consumoEmReais: number;

  @IsArray()
  @ArrayMinSize(12)
  @ValidateNested({ each: true })
  @Type(() => HistoricoDeConsumoDto)
  historicoDeConsumoEmKWH: HistoricoDeConsumoDto[];
}

export class CriarSimulacaoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nomeCompleto: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  telefone: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InformacaoDaFaturaDto)
  informacoesDaFatura: InformacaoDaFaturaDto[];
}

export class CriarSimulacaoUploadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nomeCompleto: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  telefone: string;
}
