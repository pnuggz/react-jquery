const TodoList = ({ todos }) => (
  <ul>
    {todos.map((text, i) =>
      <li key={i}>{text}</li>
    )}
  </ul>
);

export default TodoList;
