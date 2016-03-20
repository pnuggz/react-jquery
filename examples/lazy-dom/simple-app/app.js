// Create bound helpers so our code is more readable
var createLazyElement = document.createLazyElement.bind(document);
var createLazyTextNode = document.createLazyTextNode.bind(document);

function NameInput(props) {
  var input = createLazyElement('input');
  input.placeholder = 'Enter your name...';
  input.value = props.value;

  input.oninput = function () {
    props.onchange(input.value);
  };

  return input;
}

function Header() {
  var h1 = createLazyElement('h1');
  h1.appendChild(
      createLazyTextNode('Simple App')
  );

  return h1;
}

function Greetings(props) {
  var p = createLazyElement('p');
  p.appendChild(
    createLazyTextNode(props.name ? 'Hello, ' + props.name : '')
  );

  return p;
}

function Application(props, setState) {
  var application = createLazyElement('div');
  application.id = 'application';

  application.appendChild(
    Header()
  );

  if (props.name.match('foo')) {
    application.appendChild(
      createLazyElement('textarea')
    );
  }

  application.appendChild(
    NameInput({
      value: props.name,
      onchange(name) {
        setState({
          name: name
        });
      }
    })
  );

  application.appendChild(
    Greetings({ name: props.name })
  );

  return application;
};

var application;

function setState(state) {
  if (application) {
    application.mergeWith(
      Application(state, setState)
    );
  } else {
    application = Application(state, setState);
  }
}

setState({ name: '' });

document.body.appendChild(application);

setState({ name: 'hello' });