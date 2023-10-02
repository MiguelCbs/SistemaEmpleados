import React from 'react';
import Tree from 'react-d3-tree';

// Definimos una función para crear un enlace
function createLink(name, link) {
  return (
    <a href={link} key={name}>
      {name}
    </a>
  );
}

const jerarquiaEmpleados = {
  name: createLink('Jerarquía de Empleados'),
  children: [
    {
      name: createLink('Jefe de Departamento'),
      children: [
        {
          name: createLink('Juan Pérez', '/Personal'),
          attributes: { Cargo: 'Gerente de Ventas' },
          _collapsed: true,
        },
        {
          name: createLink('María Rodríguez', '/Personal'),
          attributes: { Cargo: 'Gerente de Marketing' },
          _collapsed: true,
        },
        
      ],
    },
    {
      name: createLink('Gerentes'),
      children: [
        {
          name: createLink('Carlos Sánchez', '/Personal'),
          attributes: { Cargo: 'Gerente de Desarrollo' },
          _collapsed: true,
        },
        {
          name: createLink('Laura González', '/Personal'),
          attributes: { Cargo: 'Gerente de Recursos Humanos' },
          _collapsed: true,
        },
        
      ],
    },
    {
      name: createLink('Empleados'),
      children: [
        {
          name: createLink('Roberto Torres', '/Personal'),
          attributes: { Cargo: 'Analista de Datos' },
          _collapsed: true,
        },
        {
          name: createLink('Sofía Fernández', '/Personal'),
          attributes: { Cargo: 'Diseñador Gráfico' },
          _collapsed: true,
        },
        
      ],
    },
  ],
};

function About() {
  return (
    <div className="App">
      <h1>Organigrama</h1>
      <div style={{ width: '100%', height: '400px' }}>
        <Tree
          data={jerarquiaEmpleados}
          orientation="vertical"
          collapsible={true}
          separation={{
            siblings: 2,
            nonSiblings: 2.5,
          }}
        />
      </div>
    </div>
  );
}

export default About;