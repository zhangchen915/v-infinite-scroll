export function loadComponent({componentFactory, loading, loadingData}) {
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
    });
}