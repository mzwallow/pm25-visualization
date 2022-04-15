import Vue from 'vue';
import App from './App.vue';

import router from './router';
import store from './store';

import vuetify from './plugins/vuetify';

import axios from 'axios';

// Plugin used
// Vuetify -> pre-build ui component
// store -> State Management -> store data
// axios -> HTTP Request API
// router -> apps router

new Vue({
	router,
	store,
	vuetify,
	axios,
	render: (h) => h(App),
}).$mount('#app');
