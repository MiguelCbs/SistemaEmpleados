import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importa el componente Link de React Router

function Home() {
  const [currentRotation, setCurrentRotation] = useState(0);
  const images = [
    "/static/img/img1.jpg",
    "/static/img/img2.jpg",
    "/static/img/img3.jpg",
    "/static/img/img4.jpg",
    "/static/img/img5.jpg",
    "/static/img/img6.jpg",
  ];

  function handlePrevClick() {
    setCurrentRotation(currentRotation + (360 / images.length));
  }

  function handleNextClick() {
    setCurrentRotation(currentRotation - (360 / images.length));
  }

  return (
    <div className="app">
      <div className="gallery-container">
        <div className="box">
          {images.map((image, index) => (
            <div
              className={`card ${index === 0 ? 'active' : ''}`}
              key={index}
              style={{
                transform: `rotateY(${currentRotation + (360 / images.length) * index}deg) translateZ(300px)`,
              }}
            >
              <img src={image} alt={`Image ${index + 1}`} />
              {/* Agrega un botón Link que redirige a otra página */}
              <Link to={`/Personal`} className="boton-redireccion">
                Ver
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="button-container">
        <div className="btn prev" onClick={handlePrevClick}></div>
        <div className="btn next" onClick={handleNextClick}></div>
      </div>
    </div>
  );
}

export default Home;