<template>
    <div class="post">
        <div style="height: 110vh"></div>
        <div class="wrap">
            <div :is="content"></div>
        </div>
    </div>
</template>

<script>
    export default {
        components: {},
        data() {
            return {content: ''}
        },
        mounted() {
            this.content = this.$loadComponent(() => import(`@/posts/${this.$route.params.slug}`), document.querySelector('.wrap'))
        }
    }
</script>

<style src="@/assets/css/post.css"></style>