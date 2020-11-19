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
            newAnimalData: {
              numeroAnimal: "",
              raza: "",
              peso: "",
              edad: "",
              foto: "",
              finca_id: ""
            },
            isLoading: false,
            status: "",
            newAnimalModal: false,
            editFincaData: {
                id: "",
              numeroAnimal: "",
              raza: "",
              peso: "",
              edad: "",
              foto: "",
              finca_id: ""
            },
            editFincaModal: false,
            noDataFound: "",
            imagePreviewUrl: false,
        }
    }

    componentDidMount() {
        this.getAnimales();
      }   

    getAnimales() {
        axios({
            method: 'GET',
            url: `http://localhost:8000/api/animal`,
            headers: {
                "Authorization": "bearer "+localStorage.getItem('jwt')
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
                "Authorization": "bearer "+localStorage.getItem('jwt')
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
                "Authorization": "bearer "+localStorage.getItem('jwt')
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
      editFinca = (id,numeroAnimal,raza,peso,edad,foto,finca_id) => {
        this.setState({
          editFincaData: { id,numeroAnimal,raza,peso,edad,foto,finca_id },
          editFincaModal: !this.state.editFincaModal,
        });
      };

      updateFinca = () => {
        let {
          id,
          numeroAnimal,
          raza,
          peso,
          edad,
          foto,
          finca_id,

        } = this.state.editFincaData;
        this.setState({
          isLoading: true,
        });
        axios({
          method: 'POST',
          url: `http://localhost:8000/api/animal/store`,
          headers: {
              "Authorization": "bearer "+localStorage.getItem('jwt')
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
              editFincaModal: false,
              editFincaData: {numeroAnimal,
                raza,
                peso,
                edad,
                foto,
                finca_id},
              isLoading:false,
            });
            this.getAnimales();
            Alert.success("Finca se modificó exitosamente!")
          })
          .catch((error) => {
            this.setState({isLoading:false})
            console.log(error.response);
          });
      };
    
  render() {
    const { newAnimalData,editFincaData, noDataFound, animales} = this.state;
      let animalDetails = [];
      if (animales.length) {
        animalDetails = animales.map((animal) => {
          return (
            <tr key={animal.id}>
              <td>{animal.id}</td>
              <td>{animal.numeroAnimal}</td>
              <td>{animal.raza}</td>
              <td>{animal.peso}</td>
              <td>{animal.edad}</td>
              <td>{animal.foto}</td>
              <th>{animal.finca_id}</th>
              <td>
                <Button
                  color="success"
                  className="mr-3"
                  size="sm"
                  onClick={() =>
                    this.editFinca(
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
                <Button color="danger" size="sm" onClick={() => this.deleteAnimal(animal.id)}>
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
          />
          <EditAnimal
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
              <th>Numero</th>
              <th>Raza</th>
              <th>Peso</th>
              <th>Edad</th>
              <th>Foto</th>
              <th>Finca</th>
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