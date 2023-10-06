import React, { Component } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url="https://localhost:44302/api/empleado/";

class Empleados extends Component {
state={
  data:[],
  modalInsertar: false,
  modalEliminar: false,
  form:{
    id: '',
    nombre: '',
    apellidoPat: '',
    apellidoMat: '',
    fecNacimiento: '',
    fotografia: ''
  }
}

peticionGet=()=>{
axios.get(url).then(response=>{
  this.setState({data: response.data});
}).catch(error=>{
  console.log(error.message);
})
}

peticionPost=async()=>{
  delete this.state.form.id;
 await axios.post(url,this.state.form).then(response=>{
    this.modalInsertar();
    this.peticionGet();
  }).catch(error=>{
    console.log(error.message);
  })
}

peticionPut=()=>{
  axios.put(url+this.state.form.id, this.state.form).then(response=>{
    this.modalInsertar();
    this.peticionGet();
  })
}

peticionDelete=()=>{
  axios.delete(url+this.state.form.id).then(response=>{
    this.setState({modalEliminar: false});
    this.peticionGet();
  })
}

modalInsertar=()=>{
  this.setState({modalInsertar: !this.state.modalInsertar});
}

seleccionarEmpresa=(empleado)=>{
  this.setState({
    tipoModal: 'actualizar',
    form: {
      id: empleado.id,
      nombre: empleado.nombre,
      apellidoPat: empleado.apellidoPat,
      apellidoMat: empleado.apellidoMat,
      fecNacimiento: empleado.fecNacimiento,
      fotografia: empleado.fotografia
    }
  })
}

handleChange=async e=>{
e.persist();
await this.setState({
  form:{
    ...this.state.form,
    [e.target.name]: e.target.value
  }
});
console.log(this.state.form);
}

  componentDidMount() {
    this.peticionGet();
  }
  

  render(){
    const {form}=this.state;
  return (
    <div className="Empleados">
    <br /><br /><br />
  <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Empleado</button>
  <br /><br />
    <table className="table ">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido Paterno</th>
          <th>Apellido Materno</th>
          <th>Fecha de Nacimiento</th>
          <th>Fotografía</th>
        </tr>
      </thead>
      <tbody>
        {this.state.data.map(empleado=>{
          return(
            <tr>
          <td>{empleado.id}</td>
          <td>{empleado.nombre}</td>
          <td>{empleado.apellidoPat}</td>
          <td>{empleado.apellidoMat}</td>
          <td>{empleado.fecNacimiento}</td>
          <td>{empleado.fotografia}</td>
          <td>{new Intl.NumberFormat("en-EN").format(empleado.telefono)}</td>
          <td>
                <button className="btn btn-primary" onClick={()=>{this.seleccionarEmpresa(empleado); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                {"   "}
                <button className="btn btn-danger" onClick={()=>{this.seleccionarEmpresa(empleado); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                </td>
          </tr>
          )
        })}
      </tbody>
    </table>



    <Modal isOpen={this.state.modalInsertar}>
                <ModalHeader style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                    <label htmlFor="id">ID</label>
                    <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form?form.id: this.state.data.length+1}/>
                    <br />
                    <label htmlFor="nombre">Nombre</label>
                    <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form?form.nombre: ''}/>
                    <br />
                    <label htmlFor="apellidoPat">Apellido Paterno</label>
                    <input className="form-control" type="text" name="apellidoPat" id="apellidoPat" onChange={this.handleChange} value={form?form.apellidoPat: ''}/>
                    <br />
                    <label htmlFor="apellidoMat">Apellido Materno</label>
                    <input className="form-control" type="text" name="apellidoMat" id="apellidoMat" onChange={this.handleChange} value={form?form.apellidoMat:''}/>
                    <label htmlFor="fecNacimiento">Fecha de Nacimiento</label>
                    <input className="form-control" type="text" name="fecNacimiento" id="fecNacimiento" onChange={this.handleChange} value={form?form.fecNacimiento:''}/>
                    <label htmlFor="fotografia">Fotografía</label>
                    <input className="form-control" type="file" name="fotografia" id="fotografia" onChange={this.handleFileUpload} accept="image/*"/>                   
                  </div>
                </ModalBody>

                <ModalFooter>
                  {this.state.tipoModal==='insertar'?
                    <button className="btn btn-success" onClick={()=>this.peticionPost()}>
                    Insertar
                  </button>: <button className="btn btn-primary" onClick={()=>this.peticionPut()}>
                    Actualizar
                  </button>
  }
                    <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
                </ModalFooter>
          </Modal>


          <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
               Estás seguro que deseas eliminar a este usuario? {form && form.nombre}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
              <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
            </ModalFooter>
          </Modal>
  </div>



  );
}
}
export default Empleados;