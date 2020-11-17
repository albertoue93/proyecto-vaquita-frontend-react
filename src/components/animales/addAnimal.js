import React, { Component } from "react";
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

export default class addAnimal extends Component {
    render() {
      return (
        <div>
          <Button
            className="float-right mb-4"
            color="primary"
            onClick={this.props.toggleNewAnimalModal}
          >
            Agregar Animal
          </Button>
          <Modal
            isOpen={this.props.newAnimalModal}
            toggle={this.props.toggleNewAnimalModal}
          >
            <ModalHeader toggle={this.props.toggleNewAnimalModal}>
              Agregar nuevo Animal
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="numeroAnimal">Número</Label>
                <Input
                  id="numeroAnimal"
                  name="numeroAnimal"
                  value={this.props.newAnimalData.numeroAnimal}
                  onChange={this.props.onChangeAddAnimalHandler}
                />
              </FormGroup>
              <FormGroup>
                <Label for="raza">Raza</Label>
                <Input
                  id="raza"
                  name="raza"
                  value={this.props.newAnimalData.raza}
                  onChange={this.props.onChangeAddAnimalHandler}
                />
              </FormGroup>
              <FormGroup>
                <Label for="peso">Peso</Label>
                <Input
                  id="peso"
                  name="peso"
                  value={this.props.newAnimalData.peso}
                  onChange={this.props.onChangeAddAnimalHandler}
                />
              </FormGroup>
              <FormGroup>
                <Label for="edad">Edad (Meses)</Label>
                <Input
                  id="edad"
                  name="edad"
                  value={this.props.newAnimalData.edad}
                  onChange={this.props.onChangeAddAnimalHandler}
                />
              </FormGroup>
              <FormGroup>
                <Label for="foto">Foto</Label>
                <Input
                  id="foto"
                  name="foto"
                  value={this.props.newAnimalData.foto}
                  onChange={this.props.onChangeAddAnimalHandler}
                />
              </FormGroup>
              <FormGroup>
                <Label for="finca_id">Finca</Label>
                <Input
                  id="finca_id"
                  name="finca_id"
                  value={this.props.newAnimalData.finca_id}
                  onChange={this.props.onChangeAddAnimalHandler}
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={() => this.props.addAnimal()}>
                Agregar
              </Button>{" "}
              <Button color="secondary" onClick={this.props.toggleNewAnimalModal}>
                Cancelar
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      );
    }
  }