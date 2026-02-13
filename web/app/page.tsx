import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-600 mx-auto">
          <Zap size={32} strokeWidth={2.5} />
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
          Simulação de Compensação Energética
        </h1>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/simular"
            className={`
              group inline-flex items-center gap-3
              px-8 py-4 rounded-xl
              bg-orange-500 hover:bg-orange-600
              text-white font-semibold text-lg
              shadow-lg shadow-orange-200/50 hover:shadow-orange-300/70
              transition-all duration-300 transform hover:-translate-y-1
              focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2
            `}
          >
            Nova Simulação
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </main>
  );
}
