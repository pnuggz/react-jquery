/** @jsx createElement */

import { createElement } from 'lazy-dom';

const AddTodo = ({ onadd }) => {
  let input;

  return (
    <div>
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
