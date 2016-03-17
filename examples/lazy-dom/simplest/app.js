/**
 * This example is fairly worthless in practice
 * but it eases you into understanding that with
 * lazy-dom, you treat your JSX as if it were
 * real DOM. Quite literally re-render your app
 * every time as if you were creating the DOM
 * for the first time.
 * 
 * You'll learn about how to then apply the diff
 * of your new DOM to the old DOM in the more
 * complex examples like Todos.
 */

var container = <div id="container" />;
container.appendChild(<h1>hello, world.</h1>);

// Now we can just put everything in the <body>
// again, just treat them like real DOM.
document.body.appendChild(container);
