import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export function Privacidade() {
  useSEO({ title: 'Política de Privacidade', description: 'Política de Privacidade da plataforma ASF Criadores.' });

  return (
    <div className="min-h-screen pt-20 lg:pt-24 bg-[var(--asf-gray-light)]">
      <div className="container-asf section-padding py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-sm text-[var(--asf-gray-medium)] mb-6">
          <Link to="/" className="hover:text-[var(--asf-green)]">Home</Link><ChevronRight className="w-3 h-3" /><span className="text-[var(--asf-gray-dark)]">Privacidade</span>
        </nav>
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 lg:p-12 border border-gray-100">
          <h1 className="text-3xl font-poppins font-bold text-[var(--asf-gray-dark)] mb-2">Política de Privacidade</h1>
          <p className="text-sm text-[var(--asf-gray-medium)] mb-8">Última atualização: Janeiro de 2026</p>

          <div className="space-y-6 text-[var(--asf-gray-medium)] text-[15px] leading-relaxed">
            <section>
              <h2 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3">1. Dados Coletados</h2>
              <p>A ASF Criadores coleta os seguintes dados pessoais: nome completo, e-mail, telefone (WhatsApp), localização (cidade, estado, CEP, coordenadas), informações sobre espécies criadas, biografia e foto de perfil. Estes dados são fornecidos voluntariamente pelo usuário no momento do cadastro e edição do perfil.</p>
            </section>

            <section>
              <h2 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3">2. Finalidade do Uso</h2>
              <p>Os dados coletados são utilizados para: exibir seu perfil no mapa de criadores; permitir que outros usuários entrem em contato via WhatsApp; gerar estatísticas agregadas da plataforma; enviar comunicações relevantes sobre a plataforma; melhorar a experiência do usuário.</p>
            </section>

            <section>
              <h2 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3">3. Visibilidade dos Dados</h2>
              <p>Ao se cadastrar como criador, você autoriza a exibição pública das seguintes informações: nome, cidade, estado, espécies criadas, avaliações recebidas, status (venda/troca/informação) e selo de verificação. Seu telefone é exibido apenas para usuários logados que acessam seu perfil. E-mail e endereço completo não são exibidos publicamente.</p>
            </section>

            <section>
              <h2 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3">4. Armazenamento e Segurança</h2>
              <p>Os dados são armazenados nos servidores da Supabase (infraestrutura AWS), com criptografia em trânsito (TLS) e em repouso. Utilizamos autenticação segura para acesso à plataforma. Apesar de adotarmos medidas de segurança adequadas, nenhum sistema é 100% seguro.</p>
            </section>

            <section>
              <h2 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3">5. Compartilhamento</h2>
              <p>Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins comerciais. Seus dados podem ser compartilhados apenas: com outros usuários da plataforma conforme descrito na seção 3; para cumprimento de obrigação legal; para proteger direitos da ASF Brasil.</p>
            </section>

            <section>
              <h2 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3">6. Seus Direitos (LGPD)</h2>
              <p>Em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a: acessar seus dados pessoais; corrigir dados incompletos ou incorretos; solicitar a exclusão de seus dados; revogar o consentimento a qualquer momento; solicitar a portabilidade dos dados. Para exercer estes direitos, entre em contato pelo e-mail abaixo.</p>
            </section>

            <section>
              <h2 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3">7. Cookies</h2>
              <p>Utilizamos cookies e armazenamento local (localStorage) exclusivamente para manter sua sessão de login e preferências. Não utilizamos cookies de rastreamento ou publicidade.</p>
            </section>

            <section>
              <h2 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3">8. Contato do Encarregado (DPO)</h2>
              <p>Para questões relacionadas à privacidade e proteção de dados, entre em contato com nosso encarregado: <a href="mailto:privacidade@asfbrasil.org.br" className="text-[var(--asf-green)] hover:underline">privacidade@asfbrasil.org.br</a></p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
