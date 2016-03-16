/** @jsx createElement */

import { createElement, render } from 'lazy-dom';
import Application from './components/Application';

const todos = [];

function renderApplication() {
  render(
    <Application
      render={renderApplication}
      todos={todos}
    />,
    document.getElementById('container')
  );
}

renderApplication();
