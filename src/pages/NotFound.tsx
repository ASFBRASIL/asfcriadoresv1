import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export function NotFound() {
  useSEO({ title: 'Página não encontrada' });
  return (
    <div className="min-h-screen pt-20 lg:pt-24 flex items-center justify-center bg-[var(--asf-gray-light)]">
      <div className="container-asf section-padding">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-24 h-24 rounded-full bg-[var(--asf-green)]/10 flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-[var(--asf-green)]" />
          </div>
          
          <h1 className="text-6xl font-poppins font-bold text-[var(--asf-green)] mb-4">
            404
          </h1>
          <h2 className="text-2xl font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3">
            Página não encontrada
          </h2>
          <p className="text-[var(--asf-gray-medium)] mb-8">
            A página que você está procurando não existe ou foi movida. 
            Que tal explorar nosso mapa de criadores?
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--asf-green)] 
                       text-white font-medium hover:bg-[var(--asf-green-dark)] 
                       transition-all duration-300"
            >
              <Home className="w-5 h-5" />
              Ir para Home
            </Link>
            <Link
              to="/mapa"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 
                       border-[var(--asf-green)] text-[var(--asf-green)] font-medium 
                       hover:bg-[var(--asf-green)] hover:text-white transition-all duration-300"
            >
              Explorar Mapa
            </Link>
          </div>
          
          <button
            onClick={() => window.history.back()}
            className="mt-6 inline-flex items-center gap-2 text-[var(--asf-gray-medium)] 
                     hover:text-[var(--asf-green)] transition-colors duration-300 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar à página anterior
          </button>
        </div>
      </div>
    </div>
  );
}
