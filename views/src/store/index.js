import Vue from "vue";
import Vuex from "vuex";

import pm25 from "./modules/pm25.js";

// State management in vue
Vue.use(Vuex);

export default new Vuex.Store({
	// defined module used
	modules: {
		pm25
	},
});
