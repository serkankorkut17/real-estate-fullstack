import axios from "axios";
import api from "./Api";

const API_ROUTE = "favorites/";

export const getAllFavorites = async () => {
	try {
		const response = await api.get(API_ROUTE);
		return response.data;
	} catch (error) {
		console.error("Error fetching all favorites:", error);
		throw error;
	}
};

export const getFavoritesByUserId = async (userId) => {
	try {
		const response = await api.get(`${API_ROUTE}${userId}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching favorites:", error);
		throw error;
	}
};

export const addFavorite = async (propertyId) => {
	try {
		const response = await api.post(`${API_ROUTE}${propertyId}`);
		if (response.status === 200) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		console.error("Error adding favorite:", error);
		throw error;
	}
};

export const removeFavorite = async (propertyId) => {
	try {
		const response = await api.delete(`${API_ROUTE}${propertyId}`);
		if (response.status === 200) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		console.error("Error removing favorite:", error);
		throw error;
	}
};
