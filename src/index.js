import 'intersection-observer'

const ctx = Symbol();
let observer, observerTarget;

const infiniteScroll = {
    bind(el, binding, vnode) {
        el[ctx] = {
            el,
            vm: vnode.context,
            config: binding.value
        };
        const {
            index = 1, load, disable = false, isListBottom, listConfig = {
                maxSize: 0,
                page: 0
            }, observerOption = {
                root: null,
                rootMargin: "0px",
                threshold: [0]
            }
        } = el[ctx].config;

        if (typeof load !== "function") throw new ReferenceError('load argument must be function!');

        el[ctx].vm.$on('hook:updated', () => {
            el[ctx].vm.$nextTick(() => {
                const list = el[ctx].el;
                const listSize = list.childElementCount;
                if (!list.childNodes.length) return;
                if (index >= listSize) throw new RangeError(`max index value is ${listSize} but get ${index} !`);
                if (observer && observerTarget) observer.unobserve(observerTarget);
                observerTarget = list.childNodes.item(list.childElementCount - index);
                observer = new IntersectionObserver(([entry]) => {
                    if (entry && entry.isIntersecting) {
                        if (listSize < listConfig.maxSize) {
                           load(entry)
                        } else {
                            vnode.context[isListBottom] = true;
                            infiniteScroll.unbind(el)
                        }
                    }
                }, observerOption);

                observer.observe(list.childNodes.item(list.childElementCount - index));
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