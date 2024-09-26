// Base class for KJS components with lifecycle hooks
class Component {
    constructor(props) {
      this.props = props;
      this.state = {};
      this.isMounted = false;
    }
  
    // Lifecycle hook called before component is mounted
    componentWillMount() {}
  
    // Lifecycle hook called after component is mounted
    componentDidMount() {}
  
    // Lifecycle hook called when the component updates
    componentDidUpdate() {}
  
    // Set state method with update trigger
    setState(newState) {
      Object.assign(this.state, newState);
      this.update();
    }
  
    // Update component and trigger lifecycle
    update() {
      const oldVNode = this.vnode;
      this.vnode = this.render();
      const patches = diff(oldVNode, this.vnode);
      patch(this.container, patches);
  
      if (this.isMounted) {
        this.componentDidUpdate();
      } else {
        this.isMounted = true;
        this.componentDidMount();
      }
    }
  
    // Render method to be overridden by user component
    render() {
      throw new Error("Component's render method must be overridden");
    }
  }
  
  export { Component };
  