import React, { Component } from 'react';
import Alert from 'react-s-alert';
import { Table, Button } from 'reactstrap'
import axios from "axios";


export default class Historico extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animales: [],
      animalBackup:[],
      isLoading: false,
      status: "",
      noDataFound: "",
      busqueda:""
      
    }
  }

  componentDidMount() {
    axios({
        method: 'GET',
        url: `http://localhost:8000/api/animal/create`,
        headers: {
          "Authorization": "bearer " + this.props.token
        }
      })
        .then((response) => {
          if (response.status === 200) {
            this.setState({
              animales: response.data.data ? response.data.data : [],
              animalBackup: response.data.data ? response.data.data : []
            });
          }
          if (
            response.data.status === "failed" &&
            response.data.success === false
          ) {
            this.setState({
              noDataFound: response.data.message,
            });
          }
        });
    this.getAnimales();
    this.setState({ isLoading: false })
  }

  getAnimales() {
    axios({
      method: 'GET',
      url: `http://localhost:8000/api/animal/create`,
      headers: {
        "Authorization": "bearer " + this.props.token
      }
    })
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            animales: response.data.data ? response.data.data : [],
          });
        }
        if (
          response.data.status === "failed" &&
          response.data.success === false
        ) {
          this.setState({
            noDataFound: response.data.message,
          });
        }
      });
  }
  onChangeEditAnimalHanler =async (e) => {
    e.persist();
    await this.setState({busqueda: e.target.value});
    console.log(this.state.busqueda);
    this.filtrarElement();
  };
  filter(event){
    var text = event.target.value
    const data = this.state.animalBackup
    const newData = data.filter(function(item){
        const Raza = item.raza.toUpperCase()
        const Peso = item.peso.toString()
        const foto = item.foto.toUpperCase()
        const fecha = item.updated_at.toString()
        const campo = Raza+" "+Peso+" "+foto+" "+fecha
        const textData = text.toUpperCase()
        return campo.indexOf(textData) > -1
    })
    this.setState({
        animales: newData,
        busqueda: text,
    })
  }
  render() {
    const { noDataFound, animales } = this.state;
    let animalDetails = [];
    if (animales.length) {
      animalDetails = animales.map((animal, index) => {
        return (
          <tr key={index} className={(index % 2) ? "odd_col" : "even_col"}>
            <td>{animal.numeroAnimal}</td>
            <td>{animal.raza}</td>
            <td>{animal.peso} kg</td>
            <td><img width="50" alt="img" src={animal.foto} /></td>
            <td>{animal.updated_at}</td>
          </tr>
        );
      });
    }

    if (this.state.isLoading) {
      return <div className="spinner-border text-center" role="status"> <span className="sr-only">Loading...</span>
      </div>
    }
    return (
      <div className="App container mt-4">
        <h4 className="font-weight-bold">Listado de Animales Vendidos</h4>
        <div className="barraBusqueda">
        <input class="form-control col-md-4" placeholder="buscar..."  value={this.state.busqueda} onChange={(busqueda) => this.filter(busqueda)}/>
          </div>
          <br></br>
        <Table bordered size="sm" responsive>
          <thead>
            <tr>
              <th>Numero Animal</th>
              <th>Raza</th>
              <th>Peso</th>
              <th>Foto</th>
              <th>Fecha y Hora</th>
            </tr>
          </thead>
          {animales.length === 0 ? (
            <tbody>
              <h3>{}</h3>
            </tbody>
          ) : (
              <tbody>{animalDetails}</tbody>
            )}
        </Table>
      </div>
    );
  }
}