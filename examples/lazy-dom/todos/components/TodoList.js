/** @jsx createElement */

import { createElement } from 'lazy-dom';

const TodoList = ({ todos }) => (
  <ul>
    {todos.map(text =>
      <li>{text}</li>
    )}
  </ul>
);

export default TodoList;
