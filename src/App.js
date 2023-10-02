import Navbar from "./Navbar"
import Empleados from "./pages/Empleados"
import Home from "./pages/Home"
import About from "./pages/About"
import Personal from "./pages/Personal"
import { Route, Routes } from "react-router-dom"
import "./styles.css";

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Empleados" element={<Empleados />} />
          <Route path="/About" element={<About />} />
          <Route path="/Personal" element={<Personal/>} />
        </Routes>
      </div>
    </>
  )
}



export default App