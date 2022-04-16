import axios from "../../api/api";

// state data
const state = {
	data5a: null,
	data5b: null,
	data5c: null,
	data5d: null,
	data5e: null,
	data5f: null,
};

// mutate state
const mutations = {
	set5a(state, data) {
		state.data5a = data;
	},

	set5b(state, data) {
		state.data5b = data;
	},

	set5c(state, data) {
		state.data5c = data;
	},

	set5d(state, data) {
		state.data5d = data;
	},

	set5e(state, data) {
		state.data5e = data;
	},

	set5f(state, data) {
		state.data5f = data;
	},
};

// action -> define app data logic
const actions = {
	// get assignemnt => GET
	get4a() {
		window.open(`${axios.defaults.baseURL}/countries-pm25-gte-50-in-2015.xlsx`);
	},
	// add assignment => POST
	get4b() {
		window.open(`${axios.defaults.baseURL}/avg-pm25-by-countries-desc.xlsx`);
	},
	get4c({}, payload) {
		window.open(`${axios.defaults.baseURL}/${payload.country}/historical-pm25-by-year.xlsx`);
	},
	get4d({}, payload) {
		window.open(`${axios.defaults.baseURL}/${payload.year}/${payload.color}/total-affected-populations.xlsx`);
	},

	get5a({ commit }, payload) {
		axios
			.get(`/city-points-of-all-countries/${payload.year}`)
			.then((res) => {
				let point = res.data.map((item) => {
					return [item.longtitude, item.latitude];
				});
				if (point.length === 0) {
					point = [[0,0]];
				}
				let city = res.data.map(item => {
					return item.city
				})
				let data = {
					point,
					city
				}

				commit("set5a", data);
			});
	},
	// add assignment => POST
	get5b({ commit }) {
		axios.get(`/50-city-points-closest-to-bangkok`).then((res) => {
			let point = res.data.map((item) => {
				return [item.longtitude, item.latitude];
			});
			if (point.length === 0) {
				point = [[0,0]];
			}
			let city = res.data.map(item => {
				return item.city
			})
			let data = {
				point,
				city
			}

			commit("set5b", data);
		});
	},
	get5c({ commit }) {
		axios.get(`/city-points-of-thailand-neighbors-in-2018`).then((res) => {
			let point = res.data.map((item) => {
				return [item.longtitude, item.latitude];
			});
			if (point.length === 0) {
				point = [[0,0]];
			}
			let city = res.data.map(item => {
				return item.city
			})
			let data = {
				point,
				city
			}
			commit("set5c", data);
		});
	},

	get5d({ commit }) {
		axios
			.get(`/4-points-of-mbr-covering-city-points-in-thailand-in-2009`)
			.then((res) => {
				let point = res.data.map((item) => {
					return [item.latitude, item.longtitude];
				});
				if (point.length === 0) {
					point = [[0,0]];
				}
				let city = res.data.map(item => {
					return item.city
				})
				
				let data = {
					point,
					city
				}

				commit("set5d", data);
			});
	},
	get5e({ commit }) {
		axios
			.get(`/city-points-of-countries-having-highest-city-points-in-2011`)
			.then((res) => {
				let point = res.data.map((item) => {
					return [item.latitude, item.longtitude];
				});
				if (point.length === 0) {
					point = [[0,0]];
				}
				let city = res.data.map(item => {
					return item.city
				})
				let data = {
					point,
					city
				}
				commit("set5e", data);
			});
	},
	get5f({ commit }, payload) {
		axios
			.get(`/city-points-have-low-income/${payload.year}`)
			.then((res) => {
				let point = res.data.map((item) => {
					return [item.latitude, item.longtitude];
				});
				if (point.length === 0) {
					point = [[0,0]];
				}
				let city = res.data.map(item => {
					return item.city
				})
				let data = {
					point,
					city
				}
				commit("set5f", data);
			});
	},
};

// getters return requested data
const getters = {
	data5a(state) {
		return state.data5a;
	},
	data5b(state) {
		return state.data5b;
	},
	data5c(state) {
		return state.data5c;
	},
	data5d(state) {
		return state.data5d;
	},
	data5e(state) {
		return state.data5e;
	},
	data5f(state) {
		return state.data5f;
	},
};

export default {
	state,
	mutations,
	actions,
	getters,
};
