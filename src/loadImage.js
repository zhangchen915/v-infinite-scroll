const ctx = Symbol();
const isWebp = Symbol('webp');

function supportWebp() {
    const elem = document.createElement('canvas');
    if (!!(elem.getContext && elem.getContext('2d'))) {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
}

const loadImage = option => ({
    bind(el, binding, vnode) {
        el[ctx] = {
            vm: vnode.context,
            config: binding.value
        };

        if (typeof binding.value === "string") el[ctx].config = {src: binding.value};
        el[ctx].config = Object.assign(el[ctx].config, option);

        if (el[ctx].config.loading) el.src = el[ctx].config.loading;
    },
    inserted(el, binding, vnode) {
        const {
            webp,
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

        if (!el[ctx].config.src) return;
        const observer = new IntersectionObserver(([entry]) => {
            let src = el[ctx].config.src;
            if (webp) src = window[isWebp] ? webp(src) : src;
            if (entry && entry.isIntersecting) {
                el.nodeName === "IMG" ? el.src = src : el.style.backgroundImage = `url(${src})`;
                observer.unobserve(el);
                el[ctx] = null;
            }
        }, observerOption);
        observer.observe(el);
    },
    unbind(el) {
    }
});

const loadImageContent = option => ({});

export default {
    install: (Vue, options = {}) => {
        document.styleSheets[0].insertRule('img:not([src]) {opacity: 0;}');
        window[isWebp] = supportWebp();
        if (options.loading) new Image().src = options.loading;
        if (options.webp && typeof options.webp !== "function") throw new ReferenceError('webp must be function!');
        Vue.directive("img", loadImage(options));
        Vue.directive("img-content", loadImageContent)
    }
}