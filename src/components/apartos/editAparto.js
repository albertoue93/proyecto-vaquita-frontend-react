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

export default class editAparto extends Component {
  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.editApartoModal}
          toggle={this.props.toggleEditApartoModal}
        >
          <ModalHeader toggle={this.props.toggleEditApartoModal}>
            Editar Aparto
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="numeroAparto">Número</Label>
              <Input
                id="numeroAparto"
                name="numeroAparto"
                value={this.props.editApartoData.numeroAparto}
                onChange={this.props.onChangeEditApartoHanler}
              />
            </FormGroup>
            <FormGroup>
              <Label for="mts2">Metros Cuadrados</Label>
              <Input
                id="mts2"
                name="mts2"
                value={this.props.editApartoData.mts2}
                onChange={this.props.onChangeEditApartoHanler}
              />
            </FormGroup>
            <FormGroup>
              <Label for="finca_id">Finca</Label>
              <Input
                type="hidden"
                id="finca_id"
                name="finca_id"
                value={this.props.editApartoData.finca_id}
                onChange={this.props.onChangeEditApartoHanler}
              />
              <Input
                disabled
                id="finca_id"
                name="finca_id"
                value={this.props.editApartoData.nombreFinca}
                onChange={this.props.onChangeEditApartoHanler}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button 
              color="primary" 
              onClick={() => this.props.updateAparto()}
            >
              Editar
            </Button>
            <Button
              color="secondary"
              onClick={this.props.toggleEditApartoModal}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}