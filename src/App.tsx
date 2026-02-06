import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Mapa } from './pages/Mapa';
import { Especies } from './pages/Especies';
import { EspecieDetalhe } from './pages/EspecieDetalhe';
import { Sobre } from './pages/Sobre';
import { SouCriador } from './pages/SouCriador';
import { Entrar } from './pages/Entrar';
import { RecuperarSenha } from './pages/RecuperarSenha';
import { MeusFavoritos } from './pages/MeusFavoritos';
import { Criadores } from './pages/Criadores';
import { PerfilCriador } from './pages/PerfilCriador';
import { MeuPerfil } from './pages/MeuPerfil';
import { Dashboard } from './pages/Dashboard';
import { AuthCallback } from './pages/AuthCallback';
import { Termos } from './pages/Termos';
import { Privacidade } from './pages/Privacidade';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
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
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
