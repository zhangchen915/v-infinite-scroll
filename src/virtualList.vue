<template>
    <div class="list-wrap" >
        <div class="list" ref="list">
            <div  :key="sentry + i" v-for="(e, i) in listContent">
                <slot :item="e" class="item"></slot>
            </div>
        </div>
    </div>
</template>

<script>
    const LIST_SIZE = 14;

    function observer(el, cb) {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry && entry.isIntersecting) {
                    cb();
                    observer.unobserve(el)
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: [0]
            }
        );
        observer.observe(el);
        return observer
    }

    export default {
        props: {
            load: {type: Function}
        },
        data() {
            return {
                content: [],
                listContent: [],
                sentry: 0,
                style: {},
                bottomSentry: LIST_SIZE,
                observer: []
            }
        },
        created() {
            this.getMore();
            this.setContent()
        },
        mounted() {
            this.observer = [
                void 0,
                observer(this.$refs.list.childNodes[LIST_SIZE - 1], this.nextBlock)
            ]
        },
        methods: {
            setContent(size = LIST_SIZE) {
                this.listContent = this.content.slice(this.sentry, this.sentry + size)
            },
            getMore() {
                this.content = [...this.content, ...this.load()]
            },
            resetObserver() {
                this.observer = [
                    this.sentry
                        ? observer(this.$refs.list.childNodes[0], this.preBlock)
                        : '',
                    observer(this.$refs.list.childNodes[LIST_SIZE - 1], this.nextBlock)
                ]
            },
            preBlock() {
                this.sentry -= LIST_SIZE / 2;
                this.$nextTick(() => {
                    this.$refs.list.style.paddingTop = `${20 * this.sentry}vh`;
                    this.resetObserver()
                })
            },
            nextBlock() {
                this.observer.map(e => {
                    if (e) e.disconnect()
                });
                this.sentry += LIST_SIZE / 2;
                if (this.sentry + LIST_SIZE > this.bottomSentry) {
                    this.bottomSentry = this.sentry + LIST_SIZE;
                    this.$refs.list.style.height = `${20 * this.bottomSentry}vh`;
                }
                if (this.content.length <= this.sentry + LIST_SIZE) this.getMore(); // awaite

                this.setContent();
                this.$nextTick(() => {
                    this.$refs.list.style.paddingTop = `${20 * this.sentry}vh`;
                    this.resetObserver()
                })
            }
        }
    }
</script>

<style scoped>
    .list-wrap {
        height: 98vh;
        overflow-y: scroll;
    }

    .list {
        box-sizing: border-box;
    }

    .item {
        height: 20vh;
        text-align: center;
        border: dashed 1px gray;
    }
</style>
