import Vue from '../node_modules/vue';

import {loadComponent} from '../../../src/index'

Vue.use(loadComponent,{
    error:  require('@/posts/404')
});