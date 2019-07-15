# v-infinite-scroll

![](https://img.shields.io/badge/license-MIT-green.svg)

A new vue infinite scroll directive achieve by intersectionObserver API and polyfill.

## Installation
`npm i v-infinite-scroll --save`

## Usage

| attribute                 | Type                 | Required | Default | Description                                                                                                                                                                                                                                                                                           |
| ------------------------ | -------------------- | -------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| disable           | boolean              | optional | true   |   
| load                     | function             | yes | -       | load more function |
| index | number               | optional | 1     | the countdown index item trig load                                                                                                                                                                                                                                                                                  |
| scroll.cb   | function               | optional | - |                                                                                                                                                |
| scroll.throttleTime             | number              | optional | 200    | listens to the window scroll instead of the actual element scroll. this allows to invoke a callback function in the scope of the element while listening to the window scroll.                                                                                                                       |                                                                                                                        |
| isListBottom   | string              | optional | -   | the date name of isListBottom                                                                                                                                                                                                                                                      |
| listConfig.maxSize               | number              | optional | -   |     max size of the list
## Example

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
        listConfig: {maxSize: 100}
    }">
    <li></li>
</ol>
```