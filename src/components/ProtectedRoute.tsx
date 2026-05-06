import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldX } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAuth = true, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading, isSupabaseReady, isAdmin } = useAuth();

  // Enquanto carrega, mostrar spinner
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-[var(--asf-green)] border-t-transparent rounded-full" />
      </div>
    );
  }

  // Modo offline: permitir acesso para demonstração
  if (!isSupabaseReady) {
    return <>{children}</>;
  }

  // Se requer autenticação e não está logado
  if (requireAuth && !user) {
    return <Navigate to="/entrar" replace />;
  }

  // Se requer admin e não é admin
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[var(--asf-gray-light)]">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <ShieldX className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-poppins font-bold text-[var(--asf-gray-dark)] mb-2">
            Acesso Restrito
          </h2>
          <p className="text-[var(--asf-gray-medium)] mb-6">
            Você não tem permissão para acessar esta página. Esta área é restrita a administradores.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/" className="px-6 py-3 rounded-xl bg-[var(--asf-green)] text-white font-medium hover:bg-[var(--asf-green-dark)] transition-colors text-sm">
              Ir para Home
            </Link>
            <Link to="/mapa" className="px-6 py-3 rounded-xl bg-gray-100 text-[var(--asf-gray-dark)] font-medium hover:bg-gray-200 transition-colors text-sm">
              Ver Mapa
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
