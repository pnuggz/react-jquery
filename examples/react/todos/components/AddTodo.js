const AddTodo = ({ onAdd }) => {
  let input;

  return (
    <div>
      <input
        placeholder="Add some text..."
        ref={(node) => input = node}
      />
      <button
        onClick={() => {
          onAdd(input.value);
          input.value = '';
        }}
      >
        Add Todo
      </button>
    </div>
  );
};

export default AddTodo;
