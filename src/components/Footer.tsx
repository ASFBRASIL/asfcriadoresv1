import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  plataforma: [
    { path: '/sobre', label: 'Sobre Nós' },
    { path: '/mapa', label: 'Mapa' },
    { path: '/especies', label: 'Conheça Espécies' },
    { path: '/sou-criador', label: 'Seja Criador' },
  ],
  legal: [
    { path: '/termos', label: 'Termos de Uso' },
    { path: '/privacidade', label: 'Privacidade' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[var(--asf-gray-dark)] text-white">
      <div className="container-asf section-padding py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img 
                src="/images/logo-asf.png" 
                alt="ASF Criadores" 
                className="w-10 h-10 rounded-xl object-cover"
              />
              <span className="font-poppins font-bold text-xl">ASF Criadores</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Promovendo a meliponicultura e protegendo o futuro das nossas abelhas nativas. 
              Conectando criadores de todo o Brasil em uma comunidade unida.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center
                         hover:bg-[var(--asf-green)] transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center
                         hover:bg-[var(--asf-green)] transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center
                         hover:bg-[var(--asf-green)] transition-colors duration-300"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Plataforma Links */}
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Plataforma</h3>
            <ul className="space-y-3">
              {footerLinks.plataforma.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-[var(--asf-yellow)] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-[var(--asf-yellow)] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[var(--asf-green)] mt-0.5" />
                <span className="text-gray-400">contato@asfcriadores.com.br</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[var(--asf-green)] mt-0.5" />
                <span className="text-gray-400">(11) 4000-0000</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[var(--asf-green)] mt-0.5" />
                <span className="text-gray-400">São Paulo, SP - Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row 
                      items-center justify-between gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © 2026 ASF Criadores. Conectando meliponicultores em todo o Brasil.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/sou-criador"
              className="text-sm text-[var(--asf-yellow)] hover:underline"
            >
              Sou Criador
            </Link>
            <Link
              to="/entrar"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
