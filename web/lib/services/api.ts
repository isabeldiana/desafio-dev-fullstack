import { CriarSimulacaoInput, Lead, ListagemResponse } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export async function criarSimulacao(
  input: CriarSimulacaoInput,
): Promise<Lead> {
  const response = await fetch(`${API_URL}/simular`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao criar simulação');
  }

  return response.json();
}

export async function listarSimulacoes(
  name?: string,
  email?: string,
  codigoDaUnidadeConsumidora?: string,
  page: number = 1,
  limit: number = 20,
): Promise<ListagemResponse> {
  const params = new URLSearchParams();

  if (name) params.append('name', name);
if (email?.trim()) params.append('email', email.trim());
  if (codigoDaUnidadeConsumidora)
    params.append('codigoDaUnidadeConsumidora', codigoDaUnidadeConsumidora);

  params.append('page', page.toString());
  params.append('limit', limit.toString());

 
  const url = `${API_URL}/listagem?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Erro ao listar simulações');
  }

  return response.json();
}

export async function obterSimulacao(id: string): Promise<Lead> {
  
  const response = await fetch(`${API_URL}/listagem/${id}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Simulação não encontrada');
  }

  return response.json();
}

export async function criarSimulacaoWithFiles(formData: FormData): Promise<Lead> {
 
  const response = await fetch(`${API_URL}/simular`, {
    method: 'POST',
    body: formData,
   
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao criar simulação com arquivos');
  }

  return response.json();
}