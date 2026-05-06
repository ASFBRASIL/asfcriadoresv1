import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Chrome, AlertCircle, User, Phone, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSEO } from '../hooks/useSEO';

type Tab = 'login' | 'cadastro';

export function Entrar() {
  useSEO({ title: 'Entrar', description: 'Faça login ou crie sua conta na ASF Criadores para acessar todas as funcionalidades da plataforma.' });
  const [tab, setTab] = useState<Tab>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login form
  const [loginData, setLoginData] = useState({ email: '', password: '', remember: false });
  // Cadastro form
  const [cadData, setCadData] = useState({ nome: '', email: '', telefone: '', password: '', confirmPassword: '' });

  const { signIn, signUp, signInWithGoogle, isSupabaseReady } = useAuth();
  const navigate = useNavigate();

  const switchTab = (t: Tab) => { setTab(t); setErrorMsg(''); setSuccessMsg(''); };

  // ── LOGIN ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    const { error } = await signIn(loginData.email, loginData.password);
    if (error) {
      setErrorMsg(error.message || 'E-mail ou senha incorretos.');
    } else {
      navigate('/');
    }
    setIsSubmitting(false);
  };

  // ── CADASTRO ──
  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Validações
    if (cadData.password.length < 6) {
      setErrorMsg('A senha deve ter pelo menos 6 caracteres.');
      setIsSubmitting(false);
      return;
    }
    if (cadData.password !== cadData.confirmPassword) {
      setErrorMsg('As senhas não conferem.');
      setIsSubmitting(false);
      return;
    }
    if (!cadData.nome.trim()) {
      setErrorMsg('Informe seu nome.');
      setIsSubmitting(false);
      return;
    }

    const { error } = await signUp(cadData.email, cadData.password, cadData.nome, cadData.telefone);
    if (error) {
      setErrorMsg(error.message || 'Erro ao criar conta. Tente novamente.');
    } else {
      if (isSupabaseReady) {
        setSuccessMsg('Conta criada! Verifique seu e-mail para confirmar o cadastro.');
        setCadData({ nome: '', email: '', telefone: '', password: '', confirmPassword: '' });
      } else {
        navigate('/');
      }
    }
    setIsSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    const { error } = await signInWithGoogle();
    if (error) setErrorMsg(error.message || 'Erro ao fazer login com Google.');
  };

  const inputClass = "w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] focus:ring-2 focus:ring-[var(--asf-green)]/20 transition-all duration-300 outline-none text-sm";

  return (
    <div className="min-h-screen pt-20 lg:pt-24 bg-[var(--asf-gray-light)]">
      <div className="container-asf section-padding py-12 lg:py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-soft-lg p-8">

            {/* Tabs */}
            <div className="flex rounded-xl bg-gray-100 p-1 mb-8">
              <button onClick={() => switchTab('login')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${tab === 'login' ? 'bg-white text-[var(--asf-gray-dark)] shadow-sm' : 'text-[var(--asf-gray-medium)] hover:text-[var(--asf-gray-dark)]'}`}>
                Entrar
              </button>
              <button onClick={() => switchTab('cadastro')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${tab === 'cadastro' ? 'bg-white text-[var(--asf-gray-dark)] shadow-sm' : 'text-[var(--asf-gray-medium)] hover:text-[var(--asf-gray-dark)]'}`}>
                Criar Conta
              </button>
            </div>

            {/* Mensagens */}
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm mb-5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 text-green-700 text-sm mb-5">
                <Check className="w-4 h-4 flex-shrink-0" />{successMsg}
              </div>
            )}

            {!isSupabaseReady && (
              <div className="p-3 rounded-xl bg-blue-50 text-blue-700 text-sm mb-5">
                <strong>Modo demo:</strong> Login com <code className="bg-blue-100 px-1 rounded">demo@asfcriadores.com</code> / <code className="bg-blue-100 px-1 rounded">demo123</code>
              </div>
            )}

            {/* ══════ LOGIN ══════ */}
            {tab === 'login' && (
              <>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-poppins font-bold text-[var(--asf-gray-dark)] mb-1">Bem-vindo de volta</h1>
                  <p className="text-sm text-[var(--asf-gray-medium)]">Entre na sua conta para acessar a plataforma</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--asf-gray-dark)] mb-1.5">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" required value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} className={inputClass} placeholder="seu@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--asf-gray-dark)] mb-1.5">Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type={showPassword ? 'text' : 'password'} required value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] focus:ring-2 focus:ring-[var(--asf-green)]/20 transition-all outline-none text-sm" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={loginData.remember} onChange={e => setLoginData({ ...loginData, remember: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[var(--asf-green)]" />
                      <span className="text-sm text-[var(--asf-gray-medium)]">Lembrar de mim</span>
                    </label>
                    <Link to="/recuperar-senha" className="text-sm text-[var(--asf-green)] hover:underline">Esqueceu a senha?</Link>
                  </div>
                  <button type="submit" disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--asf-green)] text-white font-medium hover:bg-[var(--asf-green-dark)] transition-all disabled:opacity-50">
                    {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Entrar</span><ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              </>
            )}

            {/* ══════ CADASTRO ══════ */}
            {tab === 'cadastro' && (
              <>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-poppins font-bold text-[var(--asf-gray-dark)] mb-1">Crie sua conta</h1>
                  <p className="text-sm text-[var(--asf-gray-medium)]">Cadastre-se gratuitamente e faça parte da comunidade</p>
                </div>
                <form onSubmit={handleCadastro} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--asf-gray-dark)] mb-1.5">Nome completo</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" required value={cadData.nome} onChange={e => setCadData({ ...cadData, nome: e.target.value })} className={inputClass} placeholder="Seu nome completo" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--asf-gray-dark)] mb-1.5">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" required value={cadData.email} onChange={e => setCadData({ ...cadData, email: e.target.value })} className={inputClass} placeholder="seu@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--asf-gray-dark)] mb-1.5">Telefone (WhatsApp)</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="tel" value={cadData.telefone} onChange={e => setCadData({ ...cadData, telefone: e.target.value })} className={inputClass} placeholder="(00) 00000-0000" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--asf-gray-dark)] mb-1.5">Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type={showPassword ? 'text' : 'password'} required minLength={6} value={cadData.password} onChange={e => setCadData({ ...cadData, password: e.target.value })} className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] focus:ring-2 focus:ring-[var(--asf-green)]/20 transition-all outline-none text-sm" placeholder="Mínimo 6 caracteres" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--asf-gray-dark)] mb-1.5">Confirmar senha</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="password" required minLength={6} value={cadData.confirmPassword} onChange={e => setCadData({ ...cadData, confirmPassword: e.target.value })} className={inputClass} placeholder="Repita a senha" />
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--asf-green)] text-white font-medium hover:bg-[var(--asf-green-dark)] transition-all disabled:opacity-50">
                    {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Criar Conta</span><ArrowRight className="w-4 h-4" /></>}
                  </button>
                  <p className="text-xs text-[var(--asf-gray-medium)] text-center">
                    Ao se cadastrar, você concorda com nossos{' '}
                    <Link to="/sobre" className="text-[var(--asf-green)] hover:underline">Termos de Uso</Link>
                  </p>
                </form>
              </>
            )}

            {/* Divider + Google */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-[var(--asf-gray-medium)]">ou</span></div>
            </div>
            <button type="button" onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border-2 border-gray-200 text-[var(--asf-gray-dark)] font-medium hover:border-gray-300 hover:bg-gray-50 transition-all text-sm">
              <Chrome className="w-5 h-5" /> Continuar com Google
            </button>

            {/* Switch link */}
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-[var(--asf-gray-medium)]">
                {tab === 'login' ? (
                  <>Ainda não tem conta?{' '}<button onClick={() => switchTab('cadastro')} className="text-[var(--asf-green)] font-medium hover:underline">Cadastre-se</button></>
                ) : (
                  <>Já tem uma conta?{' '}<button onClick={() => switchTab('login')} className="text-[var(--asf-green)] font-medium hover:underline">Entrar</button></>
                )}
              </p>
            </div>

            {/* Link para cadastro completo de criador */}
            <div className="mt-4 text-center">
              <p className="text-xs text-[var(--asf-gray-medium)]">
                Quer se cadastrar como criador?{' '}
                <Link to="/sou-criador" className="text-[var(--asf-green)] font-medium hover:underline">
                  Cadastro de Criador
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
