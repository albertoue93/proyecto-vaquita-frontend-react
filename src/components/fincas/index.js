import React , { Component } from 'react'
import {Table, Button} from 'reactstrap'
import axios from "axios";
import AddFinca from './addFincas'

export default class Finca extends Component {
    constructor(props){
        super(props);
        this.state = {
            fincas: [],
        }
    }

    componentDidMount() {
        axios({
            method: 'GET',
            url: `http://localhost:8000/api/fincas`,
            headers: {
                "Authorization": "bearer "+localStorage.getItem('jwt')
            }
        })
        .then((response) => {
            if(response.status === 200){
                this.setState({
                    fincas: response.data.data ? response.data.data : [],
                });
                {
                    if(response.data.status === "failed" && response.data.success === false){
                        this.setState({
                            noDataFound : response.data.message,
                        });
                    }
                }
            }
        });
    }


    render() {
        const { noDataFound, fincas } = this.state;
        let fincasDetails = [];
        if(fincas.length) {
            fincasDetails = fincas.map((finca) => {
                return(
                    <tr key={finca.id}>
                        <td>{finca.id}</td>
                        <td>{finca.nombreFinca}</td>
                        <td>
                        <Button color="success" size="sm" className="mr-3">
                        Editar
                        </Button>
                        <Button color="danger" size="sm">
                        Eliminar
                        </Button>      
                        </td>
                    </tr>                    
                )
            })
        }
        return(
            <div className="App container mt-4">
                <h4>Fincas</h4>
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
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