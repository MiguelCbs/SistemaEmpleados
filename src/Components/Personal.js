import React, { useEffect, useState } from "react";
import "../styles.css";
import { CiFacebook, CiLinkedin, CiYoutube } from "react-icons/ci";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { useFilePicker } from "use-file-picker";
import { useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import { FileAmountLimitValidator } from "use-file-picker/validators";

const apiurl = "http://191.96.145.59:8000";

function Personal() {
  const { id } = useParams();
  const [empleados, setEmpleados] = useState([]);
  const [datosCargados, setDatosCargados] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [EducacionCargada, setEducacionCargada] = useState(false);
  const [redesSocialesCargadas, setRedesSocialesCargadas] = useState(false);
  const [expedienteClinicoCargado, setExpedienteClinicoCargado] =
    useState(false);

  //Comentado por acrulizacion futura
  /*
  const [selectedOption, setSelectedOption] = useState([]);

    const [jerarquiaEmpleados, setJerarquiaEmpleados] = useState({
      name: "Jerarquía de Empleados",
      children: [],
    });

  
    const [nuevaArea, setNuevaArea] = useState("");
    const [ubicacionBotonAgregarArea, setUbicacionBotonAgregarArea] = useState(
      "Jerarquía de Empleados"
    );
    const [errorAgregarElemento, setErrorAgregarElemento] = useState("");
    const [listaAreas, setListaAreas] = useState(["Jerarquía de Empleados"]);
*/

  /*Usestate para redes sociales*/
  const [redesSociales, setRedesSociales] = useState([
    {
      redSocialSeleccionada: "",
      URLRedSocial: "",
      NombreRedSocial: "",
    },
  ]);
  /*Usestate para actualizar toda la informacion de educacion*/

  const [descripcion, setDescripcion] = useState(
    "Por favor, edita tu descripción. En la parte inferior, encontrarás un botón que te permite editar todos los formularios. Para modificar cualquier sección, simplemente haz clic en el botón correspondiente y podrás actualizar la información según tus necesidades."
  );

  const [educationItems, setEducationItems] = useState([
    {
      year: "2021 - 2022",
      title: "CIBERCOM",
      description: "Descripción de la educacion",
    },
  ]);

  const [ExperienciaItems, SetExperienciaItems] = useState([
    {
      year: "2021 - 2022",
      title: "CIBERCOM",
      description: "Descripción de la experiencia",
    },
  ]);

  const [habilidades, setHabilidades] = useState([
    { skillName: "Web Design", porcentaje: 0 },
  ]);

  /*Usestate que carga los datos del get*/
  const [Educacion, setEducacion] = useState({});

  /*Cargar los datos para Redes sociales*/

  const RedSocial = [
    { label: "Facebook", value: <CiFacebook /> },
    { label: "Instagram", value: <FaInstagram /> },
    { label: "Linkedin", value: <CiLinkedin /> },
    { label: "Youtube", value: <CiYoutube /> },
    { label: "tiktok", value: <FaTiktok /> },
  ];

  //Expediente clinico

  const [selectedFiles, setSelectedFiles] = useState([]);

  const { openFilePicker, filesContent } = useFilePicker({
    readAs: "DataURL",
    accept: "pdf/*",
    validators: [new FileAmountLimitValidator({ max: 1 })],
  });

  const opcionesTipoSangre = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const [expedienteclinico, setexpedienteclinico] = useState({
    tipoSangre: "",
    Padecimientos: "",
    NumeroSeguroSocial: "",
    Datossegurodegastos: "",
    PDFSegurodegastosmedicos: null, // Initialize as null
  });

  const descargarPDF = () => {
    const pdfData = expedienteclinico.PDFSegurodegastosmedicos;

    if (pdfData) {
      const { content, name } = pdfData;

      // Crear un Blob a partir de los datos codificados en base64
      const byteCharacters = atob(content.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Crear un enlace y simular un clic para descargar el archivo
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = name || "documento.pdf";
      link.click();
    }
  };
  const handlePDFChangeD = (fileContent) => {
    // Assuming fileContent is an object with 'content' and 'name' properties
    setexpedienteclinico((prev) => ({
      ...prev,
      PDFSegurodegastosmedicos: fileContent,
    }));
  };

  useEffect(() => {
    if (filesContent && filesContent.length > 0) {
      const fileContent = filesContent[0];

      handlePDFChangeD(fileContent);
    }
  }, [filesContent]);

  /*Logica RH*/

  const [RH, setRH] = useState({
    Puesto: "",
    JefeInmediato: "",
    HorarioLaboral: {
      HoraEntrada: "",
      HoraSalida: "",
      TiempoComida: "",
      DiasTrabajados: "",
    },
    ExpedienteDigitalPDF: null,
    empleadoid: id,
  });

  const [nuevoElemento, setNuevoElemento] = useState({
    name: "",
    attributes: { Cargo: RH.Puesto },
    selectedArea: "Jerarquía de Empleados",
  });

  //Comentado por acrulizacion futura
  /*
  const guardarJerarquia = () => {
    // Realizar la solicitud POST para guardar la jerarquía
    fetch(`${apiurl}/jerarquia`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jerarquiaEmpleados), // Enviar jerarquiaEmpleados directamente
    })
      .then((response) => response.json())
  };


  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
    setRH((prevRH) => ({
      ...prevRH,
      Puesto: "",
    }));
  };


  const agregarNuevoElemento = () => {

  
    const nuevaJerarquia = { ...jerarquiaEmpleados };
    const areaSeleccionada = buscarArea(
      nuevaJerarquia,
      nuevoElemento.selectedArea
    );
  
    if (!areaSeleccionada) {
      setErrorAgregarElemento("Área no encontrada.");
      return;
    }
  
    if (!areaSeleccionada.children) {
      areaSeleccionada.children = [];
    }
  
    // Modificar para obtener nombre y apellidos
    const nombreCompleto = `${empleadoEncontrado.Nombre} ${empleadoEncontrado.ApelPaterno} ${empleadoEncontrado.ApelMaterno}`;
  
    // Agregar un nodo con la propiedad adicional linkVariable
    areaSeleccionada.children.push({
      name: nombreCompleto,
      attributes: { Cargo: RH.Puesto },
      children: [],
    });
  
    setJerarquiaEmpleados(nuevaJerarquia);
    setNuevoElemento({
      name: "",
      attributes: { Cargo: "" },
      selectedArea: nuevoElemento.selectedArea,
    });
    setErrorAgregarElemento("");
    guardarJerarquia(); // Mover la llamada aquí después de realizar cambios
  }; 
 
  const buscarArea = (arbol, areaPrincipal) => {
    if (arbol.name === areaPrincipal) {
      return arbol;
    }

    if (arbol.children) {
      for (const subarea of arbol.children) {
        const resultado = buscarArea(subarea, areaPrincipal);
        if (resultado) {
          return resultado;
        }
      }
    }

    return null;
  };
*/
  const { openFilePicker: openRHPicker, filesContent: RHFilesContent } =
    useFilePicker({
      readAs: "DataURL",
      accept: "pdf/*",
      validators: [new FileAmountLimitValidator({ max: 1 })],
    });

  const descargarPDFRH = () => {
    const pdfData = RH.ExpedienteDigitalPDF;

    if (pdfData) {
      const { content, name } = pdfData;

      // Create a Blob from base64-encoded data
      const byteCharacters = atob(content.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Create a link and simulate a click to download the file
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = name || "documento.pdf";
      link.click();
    }
  };
  const handlePDFChange = (fileContent) => {
    // Assuming fileContent is an object with 'content' and 'name' properties
    setRH((prev) => ({
      ...prev,
      ExpedienteDigitalPDF: fileContent,
    }));
  };

  useEffect(() => {
    console.log("RH Files Content:", RHFilesContent);

    if (RHFilesContent && RHFilesContent.length > 0) {
      const fileContent = RHFilesContent[0];
      console.log("Selected RH File Content:", fileContent);

      handlePDFChange(fileContent);
    }
  }, [RHFilesContent]);

  //Cargar los datos en base el ID de empleado con UsePrams
  const cargarEmpleadosBD = () => {
    fetch(`${apiurl}/empleados`, {
      method: "get",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setEmpleados(json);
        setDatosCargados(true); // Marcar que los datos se han cargado
      });
  };

  const [datoscontacto, setdatoscontacto] = useState({
    telefonoF: "",
    telefonoC: "",
    IDwhatsapp: "",
    IDtelegram: "",
    correo: "",
    empleadoid: id,
  });

  const [personalcontacto, setpersonalcontacto] = useState({
    parenstesco: "",
    nombreContacto: "",
    telefonoContacto: "",
    correoContacto: "",
    direccionContacto: "",
    empleadoid: id,
  });

  //Get y conexiones de los datos con los Usestate
  const cargarEducacionPorEmpleado = (empleadoId) => {
    fetch(`${apiurl}/educacion/empleado/${empleadoId}`, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error al cargar datos de educación: ${response.status}`
          );
        }
        return response.json();
      })
      .then((json) => {
        console.log("Respuesta completa del servidor:", json);

        setEducacion(json);
        setEducacionCargada(true);

        // Mover la lógica que depende del estado actualizado aquí
        if (!json || !json.Educacion || !Array.isArray(json.Educacion)) {
          console.log(
            "Los datos de educación no están en el formato esperado o no se han cargado."
          );
        } else {
          try {
            const educationItemsCopy = json.Educacion.map((item) => ({
              year: item.Fecha,
              title: item.Titulo,
              description: item.Descripcion,
            }));
            setEducationItems(educationItemsCopy);
            console.log(
              "Datos de educación mapeados a educationItems:",
              educationItemsCopy
            );
          } catch (error) {
            console.error("Error al mapear los datos de educación:", error);
          }
        }
        if (!json || !json.Experiencia || !Array.isArray(json.Experiencia)) {
          console.log(
            "Los datos de experiencia no están en el formato esperado o no se han cargado."
          );
        } else {
          try {
            const experienceItemsCopy = json.Experiencia.map((item) => ({
              year: item.Fecha,
              title: item.Titulo,
              description: item.Descripcion,
            }));
            SetExperienciaItems(experienceItemsCopy);
            console.log(
              "Datos de experiencia mapeados a experienceItems:",
              experienceItemsCopy
            );
          } catch (error) {
            console.error("Error al mapear los datos de experiencia:", error);
          }
        }

        if (
          !json ||
          !json.Habilidades ||
          !json.Habilidades.Programacion ||
          !Array.isArray(json.Habilidades.Programacion)
        ) {
          console.log(
            "Los datos de habilidades no están en el formato esperado o no se han cargado."
          );
        } else {
          try {
            const habilidadesItemsCopy = json.Habilidades.Programacion.map(
              (item) => ({
                skillName: item.Titulo,
                porcentaje: item.Porcentaje,
              })
            );

            setHabilidades(habilidadesItemsCopy);
            console.log(
              "Datos de habilidades mapeados a habilidades:",
              habilidades
            );
          } catch (error) {
            console.error("Error al mapear los datos de habilidades:", error);
          }
        }
        if (json && json.Descripcion) {
          setDescripcion(json.Descripcion);
          console.log("Descripción cargada:", json.Descripcion);
        } else {
          console.log(
            "La descripción no está en el formato esperado o no se ha cargado."
          );
        }
      })
      .catch((error) => {
        console.error("Error al cargar educación:", error);
      });
  };

  const cargarRedesSocialesPorEmpleado = (empleadoId) => {
    fetch(`${apiurl}/redsocial/empleado/${empleadoId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error al cargar datos de redes sociales: ${response.status}`
          );
        }
        return response.json();
      })
      .then((json) => {
        console.log("Respuesta completa del servidor (Redes Sociales):", json);

        if (!json || !json[0].RedesSociales) {
          console.log(
            "Los datos de redes sociales no están en el formato esperado o no se han cargado."
          );
          return;
        }

        const redesSocialesCopy = json[0].RedesSociales.map((item) => ({
          redSocialSeleccionada: item.redSocialSeleccionada,
          URLRedSocial: item.URLRedSocial,
          NombreRedSocial: item.NombreRedSocial,
        }));

        setRedesSociales(redesSocialesCopy); // Actualiza el estado con los datos mapeados
        setRedesSocialesCargadas(true);

        console.log(
          "Datos de redes sociales mapeados a redesSociales:",
          redesSocialesCopy
        );
      })
      .catch((error) => {
        console.error("Error al cargar redes sociales:", error);
      });
  };

  const cargarExpedienteClinicoPorEmpleado = (empleadoId) => {
    fetch(`${apiurl}/expedienteclinico/empleado/${empleadoId}`, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error al cargar datos de expediente clínico: ${response.status}`
          );
        }
        return response.json();
      })
      .then((json) => {
        console.log(
          "Respuesta completa del servidor (Expediente Clínico):",
          json
        );

        if (!json || !Array.isArray(json) || json.length === 0) {
          console.log(
            "Los datos de expediente clínico no están en el formato esperado o no se han cargado."
          );
          return;
        }

        const expedienteClinicoData = json[0]; // Tomar el primer objeto del array
        // Actualiza el estado con los datos del expediente clínico
        setexpedienteclinico({
          tipoSangre: expedienteClinicoData.tipoSangre,
          Padecimientos: expedienteClinicoData.Padecimientos,
          NumeroSeguroSocial: expedienteClinicoData.NumeroSeguroSocial,
          Datossegurodegastos: expedienteClinicoData.Segurodegastosmedicos,
          PDFSegurodegastosmedicos:
            expedienteClinicoData.PDFSegurodegastosmedicos || null,
        });
        setExpedienteClinicoCargado(true);

        console.log(
          "Datos de expediente clínico mapeados a expedienteClinico:",
          expedienteClinicoData
        );
      })
      .catch((error) => {
        console.error("Error al cargar expediente clínico:", error);
      });
  };

  const cargarDatosContactoPorEmpleado = (empleadoId) => {
    fetch(`${apiurl}/datoscontacto/empleado/${empleadoId}`, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error al cargar datos de contacto: ${response.status}`
          );
        }
        return response.json();
      })
      .then((json) => {
        console.log(
          "Respuesta completa del servidor (Datos de Contacto):",
          json
        );

        if (!json || !json["_id"]) {
          console.log(
            "Los datos de contacto no están en el formato esperado o no se han cargado."
          );
          return;
        }

        const datosContactoData = json; // No es necesario tratarlo como un array
        // Actualiza el estado con los datos de contacto
        setdatoscontacto({
          telefonoF: datosContactoData.TelFijo,
          telefonoC: datosContactoData.TelCelular,
          direccion: datosContactoData.Direccion,
          IDwhatsapp: datosContactoData.IdWhatsApp,
          IDtelegram: datosContactoData.IdTelegram,
          correo: datosContactoData.ListaCorreos,
          empleadoid: datosContactoData.empleadoId,
        });

        console.log(
          "Datos de contacto mapeados a datoscontacto:",
          datosContactoData
        );
      })
      .catch((error) => {
        console.error("Error al cargar datos de contacto:", error);
      });
  };

  const cargarPersonasContactoPorEmpleado = (empleadoId) => {
    fetch(`${apiurl}/personascontacto/empleado/${empleadoId}`, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error al cargar datos de personas de contacto: ${response.status}`
          );
        }
        return response.json();
      })
      .then((json) => {
        console.log(
          "Respuesta completa del servidor (Personas de Contacto):",
          json
        );

        if (!json || !Array.isArray(json) || json.length === 0) {
          console.log(
            "Los datos de personas de contacto no están en el formato esperado o no se han cargado."
          );
          return;
        }

        const personasContactoData = json[0]; // Tomar el primer objeto del array
        // Actualiza el estado con los datos de personas de contacto
        setpersonalcontacto({
          parenstesco: personasContactoData.parenstesco,
          nombreContacto: personasContactoData.nombreContacto,
          telefonoContacto: personasContactoData.telefonoContacto,
          correoContacto: personasContactoData.correoContacto,
          direccionContacto: personasContactoData.direccionContacto,
          empleadoid: personasContactoData.empleadoid,
        });

        console.log(
          "Datos de personas de contacto mapeados a personalcontacto:",
          personasContactoData
        );
      })
      .catch((error) => {
        console.error("Error al cargar personas de contacto:", error);
      });
  };

  const fetchRhDataByEmpleadoId = async (empleadoId, setRH) => {
    try {
      const response = await fetch(`${apiurl}/rh/${empleadoId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const rhData = await response.json();

      // Update the state with the retrieved Rh data
      setRH({
        Puesto: rhData.Puesto || "",
        JefeInmediato: rhData.JefeInmediato || "",
        HorarioLaboral: {
          HoraEntrada: rhData.HorarioLaboral?.HoraEntrada || "",
          HoraSalida: rhData.HorarioLaboral?.HoraSalida || "",
          TiempoComida: rhData.HorarioLaboral?.TiempoComida || "",
          DiasTrabajados: rhData.HorarioLaboral?.DiasTrabajados || "",
        },
        ExpedienteDigitalPDF: rhData.ExpedienteDigitalPDF || null,
        empleadoid: rhData.empleado_id || id, // Assuming you have a fallback value
      });

      // Handle the retrieved data here
    } catch (error) {
      console.error("Error fetching Rh Data:", error);
      // Handle error here
    }
  };
  //Comentado por acrulizacion futura
  /*
  const cargarrhpuesto =  () =>{
    fetch(`${apiurl}/rh`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Puedes incluir otras cabeceras si son necesarias
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error al obtener los datos de RH');
      }
      return response.json();
    })
    .then((data) => {
      console.log('Datos de RH:', data);
      if (data && data.length > 0 && data[0].RH && data[0].RH.Puesto) {
        setSelectedOption(data[0].RH.Puesto);
      } else {
        console.log('No se encontraron datos de RH.Puesto');
      }
    })
    .catch((error) => {
      console.error('Error de solicitud:', error.message);
    });
  };
*/

  // Llamada a la función para cargar personas de contacto al iniciar la página
  useEffect(() => {
    cargarEmpleadosBD();
    cargarEducacionPorEmpleado(id.trim());
    cargarRedesSocialesPorEmpleado(id.trim());
    cargarExpedienteClinicoPorEmpleado(id.trim());
    cargarDatosContactoPorEmpleado(id.trim());
    cargarPersonasContactoPorEmpleado(id.trim());
    fetchRhDataByEmpleadoId(id.trim(), setRH);
    // cargarrhpuesto();
  }, [id]);

  //Cargar los datos antes de iniciar la pagina
  if (setEducacionCargada) {
    if (!datosCargados) {
      return (
        <div className="loading">
          <span className="span1"></span>
          <span className="span2"></span>
          <span className="span3"></span>
          <span className="span4"></span>
        </div>
      );
    }
  } else {
    if (!datosCargados || !EducacionCargada) {
      return (
        <div className="loading">
          <span className="span1"></span>
          <span className="span2"></span>
          <span className="span3"></span>
          <span className="span4"></span>
        </div>
      );
    }
  }

  /*Funcion para añadir eduacion, experiencia y habilidades y funcion para eliminarlas*/

  //Funcion para Educacion
  const handleAddEducation = () => {
    const newEducationItem = {
      year: "2021 - 2022",
      title: "Universidad",
      description: "Descripción de la educación",
    };

    setEducationItems([...educationItems, newEducationItem]);
  };
  const handleRemoveEducation = () => {
    const updatedEducationItems = [...educationItems];
    updatedEducationItems.pop(); // Elimina el último elemento
    setEducationItems(updatedEducationItems);
  };

  //Funcion para Experiencia
  const handleAddExperience = () => {
    const newExperienceItem = {
      year: "2021 - 2022",
      title: "Título de la experiencia",
      description: "Descripción de la experiencia",
    };

    SetExperienciaItems([...ExperienciaItems, newExperienceItem]);
  };

  const handleRemoveExperience = () => {
    const updatedExperienceItems = [...ExperienciaItems];
    updatedExperienceItems.pop(); // Elimina el último elemento
    SetExperienciaItems(updatedExperienceItems);
  };

  //Funcion para skill
  const handleRemoveSkill = () => {
    const updatedHabilidades = [...habilidades];
    updatedHabilidades.pop(); // Elimina la última habilidad
    setHabilidades(updatedHabilidades);
  };

  const handleAddSkill = () => {
    const nuevaHabilidad = {
      skillName: "Nueva Habilidad",
      porcentaje: 0,
    };

    setHabilidades([...habilidades, nuevaHabilidad]);
  };

  const empleadoEncontrado = empleados.find(
    (empleado) => empleado._id === id.trim()
  );

  //Funcion para eliminar red social
  const handleDeleteSocial = (index) => {
    const updatedRedesSociales = [...redesSociales];
    updatedRedesSociales.splice(index, 1);
    setRedesSociales(updatedRedesSociales);
  };

  /*Boton de editar, este permite que el usuario edite su informacion*/
  const handleEditClick = () => {
    setIsEditing(true);
    setIsCreating(false); // Al hacer clic en "Editar", no estás creando un elemento nuevo
  };

  /*Manda los datos al POST o PUT y tambien impide que el usuario siga editando*/
  const handleSaveClick = () => {
    setIsEditing(false);

    if (filesContent.length > 0) {
      const file = filesContent[0];

      setexpedienteclinico((prev) => ({
        ...prev,
        PDFSegurodegastosmedicos: {
          name: file.name,
          content: file.content,
        },
      }));
    }

    const datosExpedienteClinico = {
      empleado_id: id.trim(),
      tipoSangre: expedienteclinico.tipoSangre,
      Padecimientos: expedienteclinico.Padecimientos,
      NumeroSeguroSocial: expedienteclinico.NumeroSeguroSocial,
      Segurodegastosmedicos: expedienteclinico.Datossegurodegastos,
      PDFSegurodegastosmedicos: expedienteclinico.PDFSegurodegastosmedicos,
    };

    if (RHFilesContent.length > 0) {
      const file = RHFilesContent[0];

      setexpedienteclinico((prev) => ({
        ...prev,
        PDFSegurodegastosmedicos: {
          name: file.name,
          content: file.content,
        },
      }));
    }

    const datosRedesSociales = {
      empleado_id: id.trim(),
      RedesSociales: redesSociales.map((redSocial) => ({
        redSocialSeleccionada: redSocial.redSocialSeleccionada,
        URLRedSocial: redSocial.URLRedSocial,
        NombreRedSocial: redSocial.NombreRedSocial,
      })),
    };
    // Obtén los datos de educación del estado
    const datosEducacion = {
      empleado_id: id.trim(),
      Descripcion: descripcion,
      Educacion: educationItems.map((item) => ({
        Fecha: item.year,
        Titulo: item.title,
        Descripcion: item.description,
      })),
      Experiencia: ExperienciaItems.map((item) => ({
        Fecha: item.year,
        Titulo: item.title,
        Descripcion: item.description,
      })),
      Habilidades: {
        Programacion: habilidades.map((habilidad) => ({
          Titulo: habilidad.skillName,
          Porcentaje: habilidad.porcentaje,
        })),
      },
    };

    const handleRedesSociales = () => {
      fetch(`${apiurl}/redsocial/empleado/${id}`, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((response) => {
          if (response.ok) {
            // Si el empleado ya tiene una entrada, realiza una solicitud PUT
            return fetch(`${apiurl}/redsocial/empleado/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(datosRedesSociales),
            });
          } else {
            // Si el empleado no tiene una entrada, realiza una solicitud POST
            return fetch(`${apiurl}/redsocial`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(datosRedesSociales),
            });
          }
        })
        .then((responseRedesSociales) => {
          if (!responseRedesSociales.ok) {
            throw new Error(
              `Error al enviar datos de redes sociales: ${responseRedesSociales.status}`
            );
          }
          return responseRedesSociales.json();
        })
        .then((dataRedesSociales) => {
          console.log(
            "Respuesta del servidor (Redes Sociales):",
            dataRedesSociales
          );
          // Resto de tu lógica para manejar la respuesta del servidor...
        })
        .catch((error) => {
          console.error(
            "Error en la solicitud POST/PUT (Redes Sociales):",
            error
          );
        });
    };

    // Lógica para manejar la educación
    const handleEducacion = () => {
      fetch(`${apiurl}/educacion/empleado/${id}`, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((responseEducacion) => {
          if (responseEducacion.ok) {
            // Si el empleado ya tiene una entrada, realiza una solicitud PUT
            return fetch(`${apiurl}/educacion/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(datosEducacion),
            });
          } else {
            // Si el empleado no tiene una entrada, realiza una solicitud POST
            return fetch(`${apiurl}/educacion`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(datosEducacion),
            });
          }
        })
        .then((responseEducacion) => responseEducacion.json())
        .then((dataEducacion) => {
          console.log("Respuesta del servidor (Educación):", dataEducacion);
        })
        .catch((error) => {
          console.error("Error en la solicitud POST/PUT (Educación):", error);
        });
    };

    const handleExpedienteClinico = () => {
      // Imprime los datos antes de la solicitud POST
      console.log(
        "Datos a enviar (Expediente Clínico):",
        datosExpedienteClinico
      );

      // Realiza una solicitud GET para verificar si ya existe un expediente clínico para el empleado
      fetch(`${apiurl}/expedienteclinico/empleado/${id}`, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((expedienteClinico) => {
          if (expedienteClinico.ok) {
            // Si el empleado ya tiene un expediente clínico, realiza una solicitud PUT
            return fetch(`${apiurl}/expedienteclinico/empleado/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(datosExpedienteClinico),
            });
          } else {
            // Si el empleado no tiene un expediente clínico, realiza una solicitud POST
            return fetch(`${apiurl}/expedienteclinico`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(datosExpedienteClinico),
            });
          }
        })
        .then((responseExpedienteClinico) => {
          if (!responseExpedienteClinico.ok) {
            throw new Error(
              `Error al enviar datos del expediente clínico: ${responseExpedienteClinico.status}`
            );
          }
          return responseExpedienteClinico.json();
        })
        .then((dataExpedienteClinico) => {
          console.log(
            "Respuesta del servidor (Expediente Clínico):",
            dataExpedienteClinico
          );
          // Resto de tu lógica para manejar la respuesta del servidor...
        })
        .catch((error) => {
          console.error(
            "Error en la solicitud POST/PUT (Expediente Clínico):",
            error
          );
          if (
            error instanceof TypeError &&
            error.message === "Failed to fetch"
          ) {
            console.error(
              "Posibles problemas de CORS o el servidor no está en ejecución."
            );
          }
        });
    };
    const handleUpdateDatosContacto = () => {
      const datosContacto = {
        empleado_id: id.trim(),
        TelFijo: datoscontacto.telefonoF,
        TelCelular: datoscontacto.telefonoC,
        IdWhatsApp: datoscontacto.IDwhatsapp,
        IdTelegram: datoscontacto.IDtelegram,
        ListaCorreos: datoscontacto.correo,
      };

      // Realiza una solicitud GET para verificar si ya existe un registro de datos de contacto para el empleado
      fetch(`${apiurl}/datoscontacto/empleado/${datosContacto.empleado_id}`, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((response) => {
          if (response.ok) {
            // Si el empleado ya tiene un registro, realiza una solicitud PUT para actualizarlo
            return fetch(
              `${apiurl}/datoscontacto/empleado/${datosContacto.empleado_id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(datosContacto),
              }
            );
          } else {
            // Si el empleado no tiene un registro, realiza una solicitud POST para crearlo
            return fetch(`${apiurl}/datoscontacto`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(datosContacto),
            });
          }
        })
        .then((responseDatosContacto) => {
          if (!responseDatosContacto.ok) {
            throw new Error(
              `Error al enviar datos de contacto: ${responseDatosContacto.status}`
            );
          }
          return responseDatosContacto.json();
        })
        .then((dataDatosContacto) => {
          console.log(
            "Respuesta del servidor (Datos de Contacto):",
            dataDatosContacto
          );
          // Resto de tu lógica para manejar la respuesta del servidor...
        })
        .catch((error) => {
          console.error(
            "Error en la solicitud POST/PUT (Datos de Contacto):",
            error
          );
          if (
            error instanceof TypeError &&
            error.message === "Failed to fetch"
          ) {
            console.error(
              "Posibles problemas de CORS o el servidor no está en ejecución."
            );
          }
        });
    };
    const handlePersonasContacto = () => {
      const datosPersonasContacto = {
        personalcontacto: {
          parenstesco: personalcontacto.parenstesco,
          nombreContacto: personalcontacto.nombreContacto,
          telefonoContacto: personalcontacto.telefonoContacto,
          correoContacto: personalcontacto.correoContacto,
          direccionContacto: personalcontacto.direccionContacto,
          empleadoid: id.trim(),
        },
      };

      // Realiza una solicitud GET para verificar si ya existe un registro de personas de contacto para el empleado
      fetch(
        `${apiurl}/personascontacto/empleado/${datosPersonasContacto.personalcontacto.empleadoid}`,
        {
          method: "GET",
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
        .then((response) => {
          if (response.ok) {
            // Si el empleado ya tiene un registro, realiza una solicitud PUT para actualizarlo
            return fetch(
              `${apiurl}/personascontacto/empleado/${datosPersonasContacto.personalcontacto.empleadoid}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(datosPersonasContacto),
              }
            );
          } else {
            // Si el empleado no tiene un registro, realiza una solicitud POST para crearlo
            return fetch(`${apiurl}/personascontacto`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(datosPersonasContacto),
            });
          }
        })
        .then((responsePersonasContacto) => {
          if (!responsePersonasContacto.ok) {
            throw new Error(
              `Error al enviar datos de personas de contacto: ${responsePersonasContacto.status}`
            );
          }
          return responsePersonasContacto.json();
        })
        .then((dataPersonasContacto) => {
          console.log(
            "Respuesta del servidor (Personas de Contacto):",
            dataPersonasContacto
          );
          // Resto de tu lógica para manejar la respuesta del servidor...
        })
        .catch((error) => {
          console.error(
            "Error en la solicitud POST/PUT (Personas de Contacto):",
            error
          );
          if (
            error instanceof TypeError &&
            error.message === "Failed to fetch"
          ) {
            console.error(
              "Posibles problemas de CORS o el servidor no está en ejecución."
            );
          }
        });
    };

    const handleRHData = () => {
      const datosRH = {
        empleado_id: id.trim(),
        Puesto: RH.Puesto,
        JefeInmediato: RH.JefeInmediato,
        HorarioLaboral: {
          HoraEntrada: RH.HorarioLaboral.HoraEntrada,
          HoraSalida: RH.HorarioLaboral.HoraSalida,
          TiempoComida: RH.HorarioLaboral.TiempoComida,
          DiasTrabajados: RH.HorarioLaboral.DiasTrabajados,
        },
        ExpedienteDigitalPDF: RH.ExpedienteDigitalPDF,
      };
      console.log("Importante", datosRH);

      // Realiza una solicitud GET para verificar si ya existe un registro RH para el empleado
      fetch(`${apiurl}/rh/${datosRH.empleado_id}`, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((response) => {
          if (response.ok) {
            // Si el empleado ya tiene un registro RH, realiza una solicitud PUT
            return fetch(`${apiurl}/rh/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(datosRH),
            });
          } else {
            // Si el empleado no tiene un registro RH, realiza una solicitud POST
            return fetch(`${apiurl}/rh`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(datosRH),
            });
          }
        })
        .then((responseRH) => {
          if (!responseRH.ok) {
            throw new Error(`Error al enviar datos RH: ${responseRH.status}`);
          }
          return responseRH.json();
        })
        .then((dataRH) => {
          console.log("Respuesta del servidor RH:", dataRH);
          // Resto de tu lógica para manejar la respuesta del servidor RH...
        })
        .catch((error) => {
          console.error("Error en la solicitud POST/PUT RH:", error);
          if (
            error instanceof TypeError &&
            error.message === "Failed to fetch"
          ) {
            console.error(
              "Posibles problemas de CORS o el servidor no está en ejecución."
            );
          }
        });
    };

    // Llamada a la función
    handleRHData();

    handlePersonasContacto();

    handleUpdateDatosContacto();

    handleRedesSociales();

    handleEducacion();

    handleExpedienteClinico();
  };

  const handleAddSocial = () => {
    setRedesSociales((prevRedesSociales) => [
      ...prevRedesSociales,
      {
        redSocialSeleccionada: "",
        URLRedSocial: "",
        NombreRedSocial: "",
      },
    ]);
  };

  /*Editar educacion, experiencia y habilidades*/

  const handleEditEducationYear = (event, index) => {
    const updatedEducationItems = [...educationItems];
    updatedEducationItems[index].year = event.target.value;
    setEducationItems(updatedEducationItems);
  };

  const handleEditEducationTitle = (event, index) => {
    const updatedItems = [...educationItems];
    updatedItems[index].title = event.target.value;
    setEducationItems(updatedItems);
  };

  const handleEditEducationDescription = (event, index) => {
    const updatedItems = [...educationItems];
    updatedItems[index].description = event.target.value;
    setEducationItems(updatedItems);
  };

  const handleEditExperienceYear = (event, index) => {
    const updatedExperienceItems = [...ExperienciaItems];
    updatedExperienceItems[index].year = event.target.value;
    SetExperienciaItems(updatedExperienceItems);
  };

  const handleEditExperienceTitle = (event, index) => {
    const updatedItems = [...ExperienciaItems];
    updatedItems[index].title = event.target.value;
    SetExperienciaItems(updatedItems);
  };

  const handleEditExperienceDescription = (event, index) => {
    const updatedItems = [...ExperienciaItems];
    updatedItems[index].description = event.target.value;
    SetExperienciaItems(updatedItems);
  };

  const handleEditSkillName = (event, index) => {
    const updatedHabilidades = [...habilidades];
    updatedHabilidades[index].skillName = event.target.value;
    setHabilidades(updatedHabilidades);
  };

  const actualizarPorcentaje = (e, index) => {
    const porcentaje = e.target.value;
    const updatedHabilidades = [...habilidades];
    updatedHabilidades[index].porcentaje = porcentaje;
    setHabilidades(updatedHabilidades);
  };

  //Actualizar expediente clinico
  const handleEditTipoSangre = (e) => {
    const updatedExpedienteclinico = { ...expedienteclinico };
    updatedExpedienteclinico.tipoSangre = e.target.value;
    setexpedienteclinico(updatedExpedienteclinico);
  };

  const handleEditPadecimientos = (e) => {
    const updatedExpedienteclinico = { ...expedienteclinico };
    updatedExpedienteclinico.Padecimientos = e.target.value;
    setexpedienteclinico(updatedExpedienteclinico);
  };

  const handleEditNumeroSeguroSocial = (e) => {
    const updatedExpedienteclinico = { ...expedienteclinico };
    updatedExpedienteclinico.NumeroSeguroSocial = e.target.value;
    setexpedienteclinico(updatedExpedienteclinico);
  };
  const handleEditsegurodegastos = (e) => {
    const updatedExpedienteclinico = { ...expedienteclinico };
    updatedExpedienteclinico.Datossegurodegastos = e.target.value;
    setexpedienteclinico(updatedExpedienteclinico);
  };

  const handleInputChangedatoscontacto = (field, value) => {
    setdatoscontacto((prevDatos) => ({
      ...prevDatos,
      [field]: value,
    }));
  };

  const handlePersonalContactoChange = (field, value) => {
    setpersonalcontacto((prevPersonalContacto) => ({
      ...prevPersonalContacto,
      [field]: value,
    }));
  };

  /*Atualizar RH*/

  const handleRHChange = (property, value) => {
    setRH((prevRH) => {
      const updatedRH = { ...prevRH };
      const properties = property.split(".");
      let currentObj = updatedRH;

      for (let i = 0; i < properties.length - 1; i++) {
        currentObj = currentObj[properties[i]];
      }

      currentObj[properties[properties.length - 1]] = value;

      return updatedRH;
    });
  };

  //Renderizado de agregar educacion y experiencia
  const renderDescription = () => {
    return (
      <div>
        {isEditing ? (
          <TextareaAutosize
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)} // Update the descripcion state
            className="EditarPersonal"
          />
        ) : (
          <p>{descripcion}</p>
        )}
      </div>
    );
  };

  //Reenderiza educacion

  const renderEducationSection = () => {
    return (
      <div className="education-column">
        <h3 className="title">Educación</h3>
        <div className="education-box">
          {educationItems.map((item, index) => (
            <div key={index} className="education-content">
              <div className="content">
                <div className="year">
                  {isEditing ? (
                    <input
                      type="number"
                      value={parseInt(item.year)}
                      onChange={(event) =>
                        handleEditEducationYear(event, index)
                      }
                      className="EditarEducacion"
                    />
                  ) : (
                    <>
                      <i className="bx bxs-calendar"></i> {item.year}
                    </>
                  )}
                </div>
                {isEditing ? (
                  <TextareaAutosize
                    value={item.title}
                    onChange={(event) => handleEditEducationTitle(event, index)}
                    className="EditarEducacion"
                  />
                ) : (
                  <h3>{item.title}</h3>
                )}
                {isEditing ? (
                  <TextareaAutosize
                    value={item.description}
                    onChange={(event) =>
                      handleEditEducationDescription(event, index)
                    }
                    className="EditarEducacion"
                  />
                ) : (
                  <p>{item.description}</p>
                )}
              </div>
            </div>
          ))}
          {isEditing && (
            <>
              <button className="btn" onClick={handleAddEducation}>
                Agregar Educación
              </button>
              <button className="btn" onClick={handleRemoveEducation}>
                Eliminar Educación
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  /*Renderiza la experiencia*/

  const renderExperienceSection = () => {
    return (
      <div className="education-column">
        <h3 className="title">Experiencia</h3>
        <div className="education-box">
          {ExperienciaItems.map((item, index) => (
            <div key={index} className="education-content">
              <div className="content">
                <div className="year">
                  {isEditing ? (
                    <input
                      type="number"
                      value={parseInt(item.year)}
                      onChange={(event) =>
                        handleEditExperienceYear(event, index)
                      }
                      className="EditarEducacion"
                    />
                  ) : (
                    <>
                      <i className="bx bxs-calendar"></i> {item.year}
                    </>
                  )}
                </div>
                {isEditing ? (
                  <TextareaAutosize
                    value={item.title}
                    onChange={(event) =>
                      handleEditExperienceTitle(event, index)
                    }
                    className="EditarEducacion"
                  />
                ) : (
                  <h3>{item.title}</h3>
                )}
                {isEditing ? (
                  <TextareaAutosize
                    value={item.description}
                    onChange={(event) =>
                      handleEditExperienceDescription(event, index)
                    }
                    className="EditarEducacion"
                  />
                ) : (
                  <p>{item.description}</p>
                )}
              </div>
            </div>
          ))}
          {isEditing && (
            <>
              <button className="btn" onClick={handleAddExperience}>
                Agregar Experiencia
              </button>
              <button className="btn" onClick={handleRemoveExperience}>
                Eliminar Experiencia
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  //Render de habilidades
  const renderSkillSection = () => {
    return (
      <div className="skills-row">
        <div className="skills-column">
          <h2 className="title">Habilidades Profesionales</h2>

          <div className="skills-box">
            {habilidades.map((habilidad, index) => (
              <div key={index} className="skills-content">
                <div className="progress">
                  {isEditing ? (
                    <div className="edit-skill-name">
                      <label htmlFor={`skillName${index}`}>Nombre:</label>
                      <input
                        type="text"
                        id={`skillName${index}`}
                        value={habilidad.skillName}
                        onChange={(e) => handleEditSkillName(e, index)}
                        className="EditarEducacion"
                      />
                      <span id={`skillSkill${index}`}>
                        {habilidad.porcentaje}%
                      </span>
                      <div className="progress-bar-container">
                        <div
                          className="bar"
                          style={{ width: `${habilidad.porcentaje}%` }}
                        >
                          <div className="bar-overlay"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3>
                        {habilidad.skillName}{" "}
                        <span id={`skillSkill${index}`}>
                          {habilidad.porcentaje}%
                        </span>
                      </h3>
                      <div className="progress-bar-container">
                        <div
                          className="bar"
                          style={{ width: `${habilidad.porcentaje}%` }}
                        >
                          <div className="bar-overlay"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={habilidad.porcentaje}
                    className="skill-range"
                    onChange={(e) => actualizarPorcentaje(e, index)}
                    disabled={!isEditing}
                    style={{ display: isEditing ? "block" : "none" }}
                  />
                </div>
              </div>
            ))}
            {isEditing && (
              <>
                <button className="btn" onClick={handleAddSkill}>
                  Agregar Habilidad
                </button>
                <button className="btn" onClick={handleRemoveSkill}>
                  Eliminar Habilidad
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  //RenderRedsocial

  const renderRedesSociales = () => {
    return (
      <div className="redes-sociales-container">
        <div className="social-media-row">
          <h2 className="heading">Redes Sociales</h2>
          {isEditing ? (
            <div>
              {redesSociales.map((social, index) => (
                <div key={index} className="social-media-content">
                  <select
                    value={social.redSocialSeleccionada}
                    onChange={(e) => {
                      const updatedRedesSociales = [...redesSociales];
                      updatedRedesSociales[index].redSocialSeleccionada =
                        e.target.value;
                      setRedesSociales(updatedRedesSociales);
                    }}
                  >
                    <option value="">Selecciona una red social</option>
                    {RedSocial.map((option) => (
                      <option key={option.label} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <h2>URL</h2>
                  <TextareaAutosize
                    value={social.URLRedSocial}
                    onChange={(e) => {
                      const updatedRedesSociales = [...redesSociales];
                      updatedRedesSociales[index].URLRedSocial = e.target.value;
                      setRedesSociales(updatedRedesSociales);
                    }}
                    className="EditarPersonal"
                    placeholder="URL de la red social"
                  />
                  <h2>Username</h2>
                  <TextareaAutosize
                    value={social.NombreRedSocial}
                    onChange={(e) => {
                      const updatedRedesSociales = [...redesSociales];
                      updatedRedesSociales[index].NombreRedSocial =
                        e.target.value;
                      setRedesSociales(updatedRedesSociales);
                    }}
                    className="EditarPersonal"
                    placeholder="Nombre de usuario"
                  />
                  <button
                    className="post-socialmedia"
                    onClick={() => handleDeleteSocial(index)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button className="post-socialmedia" onClick={handleAddSocial}>
                Agregar red social
              </button>
            </div>
          ) : (
            <div className="redes-sociales-cont">
              {redesSociales.map((redSocial, index) => (
                <a
                  key={index}
                  href={`https://${redSocial.URLRedSocial}`}
                  className="red-social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="red-social-item">
                    {redSocial.redSocialSeleccionada && (
                      <svg
                        className="red-social-icon"
                        viewBox="0 0 10 10"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {RedSocial.find(
                          (social) =>
                            social.label === redSocial.redSocialSeleccionada
                        )?.value || "Icono no encontrado"}
                      </svg>
                    )}
                    <div className="red-social-info">
                      <p className="nombre-red-social">
                        {redSocial.NombreRedSocial}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderInfoPersonalSection = () => {
    return (
      <div className="info-column">
        <div className="info-box">
          <div className="info-content">
            <h3>Datos de Contacto</h3>
            <div className="content">
              <label>Teléfono Fijo:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={datoscontacto.telefonoF}
                  onChange={(e) =>
                    handleInputChangedatoscontacto("telefonoF", e.target.value)
                  }
                  className="EditarEducacion"
                  maxLength={11}
                  onKeyPress={(e) => {
                    if (isNaN(Number(e.key))) {
                      e.preventDefault();
                    }
                  }}
                />
              ) : (
                <p>{datoscontacto.telefonoF}</p>
              )}

              <label>Teléfono Celular (Obligatorio):</label>
              {isEditing ? (
                <input
                  type="text"
                  value={datoscontacto.telefonoC}
                  onChange={(e) =>
                    handleInputChangedatoscontacto("telefonoC", e.target.value)
                  }
                  className="EditarEducacion"
                  maxLength={11}
                  onKeyPress={(e) => {
                    if (isNaN(Number(e.key))) {
                      e.preventDefault();
                    }
                  }}
                />
              ) : (
                <p>{datoscontacto.telefonoC}</p>
              )}

              <label>ID de WhatsApp:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={datoscontacto.IDwhatsapp}
                  onChange={(e) =>
                    handleInputChangedatoscontacto("IDwhatsapp", e.target.value)
                  }
                  className="EditarEducacion"
                />
              ) : (
                <p>{datoscontacto.IDwhatsapp}</p>
              )}

              <label>ID de Telegram:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={datoscontacto.IDtelegram}
                  onChange={(e) =>
                    handleInputChangedatoscontacto("IDtelegram", e.target.value)
                  }
                  className="EditarEducacion"
                />
              ) : (
                <p>{datoscontacto.IDtelegram}</p>
              )}

              <label>Correo:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={datoscontacto.correo}
                  onChange={(e) =>
                    handleInputChangedatoscontacto("correo", e.target.value)
                  }
                  className="EditarEducacion"
                />
              ) : (
                <p>{datoscontacto.correo}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  //Render RH

  const renderRHSection = () => {
    return (
      <div className="RH-column">
        <div className="RH-box">
          <div className="RH-content">
            <div className="content">
              <label>Puesto:</label>
              {isEditing ? (
                //Comentado por acrulizacion futura
                /*
                <div>
                 <select id="puestos" value={selectedOption} onChange={handleSelectChange}>
                 <option value="existing2">Puesto Existente 2</option>
                 <option value="new">Agregar Nuevo Puesto</option>
               </select>
               */
                //{selectedOption === "new" && (
                <input
                  type="text"
                  value={RH.Puesto}
                  onChange={(e) => handleRHChange("Puesto", e.target.value)}
                />
              ) : (
                /*)}
                </div>*/
                <p>{RH.Puesto}</p>
              )}

              <label>Jefe Inmediato:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={RH.JefeInmediato}
                  onChange={(e) =>
                    handleRHChange("JefeInmediato", e.target.value)
                  }
                />
              ) : (
                <p>{RH.JefeInmediato}</p>
              )}

              <label>Hora de Entrada:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={RH.HorarioLaboral.HoraEntrada}
                  onChange={(e) =>
                    handleRHChange("HorarioLaboral.HoraEntrada", e.target.value)
                  }
                />
              ) : (
                <p>{RH.HorarioLaboral.HoraEntrada}</p>
              )}

              <label>Hora de Salida:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={RH.HorarioLaboral.HoraSalida}
                  onChange={(e) =>
                    handleRHChange("HorarioLaboral.HoraSalida", e.target.value)
                  }
                />
              ) : (
                <p>{RH.HorarioLaboral.HoraSalida}</p>
              )}

              <label>Tiempo de Comida:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={RH.HorarioLaboral.TiempoComida}
                  onChange={(e) =>
                    handleRHChange(
                      "HorarioLaboral.TiempoComida",
                      e.target.value
                    )
                  }
                />
              ) : (
                <p>{RH.HorarioLaboral.TiempoComida}</p>
              )}

              <label>Días Trabajados:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={RH.HorarioLaboral.DiasTrabajados}
                  onChange={(e) =>
                    handleRHChange(
                      "HorarioLaboral.DiasTrabajados",
                      e.target.value
                    )
                  }
                />
              ) : (
                <p>{RH.HorarioLaboral.DiasTrabajados}</p>
              )}
              {isEditing ? (
                <div className="rh-select-archivo">
                  <button onClick={openRHPicker}>
                    Seleccionar Archivo PDF (RH)
                  </button>

                  {RHFilesContent.map((file, index) => (
                    <div key={index}>
                      <p>{file.name}</p>
                      <img
                        style={{
                          width: 200,
                          height: 200,
                          marginTop: 10,
                        }}
                        alt={file.name}
                        src={file.content}
                      ></img>
                      <br />
                    </div>
                  ))}
                </div>
              ) : (
                // If not editing, display RH information
                <div className="RH-section"></div>
              )}
            </div>

            <div className="RH-archivo">
              {RH.ExpedienteDigitalPDF && (
                <>
                  <p>Nombre del PDF: {RH.ExpedienteDigitalPDF.name}</p>
                  <button onClick={descargarPDFRH}>Descargar PDF</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /*Render Personas contacto*/
  const renderPersonasContactoContent = () => {
    return (
      <div className="personasContacto-content">
        <label>Nombre de Contacto:</label>
        {isEditing ? (
          <input
            type="text"
            value={personalcontacto.nombreContacto}
            onChange={(e) =>
              handlePersonalContactoChange("nombreContacto", e.target.value)
            }
            className="EditarEducacion"
          />
        ) : (
          <p>{personalcontacto.nombreContacto}</p>
        )}

        <label>Parentesco:</label>
        {isEditing ? (
          <input
            type="text"
            value={personalcontacto.parenstesco}
            onChange={(e) =>
              handlePersonalContactoChange("parenstesco", e.target.value)
            }
            className="EditarEducacion"
          />
        ) : (
          <p>{personalcontacto.parenstesco}</p>
        )}

        <label>Número de Teléfono:</label>
        {isEditing ? (
          <input
            type="text"
            value={personalcontacto.telefonoContacto}
            onChange={(e) =>
              handlePersonalContactoChange("telefonoContacto", e.target.value)
            }
            className="EditarEducacion"
            maxLength={11}
            onKeyPress={(e) => {
              if (isNaN(Number(e.key))) {
                e.preventDefault();
              }
            }}
          />
        ) : (
          <p>{personalcontacto.telefonoContacto}</p>
        )}

        <label>Correo del Contacto:</label>
        {isEditing ? (
          <input
            type="text"
            value={personalcontacto.correoContacto}
            onChange={(e) =>
              handlePersonalContactoChange("correoContacto", e.target.value)
            }
            className="EditarEducacion"
          />
        ) : (
          <p>{personalcontacto.correoContacto}</p>
        )}

        <label>Dirección del Contacto:</label>
        {isEditing ? (
          <input
            type="text"
            value={personalcontacto.direccionContacto}
            onChange={(e) =>
              handlePersonalContactoChange("direccionContacto", e.target.value)
            }
            className="EditarEducacion"
          />
        ) : (
          <p>{personalcontacto.direccionContacto}</p>
        )}
      </div>
    );
  };

  const renderExpedienteClinicoSection = () => {
    return (
      <div className="expediente-clinico">
        <h3>Expediente Clínico</h3>
        {isEditing ? (
          <div className="content">
            <label>Tipo de Sangre:</label>
            <select
              id="tipoSangre"
              value={expedienteclinico.tipoSangre}
              onChange={handleEditTipoSangre}
            >
              <option value="">Selecciona el tipo de sangre</option>
              {opcionesTipoSangre.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
  
            <label>Padecimientos:</label>
            <TextareaAutosize
              value={expedienteclinico.Padecimientos}
              onChange={handleEditPadecimientos}
              className="EditarPersonal"
              placeholder="Padecimientos"
            />
  
            <label>Numero del seguro social:</label>
            <input
              type="text"
              value={expedienteclinico.NumeroSeguroSocial}
              onChange={handleEditNumeroSeguroSocial}
              onKeyPress={(e) => {
                if (isNaN(Number(e.key))) {
                  e.preventDefault();
                }
              }}
              className="EditarPersonal"
              placeholder="Numero del seguro social"
              maxLength={11}
            />
  
            <label>Datos del seguro de gastos medicos:</label>
            <TextareaAutosize
              value={expedienteclinico.Datossegurodegastos}
              onChange={handleEditsegurodegastos}
              className="EditarPersonal"
              placeholder="Seguro de gastos medicos mayores"
            />
  
            <div className="rh-select-archivo">
              <button onClick={openFilePicker}>
                Seleccionar Archivo PDF
              </button>
              {selectedFiles.map((file, index) => (
                <div key={index}>
                  <p>{file.name}</p>
                  <img
                    style={{
                      width: 200,
                      height: 200,
                      marginTop: 10,
                    }}
                    alt={file.name}
                    src={file.content}
                  ></img>
                  <br />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="expediente-clinico-content">
            <label>Tipo de Sangre:</label>
            <p>{expedienteclinico.tipoSangre}</p>
  
            <label>Padecimientos:</label>
            <p>{expedienteclinico.Padecimientos}</p>
  
            <label>Numero del seguro social:</label>
            <p>{expedienteclinico.NumeroSeguroSocial}</p>
  
            <label>Datos del seguro de gastos medicos:</label>
            <p>{expedienteclinico.Datossegurodegastos}</p>
  
          </div>
        )}
        <div className="Expedienteclinico-archivo">
          {expedienteclinico.PDFSegurodegastosmedicos && (
            <>
              <p>
                Nombre del PDF:
                {expedienteclinico.PDFSegurodegastosmedicos.name}
              </p>
              <button onClick={descargarPDF}>Descargar PDF</button>
            </>
          )}
        </div>
      </div>
    );
  };

  // Resto de tu código para mostrar el empleado

  return (
    <div className="Personal">
      <div className="personal-content">
        <section className="about" id="about">
          <h2 className="main-heading">
            Sobre <span>Mi</span>
          </h2>
          <div className="circle-spin"></div>
          <div className="about-img">
            <img src={empleadoEncontrado.Fotografia} alt="about" />
          </div>

          <div className="about-content">
            <div className="left-column">
              <h2 className="desc-heading">Intro</h2>
              <div className="description">
                <h3>
                  {empleadoEncontrado.Nombre} {empleadoEncontrado.ApelPaterno}{" "}
                  {empleadoEncontrado.ApelMaterno}
                </h3>
                <p>{renderDescription()}</p>
              </div>
              <div className="info-containter">
                {renderInfoPersonalSection()}
              </div>
              <div className="personasContacto">
                <h3>Personas de Contacto</h3>
                {renderPersonasContactoContent()}
              </div>
              <div className="redes-sociales-containter">
                {renderRedesSociales()}
              </div>
              <div className="expediente-clinico">
                {renderExpedienteClinicoSection()}
              </div>
            </div>
            <div className="right-column">
              <div className="content">
                <section className="education" id="education">
                  <h2 className="heading">
                    Mi <span>Trayectoria</span>
                  </h2>
                  <div className="education-row">
                    {renderEducationSection()}
                    {renderExperienceSection()}
                  </div>
                </section>

                <p>
                  <h2 className="heading">
                    Mis <span>Habilidades</span>
                  </h2>
                </p>

                <p>
                  <div className="skills-row">{renderSkillSection()}</div>
                </p>

                <div className="RH">
                  <h3>Recursos Humanos</h3>
                  <div className="RH-info">{renderRHSection()}</div>
                </div>

                <p></p>

                <div>
                  {isEditing ? (
                    <button className="btn" onClick={handleSaveClick}>
                      Guardar
                    </button>
                  ) : (
                    <button className="btn" onClick={handleEditClick}>
                      Editar
                    </button>
                  )}
                </div>
                <div className="Org-Empleado"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Personal;
