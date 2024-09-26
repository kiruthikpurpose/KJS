/**
 * Renders a component for testing.
 * @param {Function} component - The component to render.
 * @param {Object} props - The props to pass to the component.
 * @returns {HTMLElement} - The rendered component's root element.
 */
export function render(component, props) {
    const instance = new component(props);
    const element = instance.render();
    document.body.appendChild(element);
    return element;
}

/**
 * Cleans up the DOM after tests.
 */
export function cleanup() {
    document.body.innerHTML = '';
}
