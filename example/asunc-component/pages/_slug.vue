<template>
    <div class="post">
        <component></component>
    </div>
</template>

<script>
    export default {
        components: {
            'component': () => this.$loadComponent(import(`@/posts/${this.$route.params.slug}`), document.querySelector('.post'))
        }
        // mounted() {
        //     console.log( document.querySelector('.post'))
        //
        //     this.content = this.$loadComponent(import(`@/posts/${this.$route.params.slug}`), document.querySelector('.post'))
        // }
    }
</script>

<style src="@/assets/css/post.css"></style>