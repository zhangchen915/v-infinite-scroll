import Vue from 'vue';

import {loadComponent} from '../../../src/index'

Vue.use(loadComponent,{
    errorComponent:  require('@/posts/404')
});