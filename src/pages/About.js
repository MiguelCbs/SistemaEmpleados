import React from 'react';
import Tree from 'react-d3-tree';

const jerarquiaEmpleados = {
  name: 'Jerarquía de Empleados',
  children: [
    {
      name: 'Jefe de Departamento',
      children: [
        { name: 'Juan Pérez', cargo: 'Gerente de Ventas' },
        { name: 'María Rodríguez', cargo: 'Gerente de Marketing' },
        // Otros empleados del Jefe de Departamento
      ],
    },
    {
      name: 'Gerentes',
      children: [
        { name: 'Carlos Sánchez', cargo: 'Gerente de Desarrollo' },
        { name: 'Laura González', cargo: 'Gerente de Recursos Humanos' },
        // Otros empleados de Gerentes
      ],
    },
    {
      name: 'Empleados',
      children: [
        { name: 'Roberto Torres', cargo: 'Analista de Datos' },
        { name: 'Sofía Fernández', cargo: 'Diseñador Gráfico' },
        // Otros empleados de Empleados
      ],
    },
  ],
};

function About() {
  return (
    <div className="App">
      <h1>Organigrama</h1>
      <div style={{ width: '100%', height: '400px' }}>
        <Tree data={jerarquiaEmpleados} orientation="vertical" />
      </div>
    </div>
  );
}

export default About;