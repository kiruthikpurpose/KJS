// VNode class representing a Virtual DOM node
class VNode {
    constructor(type, props = {}, children = [], key = null) {
      this.type = type;
      this.props = props;
      this.children = children;
      this.key = key;
    }
  }
  
  // Function to create Virtual DOM elements
  function createElement(type, props, ...children) {
    const normalizedChildren = children.flat(); // Flatten children for easier processing
    return new VNode(type, props, normalizedChildren, props?.key);
  }
  
  // Render function: convert Virtual DOM to real DOM
  function render(vnode, container) {
    const el = createRealNode(vnode);
    container.appendChild(el);
  }
  
  // Create actual DOM node from Virtual DOM node
  function createRealNode(vnode) {
    if (typeof vnode === "string") {
      return document.createTextNode(vnode);
    }
  
    const el = document.createElement(vnode.type);
  
    // Set attributes/props
    Object.keys(vnode.props || {}).forEach(key => {
      setAttribute(el, key, vnode.props[key]);
    });
  
    // Render children recursively
    vnode.children.forEach(child => {
      el.appendChild(createRealNode(child));
    });
  
    return el;
  }
  
  // Set attributes and properties
  function setAttribute(el, key, value) {
    if (key.startsWith("on") && typeof value === "function") {
      // Event handlers
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      el.setAttribute(key, value);
    }
  }
  
  // Diff algorithm for comparing oldVNode and newVNode
  function diff(oldVNode, newVNode) {
    const patches = [];
  
    // Compare type
    if (oldVNode.type !== newVNode.type) {
      patches.push({ type: "REPLACE", newVNode });
    } else {
      // Compare props
      const propPatches = diffProps(oldVNode.props, newVNode.props);
      if (propPatches.length > 0) {
        patches.push({ type: "PROPS", propPatches });
      }
  
      // Compare children
      const childPatches = diffChildren(oldVNode.children, newVNode.children);
      if (childPatches.length > 0) {
        patches.push({ type: "CHILDREN", childPatches });
      }
    }
  
    return patches;
  }
  
  // Diff props
  function diffProps(oldProps, newProps) {
    const patches = [];
    const allProps = { ...oldProps, ...newProps };
  
    Object.keys(allProps).forEach(key => {
      const oldVal = oldProps[key];
      const newVal = newProps[key];
      if (oldVal !== newVal) {
        patches.push({ key, value: newVal });
      }
    });
  
    return patches;
  }
  
  // Diff children
  function diffChildren(oldChildren, newChildren) {
    const patches = [];
    const max = Math.max(oldChildren.length, newChildren.length);
  
    for (let i = 0; i < max; i++) {
      patches.push(diff(oldChildren[i], newChildren[i]));
    }
  
    return patches;
  }
  
  // Apply patches to the real DOM
  function patch(parent, patches) {
    patches.forEach(patch => {
      switch (patch.type) {
        case "REPLACE":
          const newEl = createRealNode(patch.newVNode);
          parent.replaceChild(newEl, parent.firstChild);
          break;
        case "PROPS":
          applyPropPatches(parent.firstChild, patch.propPatches);
          break;
        case "CHILDREN":
          applyChildPatches(parent, patch.childPatches);
          break;
        default:
          break;
      }
    });
  }
  
  // Apply property patches
  function applyPropPatches(el, propPatches) {
    propPatches.forEach(patch => {
      setAttribute(el, patch.key, patch.value);
    });
  }
  
  // Apply child patches
  function applyChildPatches(parent, childPatches) {
    childPatches.forEach((patch, i) => {
      patch(parent.childNodes[i], patch);
    });
  }
  
  export { VNode, createElement, render, diff, patch };
  