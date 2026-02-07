import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Image, ZoomIn, Check, AlertTriangle } from 'lucide-react';

/* ── Tipos ── */

export interface ImageUploaderProps {
  /** URL da imagem atual (já salva) */
  value?: string;
  /** Callback quando imagem é selecionada e comprimida (retorna File pronto para upload) */
  onFileReady?: (file: File) => void;
  /** Callback quando imagem é removida */
  onRemove?: () => void;
  /** Callback completo: seleciona, comprime e faz upload via função externa */
  onUpload?: (file: File) => Promise<string | null>;
  /** Label acima do componente */
  label?: string;
  /** Texto de ajuda abaixo */
  hint?: string;
  /** Tamanho máximo em bytes (padrão 5MB) */
  maxSize?: number;
  /** Tipos aceitos */
  accept?: string;
  /** Largura máxima para compressão (padrão 1200px) */
  maxWidth?: number;
  /** Qualidade de compressão 0-1 (padrão 0.8) */
  quality?: number;
  /** Modo do componente: 'default' (retangular) ou 'avatar' (circular) */
  mode?: 'default' | 'avatar';
  /** Classes extras para o container */
  className?: string;
  /** Desabilitar interação */
  disabled?: boolean;
  /** Aspect ratio para preview: '4/3', '16/9', '1/1' */
  aspect?: string;
}

/* ── Compressão de imagem no client ── */

function compressImage(file: File, maxWidth: number, quality: number): Promise<File> {
  return new Promise((resolve) => {
    // Se for SVG ou GIF, não comprimir
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
      resolve(file);
      return;
    }

    const img = new window.Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    img.onload = () => {
      let { width, height } = img;

      // Redimensionar se maior que maxWidth
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const ext = file.type === 'image/png' ? '.png' : '.webp';
            const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, ext), {
              type: blob.type,
              lastModified: Date.now(),
            });
            // Só usar comprimido se for menor
            resolve(compressedFile.size < file.size ? compressedFile : file);
          } else {
            resolve(file);
          }
        },
        file.type === 'image/png' ? 'image/png' : 'image/webp',
        quality,
      );
    };

    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
}

/* ── Formatar tamanho de arquivo ── */

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/* ── Componente ── */

