// Symbol.node is the only publicly exposed symbol, the rest should
// be considered a artifact of the polyfill
export const $$node = Symbol('Symbol.node');

export const $$children = Symbol('[[children]]');
export const $$cachedNode = Symbol('[[cachedNode]]');
export const $$parentLazyNode = Symbol('[[parentLazyNode]]');
export const $$isElement = Symbol('[[isElement]]');
export const $$props = Symbol('[[props]]');
export const $$methods = Symbol('[[methods]]');
export const $$tagName = Symbol('[[tagName]]');
export const $$lazyNodeValue = Symbol('[[lazyNodeValue]]');
export const $$isStatic = Symbol('[[isStatic]]');
export const $$internalInvocation = Symbol('[[internalInvocation]]');
