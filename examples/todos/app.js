/** @jsx createElement */

import { createElement, render } from 'lazy-dom';
import Application from './components/Application';

// For simplicity's sake, we're managing the
// application state here and passing it down
// lazy-dom makes no assumptions on how you
// handle state, just re-render whenever
// state changes!
const todos = [];

// Every time a change happens, we'll simply re-render
// everything from the top
function renderApplication() {
  render(
    <Application
      render={renderApplication}
      todos={todos}
    />,
    document.getElementById('container')
  );
}

// Kick off initial render
renderApplication();
