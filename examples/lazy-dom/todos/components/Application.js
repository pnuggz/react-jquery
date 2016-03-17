/** @jsx createElement */

import { createElement } from 'lazy-dom';
import AddTodo from './AddTodo';
import TodoList from './TodoList';

const Application = ({ render, todos }) => (
  <div>
    <h1>My Todos (lazy-dom)</h1>
    <AddTodo
      onadd={(text) => {
        todos.push(text);
        // re-render app with new state
        render({ todos });
      }}
    />
    <TodoList todos={todos} />
  </div>
);

export default Application;
