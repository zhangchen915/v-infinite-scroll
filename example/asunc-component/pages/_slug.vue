<template>
    <div class="post">
        <div v-if="component" :is="component"></div>
    </div>
</template>

<script>
    // See https://vuejs.org/v2/guide/components.html#Advanced-Async-Components
    let resolveComponent;

    const getPost = slug => ({
        component: new Promise(resolve => resolveComponent = resolve),
        loading: {
            mounted() {
                setTimeout(() => {
                    console.log(slug)
                    import(`@/posts/${slug}`).then(res => {
                        console.log(res)
                        resolveComponent(res)
                    });
                }, 2000)
            },
        },
        error: require('@/posts/404')
    });

    export default {
        comments() {
        },
        created() {
            this.component = () => getPost(this.$route.params.slug)
        }
    }
</script>

<style src="@/assets/css/post.css"></style>