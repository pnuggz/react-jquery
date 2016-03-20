/**
 * This example is fairly worthless in practice
 * but it eases you into understanding that you
 * treat lazy elements as if they were real
 * DOM nodes.
 * 
 * Quite literally re-render your app
 * every time as if you were creating the DOM
 * for the first time.
 * 
 * You'll learn about how to then apply the diff
 * of your new DOM to the old DOM in the more
 * complex examples like "Simple App".
 */


var h1 = document.createLazyElement('h1');
var text = document.createLazyTextNode('hello, world.');
h1.appendChild(text);

// Now we can just put everything in the <body>.
// Just treat them like real DOM and they will
// lazily create them self
document.body.appendChild(h1);

/*

// You could also could have written it like this,
// which reads better for some people to visualize
// the parent/child relationship

document.body.appendChild(
  document.createLazyElement('h1').appendChild(
    document.createLazyTextNode('hello, world.')
  )
);

*/
