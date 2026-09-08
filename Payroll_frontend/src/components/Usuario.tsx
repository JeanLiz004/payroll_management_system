import React, { useEffect, useState, type ChangeEvent } from "react";
import DataTable, { type TableColumn } from 'react-data-table-component';
import { Card, CardBody, CardHeader, Button, Modal, ModalHeader, ModalBody, Label, Input, FormGroup, ModalFooter, Row, Col } from "reactstrap";
import Swal from 'sweetalert2';

interface Rol {
  idRol: number;
  descripcion: string;
}

interface UsuarioModel {
  idUsuario: number;
  nombre: string;
  correo: string;
  telefono: string;
  idRol: number;
  clave: string;
  esActivo: boolean;
  idRolNavigation?: Rol;
}

const modeloUsuarioInicial: UsuarioModel = {
  idUsuario: 0,
  nombre: "",
  correo: "",
  telefono: "",
  idRol: 0,
  clave: "",
  esActivo: true
};

const Usuario: React.FC = () => {
  const [usuario, setUsuario] = useState<UsuarioModel>(modeloUsuarioInicial);
  const [pendiente, setPendiente] = useState<boolean>(true);
  const [usuarios, setUsuarios] = useState<UsuarioModel[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [verModal, setVerModal] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let valorConvertido: string | number | boolean = value;

    if (name === "idRol") {
      valorConvertido = Number(value);
    } else if (name === "esActivo") {
      valorConvertido = value === "true";
    }

    setUsuario((prev) => ({
      ...prev,
      [name]: valorConvertido
    }));
  };

  const obtenerRoles = async (): Promise<void> => {
    try {
      const response = await fetch("api/rol/Lista");
      if (response.ok) {
        const data: Rol[] = await response.json();
        setRoles(data);
      }
    } catch (error) {
      console.error("Error al obtener roles:", error);
    }
  };

  const obtenerUsuarios = async (): Promise<void> => {
    try {
      const response = await fetch("api/usuario/Lista");
      if (response.ok) {
        const data: UsuarioModel[] = await response.json();
        setUsuarios(data);
        setPendiente(false);
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  useEffect(() => {
    obtenerRoles();
    obtenerUsuarios();
  }, []);

  const columns: TableColumn<UsuarioModel>[] = [
    {
      name: 'Nombre',
      selector: (row) => row.nombre,
      sortable: true,
    },
    {
      name: 'Correo',
      selector: (row) => row.correo,
      sortable: true,
    },
    {
      name: 'Telefono',
      selector: (row) => row.telefono,
      sortable: true,
    },
    {
      name: 'Rol',
      selector: (row) => row.idRolNavigation?.descripcion || '',
      sortable: true,
      cell: (row) => row.idRolNavigation?.descripcion || 'Sin Rol'
    },
    {
      name: 'Estado',
      selector: (row) => (row.esActivo ? 1 : 0),
      sortable: true,
      cell: (row) => {
        const clase = row.esActivo ? "badge badge-info p-2" : "badge badge-danger p-2";
        return <span className={clase}>{row.esActivo ? "Activo" : "No Activo"}</span>;
      }
    },
    {
      name: '',
      cell: (row) => (
        <>
          <Button color="primary" size="sm" className="mr-2" onClick={() => abrirEditarModal(row)}>
            <i className="fas fa-pen-alt"></i>
          </Button>

          <Button color="danger" size="sm" onClick={() => eliminarUsuario(row.idUsuario)}>
            <i className="fas fa-trash-alt"></i>
          </Button>
        </>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontSize: '13px',
        fontWeight: 800,
      },
    },
    headRow: {
      style: {
        backgroundColor: "#eee",
      }
    }
  };

  const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
  };

  const abrirEditarModal = (data: UsuarioModel) => {
    setUsuario(data);
    setVerModal(!verModal);
  };

  const cerrarModal = () => {
    setUsuario(modeloUsuarioInicial);
    setVerModal(!verModal);
  };

  const guardarCambios = async () => {
    const payload = { ...usuario };
    delete payload.idRolNavigation;

    const isNuevo = payload.idUsuario === 0;
    const url = isNuevo ? "api/usuario/Guardar" : "api/usuario/Editar";
    const method = isNuevo ? 'POST' : 'PUT';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      await obtenerUsuarios();
      setUsuario(modeloUsuarioInicial);
      setVerModal(!verModal);
    } else {
      alert("Error al guardar");
    }
  };

  const eliminarUsuario = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Está seguro?',
      text: "Desea eliminar el usuario",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, continuar',
      cancelButtonText: 'No, volver'
    });

    if (result.isConfirmed) {
      const response = await fetch(`api/usuario/Eliminar/${id}`, { method: "DELETE" });
      if (response.ok) {
        await obtenerUsuarios();
        Swal.fire('¡Eliminado!', 'El usuario fue eliminado.', 'success');
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader style={{ backgroundColor: '#4e73df', color: "white" }}>
          Lista de Usuarios
        </CardHeader>
        <CardBody>
          <Button color="success" size="sm" onClick={() => setVerModal(!verModal)}>Nuevo Usuario</Button>
          <hr />
          <DataTable
            columns={columns}
            data={usuarios}
            progressPending={pendiente}
            pagination
            paginationComponentOptions={paginationComponentOptions}
            customStyles={customStyles}
          />
        </CardBody>
      </Card>

      <Modal isOpen={verModal}>
        <ModalHeader>Detalle Usuario</ModalHeader>
        <ModalBody>
          <Row>
            <Col sm={6}>
              <FormGroup>
                <Label>Nombre</Label>
                <Input bsSize="sm" name="nombre" onChange={handleChange} value={usuario.nombre} />
              </FormGroup>
            </Col>
            <Col sm={6}>
              <FormGroup>
                <Label>Correo</Label>
                <Input bsSize="sm" name="correo" onChange={handleChange} value={usuario.correo} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <FormGroup>
                <Label>Teléfono</Label>
                <Input bsSize="sm" name="telefono" onChange={handleChange} value={usuario.telefono} />
              </FormGroup>
            </Col>
            <Col sm={6}>
              <FormGroup>
                <Label>Rol</Label>
                <Input bsSize="sm" type="select" name="idRol" onChange={handleChange} value={usuario.idRol}>
                  <option value={0}>Seleccionar</option>
                  {roles.map((item) => (
                    <option key={item.idRol} value={item.idRol}>
                      {item.descripcion}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <FormGroup>
                <Label>Contraseña</Label>
                <Input bsSize="sm" name="clave" onChange={handleChange} value={usuario.clave} type="password" />
              </FormGroup>
            </Col>
            <Col sm="6">
              <FormGroup>
                <Label>Estado</Label>
                <Input bsSize="sm" type="select" name="esActivo" onChange={handleChange} value={String(usuario.esActivo)}>
                  <option value="true">Activo</option>
                  <option value="false">No Activo</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button size="sm" color="primary" onClick={guardarCambios}>Guardar</Button>
          <Button size="sm" color="danger" onClick={cerrarModal}>Cerrar</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Usuario;