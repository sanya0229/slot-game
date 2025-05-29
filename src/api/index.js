import axios from "axios";

class Api {
	static getMatrix(params) {
		return axios.get('https://nomad-admin.com/api/get-random-matrix', {params})
	}
}
export default Api;
