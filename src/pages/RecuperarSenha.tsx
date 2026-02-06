import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Check, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [sent, setSent] = useState(false);
  const { resetPassword, isSupabaseReady } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Informe seu e-mail.');
      setIsSubmitting(false);
      return;
    }

    const { error } = await resetPassword(email);
    if (error) {
      setErrorMsg(error.message || 'Erro ao enviar e-mail de recuperação.');
    } else {
      setSent(true);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen pt-20 lg:pt-24 bg-[var(--asf-gray-light)]">
      <div className="container-asf section-padding py-12 lg:py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-soft-lg p-8">

            {sent ? (
              /* Sucesso */
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-poppins font-bold text-[var(--asf-gray-dark)] mb-2">E-mail enviado!</h1>
                <p className="text-[var(--asf-gray-medium)] mb-2">
                  Enviamos um link de recuperação para:
                </p>
                <p className="font-medium text-[var(--asf-gray-dark)] mb-6">{email}</p>
                <p className="text-sm text-[var(--asf-gray-medium)] mb-8">
                  Verifique sua caixa de entrada e spam. O link expira em 1 hora.
                </p>
                <div className="flex flex-col gap-3">
                  <Link to="/entrar" className="w-full px-6 py-3 rounded-xl bg-[var(--asf-green)] text-white font-medium text-center hover:bg-[var(--asf-green-dark)] transition-colors text-sm">
                    Voltar para Login
                  </Link>
                  <button onClick={() => { setSent(false); setEmail(''); }}
                    className="w-full px-6 py-3 rounded-xl bg-gray-100 text-[var(--asf-gray-dark)] font-medium text-sm hover:bg-gray-200 transition-colors">
                    Tentar outro e-mail
                  </button>
                </div>
              </div>
            ) : (
              /* Formulário */
              <>
                <Link to="/entrar" className="inline-flex items-center gap-1 text-sm text-[var(--asf-green)] hover:underline mb-6">
                  <ArrowLeft className="w-4 h-4" /> Voltar para login
                </Link>

                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-[var(--asf-green)]/10 flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-7 h-7 text-[var(--asf-green)]" />
                  </div>
                  <h1 className="text-2xl font-poppins font-bold text-[var(--asf-gray-dark)] mb-1">Recuperar senha</h1>
                  <p className="text-sm text-[var(--asf-gray-medium)]">
                    Informe seu e-mail e enviaremos um link para redefinir sua senha.
                  </p>
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm mb-5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />{errorMsg}
                  </div>
                )}

                {!isSupabaseReady && (
                  <div className="p-3 rounded-xl bg-yellow-50 text-yellow-700 text-sm mb-5">
                    <strong>Modo demo:</strong> Recuperação de senha requer Supabase configurado.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--asf-gray-dark)] mb-1.5">E-mail cadastrado</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] focus:ring-2 focus:ring-[var(--asf-green)]/20 transition-all outline-none text-sm"
                        placeholder="seu@email.com" />
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--asf-green)] text-white font-medium hover:bg-[var(--asf-green-dark)] transition-all disabled:opacity-50 text-sm">
                    {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Enviar link de recuperação'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
