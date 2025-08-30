import { useState, useEffect, use } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import {
	Card,
	Button,
	TextInput,
	Textarea,
	Select,
	FileInput,
	Label,
	Alert,
} from "flowbite-react";
import { HiSave, HiArrowLeft, HiX, HiCloudUpload } from "react-icons/hi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
	getPropertyById,
	createProperty,
	updateProperty,
	deletePropertyMedia,
} from "../../services/PropertyService";
import PropertyFormBasicInfo from "../../components/PropertyForms/PropertyFormBasicInfo";
import PropertyFormDetails from "../../components/PropertyForms/PropertyFormDetails";
import PropertyFormFeatures from "../../components/PropertyForms/PropertyFormFeatures";
import PropertyFormLocation from "../../components/PropertyForms/PropertyFormLocation";
import PropertyFormAdditional from "../../components/PropertyForms/PropertyFormAdditional";
import PropertyFormDates from "../../components/PropertyForms/PropertyFormDates";
import PropertyFormImages from "../../components/PropertyForms/PropertyFormImages";
import { useAuthContext } from "../../context/Auth";
import { format } from "date-fns";

const PropertyForm = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const isEdit = Boolean(id);
	const { user, isLoggedIn } = useAuthContext();
	const { t } = useTranslation();

	if (!isLoggedIn()) {
		return <Navigate to="/login" replace />;
	}

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		propertyTypeId: "",
		propertyStatusId: "",
		country: "Turkey",
		city: "",
		district: "",
		neighborhood: "",
		street: "",
		addressLine: "",
		price: "",
		currencyId: "",
		deposit: "",
		monthlyFee: "",
		grossArea: "",
		netArea: "",
		rooms: "",
		bedrooms: "",
		bathrooms: "",
		floor: "",
		totalFloors: "",
		buildingAge: "",
		heatingType: "",
		hasElevator: false,
		hasBalcony: false,
		hasGarden: false,
		hasParking: false,
		isFurnished: false,
		usageStatus: "",
		isInComplex: false,
		isEligibleForLoan: true,
		deedStatus: "",
		listedBy: "",
		isExchangeable: false,
		latitude: "",
		longitude: "",
		startDate: "",
		endDate: "",
		ownerId: user?.id || "",
	});

	const [images, setImages] = useState([]);
	const [existingImages, setExistingImages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [locationInfo, setLocationInfo] = useState({
		latitude: null,
		longitude: null,
		source: null, // 'manual', 'address', 'geolocation', 'map'
	});

	useEffect(() => {
		setFormData((prev) => ({
			...prev,
			latitude: locationInfo.latitude,
			longitude: locationInfo.longitude,
		}));
		console.log("Location Info Updated:", locationInfo);
	}, [locationInfo]);

	useEffect(() => {
		if (isEdit) {
			// Fetch existing property data
			const fetchProperty = async () => {
				try {
					const property = await getPropertyById(id);
					// setFormData(property.data);
					// Tarih formatını YYYY-MM-DD olarak ayarla
					const formattedStartDate = property.data.startDate
						? format(
								new Date(property.data.startDate),
								"yyyy-MM-dd"
						  )
						: "";
					const formattedEndDate = property.data.endDate
						? format(new Date(property.data.endDate), "yyyy-MM-dd")
						: "";
					console.log(property.data);
					setFormData({
						...property.data,
						startDate: formattedStartDate,
						endDate: formattedEndDate,
					});
					setExistingImages(property.data.media || []);
					setLocationInfo({
						latitude: property.data.latitude,
						longitude: property.data.longitude,
						source: "manual", // or 'address', 'geolocation', 'map'
					});
				} catch (error) {
					console.log("Error fetching property:", error);
					setError(t("adminPropertyForm.messages.loadingError"));
					// setTimeout(() => {
					// 	navigate("/properties");
					// }, 2500);
				}
			};
			fetchProperty();
		}
	}, [isEdit, id, navigate]);

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleCheckboxChange = (name, checked) => {
		setFormData((prev) => ({
			...prev,
			[name]: checked,
		}));
	};

	const handleImageUpload = (e) => {
		const files = Array.from(e.target.files);
		const validFiles = files.filter((file) => {
			const validTypes = ["image/jpeg", "image/jpg", "image/png"];
			const maxSize = 10 * 1024 * 1024; // 10MB
			return validTypes.includes(file.type) && file.size <= maxSize;
		});

		if (validFiles.length !== files.length) {
			setError(
				t("propertyForm.validation.fileTypeError")
			);
			return;
		}

		setImages((prev) => [...prev, ...validFiles]);
	};

	const removeImage = (index) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
	};

	const removeExistingImage = async (index, imageData) => {
			try {
				setLoading(true);
				const response = await deletePropertyMedia(id, imageData.id);
				
				if (response.success) {
					setExistingImages((prev) => prev.filter((_, i) => i !== index));
					toast.success(t("myProperties.deleteModal.successMessage"));
				} else {
					setError(response.error?.message || t("adminPropertyForm.messages.deleteImageError"));
					toast.error(t("adminPropertyForm.messages.deleteImageError"));
				}
			} catch (error) {
				console.error("Error deleting existing image:", error);
				setError(t("adminPropertyForm.messages.deleteImageError"));
				toast.error(t("adminPropertyForm.messages.deleteImageError"));
			} finally {
				setLoading(false);
			}
		};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const form = new FormData();
			// FormData nesnesi oluştur
			for (const [key, value] of Object.entries(formData)) {
				if (value !== null && value !== undefined && value !== "") {
					form.append(
						key,
						typeof value === "boolean" ? String(value) : value
					);
				}
			}

			images.forEach((file) => {
				form.append("images", file, file.name); // veya "images[]"
			});

			// images.forEach((image) => {
			// 	form.append("images", image);
			// });

			// FormData içeriğini doğru şekilde görmek için:
			console.log("FormData entries:", [...form.entries()]);
			// Dosyaları ayrıca gösterin:
			images.forEach((f, i) =>
				console.log(`image[${i}] ->`, f.name, f.type, f.size)
			);

			if (isEdit) {
				await updateProperty(id, form);
				setSuccess(t("adminPropertyForm.messages.updateSuccess"));
			} else {
				await createProperty(form);
				setSuccess(t("adminPropertyForm.messages.createSuccess"));
			}

			setTimeout(() => {
				toast.success(t("adminPropertyForm.messages.saveSuccess"));
				navigate("/admin/properties");
			}, 1000);
		} catch (err) {
			setError(
				err.response?.data?.message || err.message || t("adminPropertyForm.messages.submitError")
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<Button
						color="gray"
						onClick={() => navigate("/admin/properties")}
						className="dark:bg-gray-700 dark:text-white"
					>
						<HiArrowLeft className="mr-2 h-5 w-5" />
						{t("singleProperty.goBack")}
					</Button>
					<div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
							{isEdit ? t("adminPropertyForm.editProperty.title") : t("adminPropertyForm.newProperty.title")}
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							{isEdit
								? t("adminPropertyForm.editProperty.description")
								: t("adminPropertyForm.newProperty.description")}
						</p>
					</div>
				</div>
			</div>

			{/* Alerts */}
			{error && (
				<Alert
					color="failure"
					className="dark:bg-gray-800 dark:text-white"
				>
					{error}
				</Alert>
			)}

			{success && (
				<Alert
					color="success"
					className="dark:bg-gray-800 dark:text-white"
				>
					{success}
				</Alert>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				<PropertyFormBasicInfo
					formData={formData}
					handleInputChange={handleInputChange}
				/>
				<PropertyFormDetails
					formData={formData}
					handleInputChange={handleInputChange}
				/>
				<PropertyFormFeatures
					formData={formData}
					handleInputChange={handleInputChange}
				/>
				<PropertyFormLocation
					formData={formData}
					handleInputChange={handleInputChange}
					locationInfo={locationInfo}
					setLocationInfo={setLocationInfo}
					setFormData={setFormData}
					loading={loading}
					setLoading={setLoading}
				/>
				<PropertyFormAdditional
					formData={formData}
					handleInputChange={handleInputChange}
				/>
				<PropertyFormDates
					formData={formData}
					handleInputChange={handleInputChange}
				/>
				<PropertyFormImages
					images={images}
					existingImages={existingImages}
					handleImageUpload={handleImageUpload}
					removeImage={removeImage}
					removeExistingImage={removeExistingImage}
				/>
				<div className="flex justify-end space-x-4">
					<Button
						type="button"
						color="gray"
						onClick={() => navigate("/admin/properties")}
						className="dark:bg-gray-700 dark:text-white"
					>
						{t("adminPropertyForm.buttons.cancel")}
					</Button>
					<Button
						type="submit"
						disabled={loading}
						className="dark:bg-blue-700 dark:text-white"
					>
						<HiSave className="mr-2 h-5 w-5" />
						{loading
							? (isEdit ? t("adminPropertyForm.buttons.updating") : t("adminPropertyForm.buttons.saving"))
							: isEdit
							? t("adminPropertyForm.buttons.update")
							: t("adminPropertyForm.buttons.save")}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default PropertyForm;
