import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export function Termos() {
  useSEO({ title: 'Termos de Uso', description: 'Termos de Uso da plataforma ASF Criadores.' });

  return (
    <div className="min-h-screen pt-20 lg:pt-24 bg-[var(--asf-gray-light)]">
      <div className="container-asf section-padding py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-sm text-[var(--asf-gray-medium)] mb-6">
          <Link to="/" className="hover:text-[var(--asf-green)]">Home</Link><ChevronRight className="w-3 h-3" /><span className="text-[var(--asf-gray-dark)]">Termos de Uso</span>
        </nav>
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 lg:p-12 border border-gray-100">
          <h1 className="text-3xl font-poppins font-bold text-[var(--asf-gray-dark)] mb-2">Termos de Uso</h1>
          <p className="text-sm text-[var(--asf-gray-medium)] mb-8">Última atualização: Janeiro de 2026</p>

          <div className="prose-custom space-y-6 text-[var(--asf-gray-medium)] text-[15px] leading-relaxed">
            <section>
              <h2 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3">1. Aceitação dos Termos</h2>
              <p>Ao acessar e utilizar a plataforma ASF Criadores ("Plataforma"), você concorda com estes Termos de Uso. Se você não concorda com qualquer parte destes termos, não utilize a Plataforma.</p>
            </section>

            <section>
              <h2 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3">2. Descrição do Serviço</h2>
              <p>A ASF Criadores é uma plataforma gratuita que conecta criadores de abelhas sem ferrão (meliponicultores) com interessados em adquirir colônias, trocar informações e promover a meliponicultura no Brasil. A plataforma oferece um mapa interativo de criadores, catálogo de espécies, sistema de avaliações e canal de comunicação via WhatsApp.</p>
            </section>

            <section>
              <h2 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3">3. Cadastro e Conta</h2>
              <p>Para utilizar funcionalidades restritas, é necessário criar uma conta fornecendo informações verídicas. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades realizadas em sua conta. A ASF se reserva o direito de suspender ou encerrar contas que violem estes termos.</p>
            </section>

            <section>
              <h2 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3">4. Responsabilidades do Usuário</h2>
              <p>Ao utilizar a plataforma, você se compromete a: fornecer informações verdadeiras e atualizadas; não utilizar a plataforma para fins ilícitos; respeitar os demais usuários; não publicar conteúdo ofensivo, discriminatório ou ilegal; cumprir a legislação ambiental vigente relacionada à criação de abelhas nativas.</p>
            </section>

            <section>
              <h2 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3">5. Transações entre Usuários</h2>
              <p>A ASF Criadores é uma plataforma de conexão e não intermedia transações financeiras ou comerciais entre usuários. Qualquer negociação (compra, venda ou troca de colônias) é de responsabilidade exclusiva das partes envolvidas. Recomendamos que os criadores verifiquem a legislação local sobre comércio de abelhas nativas.</p>
            </section>

            <section>
              <h2 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3">6. Propriedade Intelectual</h2>
              <p>Todo o conteúdo da plataforma, incluindo textos, imagens, logotipos e software, é propriedade da ASF Brasil ou de seus respectivos titulares. O uso não autorizado deste conteúdo é proibido.</p>
            </section>

            <section>
              <h2 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3">7. Limitação de Responsabilidade</h2>
              <p>A ASF Criadores não se responsabiliza por: informações incorretas fornecidas por usuários; danos decorrentes de transações entre usuários; indisponibilidade temporária da plataforma; conteúdo publicado por terceiros.</p>
            </section>

            <section>
              <h2 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3">8. Contato</h2>
              <p>Em caso de dúvidas sobre estes Termos de Uso, entre em contato pelo e-mail: <a href="mailto:contato@asfbrasil.org.br" className="text-[var(--asf-green)] hover:underline">contato@asfbrasil.org.br</a></p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
