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

export default class editFinca extends Component {
  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.editFincaModal}
          toggle={this.props.toggleEditFincaModal}
        >
          <ModalHeader toggle={this.props.toggleEditFincaModal}>
            Editar Finca
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="nombreFinca">Nombre</Label>
              <Input
                id="nombreFinca"
                name="nombreFinca"
                value={this.props.editFincaData.nombreFinca}
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