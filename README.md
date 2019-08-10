# v-infinite-scroll

![](https://img.shields.io/badge/license-MIT-green.svg)

A new vue lazy load directive achieve by intersectionObserver API and polyfill.

## Installation
`npm i v-lazyload --save`

## v-infinite-scroll

| attribute                 | Type                 | Required | Default | Description                                                                                                                                                                                                                                                                                           |
| ------------------------ | -------------------- | -------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| disable           | boolean              | optional | true   ||
| load                     | function             | yes | -       | load more function |
| index | number               | optional | 1     | the countdown index item trig load                                                                                                                                                                                                                                                                                  |
| scroll.cb   | function               | optional | - |                                                                                                                                                |
| scroll.throttleTime             | number              | optional | 200    | listens to the window scroll instead of the actual element scroll. this allows to invoke a callback function in the scope of the element while listening to the window scroll.                                                                                                                       |
| isListBottom   | string              | optional | -   | the date name of isListBottom                                                                                                                                                                                                                                                      |
| max | number | optional | - | max size of the list |
| observerOption | object | optional |  | [IntersectionObserver options](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver#Parameters) |
### Example

```html
<ol  v-infinite-scroll="
     {
        load: loadList,
        index: 1,
        scroll:{
            cb: scroll,
            throttleTime: 500
        },
        isListBottom: 'isButton',
        listConfig: {maxSize: 100},
        observerOption:{}
    }">
    <li></li>
</ol>
```

## v-img
### Example

```html
<img v-img='url'>
<img v-img="{
     src:'',
     webp: url => url,
     backgroundStyle:{
            size,
            repeat,
            position
     },
     observerOption:{}  
}">
```

```js
Vue.use(loadImage,{
        loading: 'https://loading.io/spinners/double-ring/index.double-ring-spinner.svg',
        observerOption:{}
});
```

```css
img {
    width: 200px;
    height: 150px;
    transition: opacity 0.3s;
}

img[loading] {
    opacity: 0;
}
img[loaded] {
    opacity: 1;
}
```

## v-img-content

### Example

```html
<div class="img-content" v-img-content>
    <img data-src="https://source.unsplash.com/400x300/?nature,water/s1">
    <img data-src="https://source.unsplash.com/400x300/?nature,water/s2">
    <img data-src="https://source.unsplash.com/400x300/?nature,water/s3">
</div>
```
```
data-src=url
data-src={
     src:'',
     webp: url => url,
     backgroundStyle:{
            size,
            repeat,
            position
     },
     observerOption:{}  
}
```
## v-intersect

```html
<div v-intersect:enter="intersect"></div>
<div v-intersect:leave="intersect"></div>
```

## load-component

### Example

```js
Vue.use(loadComponent,{
    loading : 'div', 
    loadingData : 'loading', 
    errorComponent:  require('@/posts/404'),
    observerOption:{}
});
```

### nuxt
```vue
// loadComponent must be used in client mode
<template>
    <div class="post">
        <div style="height: 110vh"></div>
        <div :is="content"></div>
    </div>
</template>

<script>
    export default {
        components: {},
        data() {
            return {content: ''}
        },
        mounted() {
            this.content = this.$loadComponent(() => import(`content.vue`))
        }
    }
</script>
```