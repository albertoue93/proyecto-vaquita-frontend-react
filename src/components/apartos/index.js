import React , { Component } from 'react';
import Alert from 'react-s-alert';
import {Table, Button} from 'reactstrap'
import axios from "axios";
import AddAparto from './addAparto';

export default class Aparto extends Component {
    constructor(props){
        super(props);
        this.state = {
            apartos: [],
            newApartoData: {
              numeroAparto: "",
              mts2: "",
              finca_id: ""
            },
            isLoading: false,
            status: "",
            newApartoModal: false,
            noDataFound: "",
        }
    }

    componentDidMount() {
        this.getApartos();
      }   

      getApartos() {
        axios({
            method: 'GET',
            url: `http://localhost:8000/api/aparto`,
            headers: {
                "Authorization": "bearer "+localStorage.getItem('jwt')
            }
        })
    .then((response) => {
        if (response.status === 200) {
        this.setState({
            apartos: response.data.data ? response.data.data : [],
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

    toggleNewApartoModal = () => {
        this.setState({
          newApartoModal: !this.state.newApartoModal,
        });
      };

    onChangeAddApartoHandler = (e) => {
        let { newApartoData } = this.state;
        newApartoData[e.target.name] = e.target.value;
        this.setState({ newApartoData });
    };

    addAparto = () => {
        axios({
            method: 'POST',
            url: `http://localhost:8000/api/aparto/store/`,
            headers: {
                "Authorization": "bearer "+localStorage.getItem('jwt')
            }, 
            data : this.state.newApartoData
        })
          .then((response) => {
            const { apartos } = this.state;
            const newApartos = [...apartos];
            newApartos.push(response.data);
            this.setState(
              {
                apartos: newApartos,
                newApartoModal: false,
                newApartoData: {
                  numeroAparto: "",
                  mts2: "",
                  finca_id: ""
                },
              },
              () => this.getApartos(),
              Alert.success("Aparto se guardó exitosamente!")
            );
          });
      };

      deleteAparto = async(id) => {
        this.setState({
          isLoading: true,
        });
        await axios({
            method: 'DELETE',
            url: `http://localhost:8000/api/aparto/delete/`+id,
            headers: {
                "Authorization": "bearer "+localStorage.getItem('jwt')
            }
        })
          .then((response) => {
            this.setState({
              isLoading: false,
            });
            this.componentDidMount()
            Alert.error("Aparto se eliminó exitosamente!")
          })
          .catch((error) => {
            this.setState({
              isLoading: false,
            });
          });
      };
    
  render() {
    const { newApartoData, noDataFound, apartos} = this.state;
      let apartoDetails = [];
      if (apartos.length) {
        apartoDetails = apartos.map((aparto) => {
          return (
            <tr key={aparto.id}>
              <td>{aparto.id}</td>
              <td>{aparto.numeroAparto}</td>
              <td>{aparto.mts2}</td>
              <th>{aparto.finca_id}</th>
              <td>
                <Button
                  color="success"
                  className="mr-3"
                  size="sm"
                >
                  Editar
                </Button>
                <Button color="danger" size="sm" onClick={() => this.deleteAparto(aparto.id)}>
                  Eliminar
                </Button>
              </td>
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
           <h4 className="font-weight-bold">Listado de Apartos</h4> 
           <AddAparto
                toggleNewApartoModal={this.toggleNewApartoModal}
                newApartoModal={this.state.newApartoModal}
                onChangeAddApartoHandler={this.onChangeAddApartoHandler}
                addAparto={this.addAparto}
                newApartoData={newApartoData}
          />
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Numero</th>
              <th>Metros Cuadrados</th>
              <th>Finca</th>
              <th>Acciones</th>
            </tr>
          </thead>
          {apartos.length === 0 ? (
            <tbody>
              <h3>{noDataFound}</h3>
            </tbody>
          ) : (
            <tbody>{apartoDetails}</tbody>
          )}
        </Table>
      </div>
    );
  }
}