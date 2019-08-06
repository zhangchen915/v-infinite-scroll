function asyncComponent({componentFactory, wrapElement, loading, loadingData, ErrorComponent, observerOption}) {
    let resolveComponent;
    return () => ({
        component: new Promise(resolve => resolveComponent = resolve),
        loading: {
            mounted() {
                const observer = new IntersectionObserver(([entries]) => {
                    if (!entries.isIntersecting) return;
                    observer.unobserve(wrapElement);
                    componentFactory().then(resolveComponent);
                }, observerOption = {
                    root: null,
                    rootMargin: "0px",
                    threshold: [0]
                });
                observer.observe(wrapElement);
            },
            render(h) {
                return h(loading, loadingData);
            },
        },
        error: ErrorComponent,
        delay: 200
    });
}

export default {
    install: (Vue, option) => {
        Vue.prototype.$loadComponent = (componentFactory, wrapElement) => {
            return asyncComponent(Object.assign(option, {
                componentFactory,
                wrapElement
            }))
        }
    }
}