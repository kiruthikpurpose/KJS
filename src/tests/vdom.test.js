import { createElement } from '../core/vdom.js';

describe('Virtual DOM', () => {
    test('should create a virtual DOM element', () => {
        const vElement = createElement('div', { id: 'test' }, 'Hello World');
        expect(vElement).toEqual({
            tag: 'div',
            props: { id: 'test' },
            children: ['Hello World']
        });
    });

    // Add more tests related to the virtual DOM functionality
});
