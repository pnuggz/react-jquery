/** @jsx createElement */

import { createElement, render } from 'lazy-dom';
import Application from './components/Application';

// For simplicity's sake, we're accepting the
// application state here and passing it down
// lazy-dom makes no assumptions on how you
// handle state, just re-render whenever
// state changes!
function renderApplication(state) {
  render(
    <Application
      render={renderApplication}
      todos={state.todos}
    />,
    document.getElementById('container')
  );
}

// Kick off initial render with initial state
renderApplication({ todos: [] });
