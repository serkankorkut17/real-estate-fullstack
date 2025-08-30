import axios from "axios";

const API_URL = "http://localhost:8000/api/property-lookup/";

// PropertyType listesi
export const getPropertyTypes = async () => {
	return axios.get(`${API_URL}types`);
};

// PropertyStatus listesi
export const getPropertyStatuses = async () => {
	return axios.get(`${API_URL}statuses`);
};

// Currency listesi
export const getCurrencies = async () => {
	return axios.get(`${API_URL}currencies`);
};
