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
        return(
            <div>
                <Button className="float-right mb-4" color="primary">
                    Agregar Finca
                </Button>
                <Modal>
                    <ModalHeader>Agregar Nueva Finca</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="nombreFinca">Nombre</Label>
                            <Input id="nombreFinca" name="nombreFinca"/>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary">Guardar</Button>
                        <Button color="secondary">Cancelar</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}