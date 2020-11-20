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
          isOpen={this.props.editFincaModal}
          toggle={this.props.toggleEditFincaModal}
        >
          <ModalHeader toggle={this.props.toggleEditFincaModal}>
            Editar Animal {this.props.editFincaData.raza}
          </ModalHeader>
          <ModalBody>

            <FormGroup>
              <Label for="peso">Peso</Label>
              <Input
                id="peso"
                name="peso"
                value={this.props.editFincaData.peso}
                onChange={this.props.onChangeEditFincaHanler}
              />
            </FormGroup>
            <FormGroup>
              <Label for="edad">Edad</Label>
              <Input
                id="edad"
                name="edad"
                value={this.props.editFincaData.edad}
                onChange={this.props.onChangeEditFincaHanler}
              />
            </FormGroup>
            <FormGroup>
              <Label for="foto">Foto</Label>
              <Input
                id="foto"
                name="foto"
                value={this.props.editFincaData.foto}
                onChange={this.props.onChangeEditFincaHanler}
              />
            </FormGroup>
            
          </ModalBody>
          <ModalFooter>
            <Button 
              color="primary" 
              onClick={() => this.props.updateFinca()}
            >
              Editar
            </Button>
            <Button
              color="secondary"
              onClick={this.props.toggleEditFincaModal}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}