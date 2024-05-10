import React, { useEffect, useState } from "react";
import "./styles.css";
import { Route, Link, Routes, useNavigate, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Personal from "./components/Personal";
import Organigrama from "./components/Organigrama";
import Login from "./components/Login";
import Empleados from "./components/Empleados";
import "react-datepicker/dist/react-datepicker.css";
import { Switch } from "@mui/material";
function App() {
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Asumiendo que esto se maneja correctamente
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  
//Se introduce un estado para rastrear si la verificación de auntenticación aún esta en progreso...
//...cuando se comprueba que el usuario esta auntenticado se renderiza o redirige el componente de la ruta
  const ProtectedRoute = ({ component: Component, ...rest }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthChecking, setIsAuthChecking] = useState(true);
  
    useEffect(() => {
      const verifyAuth = async () => {
        const token = localStorage.getItem('access_token');
        setIsAuthenticated(!!token);
        setIsAuthChecking(false);
      };
      verifyAuth();
    }, []);
  
    if (isAuthChecking) {
      return <div>Loading...</div>;
    }
    console.log("Autenticado:", isAuthenticated);
    return isAuthenticated ? <Component {...rest} /> : <Navigate to="/" />;
  };

useEffect(() => {
  const token = localStorage.getItem('access_token');
  setIsAuthenticated(!!token);
}, []);
  const images = [
    "/static/img/img1.jpg",
    "/static/img/img2.jpg",
    "/static/img/img3.jpg",
    "/static/img/img4.jpg",
    "/static/img/img5.jpg",
    "/static/img/img6.jpg",
  ];
  //Display control 2
  useEffect(() => {
    const menuIcon = document.querySelector("#menu-icon");
    const navbar = document.querySelector(".navbar");
    if (menuIcon) {
      menuIcon.onclick = () => {
        menuIcon.classList.toggle("bx-x");
        navbar.classList.toggle("active");
      };
    }
  }, []);

  //Display control
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

  function handlePrevClick() {
    setCurrentRotation(currentRotation + 360 / images.length);
  }

  function handleNextClick() {
    setCurrentRotation(currentRotation - 360 / images.length);
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token'); // Eliminar el token del almacenamiento local
    setIsAuthenticated(false); // Actualizar el estado de autenticación a falso
    navigate('/Login'); // Redirigir al usuario a la página de login
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

return (
  <div className="App">
    <header className="header">
      <Link to="/Home" className="logo">
        Cibercom
      </Link>
      <div>
      <div  id="menu-icon"color="var(--text-color)" className="bx bx-menu"></div>
      </div>
      {isAuthenticated && (
      <nav className="navbar">
        <Link to="/Home" className="active">
          Home
        </Link>
        <Link to="/Organigrama">Organigrama</Link>
        <Link to="/Empleados">Empleados</Link>
        
         
        {isAuthenticated ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <Link to="/Login">Login</Link>
      )}

        <span class="active-nav"></span>
      </nav>
      )}
    </header>

    <Routes>
      <Route path="/Login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/Home" element={
          <Home
            currentRotation={currentRotation}
            handlePrevClick={handlePrevClick}
            handleNextClick={handleNextClick}
            images={images}
          />
        }/>
      <Route path="/Organigrama" element={<ProtectedRoute isAuthenticated={isAuthenticated} component={Organigrama} />} />
      <Route path="/Empleados" element={<ProtectedRoute isAuthenticated={isAuthenticated} component={Empleados} />} />
      <Route path="/Personal/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated} component={Personal} />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/Home" : "/Login"} replace />} />
    </Routes>

    <footer className="footer">
      <div className="footer-text">
        <p>Copyright &copy; 2023 by Cibercom | All Rights Reserved.</p>
      </div>
      <div className="footer-iconTop">
        <a href="#top" onClick={scrollToTop}>
          <box-icon name="up-arrow-alt"></box-icon>
        </a>
      </div>
    </footer>
    <script src="./js/script.js"></script>
  </div>
);
}
export default App;