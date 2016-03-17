import { createClass } from 'react';
import { render, findDOMNode } from 'react-dom';

$.fn.counter = function counter() {
  let count = 0;

  const $count = $(`<div>${count}</div>`);
  const $button = $('<button>Increase</button>');

  $button.on('click', () => {
    count++
    $count.text(count);
  });

  this.append($count);
  this.append($button);

  return this;
};

const Application = createClass({
  componentDidMount() {
    const counterElement = findDOMNode(this.refs.counter);
    // jQuery plugins need access to the real
    // DOM node and some manipulate the DOM
    // which in certain cases breaks React
    $(counterElement).counter();
  },

  render() {
    return (
      <div>
        <h2>jQuery Counter</h2>
        <div ref="counter"></div>
      </div>
    );
  }
});

render(<Application />, document.getElementById('container'));
