import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import styles from './Dashboard.module.css';

interface Empleado {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  departamento: string;
  activo: boolean;
  tipo: string;
}

const initials = (nombre: string, apellido: string) =>
  `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();

export const Dashboard: React.FC = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroDepto, setFiltroDepto] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');

  // Debounced copies of the free-text filters so we don't fire a request on
  // every keystroke — the select filter still applies immediately.
  const [nombreDebounced, setNombreDebounced] = useState(filtroNombre);
  const [deptoDebounced, setDeptoDebounced] = useState(filtroDepto);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setNombreDebounced(filtroNombre), 350);
    return () => clearTimeout(t);
  }, [filtroNombre]);

  useEffect(() => {
    const t = setTimeout(() => setDeptoDebounced(filtroDepto), 350);
    return () => clearTimeout(t);
  }, [filtroDepto]);

  const cargarEmpleados = async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (nombreDebounced) params.append('nombre', nombreDebounced);
      if (deptoDebounced) params.append('departamento', deptoDebounced);
      if (filtroEstado !== 'todos') {
        params.append('activo', filtroEstado === 'activo' ? 'true' : 'false');
      }

      const res = await api.get(`/empleados?${params.toString()}`);
      setEmpleados(res.data);
    } catch (err) {
      console.error('Error al cargar empleados:', err);
      setError('No se pudo cargar la lista de empleados. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarEmpleados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nombreDebounced, deptoDebounced, filtroEstado]);

  const hayFiltrosActivos = filtroNombre || filtroDepto || filtroEstado !== 'todos';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.brandMark}>N</div>
          <div>
            <h1 className={styles.headerTitle}>Sistema de Gestión de Nómina</h1>
            <p className={styles.headerSubtitle}>Directorio de empleados</p>
          </div>
        </div>
        {!isLoading && !error && (
          <span className={styles.headerCount}>
            {empleados.length} {empleados.length === 1 ? 'empleado' : 'empleados'}
          </span>
        )}
      </header>

      <main className={styles.body}>
        <section className={styles.filters}>
          <div className={styles.filterField}>
            <span className={styles.filterIcon}>
              <SearchIcon />
            </span>
            <input
              className={styles.input}
              placeholder="Buscar por nombre..."
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              aria-label="Buscar por nombre"
            />
          </div>
          <div className={styles.filterField}>
            <span className={styles.filterIcon}>
              <BuildingIcon />
            </span>
            <input
              className={styles.input}
              placeholder="Departamento..."
              value={filtroDepto}
              onChange={(e) => setFiltroDepto(e.target.value)}
              aria-label="Filtrar por departamento"
            />
          </div>
          <select
            className={styles.select}
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </section>

        {error && (
          <div className={styles.errorBanner} role="alert">
            <AlertIcon />
            <span>{error}</span>
            <button className={styles.retryBtn} onClick={cargarEmpleados}>
              Reintentar
            </button>
          </div>
        )}

        {/* Desktop table */}
        <div className={styles.tableWrap}>
          {isLoading ? (
            <SkeletonRows />
          ) : empleados.length === 0 ? (
            <EmptyState hayFiltros={hayFiltrosActivos} />
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido paterno</th>
                  <th>Departamento</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {empleados.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className={styles.nameCell}>
                        <span className={styles.avatar}>
                          {initials(emp.nombre, emp.apellidoPaterno)}
                        </span>
                        {emp.nombre}
                      </div>
                    </td>
                    <td>{emp.apellidoPaterno}</td>
                    <td>{emp.departamento}</td>
                    <td>{emp.tipo}</td>
                    <td>
                      <EstadoBadge activo={emp.activo} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile cards */}
        {!isLoading && empleados.length > 0 && (
          <div className={styles.cardList}>
            {empleados.map((emp) => (
              <div className={styles.card} key={emp.id}>
                <div className={styles.cardTop}>
                  <span className={styles.avatar}>
                    {initials(emp.nombre, emp.apellidoPaterno)}
                  </span>
                  <span className={styles.cardName}>
                    {emp.nombre} {emp.apellidoPaterno}
                  </span>
                </div>
                <div className={styles.cardMeta}>
                  <div>
                    <div className={styles.cardMetaLabel}>Departamento</div>
                    <div>{emp.departamento}</div>
                  </div>
                  <div>
                    <div className={styles.cardMetaLabel}>Tipo</div>
                    <div>{emp.tipo}</div>
                  </div>
                  <div>
                    <div className={styles.cardMetaLabel}>Estado</div>
                    <EstadoBadge activo={emp.activo} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

/* ---------- Small pieces ---------- */

const EstadoBadge: React.FC<{ activo: boolean }> = ({ activo }) => (
  <span className={activo ? styles.badgeActivo : styles.badgeInactivo}>
    <span className={styles.dot} />
    {activo ? 'Activo' : 'Inactivo'}
  </span>
);

const SkeletonRows: React.FC = () => (
  <div>
    {Array.from({ length: 5 }).map((_, i) => (
      <div className={styles.skeletonRow} key={i}>
        <div className={styles.skeletonBlock} style={{ width: '22%' }} />
        <div className={styles.skeletonBlock} style={{ width: '18%' }} />
        <div className={styles.skeletonBlock} style={{ width: '20%' }} />
        <div className={styles.skeletonBlock} style={{ width: '14%' }} />
        <div className={styles.skeletonBlock} style={{ width: '12%' }} />
      </div>
    ))}
  </div>
);

const EmptyState: React.FC<{ hayFiltros: boolean }> = ({ hayFiltros }) => (
  <div className={styles.stateWrap}>
    <UsersIcon />
    <p className={styles.stateTitle}>
      {hayFiltros ? 'Sin resultados para estos filtros' : 'Aún no hay empleados registrados'}
    </p>
    <p className={styles.stateText}>
      {hayFiltros
        ? 'Ajusta la búsqueda o el departamento e intenta de nuevo.'
        : 'Los empleados que registres aparecerán en este directorio.'}
    </p>
  </div>
);

/* ---------- Inline icons (no external dependency) ---------- */

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="4" y="3" width="16" height="18" rx="1" />
    <path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" />
  </svg>
);

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5" />
    <path d="M12 16h.01" />
  </svg>
);

const UsersIcon = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    style={{ margin: '0 auto', color: '#b7bcc7' }}
  >
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.6 2.8-5.8 6-5.8s6 2.2 6 5.8" />
    <circle cx="17" cy="8.5" r="2.6" />
    <path d="M15.5 14.3c2.6.3 4.5 2.2 4.5 5.7" />
  </svg>
);

export default Dashboard;
