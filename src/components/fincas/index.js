import React , { Component } from 'react'
import Alert from 'react-s-alert';
import {Table, Button} from 'reactstrap'
import axios from "axios";
import AddFincas from './addFincas';
import EditFinca from './editFinca';

export default class Finca extends Component {
    constructor(props){
        super(props);
        this.state = {
            fincas: [],
            newFincaData: {
              nombreFinca: "",
            },
            isLoading: false,
            status: "",
            newFincaModal: false,
            editFincaData: {
                id: "",
                nombreFinca: ""
            },
            editFincaModal: false,
            noDataFound: "",
        }
    }

    componentDidMount() {
        this.getFincas();
      }   

    getFincas() {
        axios({
            method: 'GET',
            url: `http://localhost:8000/api/fincas`,
            headers: {
                "Authorization": "bearer "+localStorage.getItem('jwt')
            }
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

    toggleNewFincaModal = () => {
        this.setState({
          newFincaModal: !this.state.newFincaModal,
        });
      };

    onChangeAddFincaHandler = (e) => {
        let { newFincaData } = this.state;
        newFincaData[e.target.name] = e.target.value;
        this.setState({ newFincaData });
    };

    addFinca = () => {
        axios({
            method: 'POST',
            url: `http://localhost:8000/api/fincas/store`,
            headers: {
                "Authorization": "bearer "+localStorage.getItem('jwt')
            }, 
            data : this.state.newFincaData
        })
          .then((response) => {
            const { fincas } = this.state;
            const newFincas = [...fincas];
            newFincas.push(response.data);
            this.setState(
              {
                fincas: newFincas,
                newFincaModal: false,
                newFincaData: {
                  nombreFinca: "",
                },
              },
              () => this.getFincas(),
              Alert.success("Finca se guardó exitosamente!")
            );
          });
      };

      toggleEditFincaModal = () => {
        this.setState({
          editFincaModal: !this.state.editFincaModal,
        });
      };

      onChangeEditFincaHanler = (e) => {
        let { editFincaData } = this.state;
        editFincaData[e.target.name] = e.target.value;
        this.setState({ editFincaData });
      };

      editFinca = (id, nombreFinca) => {
        this.setState({
          editFincaData: { id, nombreFinca },
          editFincaModal: !this.state.editFincaModal,
        });
      };

      updateFinca = () => {
        let {
          id,
          nombreFinca,
        } = this.state.editFincaData;
        this.setState({
          isLoading: true,
        });
        axios({
          method: 'POST',
          url: `http://localhost:8000/api/fincas/store`,
          headers: {
              "Authorization": "bearer "+localStorage.getItem('jwt')
          }, 
          data: {
            nombreFinca,id
          },
          })
          .then((response) => {
            this.setState({
              editFincaModal: false,
              editFincaData: { nombreFinca },
              isLoading:false,
            });
            this.getFincas();
            Alert.success("Finca se modificó exitosamente!")
          })
          .catch((error) => {
            this.setState({isLoading:false})
            console.log(error.response);
          });
      };

      deleteFinca = async(id) => {
        this.setState({
          isLoading: true,
        });
        await axios({
            method: 'DELETE',
            url: `http://localhost:8000/api/fincas/delete/`+id,
            headers: {
                "Authorization": "bearer "+localStorage.getItem('jwt')
            }
        })
          .then((response) => {
            this.setState({
              isLoading: false,
            });
            this.componentDidMount()
            Alert.error("Finca se eliminó exitosamente!")
          })
          .catch((error) => {
            this.setState({
              isLoading: false,
            });
          });
      };
    
  render() {
    const { newFincaData, editFincaData, noDataFound, fincas} = this.state;
      let fincasDetails = [];
      if (fincas.length) {
        fincasDetails = fincas.map((finca) => {
          return (
            <tr key={finca.id}>
              <td>{finca.id}</td>
              <td>{finca.nombreFinca}</td>
              <td>
                <Button
                  color="success"
                  className="mr-3"
                  size="sm"
                  onClick={() =>
                    this.editFinca(
                      finca.id,
                      finca.nombreFinca
                    )}
                >
                  Editar
                </Button>
                <Button color="danger" size="sm" onClick={() => this.deleteFinca(finca.id)}>
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
           <h4 className="font-weight-bold">Listado de Fincas</h4> 
           <AddFincas
                toggleNewFincaModal={this.toggleNewFincaModal}
                newFincaModal={this.state.newFincaModal}
                onChangeAddFincaHandler={this.onChangeAddFincaHandler}
                addFinca={this.addFinca}
                newFincaData={newFincaData}
          />
          <EditFinca
                toggleEditFincaModal={this.toggleEditFincaModal}
                editFincaModal={this.state.editFincaModal}
                onChangeEditFincaHanler={this.onChangeEditFincaHanler}
                editFinca={this.editFinca}
                editFincaData={editFincaData}
                updateFinca={this.updateFinca}
          />
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