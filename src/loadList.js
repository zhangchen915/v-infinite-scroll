import {throttle} from 'throttle-debounce'

const ctx = Symbol();
let observer, observerTarget;
let currentListSize = 0;

function scrollPosition(el) {
    const parent = el.parentNode;
    return (el.scrollTop || parent.scrollTop) / (el.scrollHeight - el.clientHeight) * 100;
}

const infiniteScroll = {
    bind(el, binding, vnode) {
        el[ctx] = {
            vm: vnode.context,
            config: binding.value
        };
        const {
            index = 1, load, loading = '', disable = false, isListBottom, scroll = {
                throttleTime: 200
            }, max, observerOption = {
                root: null,
                rootMargin: "0px",
                threshold: [0]
            }
        } = el[ctx].config;

        if (typeof load !== "function") throw new ReferenceError('load argument must be function!');

        if (scroll && scroll.throttleTime) el.addEventListener('scroll', throttle(scroll.throttleTime, true,
            e => scroll.cb(scrollPosition(el), e)), true);

        const loadList = async entry => {
            if (loading) {
                vnode.context[loading] = true;
                await load(entry);
                vnode.context[loading] = false;
            } else {
                await load(entry);
            }
        };

        loadList();

        el[ctx].vm.$on('hook:updated', () => {
            if (disable) return;
            el[ctx].vm.$nextTick(() => {
                const listSize = el.childElementCount;
                if (!listSize || currentListSize === listSize || listSize <= index) return;
                if (index >= listSize) throw new RangeError(`max index value is ${listSize} but get ${index} !`);
                if (observer && observerTarget) observer.unobserve(observerTarget);

                currentListSize = listSize;
                observerTarget = el.childNodes.item(el.childElementCount - index);
                observer = new IntersectionObserver(async ([entry]) => {
                    if (!entry.isIntersecting) return;
                    if (max && listSize > max) {
                        vnode.context[isListBottom] = true;
                        infiniteScroll.unbind(el);
                    } else {
                        await loadList(entry)
                    }
                }, observerOption);

                observer.observe(el.childNodes.item(el.childElementCount - index));
            });
        });
    },
    unbind(el) {
        if (el && el[ctx] && observer && observerTarget)
            observer.unobserve(observerTarget);
        observer = null;
        observerTarget = null;
    }
};

export default {
    install: (Vue) => {
        Vue.directive("infinite-scroll", infiniteScroll)
    }
}