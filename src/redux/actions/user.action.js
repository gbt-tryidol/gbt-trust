// import axios from "../utils/axios.js";
import axios from "axios";
import { config } from "dotenv";
import Cookies from "js-cookie";

// const URI = "https://gbt-trust-backend.onrender.com/api/v1/user";
const URI = import.meta.env.VITE_API_ENDPOINT;

export const userLogin = (loginDetails) => async (dispatch) => {
	try {
		dispatch({
			type: "GET_LOGIN_REQUEST",
		});
		const { data } = await axios.post(`${URI}/login`, loginDetails);
		const payload = {
			user: data.data.user,
			message: data.message,
		};

		Cookies.set("token", data.data.token, { expires: 1 });

		dispatch({
			type: "GET_LOGIN_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GET_LOGIN_FAILURE",
			payload: error.message,
		});
	}
};

export const generateResetToken = (email) => async (dispatch) => {
	try {
		dispatch({
			type: "GENERATE_RESET_TOKEN_REQUEST",
		});
		console.log(email);
		const { data } = await axios.post(`${URI}/forgot`, { email });
		const payload = {
			message: data.message,
		};

		dispatch({
			type: "GENERATE_RESET_TOKEN_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GENERATE_RESET_TOKEN_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const resetPassword = (password, resetToken) => async (dispatch) => {
	try {
		dispatch({
			type: "FORGOT_PASSWORD_REQUEST",
		});
		const { data } = await axios.put(`${URI}/password/reset/${resetToken}`, { password });
		const payload = {
			message: data.message,
		};

		dispatch({
			type: "FORGOT_PASSWORD_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "FORGOT_PASSWORD_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const updateProfile = (profile) => async (dispatch) => {
	try {
		dispatch({
			type: "UPDATE_PROFILE_REQUEST",
		});
		const token = Cookies.get("token"); // Get the token from the cookie
		// eslint-disable-next-line no-unused-vars
		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.post(`${URI}/update/user`, profile, config);

		const payload = {
			message: data.message,
		};

		dispatch({
			type: "UPDATE_PROFILE_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "UPDATE_PROFILE_FAILURE",
			payload: error.message,
		});
	}
};

export const generateReferal = () => async (dispatch) => {
	try {
		dispatch({
			type: "GENERATE_REFERAL_CODE_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie
		// eslint-disable-next-line no-unused-vars
		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		// eslint-disable-next-line no-unused-vars
		const data = await axios.post(`${URI}/referral/generate-code`, {}, config);

		dispatch({
			type: "GENERATE_REFERAL_CODE_SUCCESS",
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GENERATE_REFERAL_CODE_FAILURE",
			payload: error.message,
		});
	}
};

export const generateReferalLink = () => async (dispatch) => {
	try {
		dispatch({
			type: "GENERATE_REFERAL_LINK_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie
		// eslint-disable-next-line no-unused-vars
		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		// eslint-disable-next-line no-unused-vars
		const data = await axios.post(`${URI}/referral/generate-link`, {}, config);

		dispatch({
			type: "GENERATE_REFERAL_LINK_SUCCESS",
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GENERATE_REFERAL_LINK_FAILURE",
			payload: error.message,
		});
	}
};

export const addReferral = (code) => async (dispatch) => {
	try {
		dispatch({
			type: "ADD_REFERRAL_REQUEST",
		});

		alert(code);

		const token = Cookies.get("token"); // Get the token from the cookie
		// eslint-disable-next-line no-unused-vars
		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};
		console.log("hii");

		const { data } = await axios.get(`${URI}/referral/generated-link/:referralCode=${code}`, config);
		console.log(data);
		const payload = {
			user: data.data.user,
			// message: data.message,
			referralCode: data.data.referralCode,
		};

		dispatch({
			type: "ADD_REFERRAL_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "ADD_REFERRAL_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const userSignup = (formdata) => async (dispatch) => {
	try {
		dispatch({
			type: "GET_SIGNUP_REQUEST",
		});
		const { data } = await axios.post(`${URI}/register`, formdata);

		const payload = {
			user: data.data.user,
			message: data.message,
			referralCode: data.data.referralCode,
		};

		Cookies.set("token", data.data.token, { expires: 1 });

		dispatch({
			type: "GET_SIGNUP_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GET_SIGNUP_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const logoutUser = () => async (dispatch) => {
	try {
		dispatch({
			type: "GET_LOGOUT_REQUEST",
		});

		Cookies.remove("token");

		const payload = {
			message: "User Logged Out Successfully",
		};

		dispatch({
			type: "GET_LOGOUT_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GET_LOGOUT_FAILURE",
			payload: "there was an error while logging out",
		});
	}
};

export const loadUser = () => async (dispatch) => {
	try {
		dispatch({
			type: "LOAD_USER_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie
		// eslint-disable-next-line no-unused-vars
		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.get(`${URI}/me`, config);
		dispatch({
			type: "LOAD_USER_SUCCESS",
			payload: data.data.user,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "LOAD_USER_FAILURE",
			// payload: "error while loading user",
		});
	}
};

export const getAllUsers = () => async (dispatch) => {
	try {
		dispatch({
			type: "GET_ALL_USERS_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie
		// eslint-disable-next-line no-unused-vars
		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.get(`${URI}/allusers`, config);

		dispatch({
			type: "GET_ALL_USERS_SUCCESS",
			payload: data.data,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GET_ALL_USERS_FAILURE",
			payload: "error while loading user",
		});
	}
};

export const verifyUser = (id, status) => async (dispatch) => {
	try {
		dispatch({
			type: "VERIFY_USER_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie
		// eslint-disable-next-line no-unused-vars
		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		// eslint-disable-next-line no-unused-vars
		const { data } = await axios.post(`${URI}/verify/user?id=${id}`, { status }, config);

		dispatch({
			type: "VERIFY_USER_SUCCESS",
			payload: data.message,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "VERIFY_USER_FAILURE",
			payload: "error while loading user",
		});
	}
};

export const getActiveUsers = () => async (dispatch) => {
	try {
		dispatch({
			type: "GET_ACTIVE_USERS_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie
		// eslint-disable-next-line no-unused-vars
		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.get(`${URI}/active-users`, config);

		dispatch({
			type: "GET_ACTIVE_USERS_SUCCESS",
			payload: data.data,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GET_ACTIVE_USERS_FAILURE",
			payload: "error while loading user",
		});
	}
};

export const sendMail = (email) => async (dispatch) => {
	try {
		dispatch({
			type: "MAIL_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie
		// eslint-disable-next-line no-unused-vars
		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.post(`${URI}/send-mail`, { email }, config);
		dispatch({
			type: "MAIL_SUCCESS",
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "MAIL_FAILURE",
			payload: "there was an error while logging out",
		});
	}
};
