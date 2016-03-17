import AddTodo from './AddTodo';
import TodoList from './TodoList';

const Application = ({ render, todos }) => (
  <div>
    <h1>My Todos</h1>
    <AddTodo
      onAdd={(text) => {
        todos.push(text);
        // re-render app with new state
        render({ todos });
      }}
    />
    <TodoList todos={todos} />
  </div>
);

export default Application;
