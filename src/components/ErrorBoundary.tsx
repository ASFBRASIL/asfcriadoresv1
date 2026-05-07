import { Component, type ReactNode } from 'react';
import { RefreshCw, WifiOff } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  isChunkError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, isChunkError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Erros de carregamento de chunk (lazy loading) têm mensagens específicas
    const isChunk =
      error.message.includes('Loading chunk') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('Importing a module');
    return { hasError: true, isChunkError: isChunk };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleRetry = () => {
    // Para erros de chunk, recarregar a página garante o novo bundle
    if (this.state.isChunkError) {
      window.location.reload();
    } else {
      this.setState({ hasError: false, isChunkError: false });
    }
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
            {this.state.isChunkError
              ? <WifiOff className="w-8 h-8 text-gray-400" />
              : <RefreshCw className="w-8 h-8 text-gray-400" />
            }
          </div>
          <h2 className="text-xl font-poppins font-bold text-[var(--asf-gray-dark)] mb-2">
            {this.state.isChunkError ? 'Erro de conexão' : 'Algo deu errado'}
          </h2>
          <p className="text-sm text-[var(--asf-gray-medium)] mb-6">
            {this.state.isChunkError
              ? 'Não foi possível carregar esta página. Verifique sua conexão e tente novamente.'
              : 'Ocorreu um erro inesperado. Tente recarregar a página.'
            }
          </p>
          <button
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                       bg-[var(--asf-green)] text-white text-sm font-medium
                       hover:bg-[var(--asf-green-dark)] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }
}
