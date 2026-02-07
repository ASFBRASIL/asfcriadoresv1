import { Link } from 'react-router-dom';
import { Heart, Users, Leaf, MapPin, ArrowRight, Quote, Target, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSEO } from '../hooks/useSEO';

const values = [
  {
    icon: Heart,
    title: 'Paixão pela Natureza',
    description: 'Acreditamos na importância das abelhas nativas para a preservação dos ecossistemas brasileiros.',
  },
  {
    icon: Users,
    title: 'Comunidade Unida',
    description: 'Conectamos criadores de todo o Brasil para troca de experiências e fortalecimento da meliponicultura.',
  },
  {
    icon: Leaf,
    title: 'Sustentabilidade',
    description: 'Promovemos práticas sustentáveis de criação que beneficiam tanto as abelhas quanto o meio ambiente.',
  },
  {
    icon: MapPin,
    title: 'Alcance Nacional',
    description: 'Estamos presentes em todos os estados brasileiros, conectando criadores de Norte a Sul.',
  },
];

const team = [
  {
    name: 'Dr. Carlos Mendes',
    role: 'Fundador',
    description: 'Meliponicultor há mais de 20 anos, pesquisador e apaixonado por abelhas nativas.',
  },
  {
    name: 'Dra. Ana Silva',
    role: 'Diretora Científica',
    description: 'Bióloga especializada em polinizadores e conservação de espécies nativas.',
  },
  {
    name: 'Pedro Santos',
    role: 'Coordenador de Comunidade',
    description: 'Responsável por conectar criadores e promover eventos de meliponicultura.',
  },
];

export function Sobre() {
  useSEO({ title: 'Sobre Nós', description: 'Conheça a missão da ASF Criadores: conectar meliponicultores e preservar as abelhas sem ferrão do Brasil.' });
  return (
    <div className="min-h-screen pt-20 lg:pt-24">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-[var(--asf-green)] to-[var(--asf-green-dark)]">
        <div className="container-asf section-padding">
          <div className="max-w-3xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <nav className="flex items-center justify-center gap-2 text-sm text-white/70 mb-6">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <span className="text-white">Sobre</span>
              </nav>
              <h1 className="text-3xl lg:text-5xl font-poppins font-bold mb-6">
                Sobre a ASF Criadores
              </h1>
              <p className="text-lg text-white/80 leading-relaxed">
                Somos uma plataforma dedicada a conectar criadores de abelhas sem ferrão em todo o Brasil, 
                promovendo a meliponicultura sustentável e a preservação da biodiversidade.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-asf section-padding">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[var(--asf-gray-light)] rounded-2xl p-8"
            >
              <div className="w-14 h-14 rounded-xl bg-[var(--asf-green)]/10 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-[var(--asf-green)]" />
              </div>
              <h2 className="text-2xl font-poppins font-bold text-[var(--asf-gray-dark)] mb-4">
                Nossa Missão
              </h2>
              <p className="text-[var(--asf-gray-medium)] leading-relaxed">
                Conectar criadores de abelhas sem ferrão em todo o Brasil, facilitando a troca de conhecimento, 
                colônias e experiências. Queremos fortalecer a comunidade meliponicultora e contribuir para 
                a preservação das espécies nativas brasileiras.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[var(--asf-gray-light)] rounded-2xl p-8"
            >
              <div className="w-14 h-14 rounded-xl bg-[var(--asf-yellow)]/20 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-[var(--asf-yellow-dark)]" />
              </div>
              <h2 className="text-2xl font-poppins font-bold text-[var(--asf-gray-dark)] mb-4">
                Nossa Visão
              </h2>
              <p className="text-[var(--asf-gray-medium)] leading-relaxed">
                Ser a principal plataforma de conexão entre meliponicultores do Brasil, promovendo o 
                crescimento sustentável da atividade e a conservação das abelhas nativas para as 
                futuras gerações.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-16 lg:py-20 bg-[var(--asf-gray-light)]">
        <div className="container-asf section-padding">
          <div className="max-w-3xl mx-auto text-center">
            <Quote className="w-12 h-12 text-[var(--asf-green)]/30 mx-auto mb-6" />
            <blockquote className="text-xl lg:text-2xl text-[var(--asf-gray-dark)] font-medium leading-relaxed mb-6">
              "As abelhas sem ferrão são tesouros da nossa biodiversidade. Nossa missão é garantir 
              que cada vez mais pessoas possam conhecer, criar e preservar essas espécies incríveis."
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[var(--asf-green)]/10 flex items-center justify-center">
                <span className="font-semibold text-[var(--asf-green)]">CM</span>
              </div>
              <div className="text-left">
                <div className="font-medium text-[var(--asf-gray-dark)]">Dr. Carlos Mendes</div>
                <div className="text-sm text-[var(--asf-gray-medium)]">Fundador</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-asf section-padding">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-poppins font-bold text-[var(--asf-gray-dark)] mb-4">
              Nossos Valores
            </h2>
            <p className="text-[var(--asf-gray-medium)] max-w-2xl mx-auto">
              Princípios que guiam nosso trabalho e nossa relação com a comunidade meliponicultora.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[var(--asf-gray-light)] rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--asf-green)]/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-[var(--asf-green)]" />
                </div>
                <h3 className="font-poppins font-semibold text-lg text-[var(--asf-gray-dark)] mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-[var(--asf-gray-medium)] leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-20 bg-[var(--asf-gray-light)]">
        <div className="container-asf section-padding">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-poppins font-bold text-[var(--asf-gray-dark)] mb-4">
              Nossa Equipe
            </h2>
            <p className="text-[var(--asf-gray-medium)] max-w-2xl mx-auto">
              Pessoas apaixonadas que trabalham para fortalecer a comunidade meliponicultora.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-[var(--asf-green)]/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-semibold text-[var(--asf-green)]">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-poppins font-semibold text-lg text-[var(--asf-gray-dark)]">
                  {member.name}
                </h3>
                <p className="text-sm text-[var(--asf-green)] mb-3">{member.role}</p>
                <p className="text-sm text-[var(--asf-gray-medium)]">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-[var(--asf-green)] to-[var(--asf-green-dark)]">
        <div className="container-asf section-padding">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-poppins font-bold text-white mb-4">
              Quer fazer parte dessa comunidade?
            </h2>
            <p className="text-white/80 mb-8">
              Junte-se a mais de 500 criadores de abelhas sem ferrão em todo o Brasil.
            </p>
            <Link
              to="/sou-criador"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--asf-yellow)]
                       text-[var(--asf-gray-dark)] font-semibold hover:bg-[var(--asf-yellow-light)]
                       transition-all duration-300 hover:-translate-y-0.5"
            >
              Cadastre-se como criador
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