export function ImageUploader({
  value,
  onFileReady,
  onRemove,
  onUpload,
  label,
  hint,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = 'image/jpeg,image/png,image/webp,image/gif',
  maxWidth = 1200,
  quality = 0.8,
  mode = 'default',
  className = '',
  disabled = false,
  aspect = '4/3',
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // Imagem final: preview local > value externo
  const displayImage = preview || value || null;

  // Limpar preview local quando value muda (ex: após upload com sucesso)
  useEffect(() => {
    if (value && preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  }, [value]);

  /* ── Validação ── */

  const validateFile = (file: File): string | null => {
    const validTypes = accept.split(',').map((t) => t.trim());
    if (!validTypes.some((t) => file.type.match(t.replace('*', '.*')))) {
      return 'Formato não suportado. Use JPG, PNG ou WebP.';
    }
    if (file.size > maxSize) {
      return `Arquivo muito grande (${formatFileSize(file.size)}). Máximo: ${formatFileSize(maxSize)}.`;
    }
    return null;
  };

  /* ── Processar arquivo ── */

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      setCompressionInfo(null);

      // Validar
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Preview local imediato
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);

      // Comprimir
      const originalSize = file.size;
      const compressed = await compressImage(file, maxWidth, quality);
      const compressedSize = compressed.size;

      if (compressedSize < originalSize) {
        const savings = ((1 - compressedSize / originalSize) * 100).toFixed(0);
        setCompressionInfo(
          `${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)} (-${savings}%)`,
        );
      }

      // Se tem onUpload, faz upload automaticamente
      if (onUpload) {
        setIsUploading(true);
        setUploadProgress(0);

        // Simular progresso (Supabase não suporta progress nativo)
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(interval);
              return 90;
            }
            return prev + Math.random() * 15;
          });
        }, 200);

        try {
          const resultUrl = await onUpload(compressed);
          clearInterval(interval);
          setUploadProgress(100);

          if (resultUrl) {
            // Sucesso - limpar preview local pois o value vai atualizar
            setTimeout(() => {
              URL.revokeObjectURL(localUrl);
              setPreview(null);
              setIsUploading(false);
              setUploadProgress(0);
            }, 500);
          } else {
            setError('Erro ao enviar imagem. Tente novamente.');
            setPreview(null);
            URL.revokeObjectURL(localUrl);
            setIsUploading(false);
            setUploadProgress(0);
          }
        } catch {
          clearInterval(interval);
          setError('Erro ao enviar imagem. Tente novamente.');
          setPreview(null);
          URL.revokeObjectURL(localUrl);
          setIsUploading(false);
          setUploadProgress(0);
        }
      } else if (onFileReady) {
        // Modo manual: entregar arquivo comprimido para o pai
        onFileReady(compressed);
      }
    },
    [onUpload, onFileReady, maxWidth, quality, maxSize, accept],
  );

  /* ── Drag & Drop ── */

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [disabled, processFile],
  );

  /* ── Click para selecionar ── */

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      // Limpar input para permitir re-selecionar mesmo arquivo
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [processFile],
  );

  /* ── Remover ── */

  const handleRemove = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    setError(null);
    setCompressionInfo(null);
    setUploadProgress(0);
    setIsUploading(false);
    onRemove?.();
  }, [preview, onRemove]);

  /* ── Render ── */

  const isAvatar = mode === 'avatar';

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-[var(--asf-gray-dark)] dark:text-gray-200 mb-2">
          {label}
        </label>
      )}

      <div className="flex items-start gap-4">
        {/* Zona de drop / Preview */}
        <div
          ref={dropRef}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={`
            relative group cursor-pointer transition-all duration-300 overflow-hidden
            ${isAvatar
              ? 'w-28 h-28 rounded-full'
              : `w-full max-w-xs rounded-xl`
            }
            ${isDragging
              ? 'border-[var(--asf-green)] bg-[var(--asf-green)]/5 scale-[1.02]'
              : displayImage
                ? 'border-transparent'
                : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:border-[var(--asf-green)] hover:bg-[var(--asf-green)]/5'
            }
            ${!isAvatar ? 'border-2 border-dashed' : 'border-2 border-dashed'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={!isAvatar ? { aspectRatio: aspect } : undefined}
        >
          {displayImage ? (
            <>
              <img
                src={displayImage}
                alt="Preview"
                className={`w-full h-full object-cover ${isUploading ? 'opacity-50' : ''}`}
              />

              {/* Overlay hover */}
              {!isUploading && !disabled && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFullPreview(true);
                      }}
                      className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                      title="Ver em tamanho real"
                    >
                      <ZoomIn className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove();
                      }}
                      className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-red-50 transition-colors"
                      title="Remover"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              )}

              {/* Barra de progresso sobre a imagem */}
              {isUploading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                  <div className="w-3/4 h-2 bg-white/30 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-[var(--asf-green)] rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${Math.min(uploadProgress, 100)}%` }}
                    />
                  </div>
                  <span className="text-white text-xs font-medium">
                    {uploadProgress >= 100 ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Enviado!
                      </span>
                    ) : (
                      `Enviando... ${Math.round(uploadProgress)}%`
                    )}
                  </span>
                </div>
              )}
            </>
          ) : (
            /* Estado vazio */
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <div
                className={`rounded-full bg-[var(--asf-green)]/10 flex items-center justify-center mb-2
                ${isAvatar ? 'w-12 h-12' : 'w-14 h-14'}`}
              >
                {isDragging ? (
                  <Upload className="w-6 h-6 text-[var(--asf-green)] animate-bounce" />
                ) : (
                  <Image className={`text-[var(--asf-green)] ${isAvatar ? 'w-5 h-5' : 'w-6 h-6'}`} />
                )}
              </div>
              {!isAvatar && (
                <>
                  <p className="text-sm font-medium text-[var(--asf-gray-dark)] dark:text-gray-200 text-center">
                    {isDragging ? 'Solte a imagem aqui' : 'Arraste ou clique'}
                  </p>
                  <p className="text-xs text-[var(--asf-gray-medium)] mt-1 text-center">
                    JPG, PNG, WebP. Máx. {formatFileSize(maxSize)}
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Input escondido */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
        />
      </div>

      {/* Info de compressão */}
      {compressionInfo && (
        <p className="mt-2 text-xs text-[var(--asf-green)] flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          Comprimido: {compressionInfo}
        </p>
      )}

      {/* Erro */}
      {error && (
        <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}

      {/* Hint */}
      {hint && !error && !compressionInfo && (
        <p className="mt-2 text-xs text-[var(--asf-gray-medium)]">{hint}</p>
      )}

      {/* Modal Full Preview */}
      {showFullPreview && displayImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowFullPreview(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={displayImage}
              alt="Preview completo"
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
            />
            <button
              onClick={() => setShowFullPreview(false)}
              className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
