import React , { Component } from 'react';
import Alert from 'react-s-alert';
import {Table, Button} from 'reactstrap'
import axios from "axios";
import AddAnimal from './addAnimal';
import EditAnimal from './editAnimal';

export default class Animal extends Component {
    constructor(props){
        super(props);
        this.state = {
            animales: [],
            checkedBoxes: [],
            newAnimalData: {
              numeroAnimal: "",
              raza: "",
              peso: "",
              edad: "",
              foto: null,
              finca_id: ""
            },
            isLoading: false,
            status: "",
            newAnimalModal: false,
            editAnimalData: {
                id: "",
              numeroAnimal: "",
              raza: "",
              peso: "",
              edad: "",
              foto: "",
              finca_id: ""
            },
            editAnimalModal: false,
            noDataFound: "",
            imagePreviewUrl: false,
        }
    }

    componentDidMount() {
        this.getAnimales();
        this.setState({isLoading:false})
      }   

    getAnimales() {
        axios({
            method: 'GET',
            url: `http://localhost:8000/api/animal`,
            headers: {
                "Authorization": "bearer "+this.props.token
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

    toggleNewAnimalModal = () => {
        this.setState({
          newAnimalModal: !this.state.newAnimalModal,
        });
      };
      onChange(e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length)
        return;
        this.createImage(files[0]);
        }
        createImage(file) {
        let reader = new FileReader();
        reader.onload = (e) => {
        this.setState({
        image: e.target.result
        })
        };
        reader.readAsDataURL(file);
        }
        
    onChangeAddAnimalHandler = (e) => {
        let { newAnimalData } = this.state;
        newAnimalData[e.target.name] = e.target.value;
        this.setState({ newAnimalData });
    };

    addAnimal = () => {
        axios({
            method: 'POST',
            url: `http://localhost:8000/api/animal/store/`,
            headers: {
                "Authorization": "bearer "+this.props.token
            }, 
            data : this.state.newAnimalData
        })
          .then((response) => {
            const { animales } = this.state;
            const newAnimales = [...animales];
            newAnimales.push(response.data);
            this.setState(
              {
                animales: newAnimales,
                newAnimalModal: false,
                newAnimalData: {
                  numeroAnimal: "",
                  raza: "",
                  peso: "",
                  edad: "",
                  foto: "",
                  finca_id: ""
                },
              },
              () => this.getAnimales(),
              Alert.success("Animal se guardó exitosamente!")
            );
          });
      };

      deleteAnimal = async(id) => {
        this.setState({
          isLoading: true,
        });
        await axios({
            method: 'DELETE',
            url: `http://localhost:8000/api/animal/delete/`+id,
            headers: {
                "Authorization": "bearer "+this.props.token
            }
        })
          .then((response) => {
            this.setState({
              isLoading: false,
            });
            this.componentDidMount()
            Alert.error("Animal se eliminó exitosamente!")
          })
          .catch((error) => {
            this.setState({
              isLoading: false,
            });
          });
      };
      toggleEditAnimalModal = () => {
        this.setState({
          editAnimalModal: !this.state.editAnimalModal,
        });
      };

      onChangeEditAnimalHanler = (e) => {
        let { editAnimalData } = this.state;
        editAnimalData[e.target.name] = e.target.value;
        this.setState({ editAnimalData });
      };
      editAnimal = (id,numeroAnimal,raza,peso,edad,foto,finca_id) => {
        this.setState({
          editAnimalData: { id,numeroAnimal,raza,peso,edad,foto,finca_id },
          editAnimalModal: !this.state.editAnimalModal,
        });
      };

      updateAnimal = () => {
        let {
          id,
          numeroAnimal,
          raza,
          peso,
          edad,
          foto,
          finca_id,

        } = this.state.editAnimalData;
        this.setState({
          isLoading: true,
        });
        axios({
          method: 'POST',
          url: `http://localhost:8000/api/animal/store`,
          headers: {
              "Authorization": "bearer "+this.props.token
          }, 
          data: {
          numeroAnimal,
          raza,
          peso,
          edad,
          foto,
          finca_id,
          id
          },
          })
          .then((response) => {
            this.setState({
              editAnimalModal: false,
              editAnimalData: {numeroAnimal,
                raza,
                peso,
                edad,
                foto,
                finca_id},
              isLoading:false,
            });
            this.getAnimales();
            Alert.success(response.data.message)
          })
          .catch((error) => {
            this.setState({isLoading:false})
            console.log(error.response);
          });
      };

      toggleCheckbox = (e, finca) => {		
        if(e.target.checked) {
          let arr = this.state.checkedBoxes;
          arr.push(finca.id);
          
          this.setState = { checkedBoxes: arr};
        } else {			
          let fincas = this.state.checkedBoxes.splice(this.state.checkedBoxes.indexOf(finca.id), 1);
          
          this.setState = {
            checkedBoxes: fincas
          }
        }		
        console.log(this.state.checkedBoxes);
      }

      deleteAnimalCheck = async() => {
        await axios({
            method: 'DELETE',
            url: `http://localhost:8000/api/animal/bulk-delete/`,
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
            Alert.error("Animal(es) se eliminó exitosamente!")
          })
          .catch((error) => {
            console.log(error)
            Alert.error("Debe seleccionar al menos un Animal")
          });
      };

      updateAnimalCheck = async() => {
        await axios({
            method: 'PUT',
            url: `http://localhost:8000/api/animal/updateStatus/`,
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
            Alert.error("Se cambió el estado exitosamente!")
          })
          .catch((error) => {
            console.log(error)
            Alert.error("Debe seleccionar al menos un Animal")
          });
      };
    
  render() {
    const { newAnimalData,editAnimalData, noDataFound, animales} = this.state;
      let animalDetails = [];
      if (animales.length) {
        animalDetails = animales.map((animal, index) => {
          return (
            <tr key={index} className={(index % 2) ? "odd_col" : "even_col"}>
              <td>
              <input type="checkbox" className="selectsingle" value="{animal.id}" checked={this.state.checkedBoxes.find((p) => p.id === animal.id)} onChange={(e) => this.toggleCheckbox(e, animal)}/>
									  &nbsp;&nbsp;{animal.id}
              </td>
              <td>{animal.numeroAnimal}</td>
              <td>{animal.raza}</td>
              <td>{animal.peso} kg</td>
              <td>{animal.edad}</td>
              <td><img width="50" alt="img" src={animal.foto}/></td>
              <td>{animal.nombreFinca}</td>
              {
                animal.estado === "en_finca"
                ? <td>En Finca</td>
                : <td>Vendido</td>
              }
              
              <td>
                <Button
                  color="success"
                  className="mr-3"
                  size="sm"
                  onClick={() =>
                    this.editAnimal(
                      animal.id,
                      animal.numeroAnimal,
                      animal.raza,
                      animal.peso,
                      animal.edad,
                      animal.foto,
                      animal.finca_id
                    )}
                >
                  Editar
                </Button>
                <Button className="fas fa-edit" color="danger" size="sm" onClick={() => this.deleteAnimal(animal.id)}>
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
           <h4 className="font-weight-bold">Listado de Animales</h4> 
           <AddAnimal
                toggleNewAnimalModal={this.toggleNewAnimalModal}
                newAnimalModal={this.state.newAnimalModal}
                onChangeAddAnimalHandler={this.onChangeAddAnimalHandler}
                addAnimal={this.addAnimal}
                newAnimalData={newAnimalData}
                deleteAnimalCheck={this.deleteAnimalCheck}
                updateAnimalCheck={this.updateAnimalCheck}
          />
          <EditAnimal
                toggleEditAnimalModal={this.toggleEditAnimalModal}
                editAnimalModal={this.state.editAnimalModal}
                onChangeEditAnimalHanler={this.onChangeEditAnimalHanler}
                editAnimal={this.editAnimal}
                editAnimalData={editAnimalData}
                updateAnimal={this.updateAnimal}
          />
        <Table bordered size="sm" responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Numero</th>
              <th>Raza</th>
              <th>Peso</th>
              <th>Edad</th>
              <th>Foto</th>
              <th>Finca</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          {animales.length === 0 ? (
            <tbody>
              <h3>{noDataFound}</h3>
            </tbody>
          ) : (
            <tbody>{animalDetails}</tbody>
          )}
        </Table>
      </div>
    );
  }
}