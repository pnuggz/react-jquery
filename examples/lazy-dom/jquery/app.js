$.fn.counter = function counter() {
  let count = 0;

  const $count = $(`<div>${count}</div>`);
  const $button = $('<button>Increase</button>');

  $button.on('click', () => {
    count++
    $count.text(`${count}`);
  });

  this.append($count);
  this.append($button);

  return this;
};

const Application = () => {
  let counter = <div id="suchwow" />;

  // lazy-dom JSX elements can be treated as if they
  // they were actual DOM nodes!
  $(counter).counter();

  return (
    <div>
      <h2>jQuery Counter</h2>
      {counter}
    </div>
  );
};

document.body.appendChild(<Application />);
