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
            index = 1, load, observerOption = {
                root: null,
                rootMargin: "0px",
                threshold: [0]
            }
        } = el[ctx].config;

        if (typeof load !== "function") throw new Error('load argument must be function!');

        el[ctx].vm.$on('hook:updated', () => {
            el[ctx].vm.$nextTick(() => {
                const list = el[ctx].el;
                const listSize = list.childElementCount;
                if (!list.childNodes.length) return;
                if (index >= listSize) throw new Error(`max index value is ${listSize} but get ${index} !`);
                if (observer && observerTarget) observer.unobserve(observerTarget);
                observerTarget = list.childNodes.item(list.childElementCount - index);
                observer = new IntersectionObserver(([entry]) => {
                    if (entry && entry.isIntersecting) {
                        load(entry);
                        const currentIntersectionRatio = Math.floor(
                            entry.intersectionRatio * 100
                        );
                        console.log(currentIntersectionRatio)
                    }
                }, observerOption);

                observer.observe(list.childNodes.item(list.childElementCount - index));
            });
        });
    },

    unbind(el) {
        if (el && el[ctx] && observer && observerTarget)
            observer.unobserve(observerTarget);
    }
};

export default {
    install: (Vue) => {
        Vue.directive("infinite-scroll", infiniteScroll)
    }
}