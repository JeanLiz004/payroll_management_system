import React, { useEffect, useMemo, useState, type ChangeEvent } from "react";
import DataTable, { Media, type TableColumn } from "react-data-table-component";
import {
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  FormGroup,
  ModalFooter,
  Row,
  Col,
} from "reactstrap";
import Swal from "sweetalert2";
import api from "../api/axiosConfig";
import "./Usuario.css";

interface UsuarioModel {
  id: number;
  nombreUsuario: string;
  rol: string;
}

interface FormUsuarioData {
  id?: number;
  nombreUsuario: string;
  password?: string;
  rol: string;
}

const modeloInicial: FormUsuarioData = {
  id: 0,
  nombreUsuario: "",
  password: "",
  rol: "User",
};

const customStyles = {
  headRow: {
    style: {
      backgroundColor: "#faf9f5",
      borderBottomWidth: "1px",
      borderBottomColor: "#e6e3d8",
      borderBottomStyle: "solid" as const,
      minHeight: "44px",
    },
  },
  headCells: {
    style: {
      fontSize: "12px",
      fontWeight: 600,
      letterSpacing: "0.02em",
      color: "#5b6577",
    },
  },
  rows: {
    style: {
      fontSize: "13.5px",
      color: "#232b3a",
      minHeight: "54px",
    },
    highlightOnHoverStyle: {
      backgroundColor: "#faf9f5",
      transitionDuration: "0.12s",
    },
  },
  pagination: {
    style: {
      borderTopWidth: "1px",
      borderTopColor: "#e6e3d8",
      borderTopStyle: "solid" as const,
      fontSize: "13px",
      color: "#5b6577",
    },
  },
  noData: {
    style: {
      padding: "48px 0",
      color: "#5b6577",
      fontSize: "14px",
    },
  },
};

