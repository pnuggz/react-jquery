// With lazy-dom, you can treat JSX elements
// as if they were real DOM nodes.
var container = <div id="container" />;
container.appendChild(<h1>hello, world.</h1>);

// Now we can just put everything in the <body>
document.body.appendChild(container);
