import { VNode, createElement, render, diff, patch } from './vdom.js';
import { reactive } from './reactivity.js';
import { Router } from './router.js';
import { Store } from './store.js';
import { interpolate } from './interpolation.js';
import { ErrorBoundary, KJSError } from './error-handling.js';
import { useState, useEffect, useMemo, useCallback } from './hooks.js';
import { debounce } from './utils.js'; // Utility functions for optimization

class KJS {
  constructor(config = {}) {
    this.state = reactive(config.initialState || {});  // Centralized reactive state
    this.router = new Router(config.routes || []);     // Router instance for handling routes
    this.store = new Store(config.globalState || {});  // Global state management
    this.errorBoundary = new ErrorBoundary();          // Error boundary for catching component errors
    this.components = new Map();                       // Map of components for lifecycle management
    this.hooks = { useState, useEffect, useMemo, useCallback }; // Hook system
    this.vnode = null;
    this.container = null;
    this.batchUpdates = false;  // Flag for batching updates
    this.updateQueue = [];
    this.eventListeners = [];   // Centralized event listener management
  }

  // Mount the app to the root DOM element
  mount(component, container) {
    this.container = container;
    this.component = component;
    this.update();

    // Watch for reactive state changes and update accordingly
    Object.keys(this.state).forEach(key => {
      this.state[key].subscribe(() => this.scheduleUpdate());
    });

    // Setup routing to trigger updates on route changes
    this.router.onRouteChange(() => this.scheduleUpdate());

    // Initialize performance optimizations (batching, memoization, etc.)
    this.initializePerformanceOptimizations();
  }

  // Update the virtual DOM and apply patches to the real DOM
  update() {
    try {
      const newVnode = this.errorBoundary.wrapRender(this.component, this.state);
      const patches = diff(this.vnode, newVnode);
      patch(this.container, patches);
      this.vnode = newVnode;

      // Run post-render lifecycle hooks (componentDidMount, etc.)
      this.runLifecycleHooks('componentDidMount');
    } catch (error) {
      this.handleError(error);
    }
  }

  // Schedule updates to be batched and debounced for performance
  scheduleUpdate() {
    if (this.batchUpdates) {
      this.updateQueue.push(() => this.update());
    } else {
      this.update();
    }
  }

  // Performance optimizations like debouncing, batching updates, and memoization
  initializePerformanceOptimizations() {
    // Debounce updates to prevent unnecessary re-renders
    this.scheduleUpdate = debounce(this.scheduleUpdate.bind(this), 50); // Adjust debounce delay as needed

    // Enable batching for high-frequency updates (e.g., input events)
    this.batchUpdates = true;

    // Process any pending updates in the queue
    setInterval(() => {
      if (this.updateQueue.length > 0) {
        this.updateQueue.forEach(update => update());
        this.updateQueue = [];
      }
    }, 100);
  }

  // Global event listener system to manage and clean up event bindings
  addEventListener(event, callback) {
    const listener = { event, callback };
    this.eventListeners.push(listener);
    document.addEventListener(event, callback);
  }

  removeEventListener(event, callback) {
    this.eventListeners = this.eventListeners.filter(listener => listener.event !== event || listener.callback !== callback);
    document.removeEventListener(event, callback);
  }

  // Clean up all event listeners when component unmounts
  cleanUpEventListeners() {
    this.eventListeners.forEach(listener => {
      document.removeEventListener(listener.event, listener.callback);
    });
    this.eventListeners = [];
  }

  // Run component lifecycle hooks
  runLifecycleHooks(hook) {
    const components = this.container.querySelectorAll('[data-kjs-component]');
    components.forEach(element => {
      const component = element.__kjsComponent;
      if (component && typeof component[hook] === 'function') {
        component[hook]();
      }
    });
  }

  // Error handling: log and display fallback UI
  handleError(error) {
    if (error instanceof KJSError) {
      error.logError();
    } else {
      console.error('Unhandled error:', error);
    }
    this.errorBoundary.renderFallbackUI();
  }

  // State and component reactivity
  setState(newState) {
    Object.keys(newState).forEach(key => {
      this.state[key] = newState[key];
    });
  }

  // Text interpolation system
  interpolate(template) {
    return interpolate(template, this.state);
  }

  // Hooks system (e.g., useState, useEffect)
  useState(initialValue) {
    return useState(initialValue);
  }

  useEffect(effect, deps) {
    return useEffect(effect, deps);
  }

  useMemo(factory, deps) {
    return useMemo(factory, deps);
  }

  useCallback(callback, deps) {
    return useCallback(callback, deps);
  }

  // Routing system to navigate between pages
  navigate(path) {
    this.router.navigate(path);
  }

  // Global state management (store access)
  getState() {
    return this.store.getState();
  }

  dispatch(action) {
    this.store.dispatch(action);
  }

  // Unmount the framework (clean up resources)
  unmount() {
    this.cleanUpEventListeners();
    this.vnode = null;
    this.container.innerHTML = ''; // Clear the container
  }
}

export default KJS;
