import axios from "axios";
import api from "./Api";

const API_ROUTE = "properties/";

// Tüm emlakları getir
export const getProperties = async (filters = {}) => {
	try {
		const params = new URLSearchParams();
		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== "") {
				params.append(key, value);
			}
		});

		const response = await api.get(API_ROUTE, { params });
		return {
			success: true,
			data: response.data
		};
	} catch (error) {
		console.error("Error in getProperties:", error);
		return {
			success: false,
			error: error.response?.data || error.message,
			data: null
		};
	}
};

// Kullanıcıya ait emlakları getir
export const getMyProperties = async (userId) => {
	try {
		const response = await api.get(`${API_ROUTE}user/${userId}/`);
		return {
			success: true,
			data: response.data
		};
	} catch (error) {
		console.error("Error in getMyProperties:", error);
		return {
			success: false,
			error: error.response?.data || error.message,
			data: null
		};
	}
};

// Tek bir emlak getir
export const getPropertyById = async (id) => {
	try {
		const response = await api.get(`${API_ROUTE}${id}`);
		return {
			success: true,
			data: response.data
		};
	} catch (error) {
		console.error("Error in getPropertyById:", error);
		return {
			success: false,
			error: error.response?.data || error.message,
			data: null
		};
	}
};

// Yeni emlak oluştur
export const createProperty = async (formData) => {
	try {
		const response = await api.post(API_ROUTE, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return {
			success: true,
			data: response.data
		};
	} catch (error) {
		console.error("Error in createProperty:", error);
		return {
			success: false,
			error: error.response?.data || error.message,
			data: null
		};
	}
};

// Emlak güncelle
export const updateProperty = async (id, formData) => {
	try {
		const response = await api.put(`${API_ROUTE}${id}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return {
			success: true,
			data: response.data
		};
	} catch (error) {
		console.error("Error in updateProperty:", error);
		return {
			success: false,
			error: error.response?.data || error.message,
			data: null
		};
	}
};

// Emlak sil
export const deleteProperty = async (id) => {
	try {
		const response = await api.delete(`${API_ROUTE}${id}`);
		return {
			success: true,
			data: response.data
		};
	} catch (error) {
		console.error("Error in deleteProperty:", error);
		return {
			success: false,
			error: error.response?.data || error.message,
			data: null
		};
	}
};

// Emlak medya dosyasını sil
export const deletePropertyMedia = async (propertyId, mediaId) => {
	try {
		const response = await api.delete(`${API_ROUTE}${propertyId}/media/${mediaId}`);
		return {
			success: true,
			data: response.data
		};
	} catch (error) {
		console.error("Error in deletePropertyMedia:", error);
		return {
			success: false,
			error: error.response?.data || error.message,
			data: null
		};
	}
};
