export function loadComponent({componentFactory, loading, loadingData ,ErrorComponent}) {
    let resolveComponent;

    return () => ({
        // We return a promise to resolve a
        // component eventually.
        component: new Promise(resolve => resolveComponent = resolve),
        loading: {
            mounted() {
                const observer = new IntersectionObserver(([entries]) => {
                    if (!entries.isIntersecting) return;
                    observer.unobserve(this.$el);
                    // The `componentFactory()` resolves
                    // to the result of a dynamic `import()`
                    // which is passed to the `resolveComponent()`
                    // function.
                    componentFactory().then(resolveComponent);
                });
                observer.observe(this.$el);
            },
            // Here we render the the component passed
            // to this function via the `loading` parameter.
            render(createElement) {
                return createElement(loading, loadingData);
            },
        },
        error: ErrorComponent,
        // Delay before showing the loading component. Default: 200ms.
        delay: 200,
        // The error component will be displayed if a timeout is
        // provided and exceeded. Default: Infinity.
        timeout: 3000
    });
}