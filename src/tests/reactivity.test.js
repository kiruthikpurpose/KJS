import { reactive, watch } from '../core/reactivity.js';

describe('Reactivity', () => {
    test('should create a reactive object', () => {
        const state = reactive({ count: 0 });
        expect(state.count).toBe(0);
        
        state.count++;
        expect(state.count).toBe(1);
    });

    test('should watch for changes', () => {
        const state = reactive({ name: 'John' });
        let nameChanged = false;
        
        watch(state, 'name', () => {
            nameChanged = true;
        });
        
        state.name = 'Doe';
        expect(nameChanged).toBe(true);
    });

    // Add more tests for reactivity functions
});
