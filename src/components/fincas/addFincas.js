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

export default class addFincas extends Component {
  render() {
    return (
      <div>
        <Button
          className="float-left mb-4"
          color="danger"
          size="sm"
          onClick={this.props.deleteFincaCheck}>
          Eliminar Finca(s) Seleccionada(s)
          </Button>
        <Button
          className="float-right mb-4"
          color="primary"
          size="sm"
          onClick={this.props.toggleNewFincaModal}
        >
          Agregar Finca
          </Button>
        <Modal
          isOpen={this.props.newFincaModal}
          toggle={this.props.toggleNewFincaModal}
        >
          <ModalHeader toggle={this.props.toggleNewFincaModal}>
            Agregar nueva Finca
            </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="nombreFinca">Nombre</Label>
              <Input
                id="nombreFinca"
                name="nombreFinca"
                value={this.props.newFincaData.nombreFinca}
                onChange={this.props.onChangeAddFincaHandler}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => this.props.addFinca()}>
              Agregar
              </Button>{" "}
            <Button color="secondary" onClick={this.props.toggleNewFincaModal}>
              Cancelar
              </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}