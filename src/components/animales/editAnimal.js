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

export default class editAnimal extends Component {
  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.editAnimalModal}
          toggle={this.props.toggleEditAnimalModal}
        >
          <ModalHeader toggle={this.props.toggleEditAnimalModal}>
            Editar Animal {this.props.editAnimalData.raza}
          </ModalHeader>
          <ModalBody>

            <FormGroup>
              <Label for="peso">Peso</Label>
              <Input
                id="peso"
                name="peso"
                value={this.props.editAnimalData.peso}
                onChange={this.props.onChangeEditAnimalHanler}
              />
            </FormGroup>
            <FormGroup>
              <Label for="edad">Edad (Meses)</Label>
              <Input
                id="edad"
                name="edad"
                value={this.props.editAnimalData.edad}
                onChange={this.props.onChangeEditAnimalHanler}
              />
            </FormGroup>
            <FormGroup>
              <Label for="foto">Foto</Label>
              <Input
                id="foto"
                name="foto"
                value={this.props.editAnimalData.foto}
                onChange={this.props.onChangeEditAnimalHanler}
              />
            </FormGroup>
            
          </ModalBody>
          <ModalFooter>
            <Button 
              color="primary" 
              onClick={() => this.props.updateAnimal()}
            >
              Editar
            </Button>
            <Button
              color="secondary"
              onClick={this.props.toggleEditAnimalModal}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}