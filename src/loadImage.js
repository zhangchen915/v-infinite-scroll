const ctx = Symbol();
const isWebp = Symbol('webp');

function supportWebp() {
    const elem = document.createElement('canvas');
    if (!!(elem.getContext && elem.getContext('2d'))) {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
}

function config(config, option) {
    if (typeof config === "string") config = {src: config};
    return Object.assign(config, option);
}

function setUrl(el, src, backgroundStyle) {
    if (el.nodeName === "IMG") {
        el.src = src;
        el.setAttribute('loading', '');
        el.onload = () => {
            el.setAttribute('loaded', '')
        }
    } else {
        el.style.backgroundImage = `url(${src})`;
        if (backgroundStyle) {
            el.style.backgroundSize = backgroundStyle.size || 'cover';
            el.style.backgroundPosition = backgroundStyle.position || 'center';
            el.style.backgroundRepeat = backgroundStyle.repeat || 'no-repeat'
        }
    }
}

function setObserver(el) {
    let {
        src,
        webp,
        backgroundStyle,
        observerOption = {
            root: null,
            rootMargin: "0px",
            threshold: [0]
        }
    } = el[ctx].config;

    if (!src) return;

    const observer = new IntersectionObserver(([entry]) => {
        if (entry && entry.isIntersecting) {
            if (el[ctx].content) {
                if (webp) src = window[isWebp] ? src.map(e => webp(e)) : src;
                el[ctx].content.forEach((e, i) => setUrl(e, src[i], backgroundStyle))
            } else {
                if (webp) src = window[isWebp] ? webp(src) : src;
                setUrl(el, src, backgroundStyle)
            }
            observer.unobserve(el);
            el[ctx] = null;
        }
    }, observerOption);
    observer.observe(el);
}

const loadImage = option => ({
    bind(el, binding, vnode) {
        el[ctx] = {
            vm: vnode.context,
            config: binding.value
        };

        el[ctx].config = config(binding.value, option);

        if (el[ctx].config.loading) el.src = el[ctx].config.loading;
    },
    inserted(el) {
        setObserver(el)
    },
    unbind(el) {
        el[ctx] = null;
    }
});

const loadImageContent = option => ({
    bind(el, binding, vnode) {
        const els = Array.from(el.querySelectorAll('[data-src]'));
        option.src = els.map(e => e.getAttribute('data-src'));
        el[ctx] = {
            vm: vnode.context,
            config: option,
            content: els
        };
        if (els.length && option.loading) els.forEach(e => setUrl(e, option.loading))
    },
    inserted(el) {
        if (!el[ctx].content.length) return;
        setObserver(el)
    },
});

export default {
    install: (Vue, options = {}) => {
        document.styleSheets[0].insertRule('img:not([src]) {opacity: 0;}');
        window[isWebp] = supportWebp();
        if (options.loading) new Image().src = options.loading;
        if (options.webp && typeof options.webp !== "function") throw new ReferenceError('webp must be function!');
        Vue.directive("img", loadImage(options));
        Vue.directive("img-content", loadImageContent(options))
    }
}