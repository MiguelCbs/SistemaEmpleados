import React, { useEffect, useState } from "react";
import "../styles.css";
import {Link} from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

const apiurl = "http://191.96.145.59:8000";

function Home({ currentRotation, handlePrevClick, handleNextClick, images }) {
    const [empleados, setEmpleados] = useState([]);
    const [datosCargados, setDatosCargados] = useState(false);
    
    const menuIcon = document.querySelector("#menu-icon");
    const navbar = document.querySelector(".navbar");
  
    if (menuIcon) {
      menuIcon.onclick = () => {
        menuIcon.classList.toggle("bx-x");
        navbar.classList.toggle("active");
      };
    }
  
    let sections = document.querySelectorAll("section");
    let navLinks = document.querySelectorAll("header nav a");
  
    window.onscroll = () => {
      sections.forEach((sec) => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 100;
        let height = sec.offsetHeight;
        let id = sec.getAttribute("id");
  
        if (top >= offset && top < offset) {
          navLinks.forEach((links) => {
            links.classList.remove("active");
            document
              .querySelector("header nav a[href*=" + id + "]")
              .classList.add("active");
          });
        }
      });
  
      let header = document.querySelector("header");
  
      header.classList.toggle("sticky", window.scrollY > 100);
    };
  
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
          setDatosCargados(true);
        });
    };
  
    useEffect(() => {
      cargarEmpleadosBD();
    }, []);
  
    /*Espacio para load*/
  
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
  
    return (
      <section className="home" id="home">
        <div className="home-content">
          <div className="gallery-container">
            <div className="box">
              {empleados.map((empleado, index) => (
                <div
                  className={`card ${index === 0 ? "active" : ""}`}
                  key={index}
                  style={{
                    transform: `rotateY(${
                      currentRotation + (360 / images.length) * index
                    }deg) translateZ(300px)`,
                  }}
                >
                  <img src={empleado.Fotografia} alt={` ${index + 1}`} />
                  <Link
                    to={`/Personal/${empleado._id}`}
                    className="btn-direction"
                  >
                    Ver
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="button-container">
            <div className="button prev" onClick={handlePrevClick}></div>
            <div className="button next" onClick={handleNextClick}></div>
          </div>
        </div>
      </section>
    );
  }

  export default Home;