class Router {
    constructor(routes = []) {
        this.routes = routes;  // Array of route definitions { path: '/home', component: HomeComponent }
        this.currentPath = window.location.pathname;  // Get the initial URL path
        this.onRouteChangeCallback = null;  // Callback to trigger re-renders

        this.init();
    }

    // Initialize the router to listen for URL changes
    init() {
        // Handle browser back/forward navigation
        window.addEventListener('popstate', () => {
            this.currentPath = window.location.pathname;
            this.renderComponent();
        });
    }

    // Register the callback to be run when the route changes
    onRouteChange(callback) {
        this.onRouteChangeCallback = callback;
    }

    // Navigate to a specific path
    navigate(path) {
        if (this.currentPath !== path) {
            this.currentPath = path;
            window.history.pushState({}, '', path);  // Update the URL without reloading the page
            this.renderComponent();
        }
    }

    // Find the route that matches the current URL and render the corresponding component
    renderComponent() {
        const route = this.routes.find(r => r.path === this.currentPath);
        if (route && typeof this.onRouteChangeCallback === 'function') {
            this.onRouteChangeCallback(route.component);  // Call the callback with the matching component
        } else {
            console.error(`No route matches path: ${this.currentPath}`);
        }
    }
}

export { Router };
