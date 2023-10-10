import React, { useState } from 'react';
import './styles.css';
import { Route, Link, Routes } from 'react-router-dom'; // Importa Route y Routes en lugar de BrowserRouter
import Tree from 'react-d3-tree';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function App() {
  const [currentRotation, setCurrentRotation] = useState(0);
  const images = [
    '/static/img/img1.jpg',
    '/static/img/img2.jpg',
    '/static/img/img3.jpg',
    '/static/img/img4.jpg',
    '/static/img/img5.jpg',
    '/static/img/img6.jpg',
  ];

  function handlePrevClick() {
    setCurrentRotation(currentRotation + 360 / images.length);
  }

  function handleNextClick() {
    setCurrentRotation(currentRotation - 360 / images.length);
  }

  const jerarquiaEmpleados = {
    name: 'Jerarquía de Empleados',
    children: [
      {
        name: 'Jefe de Departamento',
        children: [
          {
            name: 'Juan Pérez',
            attributes: { Cargo: 'Gerente de Ventas' },
            _collapsed: true,
          },
          {
            name: 'María Rodríguez',
            attributes: { Cargo: 'Gerente de Marketing' },
            _collapsed: true,
          },
          // Agrega más empleados bajo el Jefe de Departamento si es necesario
        ],
      },
      {
        name: 'Gerentes',
        children: [
          {
            name: 'Carlos Sánchez',
            attributes: { Cargo: 'Gerente de Desarrollo' },
            _collapsed: true,
          },
          {
            name: 'Laura González',
            attributes: { Cargo: 'Gerente de Recursos Humanos' },
            _collapsed: true,
          },
          // Agrega más gerentes si es necesario
        ],
      },
      {
        name: 'Empleados',
        children: [
          {
            name: 'Roberto Torres',
            attributes: { Cargo: 'Analista de Datos' },
            _collapsed: true,
          },
          {
            name: 'Sofía Fernández',
            attributes: { Cargo: 'Diseñador Gráfico' },
            _collapsed: true,
          },
          // Agrega más empleados si es necesario
        ],
      },
    ],
  };

  return (
    <div className="App">
      <header className="header">
    <a href="/" className="logo">
      Cibercom
    </a>
    <div className="bx bx-manu" id="menu-icon">
      <i className="bx bx-menu"></i>
    </div>
    <nav className="navbar">
      <Link to="/" className="active">
        Home
      </Link>
      <Link to="/Organigrama">Organigrama</Link>
      <Link to="/Empleados">Empleados</Link>
      <Link to="/Personal">Personal</Link>
    </nav>
  </header>

  <Routes>
        <Route
          path="/"
          element={
            <Home
              currentRotation={currentRotation}
              handlePrevClick={handlePrevClick}
              handleNextClick={handleNextClick}
              images={images}
            />
          }
        />
        <Route path="/Organigrama" element={<Organigrama jerarquiaEmpleados={jerarquiaEmpleados} />} />
        <Route path="/Empleados" element={<Empleados />} />
        <Route path="/Personal" element={<Personal />} />
        
        {/* Agrega más rutas para otras páginas aquí */}
      </Routes>

      <footer className="footer">
        <div className="footer-text">
          <p>Copyright &copy; 2023 by Cibercom | All Rights Reserved.</p>
        </div>
        <div className="footer-iconTop">
          <a href="#">
            <i className="bx bx-up-arrow-alt"></i>
          </a>
        </div>
      </footer>
      <script src="./js/script.js"></script>
    </div>
  );
}

