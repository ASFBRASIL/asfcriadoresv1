import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Users, Star, TrendingUp, Shield, MapPin, Leaf, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { estados } from '../data/estados';
import { useSEO } from '../hooks/useSEO';

const benefits = [
  { icon: MapPin, title: 'Visibilidade Nacional', description: 'Seu meliponário visível para milhares de pessoas em todo o Brasil.' },
  { icon: Users, title: 'Conexão Direta', description: 'Conecte-se com compradores e troque colônias com outros criadores.' },
  { icon: Leaf, title: 'Ferramentas de Gestão', description: 'Acesse ferramentas para gerenciar suas colônias de forma eficiente.' },
  { icon: Star, title: 'Conteúdo Exclusivo', description: 'Acesso a conteúdo exclusivo sobre meliponicultura.' },
  { icon: TrendingUp, title: 'Eventos e Workshops', description: 'Participação em eventos e workshops exclusivos para membros.' },
  { icon: Shield, title: 'Suporte Técnico', description: 'Suporte técnico especializado para suas dúvidas.' },
];

const testimonials = [
  { name: 'João Martins', location: 'São Paulo, SP', text: 'Desde que me cadastrei na ASF Criadores, minha visibilidade aumentou muito. Já fiz diversas vendas e troquei experiências com criadores de todo o Brasil.', initials: 'JM', since: '2023' },
  { name: 'Maria Costa', location: 'Salvador, BA', text: 'A plataforma me ajudou a encontrar compradores para minhas colônias de Uruçu. O contato direto via WhatsApp facilita muito o negócio.', initials: 'MC', since: '2022' },
];

