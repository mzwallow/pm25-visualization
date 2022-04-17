import axios from "../../api/api";

// state data
const state = {
	data5a: null,
	data5b: null,
	data5c: null,
	data5d: null,
	data5e: null,
	data5f: null,
	uploadStatus: null,
	componentKey: 0
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
	setUploadStatus(state, data) {
		state.uploadStatus = data;
	},
	setComponentKey(state, data) {
		state.componentKey += 1;
	},
};

// action -> define app data logic
const actions = {
	uploadFile({dispatch}, payload){
		dispatch('getProcess')
		axios.post("/air-pollution/upload", payload.formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		})
		.then((res) => {
			
		})
		.catch((err) => {
			this.$refs.fileInput.remove();
			alert("เกิดข้อผิดพลาด");
		});
	},

	getProcess({commit, dispatch}){
		axios.get('/air-pollution/process')
			.then(res => {
				if(res.data.message.split(" ")[0] !== "Success"){
					commit('setUploadStatus', res.data.message)
					setTimeout(() => {
						dispatch('getProcess')
					}, 5000)
				} else {
					commit('setUploadStatus', res.data.message)
					alert("อัพโหลดสำเร็จ");
					dispatch("get5a",{ year: 2016 });
					dispatch("get5b");
					dispatch("get5c");
					dispatch("get5d");
					dispatch("get5e");
					dispatch("get5f", { year: 2016 });
					commit('setComponentKey')
					window.open(`${axios.defaults.baseURL}/air-pollution/error.log`)
				}
			})
			.catch(err => {
				alert("เกิดข้อผิดพลาด " + err)
			})
	},
	deleteData({commit, dispatch}){
		axios.delete('/air-pollution')
			.then(res => {
				alert('Delete Data Successfully')
				commit('setUploadStatus', null)
				dispatch("get5a",{ year: 2016 });
				dispatch("get5b");
				dispatch("get5c");
				dispatch("get5d");
				dispatch("get5e");
				dispatch("get5f", { year: 2016 });
				commit('setComponentKey')
			})
			.catch(err => {
				alert('เกิดข้อผิดพลาด ' + err)
			})
	},

	getLog() {
		window.open(`${axios.defaults.baseURL}/air-pollution/error.log`);
	},
	get4a() {
		window.open(`${axios.defaults.baseURL}/countries-pm25-gte-50-in-2015.xlsx`);
	},
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
					return [item.Geom.points[0].x, item.Geom.points[0].y];
				});
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
				return [item.Geom.points[0].x, item.Geom.points[0].y];
			});
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
				return [item.Geom.points[0].x, item.Geom.points[0].y];
			});
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
				let point
				if(res.data[0][""] !== null){
					point = res.data[0][""].points.map((item) => {
						return [item.x, item.y];
					});
				} else {
					point = []
				}
				
				let city = res.data.map(item => {
					return 'MBR'
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
					return [item.Geom.points[0].x, item.Geom.points[0].y];
				});
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
					return [item.Geom.points[0].x, item.Geom.points[0].y];
				});
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
	uploadStatus(state) {
		return state.uploadStatus;
	},
	componentKey(state) {
		return state.componentKey;
	},
};

export default {
	state,
	mutations,
	actions,
	getters,
};
