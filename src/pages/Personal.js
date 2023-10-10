import React, { useState } from 'react';
import '../styles.css'; // Importa el archivo de estilos

const Personal = () => {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpinClick = () => {
    setIsSpinning(!isSpinning);
  };

  const employeeData = {
    nombre: 'Juan Perez',
    telefono: '123-456-7890',
    direccion: '123 Calle Principal, Ciudad',
    titulo: 'Ingeniero de Software',
    proyectoActivo: 'Proyecto ABC',
    salario: 75000,
    fechaContratacion: '01/01/2020',
  };

  const profilePictureStyle = {
    position: 'relative',
    width: '180px',
    height: '180px',
    borderRadius: '70%',
    marginBottom: '10px',
    marginTop: '50px',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
    boxShadow: `0 0 0 .2rem #081b29, 0 0 0 0.4rem #02a2e7`,
  };

  return (
    <div className={`employee-profile ${isSpinning ? 'is-spinning' : ''}`}>
      <div className="profile-picture">
        <img src="/static/img/img1.jpg" alt="Foto de perfil" style={profilePictureStyle} />
      </div>
      <div className="employee-info">
        <div className="personal-info">
          <h1>Información Personal</h1>
          <p><strong>Nombre:</strong> {employeeData.nombre}</p>
          <p><strong>Teléfono:</strong> {employeeData.telefono}</p>
          <p><strong>Dirección:</strong> {employeeData.direccion}</p>
        </div>
        <div className="professional-info">
          <h1>Información Profesional</h1>
          <p><strong>Título Universitario:</strong> {employeeData.titulo}</p>
          <p><strong>Proyecto Activo:</strong> {employeeData.proyectoActivo}</p>
          <p><strong>Salario:</strong> ${employeeData.salario}</p>
          <p><strong>Fecha de Contratación:</strong> {employeeData.fechaContratacion}</p>
        </div>
      </div>
    </div>
  );
};

export default Personal;