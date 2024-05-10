import React, { useEffect, useState } from "react";
import "../styles.css";
import { Link } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter, Table } from "reactstrap";
import { CiFacebook, CiLinkedin, CiYoutube } from "react-icons/ci";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { useFilePicker } from "use-file-picker";
import * as XLSX from "xlsx";
import { useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import {
  FileAmountLimitValidator,
  FileSizeValidator,
  ImageDimensionsValidator,
} from "use-file-picker/validators";

const apiurl = "http://localhost:3000";

function Empleados() {
  const { openFilePicker, filesContent, clear } = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: true,
    validators: [new FileAmountLimitValidator({ max: 3 })],
  });
  const [imgActual, setImgActual] = useState([]);
  const [modalTitulo, setModalTitulo] = useState("");
  const [empleados, setEmpleados] = useState([]); // Estado para almacenar la lista de empleados
  const [globalFilter, setglobalFilter] = useState(""); // Estado para almacenar el filro pro nombres
  const [globalpage, setglobalpage] = useState(0);
  const [globalnumber, setglobalnumber] = useState(1);
  const [TotalEmpleados, setTotalEmpleados] = useState(0);
  const [datosCargados, setDatosCargados] = useState(false);
  const [indiceImagenActual, setIndiceImagenActual] = useState({}); //Mini galeria
  const [datoscontacto, setdatoscontacto] = useState([]);
  const [personascontacto, setpersonascontacto] = useState([]);
  const [redsocial, setredsocial] = useState([]);
  const [educacion, seteducacion] = useState([]);
  const [modalAgregarUsuario, setModalAgregarUsuario] = useState(false);
  const [message, setMessage] = useState("");
  const [messageRegistro, setmessageRegistro] = useState("");
  const [validations, setValidations] = useState([false, false, false, false]);
  const [usuarios, setUsuarios] = useState([]);

  const [showDuplicateUserAlert, setShowDuplicateUserAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [modalAgregarDireccion, setModalAgregarDireccion] = useState(false);
  const [messageRegistroNav, setmessageRegistroNav] = useState("");

  //Cambio de imagenes de mini galeria
  const cambiarImagen = (idEmpleado, cambio) => {
    setIndiceImagenActual((prevIndices) => {
      const totalImagenes = empleados.find((emp) => emp._id === idEmpleado)
        .Fotografias.length;
      const indiceActual = prevIndices[idEmpleado] || 0;
      const nuevoIndice =
        (indiceActual + cambio + totalImagenes) % totalImagenes;
      return { ...prevIndices, [idEmpleado]: nuevoIndice };
    });
  };

  useEffect(() => {
    cargarEmpleadosBD();
  }, []);

  //USUARIO
  const [formUsuario, setFormUsuario] = useState({
    user: "",
    password: "",
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
      empleado_id: empleadoId,
    };

    // Verificar si el usuario ya existe
    if (usuarios.some((usuario) => usuario.user === nuevoUsuario.user)) {
      // Mostrar la alerta de usuario duplicado
      setAlertMessage(
        "Este usuario ya existe en la base de datos, por favor ingrese otro."
      );
      setShowDuplicateUserAlert(true); // Activar la alerta
      return; // Detener el flujo aquí para evitar continuar con la creación del usuario duplicado
    }

    // Verifica si la contraseña cumple con los estándares
    if (!validations.every((validation) => validation)) {
      setmessageRegistroNav(
        "La contraseña no cumple con todas las condiciones"
      );
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
            user: "",
            password: "",
          });
          cerrarModalAgregarUsuario();
          setModalAgregarDireccion(true);
          setShowDuplicateUserAlert(false);
        })
        .catch((error) => {
          if (error.status === 400) {
            // Si el usuario ya existe, mostrar el mensaje de error correspondiente
            setmessageRegistro(error.message);
          } else {
            // Manejar otros errores de la solicitud
            console.error("Error al agregar usuario:", error);
            setMessage(error.message);
          }
        });
    } else {
      // Si no se completaron todos los campos, mostrar un mensaje de error o tomar la acción adecuada
      alert(
        "Por favor complete todos los campos del usuario antes de continuar."
      );
    }
  };

  // Datos Contacto
  const [formDatosContacto, setFormDatosContacto] = useState({
    TelFijo: "",
    TelCelular: "",
    IdWhatsApp: "",
    IdTelegram: "",
    ListaCorreos: "",
  });

  const agregarDatosContacto = (empleadoId) => {
    const nuevoDatosContacto = {
      TelFijo: formDatosContacto.TelFijo,
      TelCelular: formDatosContacto.TelCelular,
      IdWhatsApp: formDatosContacto.IdWhatsApp,
      IdTelegram: formDatosContacto.IdTelegram,
      ListaCorreos: formDatosContacto.ListaCorreos,
      empleado_id: empleadoId, // Asignar el empleadoId
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
          TelFijo: "",
          TelCelular: "",
          IdWhatsApp: "",
          IdTelegram: "",
          ListaCorreos: "",
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
    Calle: "",
    NumExterior: "",
    NumInterior: "",
    Manzana: "",
    Lote: "",
    Municipio: "",
    Ciudad: "",
    CodigoP: "",
    Pais: "",
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
      empleado_id: empleadoId,
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
          Calle: "",
          NumExterior: "",
          NumInterior: "",
          Manzana: "",
          Lote: "",
          Municipio: "",
          Ciudad: "",
          CodigoP: "",
          Pais: "",
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
  function changeTab(tabNumber) {
    // Ocultar todos los contenidos de las pestañas
    const tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach((content) => {
      content.style.display = "none";
    });

    // Mostrar el contenido de la pestaña seleccionada
    const selectedTab = document.getElementById("tab" + tabNumber);
    selectedTab.style.display = "block";

    // Desactivar todas las pestañas
    const tabs = document.querySelectorAll(".tabs button");
    tabs.forEach((tab) => {
      tab.classList.remove("active");
    });

    // Activar la pestaña seleccionada
    const selectedTabButton = document.querySelector(
      ".tabs button:nth-child(" + tabNumber + ")"
    );
    selectedTabButton.classList.add("active");
  }

  /*Cargar los datos para Redes sociales*/

  const RedSocial = [
    { label: "Facebook", value: <CiFacebook /> },
    { label: "Instagram", value: <FaInstagram /> },
    { label: "Linkedin", value: <CiLinkedin /> },
    { label: "Youtube", value: <CiYoutube /> },
    { label: "tiktok", value: <FaTiktok /> },
  ];

  useEffect(() => {
    setImgActual(filesContent);
  }, [filesContent]);

  const cargarEmpleadosBD = () => {
    fetch(`${apiurl}/empleados`, {
      method: "get",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        setEmpleados(json);
        setDatosCargados(json); // Se asume que json contiene los datos cargados
        const numeroEmpleados = json.length;
        setTotalEmpleados(numeroEmpleados);
      });
  };

  const cargardatoscontacto = () => {
    fetch(`${apiurl}/datoscontacto`)
      .then((response) => response.json())
      .then((json) => {
        setdatoscontacto(json);
      })
      .catch((error) =>
        console.error("Error al obtener datos de contacto:", error)
      );
  };

  const cargarpersonascontacto = () => {
    fetch(`${apiurl}/personascontacto`)
      .then((response) => response.json())
      .then((json) => {
        setpersonascontacto(json);
      })
      .catch((error) =>
        console.error("Error al obtener datos de contacto:", error)
      );
  };

  const cargarrd = () => {
    fetch(`${apiurl}/redsocial`)
      .then((response) => response.json())
      .then((json) => {
        setredsocial(json);
      })
      .catch((error) =>
        console.error("Error al obtener datos de contacto:", error)
      );
  };

  const cargareducacion = () => {
    fetch(`${apiurl}/educacion`)
      .then((response) => response.json())
      .then((json) => {
        seteducacion(json);
      })
      .catch((error) =>
        console.error("Error al obtener datos de contacto:", error)
      );
  };

  useEffect(() => {
    cargarEmpleadosBD();
    cargardatoscontacto();
    cargarpersonascontacto();
    cargarrd();
    cargareducacion();
  }, []);

  const [modalAgregar, setModalAgregar] = useState(false); // Estado para mostrar/ocultar el modal de agregar empleado
  const [formEmpleado, setFormEmpleado] = useState({
    id: "",
    Nombre: "",
    ApelPaterno: "",
    ApelMaterno: "",
    FecNacimiento: null, // Usa null en lugar de una cadena para el campo de fecha
    Fotografias: [], //Uso de array para mini galeria
  });

  // Función para abrir el modal de agregar empleado
  const abrirModalAgregar = () => {
    setImgActual([]);
    setModalTitulo("Agregar Empleado");
    setModalAgregar(true);
  };

  const abrirModalEditar = (empleado, id) => {
    setModalTitulo("Editar Empleado");
    setModalAgregar(true);
    const editEmp = {
      id: id,
      Nombre: empleado.Nombre,
      ApelPaterno: empleado.ApelPaterno,
      ApelMaterno: empleado.ApelMaterno,
      FecNacimiento: empleado.FecNacimiento, // Usa null en lugar de una cadena para el campo de fecha
    };

    //mini galeria
    if (empleado.hasOwnProperty("Fotografias"))
      editEmp["Fotografias"] = empleado.Fotografias;

    setImgActual([{ name: "foto", content: empleado.Fotografias }]);
    setFormEmpleado(editEmp);
  };

  // Función para cerrar el modal de agregar empleado
  const cerrarModalAgregar = () => {
    setModalAgregar(false);
    setFormEmpleado({
      id: "",
      Nombre: "",
      ApelPaterno: "",
      ApelMaterno: "",
      FecNacimiento: "",
      Fotografias: [], //Uso de array para mini galeria
    });
  };

  // Función para editar un empleado a la lista
  const editarEmpleado = () => {
    const nuevoEmpleado = {
      Nombre: formEmpleado.Nombre,
      ApelPaterno: formEmpleado.ApelPaterno,
      ApelMaterno: formEmpleado.ApelMaterno,
      FecNacimiento: formEmpleado.FecNacimiento,
      Fotografias: imgActual.map((file) => file.content), //Uso de array para mini galeria
    };

    fetch(`${apiurl}/empleados/` + formEmpleado.id, {
      method: "put",
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
        alert(json.message);
        cargarEmpleadosBD();
        cerrarModalAgregar();
        clear();
      });
  };

  // Función para agregar un empleado a la lista
  const agregarEmpleado = () => {
    const nuevoEmpleado = {
      Nombre: formEmpleado.Nombre,
      ApelPaterno: formEmpleado.ApelPaterno,
      ApelMaterno: formEmpleado.ApelMaterno,
      FecNacimiento: formEmpleado.FecNacimiento,
      Fotografias: filesContent.map((file) => file.content), //Uso de array para mini galeria
    };

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
        cargarEmpleadosBD();
        cerrarModalAgregar();
        setModalAgregarUsuario(true);
        clear();
      });
  };

  // Inicio para la funcion editar datos Datos de contacto, en ella se abre un modal y se cierra cuando se hayan hecho los cambios

  const [modalAgregarDC, setModalAgregarDC] = useState(false);
  const [formcontacto, setformcontacto] = useState({
    id: "",
    TelFijo: "",
    TelCelular: "",
    IdWhatsApp: "",
    IdTelegram: "",
    ListaCorreos: "",
  });

  const abrirModalEditarContacto = (contacto, id) => {
    setModalTitulo("Editar Contacto");
    setModalAgregarDC(true);

    setformcontacto({
      id,
      ...contacto,
    });
  };

  const cerrarModalAgregardc = () => {
    setModalAgregarDC(false);
    setformcontacto({
      id: "",
      TelFijo: "",
      TelCelular: "",
      IdWhatsApp: "",
      IdTelegram: "",
      ListaCorreos: "",
    });
  };

  const editarDcontacto = () => {
    const actualizaformcontacto = {
      empleado_id: formcontacto.id.$oid,
      ...formcontacto,
    };

    fetch(`${apiurl}/datoscontacto/empleado/${formcontacto.id.$oid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(actualizaformcontacto),
    })
      .then((response) => response.json())
      .then((json) => {
        alert(json.message);
        cargardatoscontacto();
        cerrarModalAgregardc();
        clear();
      });
  };

  const handleEditarContacto = (contacto, id) => {
    abrirModalEditarContacto(contacto, id);
  };

  /*Inicio del modal personascontacto*/

  //cuando se cambia el usestate a true se abre el modal necesario
  const [modalAgregarPC, setModalAgregarPC] = useState(false);

  const [formperscontacto, setformperscontacto] = useState({
    _id: "",
    parenstesco: "",
    nombreContacto: "",
    telefonoContacto: "",
    correoContacto: "",
    direccionContacto: "",
  });

  //Recibe la informacion de personascontacto en conjunto con empleado id
  const handleEditarpersonacontacto = (contacto, id) => {
    abrirModalEditarpersonacontacto(contacto, id);
  };

  //abre el modal necesario y establece la informacion en un Usestate
  const abrirModalEditarpersonacontacto = (contacto, id) => {
    setModalTitulo("Editar Persona Contacto");
    setModalAgregarPC(true);

    setformperscontacto({
      id,
      ...contacto,
    });
  };

  const cerrarModalAgregarpc = () => {
    setModalAgregarPC(false);
    setformperscontacto({
      id: "",
      TelFijo: "",
      TelCelular: "",
      IdWhatsApp: "",
      IdTelegram: "",
      ListaCorreos: "",
    });
  };

  const editarpersonascontacto = () => {
    const datosPersonasContacto = {
      personalcontacto: {
        parenstesco: formperscontacto.parenstesco,
        nombreContacto: formperscontacto.nombreContacto,
        telefonoContacto: formperscontacto.telefonoContacto,
        correoContacto: formperscontacto.correoContacto,
        direccionContacto: formperscontacto.direccionContacto,
        empleadoid: formperscontacto.empleadoid.$oid,
      },
    };

    console.log("Datos enviados:", datosPersonasContacto); // Agregar console.log aquí

    fetch(
      `${apiurl}/personascontacto/empleado/${datosPersonasContacto.empleadoid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosPersonasContacto),
      }
    )
      .then((response) => response.json())
      .then((json) => {
        alert(json.message);
        cargarpersonascontacto();
        cerrarModalAgregarpc(); // Corregí el nombre de la función aquí
        clear(); // Asumiendo que clear() es una función definida en otro lugar
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud:", error);
        // Trata el error adecuadamente
      });
  };

  /*Inicio del modal redes sociales*/

  //cuando se cambia el usestate a true se abre el modal necesario
  const [modalAgregarRS, setModalAgregarRS] = useState(false);

  const [formRS, setformRS] = useState([]);
  const [Idredessociales, setIdredessociales] = useState([]);

  //Recibe la informacion de personascontacto en conjunto con empleado id
  const handleEditarRS = (contacto, id) => {
    abrirModalEditarRS(contacto, id);
  };

  //abre el modal necesario y establece la informacion en un Usestate
  const abrirModalEditarRS = (contacto, id) => {
    setModalTitulo("Editar Redes sociales");
    setModalAgregarRS(true);
    const empleado = id.$oid;
    const redesSociales = contacto.RedesSociales || [];

    setIdredessociales(empleado);
    setformRS(redesSociales);
  };

  const cerrarModalAgregarRS = () => {
    setModalAgregarRS(false);
  };

  const editarrs = () => {
    const datosRedesSociales = {
      empleado_id: Idredessociales,
      RedesSociales: formRS.map((redSocial) => ({
        redSocialSeleccionada: redSocial.redSocialSeleccionada,
        URLRedSocial: redSocial.URLRedSocial,
        NombreRedSocial: redSocial.NombreRedSocial,
      })),
    };

    console.log("Datos enviados:", datosRedesSociales); // Agregar console.log aquí

    fetch(`${apiurl}/redsocial/empleado/${datosRedesSociales.empleado_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosRedesSociales),
    })
      .then((response) => response.json())
      .then((json) => {
        alert(json.message);
        cargarrd();
        cerrarModalAgregarRS(); // Corregí el nombre de la función aquí
        clear(); // Asumiendo que clear() es una función definida en otro lugar
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud:", error);
        // Trata el error adecuadamente
      });
  };

  /*Inicio del modal educacion*/
  const [ModalAgregarExperiencia, setModalAgregarExperiencia] = useState(false);

  const [ModalAgregarEducacion, setModalAgregarEducacion] = useState(false);

  const [ModalAgregarHabilidades, setModalAgregarHabilidades] = useState(false);

  const [formExperiencia, setformExperiencia] = useState({ Experiencia: [] });

  const [formEducacion, setformEducacion] = useState({ Educacion: [] });

  const [formHabilidades, setFormHabilidades] = useState({
    Habilidades: { Programacion: [] },
  });

  const [formDescripcion, setformDescripcion] = useState([]);

  const handleEditarExperiencia = (contacto, id) => {
    abrirModalEditarExperiencia(contacto, id, handleEditarExperiencia.name);
  };

  const handleEditarEducacion = (contacto, id) => {
    abrirModalEditarExperiencia(contacto, id, handleEditarEducacion.name);
  };

  const handleEditarHabilidades = (contacto, id) => {
    abrirModalEditarExperiencia(contacto, id, handleEditarHabilidades.name);
  };

  const abrirModalEditarExperiencia = (contacto, id, functionName) => {
    if (functionName === "handleEditarEducacion") {
      setModalTitulo("Editar Educación");
      setModalAgregarEducacion(true);
    } else if (functionName === "handleEditarHabilidades") {
      setModalTitulo("Editar Habilidades");
      setModalAgregarHabilidades(true);
    } else {
      setModalTitulo("Editar Experiencia");
      setModalAgregarExperiencia(true);
    }

    setformExperiencia(contacto);
    setformEducacion(contacto);
    setFormHabilidades(contacto);
    setformDescripcion(contacto);
  };

  const cerrarModalAgregarExperiencia = () => {
    setModalAgregarExperiencia(false);
    setModalAgregarEducacion(false);
    setModalAgregarHabilidades(false);
  };

  const editarmodalexperiencia = () => {
    const datosEducacion = {
      empleado_id: formDescripcion.empleado_id.$oid,
      Descripcion: formDescripcion.Descripcion,
      Educacion: formEducacion.Educacion.map((item) => ({
        Fecha: item.Fecha,
        Titulo: item.Titulo,
        Descripcion: item.Descripcion,
      })),
      Experiencia: formExperiencia.Experiencia.map((item) => ({
        Fecha: item.Fecha,
        Titulo: item.Titulo,
        Descripcion: item.Descripcion,
      })),
      Habilidades: {
        Programacion: formHabilidades.Habilidades.Programacion.map(
          (habilidad) => ({
            Titulo: habilidad.Titulo,
            Porcentaje: habilidad.Porcentaje,
          })
        ),
      },
    };

    fetch(`${apiurl}/educacion/${datosEducacion.empleado_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosEducacion),
    })
      .then((response) => response.json())
      .then((json) => {
        alert(json.message);
        cargareducacion();
        cerrarModalAgregarExperiencia(); // Corregí el nombre de la función aquí
        clear(); // Asumiendo que clear() es una función definida en otro lugar
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud:", error);
        // Trata el error adecuadamente
      });
  };

  const handleFechaNacimientoChange = (date) => {
    setFormEmpleado({ ...formEmpleado, FecNacimiento: date.target.value });
  };

  //Metodo de filtrado/*
  let resultado,
    resultadodc,
    resultadopc,
    resultadord,
    resultadoed = [];

  if (!globalFilter) {
    resultado = empleados.slice(globalpage, globalpage + 5);
    resultadodc = datoscontacto.slice(globalpage, globalpage + 5);
    resultadopc = personascontacto.slice(globalpage, globalpage + 5);
    resultadord = redsocial.slice(globalpage, globalpage + 5);
    resultadoed = educacion.slice(globalpage, globalpage + 5);
  } else {
    resultado = empleados.filter((dato) =>
      dato.Nombre.toLowerCase().includes(globalFilter.toLowerCase())
    );
    resultadodc = datoscontacto.filter((dato) =>
      dato.NombreCompleto.toLowerCase().includes(globalFilter.toLowerCase())
    );

    resultadopc = personascontacto.filter((dato) =>
      dato.NombreCompleto.toLowerCase().includes(globalFilter.toLowerCase())
    );

    resultadord = redsocial.filter((dato) =>
      dato.NombreCompleto.toLowerCase().includes(globalFilter.toLowerCase())
    );

    resultadoed = educacion.filter((dato) =>
      dato.NombreCompleto.toLowerCase().includes(globalFilter.toLowerCase())
    );
  }

  //Siguiente pagina
  var Masresultados = true;
  var Menosresultados = true;

  if (globalpage <= 0 || globalFilter) Menosresultados = false;
  if (globalpage > empleados.length - 6 || globalFilter) Masresultados = false;

  const NextPage = () => {
    let nextPageNumber = globalpage + 5; // Calcula el número de página siguiente

    // Verifica si hay un filtro global activo
    if (globalFilter) {
      const empleadosFiltrados = empleados.filter((dato) =>
        dato.Nombre.toLowerCase().includes(globalFilter.toLowerCase())
      );
      nextPageNumber =
        globalpage + 5 <= empleadosFiltrados.length
          ? nextPageNumber
          : globalpage;
    } else {
      nextPageNumber =
        globalpage + 5 <= empleados.length ? nextPageNumber : globalpage;
    }

    setglobalpage(nextPageNumber); // Actualiza la página global

    // Calcula el número de página actual en base al total de resultados y elementos por página
    const currentPageNumber = Math.floor(nextPageNumber / 5) + 1;
    setglobalnumber(currentPageNumber); // Actualiza el número de página global
  };

  const PrevPage = () => {
    let prevPageNumber = globalpage - 5; // Calcula el número de página anterior

    // Verifica si hay un filtro global activo
    if (globalFilter) {
      prevPageNumber = prevPageNumber >= 0 ? prevPageNumber : 0;
    } else {
      prevPageNumber = prevPageNumber >= 0 ? prevPageNumber : 0;
    }

    setglobalpage(prevPageNumber); // Actualiza la página global

    // Calcula el número de página actual en base al total de resultados y elementos por página
    const currentPageNumber = Math.floor(prevPageNumber / 5) + 1;
    setglobalnumber(currentPageNumber); // Actualiza el número de página global
  };

  const handleEditarEmpleado = (empleado, id) => {
    // Agrega lógica para editar el empleado aquí
    abrirModalEditar(empleado, id);
  };
  const generaArchExcel = () => {
    const wb = XLSX.utils.book_new();
    const dataArray = Array.isArray(empleados) ? empleados : [empleados];
    const ws = XLSX.utils.json_to_sheet(dataArray);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'SistemaEmpleados_Data.xlsx');
  };
  
  // Llamar a la función de carga de empleados cuando la página se carga
  useEffect(() => {
    cargarEmpleadosBD();
  }, []);

  // Función para eliminar un empleado
  const handleEliminarEmpleado = (id) => {
    // Agrega lógica para eliminar el empleado aquí
    fetch(`${apiurl}/empleados/` + id, {
      method: "delete",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        alert(json.message);
        cargarEmpleadosBD();
        fetch(`${apiurl}/datoscontacto/${id}`, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Error al eliminar datoscontacto: ${response.status}`
              );
            }
            return response.json();
          })
          .catch((error) => {
            console.error(
              "Error en la solicitud DELETE (datoscontacto):",
              error
            );
            // Maneja errores aquí si es necesario
          });
        fetch(`${apiurl}/expedienteclinico/${id}`, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Error al eliminar expedienteclinico: ${response.status}`
              );
            }
            return response.json();
          })
          .catch((error) => {
            console.error(
              "Error en la solicitud DELETE (expedienteclinico):",
              error
            );
            // Maneja errores aquí si es necesario
          });
        fetch(`${apiurl}/educacion/${id}`, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Error al eliminar educacion: ${response.status}`
              );
            }
            return response.json();
          })
          .catch((error) => {
            // Maneja errores aquí si es necesario
          });
        fetch(`${apiurl}/redsocial/${id}`, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Error al eliminar redsocial: ${response.status}`
              );
            }
            return response.json();
          })
          .catch((error) => {
            // Maneja errores aquí si es necesario
          });
        fetch(`${apiurl}/personascontacto/${id}`, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Error al eliminar personascontacto: ${response.status}`
              );
            }
            return response.json();
          })
          .catch((error) => {
            console.error(
              "Error en la solicitud DELETE (personascontacto):",
              error
            );
            // Maneja errores aquí si es necesario
          });
        fetch(`${apiurl}/rh/${id}`, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
          .then((response) => {
            if (!response.ok) {
            }
            return response.json();
          })
          .catch((error) => {
            // Maneja errores aquí si es necesario
          });
      });
  };

  /*Loader*/

  if (!datosCargados) {
    // Muestra el indicador de carga o un mensaje de carga
    return (
      <div className="loading">
        <span className="span1"></span>
        <span className="span2"></span>
        <span className="span3"></span>
        <span className="span4"></span>
      </div>
    );
  }

  // Más funciones CRUD para editar y eliminar empleados

  return (
    <section className="empleados">
      <div className="CRUDS">
        <div className="Agregar-Emp">
          <button className="btn" onClick={abrirModalAgregar}>
            <a>+</a>
          </button>
          <div>
            <input
              type="text"
              className="inputEmpleados"
              placeholder="Buscar..."
              value={globalFilter}
              onChange={(e) => setglobalFilter(e.target.value)}
            />
          </div>
          <div className="Export-Table">
    {/* Botón para exportar los datos a Excel */}
    <button onClick={generaArchExcel}>↓</button>
    {/* Resto de tu código aquí */}
  </div>
        </div>
        <div className="tabs">
          <button onClick={() => changeTab(1)}>General</button>
          <button onClick={() => changeTab(2)}>Datos de contacto</button>
          <button onClick={() => changeTab(3)}>Personas de contacto</button>
          <button onClick={() => changeTab(4)}>Expediente clinico</button>
          <button onClick={() => changeTab(5)}>Redes sociales</button>
          <button onClick={() => changeTab(6)}>Recursos humanos</button>
          <button onClick={() => changeTab(7)}>Experiencia</button>
          <button onClick={() => changeTab(8)}>Educacion</button>
          <button onClick={() => changeTab(9)}>
            Habilidades profesionales
          </button>
        </div>
        <div className="tab-content" id="tab1">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
                <th>Fecha de Nacimiento</th>
                <th>Fotografía</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {resultado.map((empleado, index) => (
                <tr key={index}>
                  <td style={{ display: "none" }}>{empleado._id}</td>
                  <td>{empleado.Nombre}</td>
                  <td>{empleado.ApelPaterno}</td>
                  <td>{empleado.ApelMaterno}</td>
                  <td>{empleado.FecNacimiento}</td>

                  <td>
                    <div className="mini-gallery">
                      {empleado.Fotografias &&
                        empleado.Fotografias.length > 0 && (
                          <img
                            src={
                              empleado.Fotografias[
                                indiceImagenActual[empleado._id] || 0
                              ]
                            }
                            alt={`Foto de ${empleado.Nombre}`}
                          />
                        )}
                      {empleado.Fotografias &&
                        empleado.Fotografias.length > 1 && (
                          <div className="mini_gallery-btn">
                            <button
                              onClick={() => cambiarImagen(empleado._id, -1)}
                            >
                              &lt;
                            </button>
                            <button
                              onClick={() => cambiarImagen(empleado._id, 1)}
                            >
                              &gt;
                            </button>
                          </div>
                        )}
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        handleEditarEmpleado(empleado, empleado._id)
                      }
                    >
                      Editar
                    </button>
                    {"   "}
                    <button
                      className="btn btn-danger"
                      onClick={() => handleEliminarEmpleado(empleado._id)}
                    >
                      Eliminar
                    </button>
                    <Link
                      to={`/Personal/${empleado._id}`}
                      className="btn-direction"
                    >
                      Perfil
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="registros">
            <div className="num-reg">
              <th>Pagina: {globalnumber}</th>
            </div>
            <div className="num-emp">
              <th>
                Registros: {globalpage} de {TotalEmpleados}
              </th>
            </div>
          </div>
          <div className="navegacion-emp">
            <div className="btn-nav">
              <button
                className="btn"
                onClick={PrevPage}
                style={{ display: Menosresultados ? "inline-block" : "none" }}
              >
                {"Anterior"}
              </button>
              <button
                className="btn"
                onClick={NextPage}
                style={{ display: Masresultados ? "inline-block" : "none" }}
              >
                {"Siguiente"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="tab-content" id="tab2">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Telefono Fijo</th>
              <th>Telefono Celular</th>
              <th>ID de Whatsapp</th>
              <th>ID de Telegram</th>
              <th>Correo | E-mail</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {resultadodc.map((contacto, index) => (
              <tr key={index}>
                <td>{contacto.NombreCompleto}</td>
                <td>{contacto.TelFijo}</td>
                <td>{contacto.TelCelular}</td>
                <td>{contacto.IdWhatsApp}</td>
                <td>{contacto.IdTelegram}</td>
                <td>{contacto.ListaCorreos}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      handleEditarContacto(contacto, contacto.EmpleadoId)
                    }
                  >
                    Editar
                  </button>
                  <Link
                    to={`/Personal/${contacto.EmpleadoId.$oid}`}
                    className="btn-direction"
                  >
                    Perfil
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="registros">
          <div className="num-reg">
            <th>Pagina: {globalnumber}</th>
          </div>
          <div className="num-emp">
            <th>
              Registros: {globalpage} de {TotalEmpleados}
            </th>
          </div>
        </div>
        <div className="navegacion-emp">
          <div className="btn-nav">
            <button
              className="btn"
              onClick={PrevPage}
              style={{ display: Menosresultados ? "inline-block" : "none" }}
            >
              {"Anterior"}
            </button>
            <button
              className="btn"
              onClick={NextPage}
              style={{ display: Masresultados ? "inline-block" : "none" }}
            >
              {"Siguiente"}
            </button>
          </div>
        </div>
      </div>
      <div className="tab-content" id="tab3">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre del empleado</th>
              <th>Parentesco</th>
              <th>Nombre de Contacto</th>
              <th>Numero de Telefono</th>
              <th>Correo</th>
              <th>Direccion del contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {resultadopc.map((contacto, index) => (
              <tr key={index}>
                <td>{contacto.NombreCompleto}</td>
                <td>{contacto.parenstesco}</td>
                <td>{contacto.nombreContacto}</td>
                <td>{contacto.telefonoContacto}</td>
                <td>{contacto.correoContacto}</td>
                <td>{contacto.direccionContacto}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      handleEditarpersonacontacto(contacto, contacto.empleadoid)
                    }
                  >
                    Editar
                  </button>
                  <Link
                    to={`/Personal/${contacto.empleadoid.$oid}`}
                    className="btn-direction"
                  >
                    Perfil
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="tab-content" id="tab4">
        <table className="table">
          <thead>
            <tr>
              <th>Tipo de Sangre</th>
              <th>Padecimientos</th>
              <th>Numero de Seguro Social (NSS)</th>
              <th>Datos de Seguro de Gastos Médicos</th>
              <th>PDF</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <div className="tab-content" id="tab5">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre del empleado</th>
              <th>Red Social</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {resultadord.map((empleado, index) => (
              <tr key={index}>
                <td>{empleado.NombreCompleto}</td>
                <td>
                  <ul>
                    {empleado.RedesSociales.map((redSocial, index) => (
                      <div key={index}>
                        <div className="redessocialescont">
                          <a
                            href={`https://${redSocial.URLRedSocial}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="red-social-link"
                          >
                            <div
                              className="redsocialicon"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              {RedSocial.find(
                                (social) =>
                                  social.label ===
                                  redSocial.redSocialSeleccionada
                              )?.value || "Icono no encontrado"}
                            </div>
                            <p>{redSocial.NombreRedSocial}</p>
                          </a>
                        </div>
                      </div>
                    ))}
                  </ul>
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      handleEditarRS(empleado, empleado.empleado_id)
                    }
                  >
                    Editar
                  </button>
                  <Link
                    to={`/Personal/${empleado.empleado_id.$oid}`}
                    className="btn-direction"
                  >
                    Perfil
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="tab-content" id="tab6">
        <table className="table">
          <thead>
            <tr>
              <th>Cargo</th>
              <th>Jefe Inmediato</th>
              <th>Horario Laboral</th>
              <th>Zona Horaria</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <div className="tab-content" id="tab7">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre del empleado</th>
              <th>Nombre de la Empresa</th>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {resultadoed.map((empleado, index) => (
              <tr key={index}>
                <td>{empleado.NombreCompleto}</td>
                <td>
                  <ul>
                    {empleado.Experiencia.map((experiencia, index) => (
                      <div key={index}>
                        <div>{experiencia.Titulo}</div>
                      </div>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {empleado.Experiencia.map((experiencia, index) => (
                      <div key={index}>
                        <div>{experiencia.Fecha}</div>
                      </div>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {empleado.Experiencia.map((experiencia, index) => (
                      <div key={index}>
                        <div>{experiencia.Descripcion}</div>
                      </div>
                    ))}
                  </ul>
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      handleEditarExperiencia(empleado, empleado.empleado_id)
                    }
                  >
                    Editar
                  </button>
                  <Link
                    to={`/Personal/${empleado.empleado_id.$oid}`}
                    className="btn-direction"
                  >
                    Perfil
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="tab-content" id="tab8">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre del empleado</th>
              <th>Institución</th>
              <th>Fecha</th>
              <th>Descripcion</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {resultadoed.map((empleado, index) => (
              <tr key={index}>
                <td>{empleado.NombreCompleto}</td>
                <td>
                  <ul>
                    {empleado.Educacion.map((escolaridad, index) => (
                      <div key={index}>
                        <div>{escolaridad.Titulo}</div>
                      </div>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {empleado.Educacion.map((escolaridad, index) => (
                      <div key={index}>
                        <div>{escolaridad.Fecha}</div>
                      </div>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {empleado.Educacion.map((escolaridad, index) => (
                      <div key={index}>
                        <div>{escolaridad.Descripcion}</div>
                      </div>
                    ))}
                  </ul>
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      handleEditarEducacion(empleado, empleado.empleado_id)
                    }
                  >
                    Editar
                  </button>
                  <Link
                    to={`/Personal/${empleado.empleado_id.$oid}`}
                    className="btn-direction"
                  >
                    Perfil
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="tab-content" id="tab9">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre del empleado</th>
              <th>Habilidad</th>
              <th>Porcentaje de conocimientos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {resultadoed.map((empleado, index) => (
              <tr key={index}>
                <td>{empleado.NombreCompleto}</td>
                <td>
                  <ul>
                    {empleado.Habilidades &&
                      empleado.Habilidades.Programacion &&
                      empleado.Habilidades.Programacion.map(
                        (habilidad, index) => (
                          <div key={index}>
                            <div>{habilidad.Titulo}</div>
                          </div>
                        )
                      )}
                  </ul>
                </td>
                <td>
                  <ul>
                    {empleado.Habilidades &&
                      empleado.Habilidades.Programacion &&
                      empleado.Habilidades.Programacion.map(
                        (habilidad, index) => (
                          <div key={index}>
                            <div>{habilidad.Porcentaje}</div>
                          </div>
                        )
                      )}
                  </ul>
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      handleEditarHabilidades(empleado, empleado.empleado_id)
                    }
                  >
                    Editar
                  </button>
                  <Link
                    to={`/Personal/${empleado.empleado_id.$oid}`}
                    className="btn-direction"
                  >
                    Perfil
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
                          <div
                            key={index}
                            style={{
                              display: "inline-block",
                              textAlign: "center",
                              margin: "10px",
                            }}
                          >
                            <img
                              style={{ width: "100px", height: "100px" }}
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
            {" "}
            {/* Contenedor para centrar los botones */}
            <button
              className="btn btn-success"
              onClick={() =>
                modalTitulo === "Agregar Empleado"
                  ? agregarEmpleado()
                  : editarEmpleado()
              }
            >
              Aceptar
            </button>
            <button className="btn btn-danger" onClick={cerrarModalAgregar}>
              Cancelar
            </button>
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
            <div></div>
          </Table>
        </ModalBody>
        <ModalFooter>
          <div style={{ textAlign: "center" }}>
            <button
              className="btn btn-success"
              onClick={() => {
                // Verificar si el usuario ya existe
                if (
                  usuarios.some((usuario) => usuario.user === formUsuario.user)
                ) {
                  // Mostrar la alerta de usuario duplicado
                  setAlertMessage(
                    "Este usuario ya existe en la base de datos, por favor ingrese otro."
                  );
                  return; // Detener el flujo aquí para evitar continuar con la creación del usuario duplicado
                }

                // Si el usuario no existe, llamar a la función para agregar el usuario
                agregarUsuario(formEmpleado.id);
              }}
            >
              Siguiente
            </button>

            <button
              className="btn btn-danger"
              onClick={cerrarModalAgregarUsuario}
            >
              Cancelar
            </button>
          </div>

          {/* Mostrar el mensaje de alerta si es necesario */}
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
                    <input
                      className="form-control"
                      type="text"
                      name="TelFijo"
                      id="TelFijo"
                      value={formDatosContacto.TelFijo}
                      onChange={(e) =>
                        setFormDatosContacto({
                          ...formDatosContacto,
                          TelFijo: e.target.value,
                        })
                      }
                    />
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
                agregarDatosContacto(formEmpleado.id);
                agregarDireccion(formEmpleado.id);
              }}
            >
              Guardar
            </button>

            <button
              className="btn btn-danger"
              onClick={cerrarModalAgregarDireccion}
            >
              Cancelar
            </button>
            {messageRegistro && (
              <div className="message">{messageRegistro}</div>
            )}
          </div>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={modalAgregarDC}
        toggle={cerrarModalAgregardc}
        className="modal-floating"
      >
        <ModalHeader>{modalTitulo}</ModalHeader>
        <ModalBody>
          <Table className="form-tabla">
            <tbody className="form-group">
              <tr>
                <td>
                  <div className="form-item">
                    <label htmlFor="telefonoFijo">Telefono fijo:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="telefonoFijo"
                      id="telefonoFijo"
                      value={formcontacto.TelFijo}
                      onChange={(e) =>
                        setformcontacto({
                          ...formcontacto,
                          TelFijo: e.target.value,
                        })
                      }
                      maxLength={11}
                      onKeyPress={(e) => {
                        if (isNaN(Number(e.key))) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </td>
                <td>
                  <div className="form-item">
                    <label htmlFor="telefonocel">Telefono celular:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="telefonocel"
                      id="telefonocel"
                      value={formcontacto.TelCelular}
                      onChange={(e) =>
                        setformcontacto({
                          ...formcontacto,
                          TelCelular: e.target.value,
                        })
                      }
                      maxLength={11}
                      onKeyPress={(e) => {
                        if (isNaN(Number(e.key))) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="form-item">
                    <label htmlFor="IdWhatsapp">Id WhatsApp:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="IdWhatsapp"
                      id="IdWhatsapp"
                      value={formcontacto.IdWhatsApp}
                      onChange={(e) =>
                        setformcontacto({
                          ...formcontacto,
                          IdWhatsApp: e.target.value,
                        })
                      }
                    />
                  </div>
                </td>
                <td>
                  <div className="form-item">
                    <label htmlFor="Idtelegram">Id Telegram:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="Idtelegram"
                      id="Idtelegram"
                      value={formcontacto.IdTelegram}
                      onChange={(e) =>
                        setformcontacto({
                          ...formcontacto,
                          IdTelegram: e.target.value,
                        })
                      }
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="form-item">
                    <label htmlFor="Correo">Correo:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="Correo"
                      id="Correo"
                      value={formcontacto.ListaCorreos}
                      onChange={(e) =>
                        setformcontacto({
                          ...formcontacto,
                          ListaCorreos: e.target.value,
                        })
                      }
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <div style={{ textAlign: "center" }}>
            <button
              className="btn btn-success"
              onClick={() => editarDcontacto()}
            >
              Guardar
            </button>
            <button className="btn btn-danger" onClick={cerrarModalAgregardc}>
              Cancelar
            </button>
          </div>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={modalAgregarPC}
        toggle={cerrarModalAgregarpc}
        className="modal-floating"
      >
        <ModalHeader>{modalTitulo}</ModalHeader>
        <ModalBody>
          <Table className="form-tabla">
            <tbody className="form-group">
              <tr>
                <td>
                  <div className="form-item">
                    <label htmlFor="nombre">Parentesco:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="nombre"
                      id="nombre"
                      value={formperscontacto.parenstesco}
                      onChange={(e) =>
                        setformperscontacto({
                          ...formperscontacto,
                          parenstesco: e.target.value,
                        })
                      }
                    />
                  </div>
                </td>
                <td>
                  <div className="form-item">
                    <label htmlFor="ApelPaterno">Nombre del contacto:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="ApelPaterno"
                      id="ApelPaterno"
                      value={formperscontacto.nombreContacto}
                      onChange={(e) =>
                        setformperscontacto({
                          ...formperscontacto,
                          nombreContacto: e.target.value,
                        })
                      }
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="form-item">
                    <label htmlFor="ApelPaterno">Telefono del contacto:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="ApelPaterno"
                      id="ApelPaterno"
                      value={formperscontacto.telefonoContacto}
                      onChange={(e) =>
                        setformperscontacto({
                          ...formperscontacto,
                          telefonoContacto: e.target.value,
                        })
                      }
                      maxLength={11}
                      onKeyPress={(e) => {
                        if (isNaN(Number(e.key))) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </td>
                <td>
                  <div className="form-item">
                    <label htmlFor="ApelMaterno">Correo del contacto:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="ApelMaterno"
                      id="ApelMaterno"
                      value={formperscontacto.correoContacto}
                      onChange={(e) =>
                        setformperscontacto({
                          ...formperscontacto,
                          correoContacto: e.target.value,
                        })
                      }
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="form-item">
                    <label htmlFor="ApelMaterno">Direccion del contacto:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="ApelMaterno"
                      id="ApelMaterno"
                      value={formperscontacto.direccionContacto}
                      onChange={(e) =>
                        setformperscontacto({
                          ...formperscontacto,
                          direccionContacto: e.target.value,
                        })
                      }
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <div style={{ textAlign: "center" }}>
            <button
              className="btn btn-success"
              onClick={() => editarpersonascontacto()}
            >
              Guardar
            </button>
            <button className="btn btn-danger" onClick={cerrarModalAgregarpc}>
              Cancelar
            </button>
          </div>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={modalAgregarRS}
        toggle={cerrarModalAgregarRS}
        className="modal-floating"
      >
        <ModalHeader>{modalTitulo}</ModalHeader>
        <ModalBody>
          <Table className="form-tabla">
            <tbody className="form-group">
              {formRS.map((redSocial, index) => (
                <tr key={index}>
                  <td>
                    <select
                      value={formRS.redSocialSeleccionada}
                      onChange={(e) => {
                        const updatedRedesSociales = [...formRS];
                        updatedRedesSociales[index].redSocialSeleccionada =
                          e.target.value;
                        setformRS(updatedRedesSociales);
                      }}
                    >
                      <option value="">Selecciona una red social</option>
                      {RedSocial.map((option) => (
                        <option value={option.label}>{option.label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="form-item">
                      <label htmlFor="nombre">Selecciona la red social:</label>
                      <input
                        className="form-control"
                        type="text"
                        name="nombre"
                        id="nombre"
                        value={redSocial.NombreRedSocial} // Mostrar el nombre de la red social
                        onChange={(e) =>
                          // Actualizar el valor de la red social en el estado formRS
                          setformRS((prevFormRS) => [
                            ...prevFormRS.slice(0, index),
                            {
                              ...prevFormRS[index],
                              NombreRedSocial: e.target.value,
                            },
                            ...prevFormRS.slice(index + 1),
                          ])
                        }
                      />
                    </div>
                  </td>
                  <td>
                    <div className="form-item">
                      <label htmlFor="ApelPaterno">Coloca la URL:</label>
                      <input
                        className="form-control"
                        type="text"
                        name="ApelPaterno"
                        id="ApelPaterno"
                        value={redSocial.URLRedSocial} // Mostrar la URL de la red social
                        onChange={(e) =>
                          // Actualizar el valor de la URL de la red social en el estado formRS
                          setformRS((prevFormRS) => [
                            ...prevFormRS.slice(0, index),
                            {
                              ...prevFormRS[index],
                              URLRedSocial: e.target.value,
                            },
                            ...prevFormRS.slice(index + 1),
                          ])
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <div style={{ textAlign: "center" }}>
            <button className="btn btn-success" onClick={() => editarrs()}>
              Guardar
            </button>
            <button className="btn btn-danger" onClick={cerrarModalAgregarRS}>
              Cancelar
            </button>
          </div>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={ModalAgregarExperiencia}
        toggle={cerrarModalAgregarExperiencia}
        className="modal-floating"
      >
        <ModalHeader>{modalTitulo}</ModalHeader>
        <ModalBody>
          <Table className="form-tabla">
            {formExperiencia.Experiencia.map((experiencia, index) => (
              <tr key={index}>
                <td>
                  <div className="form-item">
                    <label htmlFor={`fecha-${index}`}>Fecha:</label>
                    <input
                      className="form-control"
                      type="text"
                      value={experiencia.Fecha}
                      onChange={(e) =>
                        // Actualizar el valor de la fecha en la experiencia correspondiente
                        setformExperiencia((prevFormExperiencia) => {
                          const updatedExperiencia = { ...prevFormExperiencia };
                          updatedExperiencia.Experiencia[index].Fecha =
                            e.target.value;
                          return updatedExperiencia;
                        })
                      }
                    />
                  </div>
                </td>
                <td>
                  <div className="form-item">
                    <label htmlFor={`titulo-${index}`}>Título:</label>
                    <input
                      className="form-control"
                      type="text"
                      value={experiencia.Titulo}
                      onChange={(e) =>
                        // Actualizar el valor del título en la experiencia correspondiente
                        setformExperiencia((prevFormExperiencia) => {
                          const updatedExperiencia = { ...prevFormExperiencia };
                          updatedExperiencia.Experiencia[index].Titulo =
                            e.target.value;
                          return updatedExperiencia;
                        })
                      }
                    />
                  </div>
                </td>
                <td>
                  <div className="form-item">
                    <label htmlFor={`descripcion-${index}`}>Descripción:</label>
                    <input
                      className="form-control"
                      type="text"
                      value={experiencia.Descripcion}
                      onChange={(e) =>
                        // Actualizar el valor de la descripción en la experiencia correspondiente
                        setformExperiencia((prevFormExperiencia) => {
                          const updatedExperiencia = { ...prevFormExperiencia };
                          updatedExperiencia.Experiencia[index].Descripcion =
                            e.target.value;
                          return updatedExperiencia;
                        })
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </ModalBody>
        <ModalFooter>
          <div style={{ textAlign: "center" }}>
            <button
              className="btn btn-success"
              onClick={() => editarmodalexperiencia()}
            >
              Guardar
            </button>
            <button
              className="btn btn-danger"
              onClick={cerrarModalAgregarExperiencia}
            >
              Cancelar
            </button>
          </div>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={ModalAgregarEducacion}
        toggle={cerrarModalAgregarExperiencia}
        className="modal-floating"
      >
        <ModalHeader>{modalTitulo}</ModalHeader>
        <ModalBody>
          <Table className="form-tabla">
            {formEducacion.Educacion.map((Educacion, index) => (
              <tr key={index}>
                <td>
                  <div className="form-item">
                    <label htmlFor={`fecha-${index}`}>Fecha:</label>
                    <input
                      className="form-control"
                      type="text"
                      name={`fecha-${index}`}
                      id={`fecha-${index}`}
                      value={Educacion.Fecha}
                      onChange={(e) =>
                        // Actualizar el valor de la fecha en la experiencia correspondiente
                        setformEducacion((prevFormEducacion) => {
                          const updatedEducacion = { ...prevFormEducacion };
                          updatedEducacion.Educacion[index].Fecha =
                            e.target.value;
                          return updatedEducacion;
                        })
                      }
                    />
                  </div>
                </td>
                <td>
                  <div className="form-item">
                    <label htmlFor={`titulo-${index}`}>Título:</label>
                    <input
                      className="form-control"
                      type="text"
                      name={`titulo-${index}`}
                      id={`titulo-${index}`}
                      value={Educacion.Titulo}
                      onChange={(e) =>
                        // Actualizar el valor del título en la experiencia correspondiente
                        setformEducacion((prevFormEducacion) => {
                          const updatedEducacion = { ...prevFormEducacion };
                          updatedEducacion.Educacion[index].Titulo =
                            e.target.value;
                          return updatedEducacion;
                        })
                      }
                    />
                  </div>
                </td>
                <td>
                  <div className="form-item">
                    <label htmlFor={`descripcion-${index}`}>Descripcion:</label>
                    <input
                      className="form-control"
                      type="text"
                      value={Educacion.Descripcion}
                      onChange={(e) =>
                        // Actualizar el valor de la descripción en la experiencia correspondiente
                        setformEducacion((prevFormEducacion) => {
                          const updatedEducacion = { ...prevFormEducacion };
                          updatedEducacion.Educacion[index].Descripcion =
                            e.target.value;
                          return updatedEducacion;
                        })
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </ModalBody>
        <ModalFooter>
          <div style={{ textAlign: "center" }}>
            <button
              className="btn btn-success"
              onClick={() => editarmodalexperiencia()}
            >
              Guardar
            </button>
            <button
              className="btn btn-danger"
              onClick={cerrarModalAgregarExperiencia}
            >
              Cancelar
            </button>
          </div>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={ModalAgregarHabilidades}
        toggle={cerrarModalAgregarExperiencia}
        className="modal-floating"
      >
        <ModalHeader>{modalTitulo}</ModalHeader>
        <ModalBody>
          <Table className="form-tabla">
            {formHabilidades.Habilidades.Programacion.map(
              (habilidad, index) => (
                <tr key={index}>
                  <td>
                    <div className="form-item">
                      <label>Habilidad:</label>
                      <input
                        className="form-control"
                        type="text"
                        value={habilidad.Titulo}
                        onChange={(e) =>
                          // Actualizar el valor del título de la habilidad
                          setFormHabilidades((prevFormHabilidades) => {
                            const updatedHabilidades = {
                              ...prevFormHabilidades,
                            };
                            updatedHabilidades.Habilidades.Programacion[
                              index
                            ].Titulo = e.target.value;
                            return updatedHabilidades;
                          })
                        }
                      />
                    </div>
                  </td>
                  <td>
                    <div className="form-item">
                      <label>Porcentaje:</label>
                      <input
                        className="form-control"
                        type="text"
                        value={habilidad.Porcentaje}
                        onChange={(e) =>
                          // Actualizar el valor del título de la habilidad
                          setFormHabilidades((prevFormHabilidades) => {
                            const updatedHabilidades = {
                              ...prevFormHabilidades,
                            };
                            updatedHabilidades.Habilidades.Programacion[
                              index
                            ].Porcentaje = e.target.value;
                            return updatedHabilidades;
                          })
                        }
                      />
                    </div>
                  </td>
                </tr>
              )
            )}
          </Table>
        </ModalBody>
        <ModalFooter>
          <div style={{ textAlign: "center" }}>
            <button
              className="btn btn-success"
              onClick={() => editarmodalexperiencia()}
            >
              Guardar
            </button>
            <button
              className="btn btn-danger"
              onClick={cerrarModalAgregarExperiencia}
            >
              Cancelar
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </section>
  );
}

export default Empleados;
