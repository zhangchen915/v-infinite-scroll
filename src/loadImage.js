const ctx = Symbol();

function assign(target, source) {
    if (typeof source !== "object") return source;
    for (let key in source) {
        if (source.hasOwnProperty(key)) target[key] = typeof source[key] === "object" ? assign(source[key]) : source[key];
    }
    return target;
}

const loadImage = option => ({
    bind(el, binding, vnode) {
        el[ctx] = {
            vm: vnode.context,
            config: binding.value
        };

        if (typeof binding.value === "string") el[ctx].config = {src: binding.value};
        el[ctx].config = assign(el[ctx].config, option);

        const {
            loading = '',
            // TODO
            backgroundConfig = {
                size: 'cover',
                position: 'center',
                repeat: 'no-repeat'
            },
            observerOption = {
                root: null,
                rootMargin: "0px",
                threshold: [0]
            }
        } = el[ctx].config;

        if (el[ctx].config.loading) el.src = el[ctx].config.loading;
    },
    inserted(el, binding, vnode) {
        if (!el[ctx].config.src) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry && entry.isIntersecting) {
                el.nodeName === "IMG" ? el.src = el[ctx].config.src : el.style.backgroundImage = `url(${el[ctx].config.src})`;
                observer.unobserve(el);
            }
        }, el[ctx].config.observerOption);
        observer.observe(el);
    },
    unbind(el) {
    }
});

const loadImageContent = option => ({});

export default {
    install: (Vue, options = {}) => {
        document.styleSheets[0].insertRule('img:not([src]) {opacity: 0;}');
        if (options.loading) new Image().src = options.loading;
        Vue.directive("img", loadImage(options));
        Vue.directive("img-content", loadImageContent)
    }
}