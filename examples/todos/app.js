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
      // we pass a function to re-render the app
      // but that's just one convention. lazy-dom
      // doesn't make any assumptions so you could
      // just as easily use a flux/redux style
      render={renderApplication}
      todos={state.todos}
    />,
    document.getElementById('container')
  );
}

// Kick off initial render with initial state
renderApplication({ todos: [] });
