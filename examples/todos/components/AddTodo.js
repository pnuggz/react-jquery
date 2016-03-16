/** @jsx createElement */

import { createElement } from 'lazy-dom';

const AddTodo = ({ onadd }) => {
  let input;

  return (
    <div>
      {/* you can treat lazy-dom JSX elements as
          if they were actual DOM nodes! */}
      {input = <input />}
      <button
        onclick={() => {
          onadd(input.value);
          input.value = '';
        }}
      >
        Add Todo
      </button>
    </div>
  );
};

export default AddTodo;
