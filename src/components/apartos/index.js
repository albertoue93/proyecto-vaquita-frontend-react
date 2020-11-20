import React , { Component } from 'react';
import Alert from 'react-s-alert';
import {Table, Button} from 'reactstrap'
import axios from "axios";
import AddAparto from './addAparto';
import EditAparto from './editAparto';

export default class Aparto extends Component {
    constructor(props){
        super(props);
        this.state = {
            apartos: [],
            checkedBoxes: [],
            newApartoData: {
              numeroAparto: "",
              mts2: "",
              finca_id: ""
            },
            isLoading: false,
            status: "",
            newApartoModal: false,
            editApartoData: {
                id: "",
                numeroAparto: "",
                mts2: "",
                finca_id: ""
            },
            editApartoModal: false,
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
                "Authorization": "bearer "+this.props.token
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
                "Authorization": "bearer "+this.props.token
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

      toggleEditApartoModal = () => {
        this.setState({
          editApartoModal: !this.state.editApartoModal,
        });
      };

      onChangeEditApartoHanler = (e) => {
        let { editApartoData } = this.state;
        editApartoData[e.target.name] = e.target.value;
        this.setState({ editApartoData });
      };      

      editAparto = (id, numeroAparto, mts2, finca_id, nombreFinca) => {
        this.setState({
          editApartoData: { id, numeroAparto, mts2, finca_id, nombreFinca },
          editApartoModal: !this.state.editApartoModal,
        });
      };

      updateAparto = () => {
        let {
          id,
          numeroAparto, 
          mts2, 
          finca_id,
        } = this.state.editApartoData;
        this.setState({
          isLoading: true,
        });
        axios({
          method: 'POST',
          url: `http://localhost:8000/api/aparto/store`,
          headers: {
              "Authorization": "bearer "+this.props.token
          }, 
          data: {
            numeroAparto,mts2,finca_id,id
          },
          })
          .then((response) => {
            this.setState({
              editApartoModal: false,
              editApartoData: { numeroAparto, mts2, finca_id },
              isLoading:false,
            });
            this.getApartos();
            Alert.success("Aparto se modificó exitosamente!")
          })
          .catch((error) => {
            this.setState({isLoading:false})
            console.log(error.response);
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
                "Authorization": "bearer "+this.props.token
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

      toggleCheckbox = (e, aparto) => {		
        if(e.target.checked) {
          let arr = this.state.checkedBoxes;
          arr.push(aparto.id);
          
          this.setState = { checkedBoxes: arr};
        } else {			
          let apartos = this.state.checkedBoxes.splice(this.state.checkedBoxes.indexOf(aparto.id), 1);
          
          this.setState = {
            checkedBoxes: apartos
          }
        }		
        console.log(this.state.checkedBoxes);
      }

      deleteApartoCheck = async() => {
        await axios({
            method: 'DELETE',
            url: `http://localhost:8000/api/aparto/bulk-delete/`,
            data: {'ids' : this.state.checkedBoxes},
            headers: {
                "Authorization": "bearer "+this.props.token
            } 
        })
          .then((response) => {
            if(response.status === 200) {
            //this.getApartos()
            window.location.reload(false);
            }
            Alert.error("Aparto(s) se eliminó exitosamente!")
          })
          .catch((error) => {
            console.log(error)
            Alert.error("Debe seleccionar al menos un Aparto")
          });
      };
    
  render() {
    const { newApartoData, editApartoData, noDataFound, apartos} = this.state;
      let apartoDetails = [];
      if (apartos.length) {
        apartoDetails = apartos.map((aparto, index) => {
          return (
            <tr key={index} className={(index % 2) ? "odd_col" : "even_col"}>
              <td>
              <input type="checkbox" className="selectsingle" value="{aparto.id}" checked={this.state.checkedBoxes.find((p) => p.id === aparto.id)} onChange={(e) => this.toggleCheckbox(e, aparto)}/>
									  &nbsp;&nbsp;{aparto.id}
              </td>
              <td>{aparto.numeroAparto}</td>
              <td>{aparto.mts2}</td>
              <td>{aparto.nombreFinca}</td>
              <td>
                <Button
                  color="success"
                  className="mr-3"
                  size="sm"
                  onClick={() =>
                    this.editAparto(
                      aparto.id,
                      aparto.numeroAparto,
                      aparto.mts2,
                      aparto.finca_id,
                      aparto.nombreFinca
                    )}
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
                deleteApartoCheck={this.deleteApartoCheck}
          />
          <EditAparto
                toggleEditApartoModal={this.toggleEditApartoModal}
                editApartoModal={this.state.editApartoModal}
                onChangeEditApartoHanler={this.onChangeEditApartoHanler}
                editAparto={this.editAparto}
                editApartoData={editApartoData}
                updateAparto={this.updateAparto}
          />
        <Table bordered size="sm" responsive>
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