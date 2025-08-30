import { useState, useEffect, useRef } from "react";
import {
	Card,
	Button,
	Label,
	TextInput,
	FileInput,
	Spinner,
	Avatar,
	Modal,
	ModalBody,
	ModalHeader,
	ModalFooter,
} from "flowbite-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useAuthContext } from "../../context/Auth";
import { updateProfileAPI } from "../../services/UserService";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { HiCamera, HiX } from "react-icons/hi";

const Profile = () => {
	const { t } = useTranslation("common");
	const { user, validateToken } = useAuthContext();
	const [loading, setLoading] = useState(false);
	const [previewImage, setPreviewImage] = useState(null);
	const [showCropModal, setShowCropModal] = useState(false);
	const [cropSrc, setCropSrc] = useState(null);
	const [crop, setCrop] = useState({
		aspect: 1,
		width: 200,
		height: 200,
		x: 0,
		y: 0,
		unit: "%",
	});
	const [completedCrop, setCompletedCrop] = useState(null);
	const imgRef = useRef(null);
	const hiddenFileInput = useRef(null);

	// Form state
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		phoneNumber: "",
		email: "", // Read-only
		imageFile: null,
	});

	// Initialize form data with user info
	useEffect(() => {
		if (user) {
			setFormData({
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				phoneNumber: user.phoneNumber || "",
				email: user.email || "",
				imageFile: null,
			});
		}
	}, [user]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith("image/")) {
				toast.error(t("validation.invalidImageType"));
				return;
			}

			// Validate file size (5MB max)
			if (file.size > 5 * 1024 * 1024) {
				toast.error(t("validation.imageTooLarge"));
				return;
			}

			// Show crop modal
			const reader = new FileReader();
			reader.onload = (e) => {
				setCropSrc(e.target.result);
				setShowCropModal(true);
				// Reset crop to initial state
				setCrop({
					aspect: 1,
					unit: "px",
					width: 200,
					height: 200,
					x: 10,
					y: 10,
				});
			};
			reader.readAsDataURL(file);
		}
	};

	const onImageLoad = (e) => {
		const { width, height } = e.currentTarget;
		const minSize = Math.min(width, height);
		const size = Math.min(minSize * 0.8, 300); // 80% of the smaller dimension, max 300px
		
		setCrop({
			aspect: 1,
			unit: "px",
			width: size,
			height: size,
			x: (width - size) / 2,
			y: (height - size) / 2,
		});
	};

	const handleCropComplete = (crop) => {
		setCompletedCrop(crop);
	};

	const handleCropSave = async () => {
		if (!completedCrop || !imgRef.current) return;

		const canvas = document.createElement("canvas");
		const image = imgRef.current;
		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;
		const ctx = canvas.getContext("2d");

		canvas.width = completedCrop.width * scaleX;
		canvas.height = completedCrop.height * scaleY;

		ctx.drawImage(
			image,
			completedCrop.x * scaleX,
			completedCrop.y * scaleY,
			completedCrop.width * scaleX,
			completedCrop.height * scaleY,
			0,
			0,
			canvas.width,
			canvas.height
		);

		// Convert canvas to blob
		canvas.toBlob(
			(blob) => {
				if (blob) {
					const file = new File([blob], "profile-image.jpg", {
						type: "image/jpeg",
					});
					setFormData((prev) => ({ ...prev, imageFile: file }));

					// Create preview
					const previewUrl = URL.createObjectURL(blob);
					setPreviewImage(previewUrl);

					setShowCropModal(false);
					setCropSrc(null);
				}
			},
			"image/jpeg",
			0.9
		);
	};

	const handleCropCancel = () => {
		setShowCropModal(false);
		setCropSrc(null);
		// Reset file input
		if (hiddenFileInput.current) {
			hiddenFileInput.current.value = "";
		}
	};

	const triggerFileInput = () => {
		hiddenFileInput.current?.click();
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const response = await updateProfileAPI(
				formData.firstName,
				formData.lastName,
				formData.phoneNumber,
				formData.imageFile
			);

			if (response.status === 200) {
				toast.success(t("profile.updateSuccess"));
				// Reset preview and file input
				setPreviewImage(null);
				setFormData((prev) => ({ ...prev, imageFile: null }));
				// Refresh user data
				await validateToken();
			} else {
				toast.error(t("profile.updateError"));
			}
		} catch (error) {
			toast.error(t("profile.updateError"));
			console.error("Profile update error:", error);
		} finally {
			setLoading(false);
		}
	};

	const resetForm = () => {
		if (user) {
			setFormData({
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				phoneNumber: user.phoneNumber || "",
				email: user.email || "",
				imageFile: null,
			});
		}
		setPreviewImage(null);
		if (hiddenFileInput.current) {
			hiddenFileInput.current.value = "";
		}
	};

	if (!user) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<p className="text-gray-600 dark:text-gray-300">
						{t("auth.pleaseLogin")}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-2xl mx-auto">
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						{t("profile.title")}
					</h1>
					<p className="text-gray-600 dark:text-gray-300 mt-2">
						{t("profile.subtitle")}
					</p>
				</div>

				<Card>
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Profile Picture Section */}
						<div className="text-center">
							<div className="mb-4 relative inline-block">
								<Avatar
									img={previewImage || user?.profilePicture || undefined}
									size="xl"
									className="mx-auto"
								/>
								<button
									type="button"
									onClick={triggerFileInput}
									className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-colors"
								>
									<HiCamera className="h-4 w-4" />
								</button>
								<input
									ref={hiddenFileInput}
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									className="hidden"
								/>
							</div>
							<div>
								<Label
									value={t("profile.profilePicture")}
									className="mb-2 block"
								/>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{t("profile.imageHelp")}
								</p>
							</div>
						</div>

						{/* Personal Information */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label
									htmlFor="firstName"
									value={t("profile.firstName")}
									className="mb-2 block"
								/>
								<TextInput
									id="firstName"
									name="firstName"
									type="text"
									value={formData.firstName}
									onChange={handleInputChange}
									placeholder={t("profile.firstNamePlaceholder")}
								/>
							</div>

							<div>
								<Label
									htmlFor="lastName"
									value={t("profile.lastName")}
									className="mb-2 block"
								/>
								<TextInput
									id="lastName"
									name="lastName"
									type="text"
									value={formData.lastName}
									onChange={handleInputChange}
									placeholder={t("profile.lastNamePlaceholder")}
								/>
							</div>
						</div>

						{/* Contact Information */}
						<div>
							<Label
								htmlFor="phoneNumber"
								value={t("profile.phoneNumber")}
								className="mb-2 block"
							/>
							<TextInput
								id="phoneNumber"
								name="phoneNumber"
								type="tel"
								value={formData.phoneNumber}
								onChange={handleInputChange}
								placeholder={t("profile.phoneNumberPlaceholder")}
							/>
						</div>

						{/* Email (Read-only) */}
						<div>
							<Label
								htmlFor="email"
								value={t("profile.email")}
								className="mb-2 block"
							/>
							<TextInput
								id="email"
								name="email"
								type="email"
								value={formData.email}
								disabled
								className="bg-gray-50 dark:bg-gray-700"
							/>
							<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
								{t("profile.emailReadonly")}
							</p>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-3">
							<Button
								type="submit"
								disabled={loading}
								className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
							>
								{loading && <Spinner size="sm" className="mr-2" />}
								{loading ? t("profile.updating") : t("profile.updateProfile")}
							</Button>
							<Button
								type="button"
								color="gray"
								onClick={resetForm}
								disabled={loading}
								className="flex-1"
							>
								{t("profile.reset")}
							</Button>
						</div>
					</form>
				</Card>
			</div>

			{/* Image Crop Modal */}
			<Modal show={showCropModal} onClose={handleCropCancel} size="lg">
				<ModalHeader>
					<div className="flex items-center space-x-2">
						<HiCamera className="h-5 w-5" />
						<span>{t("profile.cropImage")}</span>
					</div>
				</ModalHeader>
				<ModalBody>
					<div className="text-center">
						<p className="text-gray-600 dark:text-gray-300 mb-4">
							{t("profile.cropImageHelp")}
						</p>
						{cropSrc && (
							<ReactCrop
								crop={crop}
								onChange={(newCrop) => setCrop(newCrop)}
								onComplete={handleCropComplete}
								aspect={1}
								className="mx-auto"
							>
								<img
									ref={imgRef}
									src={cropSrc}
									alt="Crop"
									className="max-h-96 mx-auto"
									onLoad={onImageLoad}
								/>
							</ReactCrop>
						)}
					</div>
				</ModalBody>
				<ModalFooter>
					<div className="flex space-x-3 w-full justify-end">
						<Button color="gray" onClick={handleCropCancel}>
							{t("profile.cancel")}
						</Button>
						<Button
							onClick={handleCropSave}
							className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
						>
							{t("profile.saveImage")}
						</Button>
					</div>
				</ModalFooter>
			</Modal>
		</div>
	);
};

export default Profile;
