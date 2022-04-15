import axios from "axios";

const instance = axios.create({
	baseURL: "http://139.59.219.252:3000",
});

// instance.defaults.headers.common['SOMETHING'] = 'something'

export default instance;
