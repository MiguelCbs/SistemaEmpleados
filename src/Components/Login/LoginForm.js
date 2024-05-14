import React, { useState, useEffect, useCallback } from "react";
import { useNavigate} from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Table } from "reactstrap";
import { useFilePicker } from "use-file-picker";
import { FileAmountLimitValidator } from "use-file-picker/validators";
import '../../styles.css';

const apiurl = "http://localhost:3000";

const LoginForm = ({openRegisterModal}) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => { 
    setShowPassword(!showPassword); 
  }; 
  const [modalTitulo,setModalTitulo] = useState("") 
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalAgregarUsuario, setModalAgregarUsuario] = useState(false);
  const [modalAgregarDireccion, setModalAgregarDireccion] = useState(false);
  const navigate = useNavigate(); 
  const [message, setMessage] = useState('');
  const [messageRegistro, setmessageRegistro] = useState("");
  const [validations, setValidations] = useState([false, false, false, false]);
  const [usuarios, setUsuarios] = useState([]);
  const [messageRegistroNav, setmessageRegistroNav] = useState("");
  const [showDuplicateUserAlert, setShowDuplicateUserAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

    //Empleado
    const { openFilePicker, filesContent, clear } = useFilePicker({
        readAs: "DataURL",
        accept: "image/*",
        multiple: true,
        validators: [new FileAmountLimitValidator({ max: 3 }),]
      });
      const [indiceImagenActual, setIndiceImagenActual] = useState({});//Mini galeria
      const [formEmpleado, setFormEmpleado] = useState({
        id: "",
        Nombre: "",
        ApelPaterno: "",
        ApelMaterno: "",
        FecNacimiento: null, // Usa null en lugar de una cadena para el campo de fecha
        Fotografias: [], //Uso de array para mini galeria
      });
      const [imgActual, setImgActual] = useState([]);
    
      useEffect(() => {
        setImgActual(filesContent);
      }, [filesContent]);
    
      const handleFechaNacimientoChange = (date) => {
        setFormEmpleado({ ...formEmpleado, FecNacimiento: date.target.value });
      };

    //EMPLEADO 
  // Función para abrir el modal de agregar empleado 
  const abrirModalAgregar = useCallback(() => {
    setModalTitulo("Agregar Registro");
    setModalAgregar(true);
    setFormEmpleado({
      id: "",
      Nombre: "",
      ApelPaterno: "",
      ApelMaterno: "",
      FecNacimiento: "",
      Fotografias: [], // Uso de array para mini galería
    });
  }, []);
  
  
      // Función para agregar un empleado a la lista
      const agregarEmpleado = () => {
        const nuevoEmpleado = {
          Nombre: formEmpleado.Nombre,
          ApelPaterno: formEmpleado.ApelPaterno,
          ApelMaterno: formEmpleado.ApelMaterno,
          FecNacimiento: formEmpleado.FecNacimiento,
          Fotografias: filesContent.map(file => file.content), //Uso de array para mini galeria
        };

        if (
          nuevoEmpleado.Nombre &&
          nuevoEmpleado.ApelPaterno &&
          nuevoEmpleado.ApelMaterno &&
          nuevoEmpleado.FecNacimiento
        ) {
        fetch(`${apiurl}/empleados`, {
          method: "post",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(nuevoEmpleado),
        })
          .then((response) => {
            return response.json();
          })
          .then((json) => {
            const _id = json._id;
            setFormEmpleado({ ...formEmpleado, id: _id }); // Asignar el id del empleado
            setModalAgregar(false);
            setModalAgregarUsuario(true);
          });
        } else {
          alert("Por favor complete todos los campos del empleado antes de continuar.");
        }
      };

      // Función para cerrar el modal de agregar empleado 
      const cerrarModalAgregar = useCallback(() => {
        console.log("Cerrando modal");
        setModalAgregar(false);
    }, []);

     //USUARIO 
     const [formUsuario, setFormUsuario] = useState({ 
        user: '', 
        password: '' 
      }); 
     
      const handleInputChange = (e) => { 
        const { name, value } = e.target; 
        setFormUsuario({ ...formUsuario, [name]: value }); 
      }; 
     
      const cerrarModalAgregarUsuario = () => {
        setModalAgregarUsuario(false);
      };
    
      const agregarUsuario = (empleadoId) => {
        const nuevoUsuario = {
          user: formUsuario.user,
          password: formUsuario.password,
          empleado_id: empleadoId
        };
      
      console.log("Usuarios existentes:", usuarios); // Verifica si 'usuarios' está poblado correctamente
    
      // Verificar si el usuario ya existe
      if (usuarios.some((usuario) => usuario.user === nuevoUsuario.user)) {
        console.log("Usuario duplicado encontrado");
        // Mostrar la alerta de usuario duplicado
        setAlertMessage("Este usuario ya existe en la base de datos, por favor ingrese otro.");
        setShowDuplicateUserAlert(true); // Activar la alerta
        return;
      }
      
        if (!validations.every(validation => validation)) {
          setmessageRegistroNav("La contraseña no cumple con todas las condiciones");
          return;
        }
      
        if (formUsuario.user && formUsuario.password) {
          fetch(`${apiurl}/usuario`, {
            method: "post",
            headers: {
              "Content-type": "application/json",
              Accept: "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(nuevoUsuario),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Error al agregar el usuario.");
              }
              return response.json();
            })
            .then((json) => {
              setFormUsuario({
                user: '',
                password: ''
              })
              cerrarModalAgregarUsuario();
              setModalAgregarDireccion(true);
              setShowDuplicateUserAlert(false);
            })
            .catch((error) => {
          // Manejar errores de la solicitud fetch
          console.error("Error al agregar usuario:", error);
          alert("Este usuario ya existe, por favor ingrese otro.");
          //setAlertMessage("Este usuario ya existe, por favor ingrese otro.");
          //setShowDuplicateUserAlert(true);
            });
        } else {
          // Si no se completaron todos los campos, mostrar un mensaje de error o tomar la acción adecuada
          alert("Por favor complete todos los campos del usuario antes de continuar.");
        }
      };

