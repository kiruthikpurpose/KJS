// Create an Observable class for handling subscriptions
class Observable {
    constructor(value) {
        this.value = value;
        this.subscribers = new Set();
    }

    get() {
        return this.value;
    }

    set(newValue) {
        if (newValue !== this.value) {
            this.value = newValue;
            this.notify();
        }
    }

    subscribe(callback) {
        this.subscribers.add(callback);
    }

    unsubscribe(callback) {
        this.subscribers.delete(callback);
    }

    notify() {
        this.subscribers.forEach(callback => callback(this.value));
    }
}

// Reactive system using Proxy to detect changes in state
function reactive(target) {
    return new Proxy(target, {
        get(target, prop, receiver) {
            const value = Reflect.get(target, prop, receiver);
            if (typeof value === 'object' && value !== null) {
                return reactive(value); // Nested reactivity
            }
            return value;
        },
        set(target, prop, value, receiver) {
            const oldValue = target[prop];
            const result = Reflect.set(target, prop, value, receiver);
            if (oldValue !== value) {
                // Notify changes to all reactive subscribers
                triggerReactivity(target, prop);
            }
            return result;
        }
    });
}

// Store reactive dependencies for state reactivity
const dependencyMap = new WeakMap();

// Track function calls that should re-run when state changes
function trackReactivity(target, key, effect) {
    let deps = dependencyMap.get(target);
    if (!deps) {
        deps = new Map();
        dependencyMap.set(target, deps);
    }

    let depEffects = deps.get(key);
    if (!depEffects) {
        depEffects = new Set();
        deps.set(key, depEffects);
    }
    
    if (effect) {
        depEffects.add(effect);
    }
}

// Notify all tracked dependencies when a state property changes
function triggerReactivity(target, key) {
    const deps = dependencyMap.get(target);
    if (deps) {
        const effects = deps.get(key);
        if (effects) {
            effects.forEach(effect => effect());
        }
    }
}

// Utility for computed properties (getter-based reactivity)
function computed(getter) {
    let value;
    const effect = () => {
        value = getter();
    };
    trackReactivity(effect);
    effect(); // Run initially to cache the computed value

    return {
        get value() {
            return value;
        }
    };
}

// Exporting the reactive system components
export { Observable, reactive, computed };
