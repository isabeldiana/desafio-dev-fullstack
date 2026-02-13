export interface HistoricoDeConsumo {
  consumoForaPontaEmKWH: number;
  mesDoConsumo: string;
}

export interface InformacaoDaFatura {
  codigoDaUnidadeConsumidora: string;
  modeloFasico: 'monofasico' | 'bifasico' | 'trifasico';
  enquadramento: 'AX' | 'B1' | 'B2' | 'B3';
  mesDeReferencia: string;
  consumoEmReais: number;
  historicoDeConsumoEmKWH: HistoricoDeConsumo[];
}

export interface CriarSimulacaoInput {
  nomeCompleto: string;
  email: string;
  telefone: string;
  informacoesDaFatura: InformacaoDaFatura[];
}

export interface Consumo {
  id: string;
  consumoForaPontaEmKWH: number;
  mesDoConsumo: string;
}

export interface Unidade {
  id: string;
  codigoDaUnidadeConsumidora: string;
  modeloFasico: string;
  enquadramento: string;
  historicoDeConsumoEmKWH: Consumo[];
}

export interface Lead {
  id: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  unidades: Unidade[];
  createdAt: string;
  updatedAt: string;
}

export interface ListagemResponse {
  data: Lead[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface MagicPdfResponse {
  data: {
    unit_key: string;
    phaseModel: 'monofasico' | 'bifasico' | 'trifasico';
    chargingModel: 'AX' | 'B1' | 'B2' | 'B3';
    consumo_fp: number;
    consumo_date: string;
  }[];
}