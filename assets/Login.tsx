import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import styles from './Login.module.css';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

const REMEMBER_KEY = 'nomina_usuario_recordado';

const ledgerRows = [
  { label: 'Salario base', value: '••••••' },
  { label: 'Bonificaciones', value: '••••••' },
  { label: 'Deducciones', value: '••••••' },
  { label: 'Neto a pagar', value: '••••••' },
];

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recordar, setRecordar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const remembered = localStorage.getItem(REMEMBER_KEY);
    if (remembered) {
      setUsuario(remembered);
      setRecordar(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const payload = {
      nombreUsuario: usuario,
      password: clave,
    };

    try {
      const response = await api.post('/Auth/login', payload);
      const token = response.data.token || response.data.Token;

      if (token) {
        localStorage.setItem('jwt_token', token);
        if (recordar) {
          localStorage.setItem(REMEMBER_KEY, usuario);
        } else {
          localStorage.removeItem(REMEMBER_KEY);
        }
        onLoginSuccess(token);
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Credenciales incorrectas');
      } else {
        setError(err.response?.data?.mensaje || 'Error de conexión con la API');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Brand / context panel */}
      <div className={styles.brandPanel}>
        <div className={styles.brandTop}>
          <div className={styles.brandMark}>N</div>
          <span className={styles.brandName}>Nómina</span>
        </div>

        <div className={styles.brandCopy}>
          <h1 className={styles.brandHeadline}>
            Cada pago, registrado con exactitud.
          </h1>
          <p className={styles.brandSub}>
            Accede al sistema de gestión de nómina para consultar planillas,
            deducciones y pagos de tu organización.
          </p>

          <div className={styles.ledger}>
            {ledgerRows.map((row) => (
              <div className={styles.ledgerRow} key={row.label}>
                <span>{row.label}</span>
                <span>{row.value}</span>
              </div>
            ))}
            <div className={styles.ledgerFade} />
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <h2 className={styles.formHeading}>Iniciar sesión</h2>
          <p className={styles.formSubtitle}>
            Ingresa tus credenciales para acceder al sistema.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="usuario">
                Usuario
              </label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>
                  <UserIcon />
                </span>
                <input
                  id="usuario"
                  type="text"
                  className={styles.input}
                  placeholder="usuario o correo"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  disabled={isLoading}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="clave">
                Contraseña
              </label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>
                  <LockIcon />
                </span>
                <input
                  id="clave"
                  type={showPassword ? 'text' : 'password'}
                  className={styles.input}
                  placeholder="••••••••"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className={styles.toggleVisibility}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className={styles.rowBetween}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={recordar}
                  onChange={(e) => setRecordar(e.target.checked)}
                />
                Recordar usuario
              </label>
            </div>

            {error && (
              <div className={styles.alert} role="alert">
                <AlertIcon />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading && <span className={styles.spinner} />}
              {isLoading ? 'Verificando…' : 'Ingresar'}
            </button>
          </form>

          <p className={styles.footerNote}>
            ¿Problemas para acceder? Contacta a Recursos Humanos.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ---------- Inline icons (no external dependency) ---------- */

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 3l18 18" />
    <path d="M10.6 5.2A9.7 9.7 0 0 1 12 5c6.2 0 10 7 10 7a15.5 15.5 0 0 1-3.4 4.1M6.6 6.6C4 8.3 2 12 2 12s3.8 7 10 7c1.4 0 2.6-.3 3.7-.8" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </svg>
);

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5" />
    <path d="M12 16h.01" />
  </svg>
);

export default Login;
