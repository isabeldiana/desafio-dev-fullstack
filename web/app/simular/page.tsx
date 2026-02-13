"use client";

import { useState } from "react";
import { criarSimulacaoWithFiles } from "@/lib/services/api";
import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import FormInput from "../components/FormInput";
import FileUpload from "../components/FileUpload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SimularPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    telefone: "",
  });

  const [files, setFiles] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.nomeCompleto || !formData.email || !formData.telefone) {
        throw new Error("Preencha todos os campos obrigatórios");
      }

      if (files.length === 0) {
        throw new Error("Envie pelo menos uma conta de energia");
      }

      const data = new FormData();

      data.append("nomeCompleto", formData.nomeCompleto);
      data.append("email", formData.email);
      data.append("telefone", formData.telefone);

      files.forEach((file) => {
        data.append("faturas", file);
      });

      await criarSimulacaoWithFiles(data);

      toast.success("Simulação criada com sucesso! 🚀", {
        action: {
          label: "Ver listagem",
          onClick: () => router.push("/listagem"),
        },
      });
      setFormData({ nomeCompleto: "", email: "", telefone: "" });
      setFiles([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar simulação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/20 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className={`
              inline-flex items-center gap-2 px-5 py-2.5 
              rounded-xl bg-white border border-gray-200 
              text-gray-700 hover:bg-gray-50 hover:border-gray-300
              shadow-sm transition-all duration-200
            `}
          >
            <ArrowLeft size={18} />
            Voltar para Home
          </Link>

          <div className="flex-1" />

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 shadow-sm">
            <Zap size={24} strokeWidth={2.5} />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-1 text-center">
          Simular Compensação Energética
        </h1>
        <p className="text-gray-600 text-lg mb-1 text-center">
          Preencha seus dados e envie sua conta de energia para começar
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl border border-gray-100/80 p-8 sm:p-10"
        >
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Dados Pessoais
            </h2>

            <div className="space-y-6">
              <FormInput
                label="Nome Completo"
                name="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={handleInputChange}
                required
              />

              <FormInput
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <FormInput
                label="Telefone"
                type="tel"
                name="telefone"
                value={formData.telefone}
                placeholder="(11) 99999-9999"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="mb-10">
            <FileUpload files={files} onChange={setFiles} disabled={loading} />
          </div>

          {error && (
            <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full flex items-center justify-center gap-3 cursor-pointer
              bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed
              text-white font-semibold text-lg
              py-4 rounded-xl
              shadow-lg shadow-orange-200/50 hover:shadow-orange-300/70
              transition-all duration-300 transform hover:-translate-y-1
              focus:outline-none focus:ring-4 focus:ring-orange-400/50 focus:ring-offset-2
            `}
          >
            {loading ? (
              <>
                <span className="animate-pulse">Enviando...</span>
              </>
            ) : (
              "Criar Simulação"
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <Link
            href="/listagem"
            className={`
              inline-block px-8 py-3 rounded-xl
              bg-gray-700 hover:bg-gray-800
              text-white font-medium
              transition-all duration-200 shadow-md hover:shadow-lg
            `}
          >
            Ver Listagem
          </Link>
        </div>
      </div>
    </div>
  );
}
