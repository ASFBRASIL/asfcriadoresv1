import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages loaded eagerly (critical path)
import { Home } from './pages/Home';
import { Entrar } from './pages/Entrar';
import { RecuperarSenha } from './pages/RecuperarSenha';
import { AuthCallback } from './pages/AuthCallback';
import { NotFound } from './pages/NotFound';

// Pages loaded lazily (reduces initial bundle)
const Mapa = lazy(() => import('./pages/Mapa').then(m => ({ default: m.Mapa })));
const Especies = lazy(() => import('./pages/Especies').then(m => ({ default: m.Especies })));
const EspecieDetalhe = lazy(() => import('./pages/EspecieDetalhe').then(m => ({ default: m.EspecieDetalhe })));
const Sobre = lazy(() => import('./pages/Sobre').then(m => ({ default: m.Sobre })));
const SouCriador = lazy(() => import('./pages/SouCriador').then(m => ({ default: m.SouCriador })));
const Termos = lazy(() => import('./pages/Termos').then(m => ({ default: m.Termos })));
const Privacidade = lazy(() => import('./pages/Privacidade').then(m => ({ default: m.Privacidade })));
const MeusFavoritos = lazy(() => import('./pages/MeusFavoritos').then(m => ({ default: m.MeusFavoritos })));
const Criadores = lazy(() => import('./pages/Criadores').then(m => ({ default: m.Criadores })));
const PerfilCriador = lazy(() => import('./pages/PerfilCriador').then(m => ({ default: m.PerfilCriador })));
const MeuPerfil = lazy(() => import('./pages/MeuPerfil').then(m => ({ default: m.MeuPerfil })));
const Notificacoes = lazy(() => import('./pages/Notificacoes').then(m => ({ default: m.Notificacoes })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--asf-green)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/mapa" element={<Mapa />} />
                  <Route path="/especies" element={<Especies />} />
                  <Route path="/criadores" element={<Criadores />} />
                  <Route path="/especie/:id" element={<EspecieDetalhe />} />
                  <Route path="/sobre" element={<Sobre />} />
                  <Route path="/sou-criador" element={<SouCriador />} />
                  <Route path="/entrar" element={<Entrar />} />
                  <Route path="/recuperar-senha" element={<RecuperarSenha />} />
                  <Route path="/termos" element={<Termos />} />
                  <Route path="/privacidade" element={<Privacidade />} />
                  <Route path="/favoritos" element={
                    <ProtectedRoute><MeusFavoritos /></ProtectedRoute>
                  } />
                  <Route path="/notificacoes" element={
                    <ProtectedRoute><Notificacoes /></ProtectedRoute>
                  } />
                  <Route path="/meu-perfil" element={
                    <ProtectedRoute><MeuPerfil /></ProtectedRoute>
                  } />
                  <Route path="/perfil/:id" element={<PerfilCriador />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute requireAdmin>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
