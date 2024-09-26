import { KJS } from '../kjs.js';

// Define a simple component
class CounterComponent {
    constructor(props) {
        this.state = { count: props.initialCount || 0 };
    }

    increment() {
        this.state.count++;
        this.render();
    }

    render() {
        return `
            <div>
                <h1>Count: ${this.state.count}</h1>
                <button id="increment">Increment</button>
            </div>
        `;
    }

    mount(container) {
        container.innerHTML = this.render();
        container.querySelector('#increment').addEventListener('click', () => this.increment());
    }
}

// Initialize the KJS application
const app = new KJS({
    initialState: { count: 0 },
});

// Mount the counter component
const container = document.getElementById('app');
const counter = new CounterComponent({ initialCount: 0 });
counter.mount(container);
