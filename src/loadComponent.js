function asyncComponent({componentFactory, loading, loadingData, ErrorComponent}) {
    let resolveComponent;

    return () => ({
        component: new Promise(resolve => resolveComponent = resolve),
        loading: {
            mounted() {
                const observer = new IntersectionObserver(([entries]) => {
                    if (!entries.isIntersecting) return;
                    observer.unobserve(this.$el);
                    componentFactory().then(resolveComponent);
                });
                observer.observe(this.$el);
            },
            render(createElement) {
                return createElement(loading, loadingData);
            },
        },
        error: ErrorComponent,
        delay: 200,
        timeout: 3000
    });
}

export default {
    install: (Vue, option) => {
        Vue.prototype.$loadComponent = componentFactory =>
            asyncComponent(Object.assign(option, {componentFactory}))
    }
}