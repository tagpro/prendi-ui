import React from 'react';
import ReactDOM from 'react-dom';
import 'jest-canvas-mock';
import App from './App';
import { render, fireEvent, getByTestId} from "@testing-library/react";
import ClickPanelComponent from './ClickBait/ClickPanel/ClickPanelComponent';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