// Datos Contacto
const [formDatosContacto, setFormDatosContacto] = useState({
    TelFijo: '',
    TelCelular: '',
    IdWhatsApp: '',
    IdTelegram: '',
    ListaCorreos: '',
  });
  
  const agregarDatosContacto = (empleadoId) => {
    const nuevoDatosContacto = {
      TelFijo: formDatosContacto.TelFijo,
      TelCelular: formDatosContacto.TelCelular,
      IdWhatsApp: formDatosContacto.IdWhatsApp,
      IdTelegram: formDatosContacto.IdTelegram,
      ListaCorreos: formDatosContacto.ListaCorreos,
      empleado_id: empleadoId // Asignar el empleadoId
    };
  
    fetch(`${apiurl}/datoscontacto`, {
      method: "post",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(nuevoDatosContacto),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        setFormDatosContacto({
          TelFijo: '',
          TelCelular: '',
          IdWhatsApp: '',
          IdTelegram: '',
          ListaCorreos: ''
        });
  
        cerrarModalAgregar();
        setModalAgregarDireccion(false);
        clear();
      })
      .catch((error) => {
        console.error("Error al agregar datos de contacto:", error);
      });
  };
  
  
  //Dirección
       const [formDireccion, setFormDireccion] = useState({
        Calle: '',
        NumExterior: '',
        NumInterior: '',
        Manzana: '',
        Lote: '',
        Municipio: '',
        Ciudad: '',
        CodigoP: '',
        Pais: ''
      });
  
      const cerrarModalAgregarDireccion = () => {
        setModalAgregarDireccion(false);
      };
    
      const agregarDireccion = (empleadoId) => {
        const nuevaDireccion = {
          Calle: formDireccion.Calle,
          NumExterior: formDireccion.NumExterior,
          NumInterior: formDireccion.NumInterior,
          Manzana: formDireccion.Manzana,
          Lote: formDireccion.Lote,
          Municipio: formDireccion.Municipio,
          Ciudad: formDireccion.Ciudad,
          CodigoP: formDireccion.CodigoP,
          Pais: formDireccion.Pais,
          empleado_id: empleadoId
        };
  
        fetch(`${apiurl}/direccion`, {
          method: "post",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(nuevaDireccion),
        })
          .then((response) => {
            return response.json();
          })
          .then((json) => {
            setFormDireccion({
              Calle: '',
              NumExterior: '',
              NumInterior: '',
              Manzana: '',
              Lote: '',
              Municipio: '',
              Ciudad: '',
              CodigoP: '',
              Pais: ''
            });
            cerrarModalAgregarDireccion();
            clear();
          });
      };

    //validacion
    function validatePassword(e) {
        const password = e.target.value;
    
        const newValidations = [
          password.length > 5,
          password.search(/[A-Z]/) > -1,
          password.search(/[0-9]/) > -1,
          password.search(/[$&+,:;=?@#]/) > -1,
        ];
        setValidations(newValidations);
      }

      useEffect(() => {
        if (openRegisterModal) {
          abrirModalAgregar(); // Asegúrate de que esta función esté definida en LoginForm
        }
      }, [openRegisterModal, abrirModalAgregar]);

      useEffect(() => {
        if (!modalAgregar) {
          console.log("Modal cerrado, reseteando estados...");
        }
      }, [modalAgregar]);

  return (
    <div>
    <Modal
    isOpen={modalAgregar}
    toggle={cerrarModalAgregar}
    className="modal-floating"
  >
    <ModalHeader>{modalTitulo}</ModalHeader>
    <ModalBody>
      <Table className="form-tabla">
        <h3>Empleado</h3>
        <div className="form-group">
        <div className="form-group">
 <tr>
   <td>
     <div className="form-item">
       <label htmlFor="nombre">Nombre:</label>
       <input
         className="form-control"
         type="text"
         name="nombre"
         id="nombre"
         value={formEmpleado.Nombre}
         onChange={(e) =>
          
           setFormEmpleado({
             ...formEmpleado,
             Nombre: e.target.value,
           })
         }
       />
     </div>
   </td>
   <td>
     <div className="form-item">
       <label htmlFor="ApelPaterno">Apellido Paterno:</label>
       <input
         className="form-control"
         type="text"
         name="ApelPaterno"
         id="ApelPaterno"
         value={formEmpleado.ApelPaterno}
         onChange={(e) =>
           setFormEmpleado({
             ...formEmpleado,
             ApelPaterno: e.target.value,
           })
         }
       />
     </div>
   </td>
 </tr>
 <tr>
   <td>
     <div className="form-item">
       <label htmlFor="fechaNac">Fecha de Nacimiento:</label>
       <input
         className="datepicker form-control"
         type="date"
         value={formEmpleado.FecNacimiento}
         onChange={handleFechaNacimientoChange}
       />
     </div>
   </td>
   <td>
     <div className="form-item">
       <label htmlFor="ApelMaterno">Apellido Materno:</label>
       <input
         className="form-control"
         type="text"
         name="ApelMaterno"
         id="ApelMaterno"
         value={formEmpleado.ApelMaterno}
         onChange={(e) =>
           setFormEmpleado({
             ...formEmpleado,
             ApelMaterno: e.target.value,
           })
         }
       />
     </div>
   </td>
 </tr>
 <tr>
     <td style={{ width: "600px" }}>
       <div
         className="form-item foto"
         style={{ textAlign: "center" }}
       >
         <label htmlFor="Fotografias" style={{ display: "block" }}>
           Fotografía:
         </label>
         <button onClick={() => openFilePicker()}>
           Subir archivo...
         </button>
         <div className="mini-gallery">
           {imgActual.map((file, index) => (
             <div key={index} style={{ display: 'inline-block', textAlign: 'center', margin: '10px' }}>
               <img
                 style={{ width: '100px', height: '100px' }}
                 alt={`Imagen seleccionada ${index + 1}`}
                 src={file.content}
               />
           </div>
             ))}
         </div>
       </div>
     </td>
   </tr>
      </div>
        </div>
      </Table>
    </ModalBody>
    <ModalFooter>
      <div style={{ textAlign: "center" }}>
        <button
          className="btn btn-success"
          onClick={() => {
            agregarEmpleado();
          }}
        >
          Siguiente
        </button>
        <button className="btn btn-danger" onClick={cerrarModalAgregar}>
          Cancelar
        </button>
        {messageRegistro && (<div className="message">{messageRegistro}</div>)}
      </div>
    </ModalFooter>
  </Modal>

  <Modal
    isOpen={modalAgregarUsuario}
    toggle={cerrarModalAgregarUsuario}
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
          onInput={validatePassword} 
          onChange={handleInputChange}
        /> 
                <div className="validacion-contraseña">
                    <p>
                      {validations[0] ? "✔️" : "❌"} Debe tener al menos 5
                      caracteres
                    </p>
                    <p>
                      {validations[1] ? "✔️" : "❌"} Debe contener una letra
                      mayúscula
                    </p>
                    <p>
                      {validations[2] ? "✔️" : "❌"} Debe contener un número
                    </p>
                    <p>
                      {validations[3] ? "✔️" : "❌"} Debe contener uno de
                      $&+,:;=?@#
                    </p>
                </div>
      </div> 
    </td> 
  </tr>
          </div>
          <div>
          </div>
      </Table>
    </ModalBody>
    <ModalFooter>
  <div style={{ textAlign: "center" }}>
    <button
      className="btn btn-success"
      onClick={() => {
        // Verificar si el usuario ya existe
        if (usuarios.some((usuario) => usuario.user === formUsuario.user)) {
          setAlertMessage("Este usuario ya existe en la base de datos, por favor ingrese otro.");
          return; 
        }
        agregarUsuario(formEmpleado.id);
      }}
    >
      Siguiente
    </button>

    <button className="btn btn-danger" onClick={cerrarModalAgregarUsuario}>
      Cancelar
    </button>
  </div>
  {/**/}
  {showDuplicateUserAlert && (
<div className="alert alert-danger" role="alert">
  {alertMessage}
</div>
)}
</ModalFooter>

  </Modal>
  
  <Modal
  isOpen={modalAgregarDireccion}
    toggle={cerrarModalAgregarDireccion}
    className="modal-floating"
  >
    <ModalHeader>{modalTitulo}</ModalHeader>
  <ModalBody>
      <Table className="form-tabla">
        <h3>Datos de Contacto</h3>
          <div className="form-groupDatosContacto">
<tr>
<td>
  <div className="form-group">
    <label htmlFor="TelFijo">Telefono Fijo:</label>
    <input className="form-control" type="text" name="TelFijo" id="TelFijo" value={formDatosContacto.TelFijo} onChange={(e) => setFormDatosContacto({ ...formDatosContacto,TelFijo: e.target.value,})}/>
  </div>
</td>
<td>
  <div className="form-group">
    <label htmlFor="TelCelular">Telefono Celular:</label>
    <input
      className="form-control"
      type="text"
      name="TelCelular"
      id="TelCelular"
      value={formDatosContacto.TelCelular}
      onChange={(e) =>
        setFormDatosContacto({
          ...formDatosContacto,
          TelCelular: e.target.value,
        })
      }
    />
  </div>
</td>
<td>
  <div className="form-group">
    <label htmlFor="IdWhatsApp">ID WhatsApp:</label>
    <input
      className="form-control"
      type="text"
      name="IdWhatsApp"
      id="IdWhatsApp"
      value={formDatosContacto.IdWhatsApp}
      onChange={(e) =>
        setFormDatosContacto({
          ...formDatosContacto,
          IdWhatsApp: e.target.value,
        })
      }
    />
  </div>
</td>
</tr>
<tr>
<td>
  <div className="form-group">
    <label htmlFor="IdTelegram">ID Telegram:</label>
    <input
      className="form-control"
      type="text"
      name="IdTelegram"
      id="IdTelegram"
      value={formDatosContacto.IdTelegram}
      onChange={(e) =>
        setFormDatosContacto({
          ...formDatosContacto,
          IdTelegram: e.target.value,
        })
      }
    />
  </div>
</td>
<td>
  <div className="form-group">
    <label htmlFor="ListaCorreos">Emails:</label>
    <input
      className="form-control"
      type="text"
      name="ListaCorreos"
      id="ListaCorreos"
      value={formDatosContacto.ListaCorreos}
      onChange={(e) =>
        setFormDatosContacto({
          ...formDatosContacto,
          ListaCorreos: e.target.value,
        })
      }
    />
  </div>
</td>
</tr>
          </div>
        <h3>Dirección</h3>
          <div className="form-groupDireccion">
          <tr>
            <td>
              <div className="form-group">
                <label htmlFor="Calle">Calle:</label>
                <input
                  className="form-control"
                  type="text"
                  name="Calle"
                  id="Calle"
                  value={formDireccion.Calle}
                  onChange={(e) =>
                    setFormDireccion({
                      ...formDireccion,
                      Calle: e.target.value,
                    })
                  }
                />
              </div>
            </td>
            <td>
              <div className="form-group">
                <label htmlFor="NumExterior">Número Exterior:</label>
                <input
                  className="form-control"
                  type="text"
                  name="NumExterior"
                  id="NumExterior"
                  value={formDireccion.NumExterior}
                  onChange={(e) =>
                    setFormDireccion({
                      ...formDireccion,
                      NumExterior: e.target.value,
                    })
                  }
                />
              </div>
            </td>
             <td>
              <div className="form-group">
                <label htmlFor="NumInterior">Número Interior:</label>
                <input
                  className="form-control"
                  type="text"
                  name="NumInterior"
                  id="NumInterior"
                  value={formDireccion.NumInterior}
                  onChange={(e) =>
                    setFormDireccion({
                      ...formDireccion,
                      NumInterior: e.target.value,
                    })
                  }
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="form-group">
                <label htmlFor="Manzana">Manzana:</label>
                <input
                  className="form-control"
                  type="text"
                  name="Manzana"
                  id="Manzana"
                  value={formDireccion.Manzana}
                  onChange={(e) =>
                    setFormDireccion({
                      ...formDireccion,
                      Manzana: e.target.value,
                    })
                  }
                />
              </div>
            </td>
            <td>
              <div className="form-group">
                <label htmlFor="Lote">Lote:</label>
                <input
                  className="form-control"
                  type="text"
                  name="Lote"
                  id="Lote"
                  value={formDireccion.Lote}
                  onChange={(e) =>
                    setFormDireccion({
                      ...formDireccion,
                      Lote: e.target.value,
                    })
                  }
                />
              </div>
            </td>
            <td>
              <div className="form-group">
                <label htmlFor="Municipio">Municipio:</label>
                <input
                  className="form-control"
                  type="text"
                  name="Municipio"
                  id="Municipio"
                  value={formDireccion.Municipio}
                  onChange={(e) =>
                    setFormDireccion({
                      ...formDireccion,
                      Municipio: e.target.value,
                    })
                  }
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="form-group">
                <label htmlFor="Ciudad">Ciudad:</label>
                <input
                  className="form-control"
                  type="text"
                  name="Ciudad"
                  id="Ciudad"
                  value={formDireccion.Ciudad}
                  onChange={(e) =>
                    setFormDireccion({
                      ...formDireccion,
                      Ciudad: e.target.value,
                    })
                  }
                />
              </div>
            </td>
            <td>
              <div className="form-group">
                <label htmlFor="CodigoP">Código Postal:</label>
                <input
                  className="form-control"
                  type="text"
                  name="CodigoP"
                  id="CodigoP"
                  value={formDireccion.CodigoP}
                  onChange={(e) =>
                    setFormDireccion({
                      ...formDireccion,
                      CodigoP: e.target.value,
                    })
                  }
                />
              </div>
            </td>
            <td>
              <div className="form-group">
                <label htmlFor="Pais">País:</label>
                <input
                  className="form-control"
                  type="text"
                  name="Pais"
                  id="Pais"
                  value={formDireccion.Pais}
                  onChange={(e) =>
                    setFormDireccion({
                      ...formDireccion,
                      Pais: e.target.value,
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
        <button
          className="btn btn-success"
          onClick={() => {
            agregarDatosContacto(formEmpleado.id)
            agregarDireccion(formEmpleado.id);
          }}
        >
          Guardar
        </button>
        
        <button className="btn btn-danger" onClick={cerrarModalAgregarDireccion}>
          Cancelar
        </button>
        {messageRegistro && (<div className="message">{messageRegistro}</div>)}
      </div>
    </ModalFooter>
  </Modal>
  </div>
  );
};

export default LoginForm;