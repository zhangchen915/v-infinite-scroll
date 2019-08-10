function asyncComponent({componentFactory, loading = 'div', loadingData = 'loading', errorComponent, observerOption}) {
    let resolveComponent;
    return () => ({
        component: new Promise(resolve => resolveComponent = resolve),
        loading: {
            mounted() {
                const observer = new IntersectionObserver(([entries]) => {
                    if (!entries.isIntersecting) return;
                    observer.unobserve(this.$el);
                    componentFactory().then(resolveComponent);
                }, observerOption = {
                    root: null,
                    rootMargin: "0px",
                    threshold: [0]
                });
                observer.observe(this.$el);
            },
            render(h) {
                return h(loading, loadingData);
            },
        },
        error: errorComponent,
        delay: 200
    });
}

export default {
    install: (Vue, option) => {
        Vue.prototype.$loadComponent = componentFactory => {
            return asyncComponent(Object.assign(option, {
                componentFactory
            }))
        }
    }
}