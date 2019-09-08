<template>
    <div class="list-wrap">
        <div class="list" ref="list">
            <div :key="sentry + i" class="item" v-for="(e, i) in listContent">
                <slot :index="sentry + i" :line="e"></slot>
            </div>
        </div>
    </div>
</template>

<script>
    const LIST_SIZE = 16;

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
                observer: [],
                itemHeight: 0
            }
        },
        async created() {
            await this.getMore();
            this.setContent();
            this.$nextTick().then(() => {
                this.observer = [
                    void 0,
                    observer(this.$refs.list.childNodes[LIST_SIZE - 1], this.nextBlock)
                ];
                this.itemHeight = document.querySelector('.item').offsetHeight;
            })
        },
        methods: {
            setContent(size = LIST_SIZE) {
                this.listContent = this.content.slice(this.sentry, this.sentry + size)
            },
            async getMore() {
                this.content = [...this.content, ...(await this.load())]
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
                    this.$refs.list.style.paddingTop = `${this.itemHeight * this.sentry}px`;
                    this.resetObserver()
                })
            },
            async nextBlock() {
                this.observer.map(e => {
                    if (e) e.disconnect()
                });
                this.sentry += LIST_SIZE / 2;
                if (this.sentry + LIST_SIZE >= this.bottomSentry) {
                    this.bottomSentry = this.sentry + LIST_SIZE;
                    this.$refs.list.style.height = `${this.itemHeight *
                    this.bottomSentry}px`
                }
                if (this.content.length <= this.sentry + LIST_SIZE) await this.getMore();

                this.setContent();
                this.$nextTick(() => {
                    this.$refs.list.style.paddingTop = `${this.itemHeight * this.sentry}px`;
                    this.resetObserver()
                })
            }
        }
    }
</script>

<style scoped>
    .list-wrap {
        display: flex;
        height: 98vh;
        overflow-y: scroll;
    }

    .list {
        box-sizing: border-box;
    }
</style>
