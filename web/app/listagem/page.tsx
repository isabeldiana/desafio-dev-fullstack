"use client";

import { useState, useEffect } from "react";
import { listarSimulacoes, obterSimulacao } from "@/lib/services/api";
import { Lead, ListagemResponse } from "@/lib/types";
import { Eye } from "lucide-react";
import Link from "next/link";
import FormInput from "../components/FormInput";
import Modal from "../components/Modal";

export default function ListagemPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    codigoDaUnidadeConsumidora: "",
    page: 1,
    limit: 10,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loadingLead, setLoadingLead] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const result: ListagemResponse = await listarSimulacoes(
        filters.name || undefined,
        filters.email || undefined,
        filters.codigoDaUnidadeConsumidora || undefined,
        filters.page,
        filters.limit,
      );
      setLeads(result.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar simulações",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const openModal = async (leadId: string) => {
    setModalOpen(true);
    setLoadingLead(true);
    try {
      const leadDetalhe = await obterSimulacao(leadId);
      setSelectedLead(leadDetalhe);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLead(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Listagem de Simulações
        </h1>
        <p className="text-gray-600 mb-8">
          Visualize e filtre todas as simulações cadastradas
        </p>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormInput
              label="Nome"
              name="name"
              value={filters.name}
              placeholder="Filtrar por nome"
              onChange={handleFilterChange}
            />
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={filters.email}
              placeholder="Filtrar por email"
              onChange={handleFilterChange}
            />
            <FormInput
              label="Código da Unidade"
              name="codigoDaUnidadeConsumidora"
              value={filters.codigoDaUnidadeConsumidora}
              placeholder="Filtrar por código"
              onChange={handleFilterChange}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">Carregando...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow border border-gray-100">
            <p className="text-gray-600 text-lg">
              Nenhuma simulação encontrada
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead className="bg-orange-50/70">
                  <tr>
                    <th className="px-6 py-4 text-left text-gray-800 font-semibold tracking-wide">
                      Nome
                    </th>
                    <th className="px-6 py-4 text-left text-gray-800 font-semibold tracking-wide">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-gray-800 font-semibold tracking-wide">
                      Telefone
                    </th>
                    <th className="px-6 py-4 text-left text-gray-800 font-semibold tracking-wide">
                      Codigo
                    </th>
                    <th className="px-6 py-4 text-left text-gray-800 font-semibold tracking-wide">
                      Data
                    </th>
                    <th className="px-6 py-4 text-center text-gray-800 font-semibold tracking-wide">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-orange-50/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {lead.nomeCompleto}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{lead.email}</td>
                      <td className="px-6 py-4 text-gray-700">
                        {lead.telefone}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {lead.unidades[0]?.codigoDaUnidadeConsumidora || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openModal(lead.id)}
                          className="p-3 rounded-full hover:bg-orange-100 transition-colors duration-200"
                          title="Ver mais informações"
                        >
                          <Eye className="w-5 h-5 text-orange-600 cursor-pointer" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/simular"
            className={`
              inline-flex items-center gap-2
              bg-orange-500 hover:bg-orange-600
              text-white font-semibold text-lg
              px-8 py-4 rounded-xl
              shadow-lg shadow-orange-200/40 hover:shadow-orange-300/60
              transition-all duration-300 transform hover:-translate-y-1
              focus:outline-none focus:ring-4 focus:ring-orange-400/50 focus:ring-offset-2
            `}
          >
            Nova Simulação
          </Link>
        </div>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Detalhes da Simulação"
        >
          {loadingLead ? (
            <p className="text-gray-600">Carregando...</p>
          ) : selectedLead ? (
            <div className="space-y-6">
              <div className="bg-orange-50/40 p-5 rounded-xl border border-orange-100">
                <p>
                  <strong>Nome:</strong> {selectedLead.nomeCompleto}
                </p>
                <p>
                  <strong>Email:</strong> {selectedLead.email}
                </p>
                <p>
                  <strong>Telefone:</strong> {selectedLead.telefone}
                </p>
                <p>
                  <strong>Data:</strong>{" "}
                  {new Date(selectedLead.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>

              {selectedLead.unidades.map((unidade) => (
                <div
                  key={unidade.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
                >
                  <p className="font-semibold text-lg text-gray-800">
                    {unidade.codigoDaUnidadeConsumidora}
                  </p>
                  <p className="text-gray-700 mt-1">
                    Modelo Fasíco: {unidade.modeloFasico}
                  </p>
                  <p className="text-gray-700">
                    Enquadramento: {unidade.enquadramento}
                  </p>

                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-gray-700 font-semibold">
                            Mês
                          </th>
                          <th className="px-4 py-3 text-right text-gray-700 font-semibold">
                            Consumo (kWh)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {unidade.historicoDeConsumoEmKWH.map((consumo, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-800">
                              {new Date(
                                consumo.mesDoConsumo,
                              ).toLocaleDateString("pt-BR", {
                                year: "numeric",
                                month: "long",
                              })}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-800 font-medium">
                              {consumo.consumoForaPontaEmKWH.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-600">Erro ao carregar a simulação</p>
          )}
        </Modal>
      </div>
    </div>
  );
}
