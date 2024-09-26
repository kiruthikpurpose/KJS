/**
 * Debounces a function to limit the rate at which it can fire.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Function} - The debounced function.
 */
export function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Throttles a function to limit how often it can be called.
 * @param {Function} func - The function to throttle.
 * @param {number} limit - The time in milliseconds to limit calls.
 * @returns {Function} - The throttled function.
 */
export function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function (...args) {
        if (!lastRan) {
            func.apply(this, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(this, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

/**
 * Deeply clones an object or array.
 * @param {Object|Array} obj - The object or array to clone.
 * @returns {Object|Array} - The cloned object or array.
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
