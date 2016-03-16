/** @jsx createElement */

import { createElement } from 'lazy-dom';
import AddTodo from './AddTodo';
import TodoList from './TodoList';

const Application = ({ render, todos }) => (
  <div>
    <h1>hello world</h1>
    <AddTodo
      onadd={(text) => {
        todos.push(text);
        render();
      }}
    />
    <TodoList todos={todos} />
  </div>
);

export default Application;
