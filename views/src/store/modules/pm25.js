import axios from '../../api/axios.js'

// state data
const state = {
	products: [],
};

// mutate state
const mutations = {
	setProducts(state, products) {
		state.products = products;
	},
};	

// action -> define app data logic
const actions = {
    // get assignemnt => GET
	getProducts({ commit }) {
		axios.get('/products').then(res => {
			// store products in State
			commit('setProducts', res.data)
		})
	},
	// add assignment => POST
	addProduct({ commit, dispatch }, formData) {
		axios.post('/add-product', formData )
			.then(res => {
				alert('product added')
				// refetch to update data
				dispatch('getProducts')
			})
	},
};

// getters return requested data
const getters = {
	// get all assignment
	products(state){
		return state.products
	},
	// get assignment list -> assignment menu
};

export default {
	state,
	mutations,
	actions,
	getters,
};
