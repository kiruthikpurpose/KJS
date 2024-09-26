import { createStore } from '../state/store.js';

describe('Store', () => {
    test('should initialize with default state', () => {
        const store = createStore({ count: 0 });
        expect(store.state.count).toBe(0);
    });

    test('should update the state', () => {
        const store = createStore({ count: 0 });
        store.setState({ count: 1 });
        expect(store.state.count).toBe(1);
    });

    // Add more tests related to state management
});
