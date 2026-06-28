import { useState, useMemo } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { TableRowSkeleton } from '../common/Skeleton';

export default function DataTable({
  columns,
  data = [],
  loading = false,
  searchable = true,
  searchKeys = [],
  pageSize = 10,
  onRowClick,
  actions,
  emptyMessage = 'No data found',
}) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      searchKeys.length > 0
        ? searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(q))
        : Object.values(row).some((val) => String(val ?? '').toLowerCase().includes(q))
    );
  }, [data, search, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="glass-card overflow-hidden p-0">
      {(searchable || actions) && (
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-3 justify-between">
          {searchable && (
            <div className="relative flex-1 max-w-sm">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                placeholder="Search..."
                className="input-field pl-10 py-2 text-sm"
              />
            </div>
          )}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-gray-400">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-medium whitespace-nowrap">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} cols={columns.length} />
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr
                  key={row._id || row.id || i}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-white/5 hover:bg-white/5 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > pageSize && (
        <div className="p-4 border-t border-white/10 flex items-center justify-between text-sm text-gray-400">
          <span>
            Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="p-2 rounded-lg glass disabled:opacity-30"
            >
              <FiChevronLeft />
            </button>
            <span className="px-3 py-2">{page + 1} / {totalPages}</span>
            <button
              type="button"
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="p-2 rounded-lg glass disabled:opacity-30"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}