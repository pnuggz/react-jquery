/**
 * One of the many issues with virtual DOM instead of real DOM
 * is that it makes it awkward (or sometimes even impossible)
 * to integrate with libraries that need access to the real DOM.
 * 
 * lazy-dom elements can be consumed exactly how you would
 * would consume real DOM elements! The trick is a bit complicated
 * but the idea is that lazy-dom elements are actually more like
 * "element placeholders" similar to virtual DOM elements
 * except they can be consumed by code expecting a real DOM
 * element and will lazily create the real DOM element
 * and proxy into it when neccesary.
 * 
 * Things get much more complicated when dealing with diffs
 * so I encourage you to read the ARCHITECTURE.md doc if
 * you really would like to know how it works.
 */

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
  let counter = <div id="counter" />;

  // lazy-dom JSX elements can be treated as
  // if they they were actual DOM nodes!
  $(counter).counter();

  return (
    <div>
      <h2>jQuery Counter</h2>
      {counter}
    </div>
  );
};

document.body.appendChild(<Application />);
