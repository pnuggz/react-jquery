import { render } from 'react-dom';
import Application from './components/Application';

// For simplicity's sake, we're accepting the
// application state here and passing it down
function renderApplication(state) {
  const start = performance.now();
  render(
    <Application
      // we pass a function to re-render the app
      // but that's just one convention.
      render={renderApplication}
      todos={state.todos}
    />,
    document.getElementById('container'),
    () => {
      // rendering in React is asynchronous
      const finish = performance.now();
      console.log('render', finish-start + ' ms');
    }
  );
}

// Kick off initial render with initial state
renderApplication({ todos: [] });
