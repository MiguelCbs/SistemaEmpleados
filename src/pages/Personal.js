import React, { useState } from 'react'

const Personal = () => {
    const [isSpinning, setIsSpinning] = useState(false);
  
    const handleSpinClick = () => {
      setIsSpinning(!isSpinning);
    };
  
  // Supongamos que tienes un objeto con los datos del empleado
  
  
  const employeeData = {
    nombre: 'Juan Perez',
    telefono: '123-456-7890',
    direccion: '123 Calle Principal, Ciudad',
    titulo: 'Ingeniero de Software',
    proyectoActivo: 'Proyecto ABC',
    salario: 75000, // Supongamos que el salario se proporciona como un número
    fechaContratacion: '01/01/2020',
    // Puedes agregar más campos según tus necesidades
  };



  return (
    <div className="employee-profile">
      <div className="profile-picture">
        {/* Supongamos que tienes una URL de la imagen del empleado */}
        <img src="/static/img/img1.jpg" alt="Foto de perfil" />
      </div>
      <div className="employee-info">
        <h1>{employeeData.nombre}</h1>
        <p><strong>Teléfono:</strong> {employeeData.telefono}</p>
        <p><strong>Dirección:</strong> {employeeData.direccion}</p>
        <p><strong>Título Universitario:</strong> {employeeData.titulo}</p>
        <p><strong>Proyecto Activo:</strong> {employeeData.proyectoActivo}</p>
        <p><strong>Salario:</strong> ${employeeData.salario}</p>
        <p><strong>Fecha de Contratación:</strong> {employeeData.fechaContratacion}</p>
      </div>
      {/* Aquí puedes agregar componentes o gráficos para representar el salario */}
    </div>
  );

};

export default Personal;