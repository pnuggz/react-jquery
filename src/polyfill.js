import Elements from './Elements';
import LazyNode from './LazyNode';
import LazyCharacterData from './LazyCharacterData';
import LazyText from './LazyText';
import LazyElement from './LazyElement';
import LazyHTMLElement from './LazyHTMLElement';
import LazyUnknownElement from './LazyUnknownElement';

import { proxyAllDescriptors } from './LazyNode';
import { $$node, $$parentLazyNode, $$internalInvocation } from './symbols';

// Just in case they got shadowed
const { document, Node, Symbol } = window;
// Where we'll store a local lookup table for
// quick tagName -> constructor resolution
const constructorsByTagName = {};

function polyfillConstructors() {
  window.LazyNode = LazyNode;
  window.LazyCharacterData = LazyCharacterData;
  window.LazyText = LazyText;
  window.LazyElement = LazyElement;
  window.LazyHTMLElement = LazyHTMLElement;

  // No browser I'm aware of supports Elements even though it is in fact
  // in the spec and a much better API for node lists
  if (!window.Elements) {
    window.Elements = Elements;
  }

  Symbol.node = $$node;

  const tags = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'math', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rb', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'];
  const constructorNameMap = { a: 'Anchor', blockquote: 'Quote', br: 'BR', caption: 'TableCaption', col: 'TableCol', colgroup: 'TableCol', datalist: 'DataList', del: 'Mod', dl: 'DList', fieldset: 'FieldSet', h1: 'Heading', h2: 'Heading', h3: 'Heading', h4: 'Heading', h5: 'Heading', h6: 'Heading', hr: 'HR', i: 'TODO', iframe: 'TODO', img: 'TODO', ins: 'TODO', kbd: 'TODO', li: 'TODO', main: 'TODO', mark: 'TODO', math: 'TODO', menuitem: 'TODO', nav: 'TODO', noscript: 'TODO', ol: 'TODO', optgroup: 'TODO', p: 'Paragraph', q: 'TODO', rb: 'TODO', rp: 'TODO', rt: 'TODO', rtc: 'TODO', ruby: 'TODO', s: 'TODO', samp: 'TODO', section: 'TODO', small: 'TODO', strong: 'TODO', sub: 'TODO', summary: 'TODO', sup: 'TODO', svg: 'TODO', tbody: 'TODO', td: 'TODO', textarea: 'TextArea', tfoot: 'TODO', th: 'TODO', thead: 'TODO', time: 'TODO', tr: 'TODO', u: 'TODO', ul: 'TODO', var: 'TODO', wbr: 'TODO' };

  const hyphensToPascalCase = function (str) {
    const camel = str.replace(/-([a-z])/g, match => match[1].toUpperCase());
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  };

  const nameForTag = function (tagName) {
    const middle = constructorNameMap[tagName] || hyphensToPascalCase(tagName);
    return `HTML${middle}Element`;
  };

  for (let i = 0, l = tags.length; i < l; i++) {
    const tagName = tags[i];
    const name = nameForTag(tagName);
    const lazyName = 'Lazy' + name;
    const nativeClass = window[name] || HTMLElement;

    // Don't fill the same tag twice which happens when
    // tags share constructors, like h1, h2, h3
    // all share LazyHTMLHeadingElement
    if (!window[lazyName]) {
      const lazyClass = new Function(
        `
          var lazyClass = function ${lazyName}() {
            LazyHTMLElement.apply(this, arguments);
          };
          lazyClass.prototype = Object.create(LazyHTMLElement.prototype);
          lazyClass.prototype.constructor = lazyClass;
          return lazyClass;
        `
      )();

      proxyAllDescriptors(nativeClass, lazyClass);

      constructorsByTagName[tagName] = lazyClass;
      window[lazyName] = lazyClass;
    }
  }
}

function polyfillNodePrototype() {
  const nodeProto = Node.prototype;
  const appendChildNative = nodeProto.appendChild;
  const removeChildNative = nodeProto.removeChild;

  nodeProto.appendChild = function appendChild(nodeOrLazyNode) {
    let node = nodeOrLazyNode;

    if (node instanceof LazyNode) {
      node = nodeOrLazyNode[$$node];
    }
    
    return appendChildNative.call(this, node);
  };

  nodeProto.removeChild = function removeChild(nodeOrLazyNode) {
    let node = nodeOrLazyNode;

    if (node instanceof LazyNode) {
      node = nodeOrLazyNode[$$node];
    }
    
    return removeChildNative.call(this, node);
  };
}

if (!document.createLazyElement) {
  polyfillConstructors();
  polyfillNodePrototype();

  document.createLazyElement = function createLazyElement(tagName) {
    if (this !== document) {
      throw new TypeError('Illegal invocation');
    }

    if (arguments.length === 0) {
      throw new TypeError(`Failed to execute 'createLazyElement' on 'Document': 1 argument required, but only 0 present.`);
    }

    if (String(tagName).match(/^[a-z][a-z0-9-]*$/ig) === null) {
      throw new DOMException(`Failed to execute 'createElement' on 'Document': The tag name provided (${tagName}) is not a valid name.`);
    }

    const constructor = constructorsByTagName[tagName] || LazyUnknownElement;
    return new constructor(tagName, $$internalInvocation);
  };

  document.createLazyTextNode = function createLazyElement(text) {
    if (this !== document) {
      throw new TypeError('Illegal invocation');
    }

    if (arguments.length === 0) {
      throw new TypeError(`Failed to execute 'createLazyTextNode' on 'Document': 1 argument required, but only 0 present.`);
    }

    return new LazyText(text);
  };
}
