/**
 * Interpolates values into a string template based on state.
 * Replaces {{key}} with the corresponding state value.
 * 
 * @param {string} template - The template string containing {{key}} placeholders.
 * @param {object} state - The reactive state object.
 * @returns {string} - The template string with values interpolated.
 */
function interpolate(template, state) {
    // A regex pattern to match {{ variable }} placeholders in the template
    return template.replace(/\{\{(.+?)\}\}/g, (match, key) => {
        const trimmedKey = key.trim(); // Remove any unnecessary whitespace from the key
        return state.hasOwnProperty(trimmedKey) ? state[trimmedKey] : ''; // Replace with the corresponding state value
    });
}

export { interpolate };
