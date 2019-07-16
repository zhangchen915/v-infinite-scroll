const ctx = Symbol();

const loadImage = {
    bind(el, binding, vnode) {
        el[ctx] = {
            vm: vnode.context,
            config: binding.value
        };
        const {
            observerOption = {
                root: null,
                rootMargin: "0px",
                threshold: [0]
            }
        } = el[ctx].config;

        el[ctx].vm.$on('hook:updated', () => {
            // if (!url) return;
            const observer = new IntersectionObserver(([entry]) => {
                if (entry && entry.isIntersecting) {
                    //TODO set src
                    observer.unobserve(el)
                }
            }, observerOption);
            observer.observe(el);
        });
    },
    unbind(el) {

    }
};

const loadImageContent = {}

export default {
    install: (Vue) => {
        document.styleSheets[0].insertRule('img:not([src]) {opacity: 0;}');
        Vue.directive("img", loadImage);
        Vue.directive("img-content", loadImageContent)
    }
}