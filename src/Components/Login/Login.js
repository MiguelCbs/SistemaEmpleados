import React, {useState} from "react";
import { useNavigate} from 'react-router-dom';
import '../../styles.css';
import "react-datepicker/dist/react-datepicker.css";
import LoginForm from "./LoginForm";

const apiurl = "http://localhost:3000";

function Login(props) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [user, setUser] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => { 
    setShowPassword(!showPassword); 
  }; 
  const navigate = useNavigate(); 
  const [message, setMessage] = useState('');
  const [messageRegistro, setmessageRegistro] = useState("");
  const handleUserChange = (e) => { 
    setUser(e.target.value); 
  }; 
  const handlePasswordChange = (e) => { 
    setPassword(e.target.value); 
  };
  const [modalAgregar, setModalAgregar] = useState(false);
  const [loginFormState, setLoginFormState] = useState({ show: false, openRegisterModal: false });

  const token = localStorage.getItem('access_token'); // Obtener el token del almacenamiento local
 
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${apiurl}/login`, {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': `Bearer ${token}`, // Adjuntar el token JWT en el header Authorization
      },
      body: JSON.stringify({
        user: user,
        password: password,
      }),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      // Si el servidor responde con un código de error HTTP, lo maneja aquí.
      return response.json().then(data => {
        throw new Error(data.error || 'Error en el servidor');
      });
    })
    .then(data => {
      if (data.access_token) { // Esta clave coincidira con cómo envía el token desde el backend
        localStorage.setItem('access_token', data.access_token);
        props.setIsAuthenticated(true);
        navigate('/Home');
      } else {
        setMessage(data.error || 'Inicio de sesión fallido'); 
      }
    })    
    .catch(error => {
      setMessage(error.message);
    });
  };

    const abrirLoginForm = () => {
      setShowLoginForm(true);
      setLoginFormState(prevState => ({ ...prevState, openRegisterModal: true }));
      console.log('Se ha llamado a abrirLoginForm');
    };
          // Función para cerrar el modal de agregar empleado 
          const cerrarModalAgregar = () => { 
            setModalAgregar(false); 
          }; 

          const manejarAperturaRegistro = () => {
            setShowLoginForm(true);
          };
  
    return (
      <div className="login">
      <div className="login-container">
            <h1>Sistema de Empleados</h1>
            <h3>Cibernética en el Siglo XXI</h3>
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
                {messageRegistro && (<div className="message">{messageRegistro}</div>)}
              </div> 
            </div> 
            <button type="submit" className="btn-direction"> 
              Iniciar sesión 
            </button> 
            <button type="button" className="btn-direction" onClick={abrirLoginForm}> 
              Registrarse 
            </button>
            </div>
            {message && <div className="message">{message}</div>}
          </form>
        </div>
        {console.log('showLoginForm:', showLoginForm)}
        {showLoginForm && <LoginForm openRegisterModal={loginFormState.openRegisterModal}/>}
      </div>
    );  
 } 
  export default Login;