export function SouCriador() {
  useSEO({ title: 'Cadastre-se como Criador', description: 'Faça parte da maior comunidade de meliponicultores do Brasil. Cadastre-se gratuitamente e conecte-se com outros criadores.' });
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    nome: '', email: '', telefone: '', password: '', confirmPassword: '',
    cidade: '', estado: '', bio: '',
  });

  const { signUp, user, isSupabaseReady } = useAuth();
  const navigate = useNavigate();

  // Se já está logado, redirecionar
  if (user) {
    return (
      <div className="min-h-screen pt-20 lg:pt-24 bg-[var(--asf-gray-light)]">
        <div className="container-asf section-padding py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-green-600" /></div>
            <h2 className="text-2xl font-poppins font-bold text-[var(--asf-gray-dark)] mb-2">Você já está cadastrado!</h2>
            <p className="text-[var(--asf-gray-medium)] mb-6">Acesse seu perfil ou explore o mapa de criadores.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/mapa" className="px-6 py-3 rounded-xl bg-[var(--asf-green)] text-white font-medium hover:bg-[var(--asf-green-dark)] transition-colors">Ver Mapa</Link>
              <Link to="/meu-perfil" className="px-6 py-3 rounded-xl bg-gray-100 text-[var(--asf-gray-dark)] font-medium hover:bg-gray-200 transition-colors">Meu Perfil</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const goStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (formData.password.length < 6) { setErrorMsg('A senha deve ter pelo menos 6 caracteres.'); return; }
    if (formData.password !== formData.confirmPassword) { setErrorMsg('As senhas não conferem.'); return; }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const { error } = await signUp(formData.email, formData.password, formData.nome, formData.telefone, formData.cidade, formData.estado);

    if (error) {
      setErrorMsg(error.message || 'Erro ao criar conta. Tente novamente.');
      setIsSubmitting(false);
      return;
    }

    // Sucesso
    setStep(3);
    setIsSubmitting(false);

    // Em modo offline, redirecionar automaticamente
    if (!isSupabaseReady) {
      setTimeout(() => navigate('/'), 2000);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] focus:ring-2 focus:ring-[var(--asf-green)]/20 transition-all duration-300 outline-none text-sm";

  return (
    <div className="min-h-screen pt-20 lg:pt-24">
      {/* Hero */}
      <section className="relative py-12 lg:py-16 bg-gradient-to-br from-[var(--asf-green)] to-[var(--asf-green-dark)]">
        <div className="container-asf section-padding">
          <div className="max-w-3xl mx-auto text-center text-white">
            <nav className="flex items-center justify-center gap-2 text-sm text-white/70 mb-6">
              <Link to="/" className="hover:text-white transition-colors">Home</Link><span>/</span><span className="text-white">Sou Criador</span>
            </nav>
            <h1 className="text-3xl lg:text-4xl font-poppins font-bold mb-4">Seja um Criador Parceiro</h1>
            <p className="text-lg text-white/80">Junte-se à maior comunidade de meliponicultores do Brasil. Cadastre-se gratuitamente e comece a conectar-se com outros criadores e potenciais clientes.</p>
          </div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row">
        {/* Left - Benefits */}
        <div className="w-full lg:w-1/2 bg-[var(--asf-gray-light)] py-12 lg:py-16">
          <div className="section-padding lg:pl-12 xl:pl-16 lg:pr-8">
            <h2 className="text-2xl font-poppins font-bold text-[var(--asf-gray-dark)] mb-8">Benefícios de ser um criador parceiro</h2>
            <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
              {benefits.map(b => (
                <div key={b.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--asf-green)]/10 flex items-center justify-center flex-shrink-0"><b.icon className="w-5 h-5 text-[var(--asf-green)]" /></div>
                  <div><h3 className="font-medium text-[var(--asf-gray-dark)] mb-1">{b.title}</h3><p className="text-sm text-[var(--asf-gray-medium)]">{b.description}</p></div>
                </div>
              ))}
            </div>
            <div className="mt-12 space-y-4">
              <h3 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-4">O que dizem nossos criadores</h3>
              {testimonials.map(t => (
                <div key={t.name} className="bg-white rounded-xl p-4">
                  <p className="text-[var(--asf-gray-medium)] text-sm mb-4 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--asf-green)]/10 flex items-center justify-center"><span className="text-sm font-semibold text-[var(--asf-green)]">{t.initials}</span></div>
                    <div><div className="font-medium text-[var(--asf-gray-dark)] text-sm">{t.name}</div><div className="text-xs text-[var(--asf-gray-medium)]">{t.location} · Criador desde {t.since}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className="w-full lg:w-1/2 bg-white py-12 lg:py-16">
          <div className="section-padding lg:pl-8 lg:pr-12 xl:pr-16">
            <div className="max-w-md mx-auto lg:mx-0">
              <h2 className="text-2xl font-poppins font-bold text-[var(--asf-gray-dark)] mb-2">Cadastro de Criador</h2>
              <p className="text-[var(--asf-gray-medium)] mb-8">Preencha os dados abaixo para criar sua conta e começar.</p>

              {/* Steps indicator */}
              <div className="flex items-center gap-4 mb-8">
                {[1, 2, 3].map(s => (
                  <div key={s} className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${step >= s ? 'bg-[var(--asf-green)] text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {step > s ? <Check className="w-5 h-5" /> : s}
                    </div>
                    {s < 3 && <div className={`flex-1 h-1 rounded-full ${step > s ? 'bg-[var(--asf-green)]' : 'bg-gray-100'}`} />}
                  </div>
                ))}
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm mb-5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{errorMsg}
                </div>
              )}

              {/* Step 1: Dados pessoais + conta */}
              {step === 1 && (
                <form onSubmit={goStep2} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--asf-gray-dark)] mb-1.5">Nome completo *</label>
                    <input type="text" required value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} className={inputClass} placeholder="Seu nome completo" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--asf-gray-dark)] mb-1.5">E-mail *</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className={inputClass} placeholder="seu@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--asf-gray-dark)] mb-1.5">Telefone (WhatsApp)</label>
                    <input type="tel" value={formData.telefone} onChange={e => setFormData({ ...formData, telefone: e.target.value })} className={inputClass} placeholder="(00) 00000-0000" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[var(--asf-gray-dark)] mb-1.5">Cidade</label>
                      <input type="text" value={formData.cidade} onChange={e => setFormData({ ...formData, cidade: e.target.value })} className={inputClass} placeholder="Sua cidade" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--asf-gray-dark)] mb-1.5">Estado</label>
                      <select value={formData.estado} onChange={e => setFormData({ ...formData, estado: e.target.value })} className={inputClass}>
                        <option value="">Selecione</option>
                        {estados.map(uf => <option key={uf.sigla} value={uf.sigla}>{uf.nome}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--asf-gray-dark)] mb-1.5">Senha *</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} required minLength={6} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className={`${inputClass} pr-12`} placeholder="Mínimo 6 caracteres" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--asf-gray-dark)] mb-1.5">Confirmar senha *</label>
                    <input type="password" required minLength={6} value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} className={inputClass} placeholder="Repita a senha" />
                  </div>
                  <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--asf-green)] text-white font-medium hover:bg-[var(--asf-green-dark)] transition-all">
                    Continuar <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-[var(--asf-gray-medium)] text-center">
                    Ao se cadastrar, você concorda com nossos <Link to="/sobre" className="text-[var(--asf-green)] hover:underline">Termos de Uso</Link>
                  </p>
                </form>
              )}

              {/* Step 2: Revisão + Confirmação */}
              {step === 2 && (
                <form onSubmit={handleSubmit}>
                  <div className="bg-[var(--asf-green)]/5 rounded-xl p-4 mb-6">
                    <h3 className="font-medium text-[var(--asf-gray-dark)] mb-2 flex items-center gap-2">
                      <Check className="w-5 h-5 text-[var(--asf-green)]" /> Quase lá!
                    </h3>
                    <p className="text-sm text-[var(--asf-gray-medium)]">
                      Revise seus dados e confirme. {isSupabaseReady ? 'Você receberá um e-mail para confirmar o cadastro.' : 'Sua conta será criada automaticamente.'}
                    </p>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-[var(--asf-gray-medium)] text-sm">Nome</span><span className="font-medium text-sm">{formData.nome}</span></div>
                    <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-[var(--asf-gray-medium)] text-sm">E-mail</span><span className="font-medium text-sm">{formData.email}</span></div>
                    {formData.telefone && <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-[var(--asf-gray-medium)] text-sm">Telefone</span><span className="font-medium text-sm">{formData.telefone}</span></div>}
                    {formData.cidade && <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-[var(--asf-gray-medium)] text-sm">Localização</span><span className="font-medium text-sm">{formData.cidade}{formData.estado ? `, ${formData.estado}` : ''}</span></div>}
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => { setStep(1); setErrorMsg(''); }}
                      className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-[var(--asf-gray-dark)] font-medium hover:border-[var(--asf-green)] transition-all text-sm">Voltar</button>
                    <button type="submit" disabled={isSubmitting}
                      className="flex-1 px-6 py-3 rounded-xl bg-[var(--asf-green)] text-white font-medium hover:bg-[var(--asf-green-dark)] transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2">
                      {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Confirmar Cadastro'}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Sucesso */}
              {step === 3 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-green-600" /></div>
                  <h3 className="text-xl font-poppins font-bold text-[var(--asf-gray-dark)] mb-2">Cadastro realizado!</h3>
                  {isSupabaseReady ? (
                    <p className="text-[var(--asf-gray-medium)] mb-6">Enviamos um e-mail de confirmação para <strong>{formData.email}</strong>. Verifique sua caixa de entrada (e spam) para ativar sua conta.</p>
                  ) : (
                    <p className="text-[var(--asf-gray-medium)] mb-6">Sua conta foi criada com sucesso! Você será redirecionado em instantes...</p>
                  )}
                  <div className="flex gap-3 justify-center">
                    <Link to="/entrar" className="px-6 py-3 rounded-xl bg-[var(--asf-green)] text-white font-medium hover:bg-[var(--asf-green-dark)] transition-colors text-sm">Ir para Login</Link>
                    <Link to="/mapa" className="px-6 py-3 rounded-xl bg-gray-100 text-[var(--asf-gray-dark)] font-medium hover:bg-gray-200 transition-colors text-sm">Explorar Mapa</Link>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                <p className="text-sm text-[var(--asf-gray-medium)]">
                  Já tem uma conta?{' '}<Link to="/entrar" className="text-[var(--asf-green)] font-medium hover:underline">Entrar</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