const Usuario: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UsuarioModel[]>([]);
  const [pendiente, setPendiente] = useState<boolean>(true);
  const [busqueda, setBusqueda] = useState("");
  const [verModal, setVerModal] = useState<boolean>(false);
  const [esEdicion, setEsEdicion] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormUsuarioData>(modeloInicial);
  const [guardando, setGuardando] = useState<boolean>(false);

  const cargarUsuarios = async () => {
    try {
      setPendiente(true);
      const res = await api.get("/Usuarios");
      const listaUsuarios = Array.isArray(res) ? res : res.data;
      setUsuarios(Array.isArray(listaUsuarios) ? listaUsuarios : []);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setUsuarios([]);
    } finally {
      setPendiente(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const usuariosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return usuarios;
    const q = busqueda.trim().toLowerCase();
    return usuarios.filter(
      (u) => u.nombreUsuario.toLowerCase().includes(q) || u.rol.toLowerCase().includes(q)
    );
  }, [usuarios, busqueda]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const abrirModalCrear = () => {
    setEsEdicion(false);
    setFormData(modeloInicial);
    setVerModal(true);
  };

  const abrirModalEditar = (usuario: UsuarioModel) => {
    setEsEdicion(true);
    setFormData({
      id: usuario.id,
      nombreUsuario: usuario.nombreUsuario,
      password: "",
      rol: usuario.rol,
    });
    setVerModal(true);
  };

  const cerrarModal = () => {
    if (guardando) return;
    setVerModal(false);
  };

  const guardarCambios = async () => {
    if (!esEdicion && (!formData.nombreUsuario || !formData.password)) {
      Swal.fire("Atención", "Nombre de usuario y contraseña son requeridos", "warning");
      return;
    }

    setGuardando(true);
    try {
      if (esEdicion) {
        await api.put(`/Usuarios/${formData.id}`, {
          rol: formData.rol,
          password: formData.password || null,
        });
        Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
      } else {
        await api.post("/Usuarios", formData);
        Swal.fire("Éxito", "Usuario creado correctamente", "success");
      }

      setVerModal(false);
      setFormData(modeloInicial);
      cargarUsuarios();
    } catch (error: any) {
      const msg = error.response?.data?.mensaje || "Error al procesar la solicitud";
      Swal.fire("Error", msg, "error");
    } finally {
      setGuardando(false);
    }
  };

  const eliminarUsuario = async (id: number, nombreUsuario: string) => {
    const result = await Swal.fire({
      title: "¿Eliminar este usuario?",
      text: `${nombreUsuario} perderá acceso al sistema. Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b3432f",
      cancelButtonColor: "#5b6577",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/Usuarios/${id}`);
        Swal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
        cargarUsuarios();
      } catch (error: any) {
        const msg = error.response?.data?.mensaje || "Error al eliminar usuario";
        Swal.fire("Error", msg, "error");
      }
    }
  };

  const columns: TableColumn<UsuarioModel>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      width: "80px",
      sortable: true,
      hide: Media.SM,
    },
    {
      name: "Usuario",
      selector: (row) => row.nombreUsuario,
      sortable: true,
      grow: 2,
    },
    {
      name: "Rol",
      selector: (row) => row.rol,
      sortable: true,
      cell: (row) => (
        <span className={`usr-badge ${row.rol === "Admin" ? "usr-badge-admin" : "usr-badge-user"}`}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
          {row.rol}
        </span>
      ),
    },
    {
      name: "Acciones",
      width: "110px",
      cell: (row) => (
        <div className="usr-actions">
          <button
            type="button"
            className="usr-icon-btn"
            title="Editar usuario"
            aria-label={`Editar ${row.nombreUsuario}`}
            onClick={() => abrirModalEditar(row)}
          >
            <PencilIcon />
          </button>
          <button
            type="button"
            className="usr-icon-btn usr-icon-btn-danger"
            title="Eliminar usuario"
            aria-label={`Eliminar ${row.nombreUsuario}`}
            onClick={() => eliminarUsuario(row.id, row.nombreUsuario)}
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Card className="usr-card">
      <div className="usr-header">
        <div className="usr-header-icon">
          <UsersIcon />
        </div>
        <div>
          <p className="usr-header-title">Gestión de usuarios</p>
          <p className="usr-header-subtitle">Administra las cuentas de acceso al sistema</p>
        </div>
      </div>

      <CardBody className="p-0">
        <div className="usr-toolbar">
          <div className="usr-search">
            <SearchIcon />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por usuario o rol..."
              aria-label="Buscar usuarios"
            />
          </div>
          <Button className="usr-new-btn" onClick={abrirModalCrear}>
            <PlusIcon />
            Nuevo usuario
          </Button>
        </div>

        <div className="usr-table-wrap">
          <DataTable
            columns={columns}
            data={usuariosFiltrados}
            progressPending={pendiente}
            pagination
            highlightOnHover
            customStyles={customStyles}
            noDataComponent={
              busqueda
                ? "Sin resultados para esta búsqueda"
                : "No hay usuarios registrados"
            }
          />
        </div>
      </CardBody>

      <Modal isOpen={verModal} toggle={cerrarModal} centered>
        <ModalHeader toggle={cerrarModal} className="usr-modal-header">
          {esEdicion ? `Editar usuario: ${formData.nombreUsuario}` : "Registrar usuario"}
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col sm={12} className="mb-3">
              <FormGroup className="mb-0">
                <Label>Nombre de usuario</Label>
                <Input
                  bsSize="sm"
                  name="nombreUsuario"
                  value={formData.nombreUsuario}
                  onChange={handleChange}
                  disabled={esEdicion}
                  autoFocus={!esEdicion}
                />
              </FormGroup>
            </Col>
            <Col sm={12} className="mb-3">
              <FormGroup className="mb-0">
                <Label>
                  Contraseña{" "}
                  {esEdicion && (
                    <span className="usr-field-hint">(dejar en blanco para conservar la actual)</span>
                  )}
                </Label>
                <Input
                  bsSize="sm"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </FormGroup>
            </Col>
            <Col sm={12}>
              <FormGroup className="mb-0">
                <Label>Rol</Label>
                <Input
                  bsSize="sm"
                  type="select"
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button size="sm" color="secondary" outline onClick={cerrarModal} disabled={guardando}>
            Cancelar
          </Button>
          <Button size="sm" className="usr-save-btn" onClick={guardarCambios} disabled={guardando}>
            {guardando && <span className="usr-spinner" />}
            {guardando ? "Guardando..." : esEdicion ? "Actualizar" : "Guardar"}
          </Button>
        </ModalFooter>
      </Modal>
    </Card>
  );
};

/* ---------- Inline icons ---------- */

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.6 2.8-5.8 6-5.8s6 2.2 6 5.8" />
    <circle cx="17" cy="8.5" r="2.6" />
    <path d="M15.5 14.3c2.6.3 4.5 2.2 4.5 5.7" />
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const PencilIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 6h18" />
    <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
    <path d="M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);

export default Usuario;
