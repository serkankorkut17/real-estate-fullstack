import API from "./Api";

// Update user profile
export const updateProfileAPI = async (firstName, lastName, phoneNumber, imageFile = null) => {
	try {
		const formData = new FormData();
		
		// Add fields only if they have values (backend expects null for unchanged fields)
		if (firstName) formData.append('FirstName', firstName);
		if (lastName) formData.append('LastName', lastName);
		if (phoneNumber) formData.append('PhoneNumber', phoneNumber);
		if (imageFile) formData.append('imageFile', imageFile);

		const response = await API.put("/account/update-profile", formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
    console.log("Profile updated:", response);
		return response;
	} catch (error) {
		return error.response;
	}
};

// Get current user profile
export const getCurrentUserProfileAPI = async () => {
	try {
		const response = await API.get("/auth/profile");
		return response;
	} catch (error) {
		return error.response;
	}
};
