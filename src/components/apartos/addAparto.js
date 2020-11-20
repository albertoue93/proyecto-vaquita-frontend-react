import React, { Component } from "react";
import axios from 'axios';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

export default class addAparto extends Component {
  state = {
    fincas: [],
  }
  componentDidMount(){
    axios({
      method: 'GET',
      url: `http://localhost:8000/api/fincas`,
      headers: {
          "Authorization": "bearer "+localStorage.getItem('jwt')
      }
    })
    .then((response) => {
      this.setState({fincas: response.data.data})
    })
  }
    render() {
      return (
        <div>
          <Button 
            className="float-left mb-4"
            color="danger" 
            size="sm"
            onClick={this.props.deleteApartoCheck}>
              Eliminar Aparto(s) Seleccionado(s)
          </Button>
          <Button
            className="float-right mb-4"
            color="primary"
            size="sm"
            onClick={this.props.toggleNewApartoModal}
          >
            Agregar Aparto
          </Button>
          <Modal
            isOpen={this.props.newApartoModal}
            toggle={this.props.toggleNewApartoModal}
          >
            <ModalHeader toggle={this.props.toggleNewApartoModal}>
              Agregar nuevo Aparto
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="numeroAparto">Número</Label>
                <Input
                  id="numeroAparto"
                  name="numeroAparto"
                  value={this.props.newApartoData.numeroAparto}
                  onChange={this.props.onChangeAddApartoHandler}
                />
              </FormGroup>
              <FormGroup>
                <Label for="mts2">Metros Cuadrados</Label>
                <Input
                  id="mts2"
                  name="mts2"
                  value={this.props.newApartoData.mts2}
                  onChange={this.props.onChangeAddApartoHandler}
                />
              </FormGroup>
              <FormGroup>
              <Label for="finca_id">Finca</Label>
                <Input type="select" 
                name="finca_id" 
                id="finca_id" 
                value={this.props.newApartoData.finca_id}
                onChange={this.props.onChangeAddApartoHandler}>
                  <option>Selecciones una Finca</option>
                  {this.state.fincas.map(item=>(
                    <option key={item.id} value={item.id}>{item.nombreFinca}</option>
                  ))}
                </Input>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={() => this.props.addAparto()}>
                Agregar
              </Button>{" "}
              <Button color="secondary" onClick={this.props.toggleNewApartoModal}>
                Cancelar
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      );
    }
  }