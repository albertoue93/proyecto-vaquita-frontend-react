import React , { Component } from 'react'
import {Table} from 'reactstrap'
import axios from "axios";

export default class FincaV extends Component {
    constructor(props){
        super(props);
        this.state = {
            fincas: [],
            noDataFound: "",
        }
        
    }

    componentDidMount() {
        this.getFincas();
      }   

    getFincas() {
        axios({
            method: 'GET',
            url: `http://localhost:8000/api/fincasV`
        })
    .then((response) => {
        if (response.status === 200) {
        this.setState({
            fincas: response.data.data ? response.data.data : [],
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
    
  render() {
    const { noDataFound, fincas} = this.state;
      let fincasDetails = [];
      if (fincas.length) {
        fincasDetails = fincas.map((finca) => {
          return (
            <tr key={finca.id}>
                <td>{finca.id}</td>
              <td>{finca.nombreFinca}</td>
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
           <h4 className="font-weight-bold">Listado de Fincas</h4> 
        <Table bordered size="sm" responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
            </tr>
          </thead>
          {fincas.length === 0 ? (
            <tbody>
              <h3>{noDataFound}</h3>
            </tbody>
          ) : (
            <tbody>{fincasDetails}</tbody>
          )}
        </Table>
      </div>
    );
  }
}