import React from 'react';
import ReactDOM from 'react-dom';
import Animal,{animales} from './../index'
import { render, screen } from '@testing-library/react';
it("renders without crashing", () =>{
    const div = document.createElement("div");
    ReactDOM.render(<Animal></Animal>,div)
  })
//HOLA MUNDO