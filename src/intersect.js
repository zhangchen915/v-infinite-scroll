const intersect = {
    bind(el, binding, vnode) {
        if (typeof binding.value === "function") binding.value = {[binding.arg]: binding.value};
        let {
            once = false,
            observerOption = {
                root: null,
                rootMargin: "0px",
                threshold: [0]
            },
            enter = undefined,
            leave = undefined,
            disable = false
        } = binding.value;

        if (binding.modifiers.once) once = true;
        if (disable) return;
        const observer = new IntersectionObserver(async ([entry]) => {
            vnode.context.$emit(entry.isIntersecting ? 'enter' : 'leave', entry);
            vnode.context.$emit('change', entry);
            if (entry.isIntersecting && enter) enter(entry);
            if (!entry.isIntersecting && leave) leave(entry);

            if (once) observer.unobserve(el);
        }, observerOption);

        observer.observe(el);
    },
    unbind(el) {
    }
};

export default {
    install: (Vue) => {
        Vue.directive("intersect", intersect)
    }
}