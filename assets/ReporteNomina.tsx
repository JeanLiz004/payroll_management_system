import React, { useEffect, useMemo, useState } from 'react';
import { empleadosService } from '../api/empleadosService';
import type { ItemReporteNominaDto } from '../types/empleado';

type ColumnaOrden = 'empleadoId' | 'nombreCompleto' | 'pagoSemanal';
type DireccionOrden = 'asc' | 'desc';

const formatearMonto = (monto: number) =>
  `$${monto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`;

const iniciales = (nombreCompleto: string) =>
  nombreCompleto
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');

export const ReporteNomina: React.FC = () => {
  const [reporte, setReporte] = useState<ItemReporteNominaDto[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [busqueda, setBusqueda] = useState('');
  const [tipoActivo, setTipoActivo] = useState<string>('todos');
  const [orden, setOrden] = useState<{ columna: ColumnaOrden; direccion: DireccionOrden }>({
    columna: 'nombreCompleto',
    direccion: 'asc',
  });

  const obtenerDatos = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await empleadosService.getReporteNomina();
      setReporte(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al conectar con la API de Nómina');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  const tipos = useMemo(
    () => Array.from(new Set(reporte.map((r) => r.tipoEmpleado))).sort(),
    [reporte]
  );

  const desglosePorTipo = useMemo(() => {
    const mapa = new Map<string, { cantidad: number; subtotal: number }>();
    reporte.forEach((item) => {
      const actual = mapa.get(item.tipoEmpleado) || { cantidad: 0, subtotal: 0 };
      actual.cantidad += 1;
      actual.subtotal += item.pagoSemanal;
      mapa.set(item.tipoEmpleado, actual);
    });
    return Array.from(mapa.entries()).sort((a, b) => b[1].subtotal - a[1].subtotal);
  }, [reporte]);

  const filasFiltradas = useMemo(() => {
    let filas = reporte;

    if (tipoActivo !== 'todos') {
      filas = filas.filter((f) => f.tipoEmpleado === tipoActivo);
    }
    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase();
      filas = filas.filter((f) => f.nombreCompleto.toLowerCase().includes(q));
    }

    const { columna, direccion } = orden;
    const factor = direccion === 'asc' ? 1 : -1;
    return [...filas].sort((a, b) => {
      if (columna === 'nombreCompleto') {
        return a.nombreCompleto.localeCompare(b.nombreCompleto) * factor;
      }
      return (a[columna] - b[columna]) * factor;
    });
  }, [reporte, tipoActivo, busqueda, orden]);

  const totalGeneral = useMemo(
    () => reporte.reduce((sum, item) => sum + item.pagoSemanal, 0),
    [reporte]
  );

  const totalFiltrado = useMemo(
    () => filasFiltradas.reduce((sum, item) => sum + item.pagoSemanal, 0),
    [filasFiltradas]
  );

  const hayFiltrosActivos = Boolean(busqueda.trim() || tipoActivo !== 'todos');

  const alternarOrden = (columna: ColumnaOrden) => {
    setOrden((prev) =>
      prev.columna === columna
        ? { columna, direccion: prev.direccion === 'asc' ? 'desc' : 'asc' }
        : { columna, direccion: 'asc' }
    );
  };

  return (
    <div className="min-h-screen bg-[#f6f4ef] print:bg-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#10192b] to-[#1b2740] px-5 py-6 sm:px-8 sm:py-7 print:bg-none print:px-0 print:py-2">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#c9a15a] font-serif text-[#e4d3ab] print:border-[#232b3a] print:text-[#232b3a]">
              N
            </div>
            <div>
              <h1 className="font-serif text-lg font-medium text-[#f4f2ec] sm:text-xl print:text-[#10192b]">
                Reporte semanal de nómina
              </h1>
              <p className="mt-0.5 text-xs text-[#9aa3b5] print:text-[#5b6577]">
                Pago calculado por empleado para la semana en curso
              </p>
            </div>
          </div>

          {!cargando && !error && reporte.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-medium text-[#dfe2e8] transition-colors hover:bg-white/10 print:hidden"
              >
                <PrintIcon />
                Imprimir
              </button>
              <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 print:border-[#e6e3d8]">
                <div className="text-[11px] text-[#9aa3b5] print:text-[#5b6577]">Empleados</div>
                <div className="text-base font-semibold text-[#f4f2ec] print:text-[#232b3a]">
                  {reporte.length}
                </div>
              </div>
              <div className="rounded-lg border border-[#c9a15a]/30 bg-[#c9a15a]/10 px-4 py-2">
                <div className="text-[11px] text-[#e4d3ab] print:text-[#8a6a2f]">Total a pagar</div>
                <div className="text-base font-semibold text-[#e4d3ab] print:text-[#3d6b52]">
                  {formatearMonto(totalGeneral)}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-6 sm:px-8 print:px-0 print:py-4">
        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-md border-l-4 border-[#b3432f] bg-[#fbeae6] px-4 py-3 text-sm text-[#8a3524]">
            <AlertIcon />
            <span className="flex-1">{error}</span>
            <button
              onClick={obtenerDatos}
              className="whitespace-nowrap rounded-md border border-current px-3 py-1 text-xs hover:bg-[#b3432f]/10"
            >
              Reintentar
            </button>
          </div>
        )}

        {cargando ? (
          <TablaEsqueleto />
        ) : !error && reporte.length === 0 ? (
          <EstadoVacio />
        ) : (
          !error && (
            <>
              {/* Breakdown by employee type */}
              {desglosePorTipo.length > 1 && (
                <div className="mb-5 flex gap-3 overflow-x-auto pb-1 print:hidden">
                  {desglosePorTipo.map(([tipo, datos]) => (
                    <div
                      key={tipo}
                      className="flex-shrink-0 rounded-lg border border-[#e6e3d8] bg-white px-4 py-3 min-w-[150px]"
                    >
                      <div className="text-xs font-medium text-[#8a6a2f]">{tipo}</div>
                      <div className="mt-1 text-sm font-semibold text-[#232b3a]">
                        {formatearMonto(datos.subtotal)}
                      </div>
                      <div className="text-[11px] text-[#90978f]">
                        {datos.cantidad} {datos.cantidad === 1 ? 'empleado' : 'empleados'}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Search + type filter */}
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
                <div className="relative w-full sm:max-w-xs">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa1b0]">
                    <SearchIcon />
                  </span>
                  <input
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar empleado..."
                    className="w-full rounded-lg border border-[#e6e3d8] bg-white py-2 pl-9 pr-3 text-sm text-[#232b3a] placeholder:text-[#b7bcc7] focus:border-[#1b2740] focus:outline-none focus:ring-2 focus:ring-[#1b2740]/10"
                  />
                </div>

                {tipos.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    <FiltroChip
                      label="Todos"
                      activo={tipoActivo === 'todos'}
                      onClick={() => setTipoActivo('todos')}
                    />
                    {tipos.map((tipo) => (
                      <FiltroChip
                        key={tipo}
                        label={tipo}
                        activo={tipoActivo === tipo}
                        onClick={() => setTipoActivo(tipo)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {filasFiltradas.length === 0 ? (
                <div className="rounded-lg border border-[#e6e3d8] bg-white px-6 py-14 text-center">
                  <p className="text-sm font-medium text-[#232b3a]">
                    Sin resultados para estos filtros
                  </p>
                  <p className="mt-1 text-sm text-[#5b6577]">
                    Ajusta la búsqueda o el tipo de empleado seleccionado.
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop / tablet table */}
                  <div className="hidden overflow-hidden rounded-lg border border-[#e6e3d8] bg-white sm:block print:rounded-none print:border-[#cfcabb]">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead className="bg-[#faf9f5] print:bg-white">
                        <tr>
                          <EncabezadoOrdenable
                            label="ID"
                            columna="empleadoId"
                            ordenActual={orden}
                            onClick={alternarOrden}
                          />
                          <EncabezadoOrdenable
                            label="Empleado"
                            columna="nombreCompleto"
                            ordenActual={orden}
                            onClick={alternarOrden}
                          />
                          <th className="p-3.5 text-xs font-semibold tracking-wide text-[#5b6577]">
                            Tipo
                          </th>
                          <th className="p-3.5 text-xs font-semibold tracking-wide text-[#5b6577]">
                            Detalle del cálculo
                          </th>
                          <EncabezadoOrdenable
                            label="Pago semanal"
                            columna="pagoSemanal"
                            ordenActual={orden}
                            onClick={alternarOrden}
                            alineacion="right"
                          />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e6e3d8]">
                        {filasFiltradas.map((item) => (
                          <tr
                            key={item.empleadoId}
                            className="transition-colors hover:bg-[#faf9f5] print:hover:bg-transparent"
                          >
                            <td className="p-3.5 font-medium text-[#5b6577]">{item.empleadoId}</td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-2.5">
                                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#1b2740] text-[11px] font-semibold text-[#e4d3ab] print:hidden">
                                  {iniciales(item.nombreCompleto)}
                                </span>
                                <span className="font-semibold text-[#232b3a]">
                                  {item.nombreCompleto}
                                </span>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <span className="rounded-full border border-[#c9a15a]/30 bg-[#c9a15a]/10 px-2.5 py-1 text-xs font-medium text-[#8a6a2f]">
                                {item.tipoEmpleado}
                              </span>
                            </td>
                            <td className="max-w-xs p-3.5 text-[#5b6577]">{item.detalleCalculo}</td>
                            <td className="p-3.5 text-right font-semibold text-[#3d6b52]">
                              {formatearMonto(item.pagoSemanal)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-[#e6e3d8] bg-[#faf9f5] print:bg-white">
                          <td colSpan={4} className="p-3.5 text-sm font-medium text-[#5b6577]">
                            {hayFiltrosActivos
                              ? `Total (${filasFiltradas.length} de ${reporte.length})`
                              : 'Total general'}
                          </td>
                          <td className="p-3.5 text-right text-sm font-bold text-[#232b3a]">
                            {formatearMonto(totalFiltrado)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="flex flex-col gap-3 sm:hidden">
                    {filasFiltradas.map((item) => (
                      <div
                        key={item.empleadoId}
                        className="rounded-lg border border-[#e6e3d8] bg-white p-4"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#1b2740] text-xs font-semibold text-[#e4d3ab]">
                              {iniciales(item.nombreCompleto)}
                            </span>
                            <div>
                              <div className="text-sm font-semibold text-[#232b3a]">
                                {item.nombreCompleto}
                              </div>
                              <div className="text-xs text-[#90978f]">ID {item.empleadoId}</div>
                            </div>
                          </div>
                          <span className="whitespace-nowrap rounded-full border border-[#c9a15a]/30 bg-[#c9a15a]/10 px-2.5 py-1 text-xs font-medium text-[#8a6a2f]">
                            {item.tipoEmpleado}
                          </span>
                        </div>
                        <p className="mb-3 text-sm leading-relaxed text-[#5b6577]">
                          {item.detalleCalculo}
                        </p>
                        <div className="flex items-center justify-between border-t border-[#e6e3d8] pt-3">
                          <span className="text-xs text-[#90978f]">Pago semanal</span>
                          <span className="text-base font-semibold text-[#3d6b52]">
                            {formatearMonto(item.pagoSemanal)}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between rounded-lg border border-[#e6e3d8] bg-[#faf9f5] px-4 py-3">
                      <span className="text-sm font-medium text-[#5b6577]">
                        {hayFiltrosActivos ? `Total (${filasFiltradas.length})` : 'Total general'}
                      </span>
                      <span className="text-base font-bold text-[#232b3a]">
                        {formatearMonto(totalFiltrado)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </>
          )
        )}
      </main>
    </div>
  );
};

/* ---------- Small pieces ---------- */

const FiltroChip: React.FC<{ label: string; activo: boolean; onClick: () => void }> = ({
  label,
  activo,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
      activo
        ? 'border-[#1b2740] bg-[#1b2740] text-[#f4f2ec]'
        : 'border-[#e6e3d8] bg-white text-[#5b6577] hover:border-[#c9c4b3]'
    }`}
  >
    {label}
  </button>
);

const EncabezadoOrdenable: React.FC<{
  label: string;
  columna: ColumnaOrden;
  ordenActual: { columna: ColumnaOrden; direccion: DireccionOrden };
  onClick: (columna: ColumnaOrden) => void;
  alineacion?: 'left' | 'right';
}> = ({ label, columna, ordenActual, onClick, alineacion = 'left' }) => {
  const activo = ordenActual.columna === columna;
  return (
    <th
      className={`p-3.5 text-xs font-semibold tracking-wide text-[#5b6577] ${
        alineacion === 'right' ? 'text-right' : 'text-left'
      }`}
      aria-sort={activo ? (ordenActual.direccion === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <button
        onClick={() => onClick(columna)}
        className={`inline-flex items-center gap-1 hover:text-[#232b3a] ${
          alineacion === 'right' ? 'flex-row-reverse' : ''
        }`}
      >
        {label}
        <span className={`transition-transform ${activo ? 'text-[#c9a15a]' : 'text-[#c9c4b3]'}`}>
          {activo && ordenActual.direccion === 'desc' ? (
            <ArrowIcon direction="down" />
          ) : (
            <ArrowIcon direction="up" />
          )}
        </span>
      </button>
    </th>
  );
};

const TablaEsqueleto: React.FC = () => (
  <div className="overflow-hidden rounded-lg border border-[#e6e3d8] bg-white">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 border-b border-[#e6e3d8] p-4 last:border-b-0"
      >
        <div className="h-7 w-7 flex-shrink-0 animate-pulse rounded-full bg-[#eeece5]" />
        <div className="h-3.5 w-1/5 animate-pulse rounded bg-[#eeece5]" />
        <div className="h-3.5 w-1/6 animate-pulse rounded bg-[#eeece5]" />
        <div className="h-3.5 flex-1 animate-pulse rounded bg-[#eeece5]" />
        <div className="h-3.5 w-16 animate-pulse rounded bg-[#eeece5]" />
      </div>
    ))}
  </div>
);

const EstadoVacio: React.FC = () => (
  <div className="rounded-lg border border-[#e6e3d8] bg-white px-6 py-14 text-center">
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#b7bcc7"
      strokeWidth="1.6"
      className="mx-auto"
    >
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
    <p className="mt-3 text-sm font-medium text-[#232b3a]">
      No hay datos de nómina para esta semana
    </p>
    <p className="mt-1 text-sm text-[#5b6577]">
      El reporte aparecerá aquí una vez que se calcule la nómina.
    </p>
  </div>
);

/* ---------- Inline icons ---------- */

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

const PrintIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M6 9V3h12v6" />
    <rect x="4" y="9" width="16" height="8" rx="1" />
    <path d="M6 17v4h12v-4" />
  </svg>
);

const AlertIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="flex-shrink-0"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5" />
    <path d="M12 16h.01" />
  </svg>
);

const ArrowIcon: React.FC<{ direction: 'up' | 'down' }> = ({ direction }) => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    style={{ transform: direction === 'down' ? 'rotate(180deg)' : undefined }}
  >
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

export default ReporteNomina;
