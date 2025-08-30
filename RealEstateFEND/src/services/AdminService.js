import axios from "axios";
import api from "./Api";

const API_ROUTE = "admin/";

// dashboard request
export const getDashboardData = async () => {
	try {
		const response = await api.get(`${API_ROUTE}dashboard`);
		return response.data;
	} catch (error) {
		console.error("Error fetching dashboard data:", error);
		throw error;
	}
};