import React, { useEffect, useState } from "react";
import "./styles.css";
import { Route, Link, Routes, useNavigate, Navigate } from "react-router-dom";
import Home from "./Components/Home";
import Personal from "./Components/Personal";
import Organigrama from "./Components/Organigrama";
import Login from "./Components/Login";
import Empleados from "./Components/Empleados";
import "react-datepicker/dist/react-datepicker.css";
import { Switch } from "@mui/material";


function App() {
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Asumiendo que esto se maneja correctamente
  const navigate = useNavigate();
  const [message, setMessage] = useState('');


const ProtectedRoute = ({ isAuthenticated, component: Component, ...rest }) => {
  console.log("Autenticado:", isAuthenticated);
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/" />;
};


  const images = [
    "/static/img/img1.jpg",
    "/static/img/img2.jpg",
    "/static/img/img3.jpg",
    "/static/img/img4.jpg",
    "/static/img/img5.jpg",
    "/static/img/img6.jpg",
  ];
  //Display control 2
 



  function handlePrevClick() {
    setCurrentRotation(currentRotation + 360 / images.length);
  }

  function handleNextClick() {
    setCurrentRotation(currentRotation - 360 / images.length);
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
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
    <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
    {isAuthenticated && (
    <>
    <Route path="/Home" element={
          <Home
            currentRotation={currentRotation}
            handlePrevClick={handlePrevClick}
            handleNextClick={handleNextClick}
            images={images}
          />
        }/>
      <Route path="/Organigrama" element={<Organigrama />}/>
      <Route path="/Empleados" element={<Empleados />} />
      <Route path="/Personal/:id" element={<Personal />} /> {}
      </>
      )}
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>

    <footer className="footer">
        <div className="footer-text">
          <p>Copyright &copy; 2023 by Cibercom | All Rights Reserved.</p>
        </div>
        <div className="footer-iconTop">
          <a href="/">
            <box-icon name="up-arrow-alt"></box-icon>
          </a>
        </div>
      </footer>
    </div>
  );
}
export default App;