import React, { useEffect, useState } from "react";
import "../styles.css";
import Tree from "react-d3-tree";

const apiurl = "http://localhost:3000";

function Organigrama() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [jerarquiaEmpleados, setJerarquiaEmpleados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (loading) {
      cargarJerarquiaEmpleados();
    }
  }, [loading]);

  const cargarJerarquiaEmpleados = () => {
    fetch(`${apiurl}/jerarquia`, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json && json.jerarquia) {
          setJerarquiaEmpleados(json.jerarquia);
        } else {
          console.error("La jerarquía de empleados está vacía.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar la jerarquía:", error);
        setLoading(false);
      });
  };

  const translateX = windowWidth / 2.5;
  const translateY = 80;

  const separation =
    windowWidth < 768
      ? { siblings: 1.1, nonSiblings: 1.4 }
      : { siblings: 2, nonSiblings: 1.6 };
  const scaleExtent =
    windowWidth < 768 ? { min: 0.5, max: 0.7 } : { min: 1.5, max: 4 };

  const uniqueNodes = (nodes) => {
    const nodeSet = new Set();
    const uniqueNodesArray = [];
    nodes.forEach((node) => {
      if (!nodeSet.has(node.name)) {
        uniqueNodesArray.push(node);
        nodeSet.add(node.name);
      }
    });
    return uniqueNodesArray;
  };

  return (
    <section className="organigrama" id="organigrama">
      <div>
        <div className="Org-Empleado">
          <h3>Organigrama</h3>
        </div>
        <div className="organigrama-container">
          {jerarquiaEmpleados && (
            <Tree
              data={{ ...jerarquiaEmpleados, children: uniqueNodes(jerarquiaEmpleados.children) }}
              orientation="vertical"
              collapsible={true}
              separation={separation}
              translate={{ x: translateX, y: translateY }}
              scaleExtent={scaleExtent}
              initialDepth={2}
              nodeLabelComponent={{
                render: <CustomNodeLabel />,
                foreignObjectWrapper: {
                  y: 24,
                  x: -10,
                  width: 200,
                  height: 50,
                },
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

const CustomNodeLabel = ({ nodeData }) => {
  return (
    <div>
      <div>{nodeData.name}</div>
      <div>Cargo: {nodeData.attributes.Cargo}</div>
    </div>
  );
};

export default Organigrama;
