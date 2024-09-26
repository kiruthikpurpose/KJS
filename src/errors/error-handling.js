// Custom KJS Error Class
class KJSError extends Error {
    constructor(message, component) {
        super(message);
        this.name = 'KJSError';
        this.component = component || 'Unknown component';
        this.timestamp = new Date();
    }

    logError() {
        console.error(`[${this.timestamp}] Error in ${this.component}: ${this.message}`);
    }
}

// ErrorBoundary Class for catching errors in components
class ErrorBoundary {
    constructor() {
        this.hasError = false;
        this.error = null;
        this.errorInfo = null;
    }

    // Wrap the component rendering in try-catch
    wrapRender(component, state) {
        try {
            this.hasError = false;
            return component(state); // Render the component as usual if no error occurs
        } catch (error) {
            this.hasError = true;
            this.error = error;
            this.handleError(error);
            return this.renderFallbackUI(); // Render fallback UI if an error occurs
        }
    }

    // Custom method to handle errors
    handleError(error) {
        if (error instanceof KJSError) {
            error.logError();
        } else {
            console.error('An unexpected error occurred:', error);
        }

        // Optionally, send error details to a logging service or server
        this.errorInfo = {
            message: error.message,
            stack: error.stack
        };
    }

    // Fallback UI that gets rendered when an error occurs
    renderFallbackUI() {
        const fallbackElement = document.createElement('div');
        fallbackElement.style.color = 'red';
        fallbackElement.style.textAlign = 'center';
        fallbackElement.style.marginTop = '20px';
        fallbackElement.innerText = 'Something went wrong! Please try again later.';
        return fallbackElement;
    }

    // Method to reset error state (for recovering from errors)
    resetError() {
        this.hasError = false;
        this.error = null;
        this.errorInfo = null;
    }
}

export { KJSError, ErrorBoundary };
