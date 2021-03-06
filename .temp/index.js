import Vue from 'vue';

import weex from 'weex-vue-render';

import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

// import render-core.
// import weex from 'weex-vue-render/dist/index.core';

// need to run `npm i weex-vue-slider weex-vue-stream --save` frist.
// import the plugins (components and modules) you want to use.
// import slider from 'weex-vue-slider';
// import stream from 'weex-vue-stream';

// install the plugins.
// weex.install(slider);
// weex.install(stream);

weex.init(Vue);

import App from '../src/index.vue';
App.el = '#root';
new Vue(App);
