import React,{Component} from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { FaDumpster } from 'react-icons/fa';
import axios from 'axios';

class App extends Component{
  constructor(props){
    super(props);
    this.state=({
      prestamos: [],
      pos: null,
      titulo: 'Mantenimiento',
      id: 0,
      idlibro: "",
      idusuario: "",
      fecprestamo: "",
      fecdevolucion: ""
    })
    this.cambioIdlibro = this.cambioIdlibro.bind(this);
    this.cambioIdUsuario = this.cambioIdUsuario.bind(this);
    this.cambioFecprestamo = this.cambioFecprestamo.bind(this);  
    this.cambioFecdevolucion = this.cambioFecdevolucion.bind(this);
    this.mostrar=this.mostrar.bind(this);
    this.eliminar=this.eliminar.bind(this);
    this.guardar=this.guardar.bind(this);
  }
  componentWillMount(){
    axios.get('http://127.0.0.1:8000/prestamos')
    .then(res=>{
      this.setState({prestamos: res.data})
    })
  }
  cambioIdlibro(e){
    this.setState({
      idlibro: e.target.value
    })
  }
  cambioIdUsuario(e){
    this.setState({
      idusuario: e.target.value
    })
  }
  cambioFecprestamo(e){
    this.setState({
      fecprestamo: e.target.value
    })
  }
  cambioFecdevolucion(e){
    this.setState({
      fecdevolucion: e.target.value
    })
  }
  
  mostrar(cod,index){
    axios.get('http://127.0.0.1:8000/prestamos/'+cod+'/')
    .then(res=>{
      this.setState({
        pos: index,
        titulo: 'Editar',
        id: res.data.id,
        nombre: res.data.idlibro,
        fecha: res.data.idusuario,
        rating: res.data.fecprestamo,
        categoria: res.data.fecdevolucion
      })
    })
  }
  guardar(e){
    e.preventDefault();
    let cod = this.state.id;
    let datos = {
      idlibro: this.state.idlibro,
      idusuario: this.state.idusuario,
      fecprestamo: this.state.fecprestamo,
      fecdevolucion: this.state.fecdevolucion,
    }
    if(cod>0){//Editamos un registro
      axios.put('http://127.0.0.1:8000/prestamos/'+cod+'/',datos)
      .then(res=>{
        let indx= this.state.pos;
        this.state.prestamos[indx]=res.data;
        var temp = this.state.prestamos;
        this.setState({
          pos:null,
          titulo: 'Nuevo',
          id: 0,
          idlibro: '',
          idusuario: '',
          fecprestamo: '',
          fecdevolucion: '',
          prestamos: temp
        });
      }).catch(err=>{
        console.log(err.toString());
      });
    }else{//Nuevo registro
      axios.post('http://127.0.0.1:8000/prestamos/',datos)
      .then(res=>{
        this.state.prestamos.push(res.data);
        var temp=this.state.prestamos;
        this.setState({
          id: 0,
          idlibro: '',
          idusuario: '',
          fecprestamo: '',
          fecdevolucion: '',
          prestamos: temp
        });
      }).catch(err=>{
        console.log(err.toString());
      });
    }
  }
  eliminar(cod){
    let rpta= window.confirm("Desea eliminar?");
    if(rpta){
      axios.delete('http://127.0.0.1:8000/prestamos/'+cod+'/')
      .then(res=>{
        var temp= this.state.prestamos.filter((prestamo)=>prestamo.id !== cod);
        this.setState({
          prestamos: temp
        })
      });
    }
  }
  render(){
  return (
    <div className="container mt-5">
      <h1>PRESTAMOS - LAB12</h1>
      <Table className="table table-bordered col-md-8">
        <thead className="thead bg-primary">
          <tr>
            <th>Ejemplar</th>
            <th>Libro</th>
            <th>Cliente</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {this.state.prestamos.map((prestamo,index)=>{
          return(
          <tr key={prestamo.id}>
            <td>{prestamo.id}</td>
            <td>{prestamo.idlibro.titulo}</td>
            <td>{prestamo.idusuario.nombre}</td>
            <td>{prestamo.fecprestamo}</td>
            <td>{prestamo.fecdevolucion}</td>
            <td className="d-flex justify-content-center"><Button className="btn btn-success" 
                onClick={()=>this.mostrar(prestamo.id,index)}>Editar</Button></td>
            <td><Button className="btn btn-danger" 
            onClick={()=>this.eliminar(prestamo.id)}><FaDumpster/></Button></td>
          </tr>
          );
        })}
        </tbody>
      </Table>
      <hr/>   
      <div className="card col-md-6">
        <div className="card-header">
        <h4>{this.state.titulo}</h4>
        </div>
      <form onSubmit={this.guardar}>
        <table className="table">
        <input type="hidden" value={this.state.id}/>
        <tr>
          <td>Ingrese Libro:</td>
          <td><input type="number" value={this.state.idlibro} onChange={this.cambioIdlibro}/></td>
        </tr>
        <tr>
        <td>
          Ingrese Usuario:</td>
          <td><input type="number" value={this.state.idusuario} onChange={this.cambioIdUsuario}/>
        </td>
        </tr>
      
      <tr>
        <td>
          Fecha de prestamo:</td>
          <td><input type="text" value={this.state.fecprestamo} onChange={this.cambioFecprestamo}/>
        </td>
        </tr>
        <tr>
        <td>
          Fecha de devolucion:</td>
          <td><input type="text" value={this.state.fecdevolucion} onChange={this.cambioFecdevolucion}/>
        </td>
        </tr>
        <td><input type="submit" className="btn btn-info"/></td>
        </table>
      </form>
      </div> 
    </div>
  )
  };
}

export default App;
