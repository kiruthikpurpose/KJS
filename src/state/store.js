class Store {
    constructor(initialState = {}) {
        this.state = initialState;
        this.subscribers = new Set();
    }

    // Get the current state
    getState() {
        return this.state;
    }

    // Update the state and notify subscribers
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }

    // Subscribe to state changes
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);  // Unsubscribe method
    }

    // Notify all subscribers about the state change
    notify() {
        this.subscribers.forEach(callback => callback(this.state));
    }

    // Action dispatcher for modifying state via reducers (optional)
    dispatch(action) {
        if (typeof action === 'function') {
            action(this);
        } else if (typeof action === 'object' && action.type) {
            this.setState(action.payload);
        }
    }
}

export { Store };
