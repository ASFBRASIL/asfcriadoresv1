import { useState, useMemo } from 'react';

export interface PaginationResult<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
  goTo: (page: number) => void;
  next: () => void;
  prev: () => void;
  setPerPage: (n: number) => void;
  perPage: number;
}

export function usePagination<T>(allItems: T[], initialPerPage = 12): PaginationResult<T> {
  const [page, setPage] = useState(1);
  const [perPage, setPerPageState] = useState(initialPerPage);

  const totalItems = allItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const safePage = Math.min(page, totalPages);

  const items = useMemo(() => {
    const start = (safePage - 1) * perPage;
    return allItems.slice(start, start + perPage);
  }, [allItems, safePage, perPage]);

  const goTo = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));
  const next = () => goTo(safePage + 1);
  const prev = () => goTo(safePage - 1);
  const setPerPage = (n: number) => { setPerPageState(n); setPage(1); };

  return { items, page: safePage, totalPages, totalItems, hasNext: safePage < totalPages, hasPrev: safePage > 1, goTo, next, prev, setPerPage, perPage };
}

// Componente visual de paginação

export function PaginationControls({ page, totalPages, totalItems, hasNext, hasPrev, goTo, next, prev }: {
  page: number; totalPages: number; totalItems: number;
  hasNext: boolean; hasPrev: boolean;
  goTo: (p: number) => void; next: () => void; prev: () => void;
}) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      <p className="text-sm text-[var(--asf-gray-medium)]">
        Mostrando página {page} de {totalPages} ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
      </p>
      <div className="flex items-center gap-1">
        <button onClick={prev} disabled={!hasPrev}
          className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 transition-colors">
          ← Anterior
        </button>
        {getPages().map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className="px-2 py-2 text-sm text-[var(--asf-gray-medium)]">…</span>
          ) : (
            <button key={p} onClick={() => goTo(p as number)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                p === page ? 'bg-[var(--asf-green)] dark:bg-[var(--asf-green)] text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-[var(--asf-gray-medium)] dark:text-gray-400'
              }`}>
              {p}
            </button>
          )
        )}
        <button onClick={next} disabled={!hasNext}
          className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 transition-colors">
          Próxima →
        </button>
      </div>
    </div>
  );
}
