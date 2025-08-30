import axios from "axios";
import api from "./Api";

const API_ROUTE = "account/";

// User Login Request
export const loginAPI = async (email, password) => {
	try {
		const data = await api.post(API_ROUTE + "login", {
			email: email,
			password: password,
		});
		console.log(data);
		return data;
	} catch (error) {
		console.log(error);
		return error.response;
	}
};

// User Registration Request
export const registerAPI = async (
	firstName,
	lastName,
	email,
	password,
	confirmPassword
) => {
	try {
		const data = await api.post(API_ROUTE + "register", {
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: password,
			confirmPassword: confirmPassword,
		});
		return data;
	} catch (error) {
		console.error(error);
		return error.response;
	}
};

// Forgot Password Request
export const forgotPasswordRequestAPI = async (email) => {
	try {
		const data = await api.post(API_ROUTE + "forgot-password", {
			email: email,
		});
		return data;
	} catch (error) {
		console.error(error);
		return error.response;
	}
};

// Reset Password Request
export const resetPasswordAPI = async (
	token,
	email,
	password,
	confirmPassword
) => {
	try {
		const data = await api.post(API_ROUTE + "reset-password", {
			token: token,
			email: email,
			newPassword: password,
			confirmPassword: confirmPassword,
		});
		console.log(data);
		return data;
	} catch (error) {
		console.error(error);
		return error.response;
	}
};

// Change Password Request
export const changePasswordAPI = async (
	currentPassword,
	newPassword,
	confirmPassword
) => {
	try {
		const data = await api.post(API_ROUTE + "change-password", {
			currentPassword: currentPassword,
			newPassword: newPassword,
			confirmPassword: confirmPassword,
		});
		return data;
	} catch (error) {
		console.error(error);
		return error.response;
	}
};

export const validateTokenAPI = async () => {
	try {
		const data = await api.get(API_ROUTE + "validate-token");
		return data;
	} catch (error) {
		console.error(error);
		return error.response;
	}
}
