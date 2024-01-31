import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';
import "../styles.css";
import { Modal, ModalHeader, ModalBody, ModalFooter, Table } from "reactstrap";
import "react-datepicker/dist/react-datepicker.css";

const apiurl = "http://191.96.145.59:8000";

function Login(props) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const [modalTitulo,setModalTitulo] = useState("")
  const [modalAgregar, setModalAgregar] = useState(false);
  const navigate = useNavigate();
  //const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState('');



  //USUARIO
  const [formUsuario, setFormUsuario] = useState({
    user: { type: String, unique: true},
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormUsuario({ ...formUsuario, [name]: value });
  };
  

  const agregarUsuario = () => {
    const nuevoUsuario = {
      user: formUsuario.user,
      password: formUsuario.password
    };

    console.log(nuevoUsuario)
    fetch (`${apiurl}/usuario`,{      
      method:'post',
      headers:{
        'Content-type':'application/json', 
        'Accept':'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body:JSON.stringify(nuevoUsuario)
    })
    .then ((response)=>{
      return response.json()
    }).then ((json)=>{
      cerrarModalAgregar();
    })    
  };


  //EMPLEADO
  // Función para abrir el modal de agregar empleado
  const abrirModalAgregar = () => {
    setModalTitulo("Agregar Registro")
    setModalAgregar(true);
  };

    // Función para cerrar el modal de agregar empleado
    const cerrarModalAgregar = () => {
      setModalAgregar(false);
    };

  const handleUserChange = (e) => {
    setUser(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${apiurl}/login`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: user,
        password: password,
      }),
    })
    .then(response => {
    if (!response.ok) {
      return response.json().then(data => {
        throw new Error(data.error || 'Credenciales Incorrectas');
      });
    }
      return response.json();
  })
    .then(data => {
      if (data.message === "Inicio de sesión exitoso") {
        props.setIsAuthenticated(true);
        navigate('/Home');
        console.log("Inicio de sesión exitoso");
      } else {
        setMessage(data.error);
      }
    })
    .catch(error => {
      setMessage(error.message);
    });
  };

  return (
  <div className="login-container">
    <h2>Login</h2>
    <form onSubmit={handleSubmit}>
    
      <div className="Registro">
      <div className="form-group">
          <label htmlFor="user">Usuario</label>
          <input
            type="user"
            id="user"
            value={user}
            onChange={handleUserChange}
          />
        </div>
      <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={toggleShowPassword}
            >
              {showPassword ? (
                <i className="fa fa-eye-slash"></i>
              ) : (
                <i className="fa fa-eye"></i>
              )}
            </button>
          </div>
        </div>
        <button type="submit" className="btn-direction">
          Iniciar sesión
        </button>
        <button className="btn-direction" onClick={abrirModalAgregar}>
          Registrarse
        </button>
      </div>
      {message && <div className="message">{message}</div>}
     </form>
      {/* Modal para agregar empleado */}
      <Modal
        isOpen={modalAgregar}
        toggle={cerrarModalAgregar}
        className="modal-floating"
      >
        <ModalHeader>{modalTitulo}</ModalHeader>
        <ModalBody>
          <Table className="form-tabla">
            <h3>Usuario</h3>
          <div className="form-groupUsuario">
              <tr>
                <td>
                  <div className="form-group">
                    <label htmlFor="user">Usuario:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="user"
                      id="user"
                      value={formUsuario.user}
                      onChange={(e) =>
                        setFormUsuario({
                          ...formUsuario,
                          user: e.target.value,
                        })
                      }
                    />
                  </div>
                </td>
                <td>
                  <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="password"
                      id="password"
                      value={formUsuario.password}
                      onChange={(e) =>
                        setFormUsuario({
                          ...formUsuario,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>
                </td>
              </tr>
            </div>

          </Table>
        </ModalBody>
        <ModalFooter>
          <div style={{ textAlign: "center" }}>
            {" "}
            {/* Contenedor para centrar los botones */}
            <button
              className="btn btn-success"
              onClick={() => {
                if (modalTitulo === "Agregar Registro") {
                  agregarUsuario();
                   // Llama a agregarUsuario() al mismo tiempo que agregarEmpleado()
                }
              }}
            >
              Guardar
            </button>
            <button className="btn btn-danger" onClick={cerrarModalAgregar}>
              Cancelar
            </button>
          </div>
        </ModalFooter>
      </Modal>
    
    </div>
  );

}
  
  export default Login;