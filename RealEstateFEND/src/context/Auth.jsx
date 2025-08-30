import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
	loginAPI,
	registerAPI,
	forgotPasswordRequestAPI,
	resetPasswordAPI,
	changePasswordAPI,
	validateTokenAPI,
} from "../services/AuthService";
import { getAllFavorites } from "../services/FavoriteService";
import { useTranslation } from "react-i18next";
import { addFavorite, removeFavorite } from "../services/FavoriteService";
import { set } from "date-fns";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const navigate = useNavigate();
	const [token, setToken] = useState(null);
	const [user, setUser] = useState(null);
	const [favorites, setFavorites] = useState([]);
	const [role, setRole] = useState(null);
	const [expiration, setExpiration] = useState(null);
	const [loading, setLoading] = useState(true);
	const { t } = useTranslation("auth");

	useEffect(() => {
		const initAuth = async () => {
			const storedToken =
				localStorage.getItem("token") || sessionStorage.getItem("token");
			if (storedToken) {
				setToken(storedToken);
				axios.defaults.headers.common["Authorization"] =
					"Bearer " + storedToken;

				// Token'ı doğrula
				await validateToken();
			}

			const response = await getAllFavorites();
			setFavorites(response);

			setLoading(false);
		};
		initAuth();
	}, []);

	useEffect(() => {
		console.log("User değişti:", user);
		console.log("role:", role);
		console.log("favorites:", favorites);
	}, [user, role, favorites]);

	useEffect(() => {
		if (expiration) {
			const now = new Date();
			if (expiration < now) {
				toast.info(t("auth.sessionExpired"));
				logout();
			}
		}
	}, [expiration]);

	// Kullanıcı giriş yapma
	const login = async (email, password, rememberMe = false) => {
		try {
			const response = await loginAPI(email, password);
			console.log(response);

			if (response && response.data && response.data.token) {
				const jwt = response.data.token;
				const firstName = response.data.firstName;
				const lastName = response.data.lastName;
				const email = response.data.email;
				const phoneNumber = response.data.phoneNumber;
				const profilePictureUrl = response.data.profilePictureUrl;
				const userId = response.data.id;
				const role = response.data.role;

				// Remember me özelliği
				if (rememberMe) {
					localStorage.setItem("token", jwt);
					localStorage.setItem("rememberMe", "true");
				} else {
					sessionStorage.setItem("token", jwt);
					localStorage.removeItem("rememberMe");
				}

				setToken(jwt);
				axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;

				setUser({
					email: email,
					firstName: firstName,
					lastName: lastName,
					profilePicture: profilePictureUrl,
					phoneNumber: phoneNumber,
					id: userId,
					role: role,
				});
				setRole(role);

				toast.success(t("auth.loginSuccess"));
				setTimeout(() => {
					navigate("/"); // Ana sayfaya yönlendir
				}, 500);
			} else {
				toast.warning(t("auth.invalidCredentials"));
			}
			return response;
		} catch (error) {
			toast.warning(t("auth.serverError"));
			return error;
		}
	};

	const validateToken = async () => {
		try {
			const response = await validateTokenAPI();
			if (response.status === 200) {
				// console.log("Token validation response:", response);
				const firstName = response.data.firstName;
				const lastName = response.data.lastName;
				const email = response.data.email;
				const phoneNumber = response.data.phoneNumber;
				const profilePictureUrl = response.data.profilePictureUrl;
				const userId = response.data.id;
				const role = response.data.role;

				setUser({
					email: email,
					firstName: firstName,
					lastName: lastName,
					id: userId,
					profilePicture: profilePictureUrl || null,
					phoneNumber: phoneNumber || null,
					role: role,
				});

				setRole(role);
			} else {
				// toast.warning(t("auth.tokenInvalid"));
				logout();
				return false;
			}
		} catch (error) {
			// toast.warning(t("auth.serverError"));
			return false;
		}
	};

	// Kullanıcı kayıt olma
	const signup = async (
		firstName,
		lastName,
		email,
		password,
		confirmPassword
	) => {
		try {
			const response = await registerAPI(
				firstName,
				lastName,
				email,
				password,
				confirmPassword
			);
			console.log(response);

			if (response.status === 400) {
				toast.warning(t("auth.signupError"));
			} else if (response.status === 201) {
				toast.success(t("auth.signupSuccess"));
				setTimeout(() => {
					navigate("/login"); // Giriş sayfasına yönlendir
				}, 500);
			} else {
				toast.warning(response.data);
			}
			return response;
		} catch (error) {
			toast.warning(t("auth.serverError"));
			return error.response;
		}
	};

	// Kullanıcı çıkış yapma
	const logout = () => {
		localStorage.removeItem("token");
		sessionStorage.removeItem("token");
		localStorage.removeItem("rememberMe");
		setUser(null);
		setToken(null);
		setRole(null);
		setExpiration(null);
		axios.defaults.headers.common["Authorization"] = "";

		toast.success(t("auth.logoutSuccess"));
		setTimeout(() => {
			navigate("/"); // Ana sayfaya yönlendir
		}, 500);
	};

	// Şifre sıfırlama isteği gönder
	const resetPasswordRequest = async (email) => {
		try {
			const response = await forgotPasswordRequestAPI(email);
			if (response.status === 200) {
				toast.success(t("auth.passwordResetRequestSuccess"));
			} else {
				toast.warning(t("auth.passwordResetRequestError"));
			}
			return response;
		} catch (error) {
			toast.warning(t("auth.serverError"));
			return error.response;
		}
	};

	// Reset token ile şifre sıfırlama
	const resetPassword = async (token, email, password, confirmPassword) => {
		try {
			const response = await resetPasswordAPI(
				token,
				email,
				password,
				confirmPassword
			);
			if (response.status === 200) {
				toast.success(t("auth.passwordResetSuccess"));
			} else {
				toast.warning(t("auth.passwordResetError"));
			}
			return response;
		} catch (error) {
			toast.warning(t("auth.serverError"));
			return error.response;
		}
	};

	// Kullanıcının giriş yapıp yapmadığını kontrol et
	const isLoggedIn = () => {
		return (
			!!(user && user.userId) ||
			!!localStorage.getItem("token") ||
			!!sessionStorage.getItem("token")
		);
	};

	// Kullanıcının admin olup olmadığını kontrol et
	const isAdmin = () => {
		return role === "Admin" || role === "admin";
	};

	// Add favorite to context
	const addFavoriteToContext = async (property) => {
		let result = await addFavorite(property.id);
		if (result) {
			setFavorites((prev) => [...prev, property]);
		}
	};

	// Remove favorite from context
	const removeFavoriteFromContext = async (propertyId) => {
		let result = await removeFavorite(propertyId);
		if (result) {
			setFavorites((prev) => prev.filter((fav) => fav.id !== propertyId));
		}
	};

	// Refresh favorites from server
	const refreshFavorites = async () => {
		try {
			const response = await getAllFavorites();
			setFavorites(response);
		} catch (error) {
			console.error("Error refreshing favorites:", error);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				role,
				expiration,
				signup,
				login,
				logout,
				loading,
				favorites,
				validateToken,
				addFavoriteToContext,
				removeFavoriteFromContext,
				refreshFavorites,
				resetPasswordRequest,
				resetPassword,
				isLoggedIn,
				isAdmin,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthContext = () => useContext(AuthContext);