function Home({ currentRotation, handlePrevClick, handleNextClick, images }) {
  return (
    <section className="home" id="home">
      <div className="home-content">
        <div className="gallery-container">
          <div className="box">
            {images.map((image, index) => (
              <div
                className={`card ${index === 0 ? 'active' : ''}`}
                key={index}
                style={{
                  transform: `rotateY(${currentRotation + (360 / images.length) * index}deg) translateZ(300px)`,
                }}
              >
                <img src={image} alt={`Image ${index + 1}`} />
                {/* Agrega un botón Link que redirige a otra página */}
                <Link to="/Empleados" className="boton-redireccion">
                  Ver
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="button-container">
          <div className="button prev" onClick={handlePrevClick}></div>
          <div className="button next" onClick={handleNextClick}></div>
        </div>
      </div>
    </section>
  );
}

function Organigrama({ jerarquiaEmpleados }) {
  return (
    <section className="organigrama" id="organigrama">
      <h2 className="heading">Organigrama</h2>
      <div className="organigrama-container">
        <Tree
          data={jerarquiaEmpleados}
          orientation="vertical"
          collapsible={true}
          separation={{
            siblings: 2,
            nonSiblings: 2,
          }}
        />
      </div>
    </section>
  );
}

function Empleados() {
  const [empleados, setEmpleados] = useState([]); // Estado para almacenar la lista de empleados
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null); // Estado para almacenar el empleado seleccionado
  const [modalAgregar, setModalAgregar] = useState(false); // Estado para mostrar/ocultar el modal de agregar empleado
  const [formEmpleado, setFormEmpleado] = useState({
    id: '',
    nombre: '',
    apellidoPat: '',
    apellidoMat: '',
    fecNacimiento: null, // Usa null en lugar de una cadena para el campo de fecha
    fotografia: '',
  });

  // Función para abrir el modal de agregar empleado
  const abrirModalAgregar = () => {
    setModalAgregar(true);
  };

  // Función para cerrar el modal de agregar empleado
  const cerrarModalAgregar = () => {
    setModalAgregar(false);
    setFormEmpleado({
      id: '',
      nombre: '',
      apellidoPat: '',
      apellidoMat: '',
      fecNacimiento: '',
      fotografia: '',
    });
  };

  // Función para agregar un empleado a la lista
  const agregarEmpleado = () => {
    // Agregar lógica para agregar un empleado aquí
    const nuevoEmpleado = {
      id: formEmpleado.id,
      nombre: formEmpleado.nombre,
      apellidoPat: formEmpleado.apellidoPat,
      apellidoMat: formEmpleado.apellidoMat,
      fecNacimiento: formEmpleado.fecNacimiento,
      fotografia: formEmpleado.fotografia,
    };
    setEmpleados([...empleados, nuevoEmpleado]);
    cerrarModalAgregar();
  };

  const handleFechaNacimientoChange = (date) => {
    setFormEmpleado({ ...formEmpleado, fecNacimiento: date });
  };


  const handleEditarEmpleado = (empleado) => {
    // Agrega lógica para editar el empleado aquí
  };
  
  // Función para eliminar un empleado
  const handleEliminarEmpleado = (id) => {
    // Agrega lógica para eliminar el empleado aquí
  };
  // Más funciones CRUD para editar y eliminar empleados

  return (
    <section className="empleados" id="Empleados">
      <div className="CRUDS">
        <button className="btn" onClick={abrirModalAgregar}>
          Agregar Empleado
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido Paterno</th>
              <th>Apellido Materno</th>
              <th>Fecha de Nacimiento</th>
              <th>Fotografía</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => (
              <tr key={empleado.id}>
                <td>{empleado.id}</td>
                <td>{empleado.nombre}</td>
                <td>{empleado.apellidoPat}</td>
                <td>{empleado.apellidoMat}</td>
                <td>
                  {empleado.fecNacimiento ? empleado.fecNacimiento.toLocaleDateString() : ''}
                </td>
                <td>{empleado.fotografia}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditarEmpleado(empleado)}
                  >
                    Editar
                  </button>
                  {"   "}
                  <button
                    className="btn btn-danger"
                    onClick={() => handleEliminarEmpleado(empleado.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar empleado */}
      <Modal isOpen={modalAgregar} toggle={cerrarModalAgregar} className="modal-floating">
        <ModalHeader>Agregar Empleado</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <div className="form-item">
              <label htmlFor="id">ID:</label>
              <input
                className="form-control"
                type="text"
                name="id"
                id="id"
                value={formEmpleado.id}
                onChange={(e) => setFormEmpleado({ ...formEmpleado, id: e.target.value })}
              />
            </div>
            <div className="form-item">
              <label htmlFor="nombre">Nombre:</label>
              <input
                className="form-control"
                type="text"
                name="nombre"
                id="nombre"
                value={formEmpleado.nombre}
                onChange={(e) => setFormEmpleado({ ...formEmpleado, nombre: e.target.value })}
              />
            </div>
            <div className="form-item">
              <label htmlFor="apellidoPat">Apellido Paterno:</label>
              <input
                className="form-control"
                type="text"
                name="apellidoPat"
                id="apellidoPat"
                value={formEmpleado.apellidoPat}
                onChange={(e) => setFormEmpleado({ ...formEmpleado, apellidoPat: e.target.value })}
              />
            </div>
            <div className="form-item">
              <label htmlFor="apellidoMat">Apellido Materno:</label>
              <input
                className="form-control"
                type="text"
                name="apellidoMat"
                id="apellidoMat"
                value={formEmpleado.apellidoMat}
                onChange={(e) => setFormEmpleado({ ...formEmpleado, apellidoMat: e.target.value })}
              />
            </div>
            <div className="form-item">
              <label htmlFor="fechaNac">Fecha de Nacimiento:</label>
              <DatePicker
                selected={formEmpleado.fecNacimiento}
                onChange={handleFechaNacimientoChange}
                dateFormat="dd/MM/yyyy"
                className="form-control"
              />
            </div>
            {/* Agregar más campos del formulario según sea necesario */}
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-success" onClick={agregarEmpleado}>
            Guardar
          </button>
          <button className="btn btn-danger" onClick={cerrarModalAgregar}>
            Cancelar
          </button>
        </ModalFooter>
      </Modal>
    </section>

  );
}

function Personal (){
  <div className='Personal'>

    <h1>hola</h1>

  </div>

}

export default App;