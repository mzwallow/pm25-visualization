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
	get4a() {
		window.open(
			"http://139.59.219.252:3000/countries-pm25-gte-50-in-2015.xlsx"
		);
	},
	// add assignment => POST
	get4b() {
		window.open(
			"http://139.59.219.252:3000/avg-pm25-by-countries-desc.xlsx"
		);
	},
	get4c({}, payload) {
		window.open(
			`http://139.59.219.252:3000/${payload.country}/historical-pm25-by-year.xlsx`
		);
	},
	get4d({}, payload) {
		window.open(
			`http://139.59.219.252:3000/${payload.year}/:color/total-affected-populations.xlsx`
		);
	},

	get5a() {
		window.open(
			"http://139.59.219.252:3000/countries-pm25-gte-50-in-2015.xlsx"
		);
	},
	// add assignment => POST
	get5b() {
		window.open(
			"http://139.59.219.252:3000/avg-pm25-by-countries-desc.xlsx"
		);
	},
	get5c({}, payload) {
		window.open(
			`http://139.59.219.252:3000/${payload.country}/historical-pm25-by-year.xlsx`
		);
	},
	get5d({}, payload) {
		window.open(
			`http://139.59.219.252:3000/${payload.year}/:color/total-affected-populations.xlsx`
		);
	},
	get5d({}, payload) {
		window.open(
			`http://139.59.219.252:3000/${payload.year}/:color/total-affected-populations.xlsx`
		);
	},
	get5d({}, payload) {
		window.open(
			`http://139.59.219.252:3000/${payload.year}/:color/total-affected-populations.xlsx`
		);
	},
};

// getters return requested data
const getters = {};

export default {
	state,
	mutations,
	actions,
	getters,
};
