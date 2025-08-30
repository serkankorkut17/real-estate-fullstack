import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button, Alert, Progress } from "flowbite-react";
import { HiSave, HiArrowLeft, HiHome, HiCheck } from "react-icons/hi";
import { toast } from "react-toastify";
import { createProperty } from "../../services/PropertyService";
import PropertyFormBasicInfo from "../../components/PropertyForms/PropertyFormBasicInfo";
import PropertyFormDetails from "../../components/PropertyForms/PropertyFormDetails";
import PropertyFormFeatures from "../../components/PropertyForms/PropertyFormFeatures";
import PropertyFormLocation from "../../components/PropertyForms/PropertyFormLocation";
import PropertyFormAdditional from "../../components/PropertyForms/PropertyFormAdditional";
import PropertyFormDates from "../../components/PropertyForms/PropertyFormDates";
import PropertyFormImages from "../../components/PropertyForms/PropertyFormImages";
import { useAuthContext } from "../../context/Auth";
import { useTranslation } from "react-i18next";

const NewProperty = () => {
	const navigate = useNavigate();
	const { user, isLoggedIn } = useAuthContext();
	const { t } = useTranslation("common");

	if (!isLoggedIn()) {
		return <Navigate to="/login" replace />;
	}

	const [currentStep, setCurrentStep] = useState(1);
	const [completedSteps, setCompletedSteps] = useState([]);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		propertyTypeId: "",
		propertyStatusId: "",
		country: "Türkiye",
		city: "İstanbul",
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
		roomCount: "",
		buildingAge: "",
		floorNumber: "",
		totalFloors: "",
		bathroomCount: "",
		heatingType: "",
		hasKitchen: false,
		hasBalcony: false,
		hasElevator: false,
		hasParking: false,
		hasGarden: false,
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
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [locationInfo, setLocationInfo] = useState({
		latitude: null,
		longitude: null,
		source: null,
	});

	const steps = [
		{ id: 1, title: t("propertyForm.steps.basicInfo"), icon: HiHome },
		{ id: 2, title: t("propertyForm.steps.propertyDetails"), icon: HiHome },
		{ id: 3, title: t("propertyForm.steps.features"), icon: HiHome },
		{ id: 4, title: t("propertyForm.steps.location"), icon: HiHome },
		{ id: 5, title: t("propertyForm.steps.additionalInfo"), icon: HiHome },
		{ id: 6, title: t("propertyForm.steps.dates"), icon: HiHome },
		{ id: 7, title: t("propertyForm.steps.photos"), icon: HiHome },
		{ id: 8, title: t("propertyForm.steps.submit"), icon: HiCheck },
	];

	const progressPercentage = (currentStep / steps.length) * 100;

	// Geocoding function for auto-location calculation
	const geocodeFromAddress = async (addressData) => {
		try {
			// Build address combinations like in LocationSelector
			const addressParts = [
				addressData.addressLine,
				addressData.street,
				addressData.neighborhood,
				addressData.district,
				addressData.city,
				"Turkey",
			].filter(Boolean);

			const addressNumberMatch = addressData.addressLine?.match(/no:\s*\d+/i);
			let addressNumber = "";
			if (addressNumberMatch) {
				addressNumber = addressNumberMatch[0];
			}

			const addressCombinations = [
				addressParts.join(", "),
				`${addressNumber} ${addressData.street}, ${addressData.neighborhood}, ${addressData.district}, ${addressData.city}, Turkey`
					.replace(/,\s*,/g, ",")
					.replace(/^,\s*|,\s*$/g, ""),
				`${addressData.street || ""} ${addressData.neighborhood || ""} ${addressData.district} ${addressData.city} Turkey`
					.replace(/\s+/g, " ")
					.trim(),
				`${addressData.neighborhood || ""} ${addressData.district} ${addressData.city} Turkey`
					.replace(/\s+/g, " ")
					.trim(),
				`${addressData.district} ${addressData.city}, Turkey`,
				`${addressData.city}, Turkey`,
			].filter(
				(addr) =>
					addr.length > 10 && addr !== "Turkey" && !addr.startsWith(",")
			);

			// Try geocoding with each address combination
			for (const address of addressCombinations) {
				try {
					const params = new URLSearchParams({
						format: "json",
						q: address.replace(/\s+/g, " ").trim(),
						countrycodes: "tr",
						limit: "5",
						addressdetails: "1",
						"accept-language": "tr,en",
					});

					const response = await fetch(`/api/geocode?${params.toString()}`, {
						headers: {
							"User-Agent": "RealEstate-App/1.0",
							"Accept-Language": "tr,en;q=0.9",
						},
					});

					if (!response.ok) continue;

					const data = await response.json();

					if (data && data.length > 0) {
						const bestResult = data.reduce((best, current) => {
							const bestImportance = parseFloat(best.importance || 0);
							const currentImportance = parseFloat(current.importance || 0);
							return currentImportance > bestImportance ? current : best;
						});

						return {
							latitude: parseFloat(bestResult.lat),
							longitude: parseFloat(bestResult.lon),
						};
					}

					// Rate limiting
					await new Promise((resolve) => setTimeout(resolve, 500));
				} catch (error) {
					console.error(`Geocoding failed for address: ${address}`, error);
					continue;
				}
			}

			return null;
		} catch (error) {
			console.error("Geocoding error:", error);
			return null;
		}
	};

	// Validation function for each step
	const validateStep = (stepNumber) => {
		const errors = [];
		
		switch (stepNumber) {
			case 1: // Basic Info
				if (!formData.title || formData.title.trim().length === 0) {
					errors.push(t("propertyForm.validation.titleRequired"));
				}
				if (formData.title && formData.title.length > 100) {
					errors.push(t("propertyForm.validation.titleMaxLength"));
				}
				if (!formData.propertyTypeId || formData.propertyTypeId === "") {
					errors.push(t("propertyForm.validation.propertyTypeRequired"));
				}
				if (!formData.propertyStatusId || formData.propertyStatusId === "") {
					errors.push(t("propertyForm.validation.propertyStatusRequired"));
				}
				break;
			case 2: // Details
				if (!formData.price || formData.price <= 0) {
					errors.push(t("propertyForm.validation.priceRequired"));
				}
				if (!formData.currencyId || formData.currencyId === "") {
					errors.push(t("propertyForm.validation.currencyRequired"));
				}
				break;
			case 4: // Location
				if (!formData.city || formData.city.trim().length === 0) {
					errors.push(t("propertyForm.validation.cityRequired"));
				}
				if (!formData.district || formData.district.trim().length === 0) {
					errors.push(t("propertyForm.validation.districtRequired"));
				}
				break;
			// Other steps don't have required fields based on DTO
		}
		
		return errors;
	};

	useEffect(() => {
		setFormData((prev) => ({
			...prev,
			latitude: locationInfo.latitude,
			longitude: locationInfo.longitude,
		}));
	}, [locationInfo]);

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleImageUpload = (e) => {
		const files = Array.from(e.target.files);
		const validFiles = files.filter((file) => {
			const validTypes = [
				"image/jpeg",
				"image/jpg",
				"image/png",
				"image/webp",
			];
			const maxSize = 15 * 1024 * 1024; // 15MB
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

	const nextStep = () => {
		if (currentStep < steps.length) {
			// Validate current step before proceeding
			const errors = validateStep(currentStep);
			if (errors.length > 0) {
				setError(errors.join(" "));
				return;
			}
			
			setError(""); // Clear any previous errors
			if (!completedSteps.includes(currentStep)) {
				setCompletedSteps([...completedSteps, currentStep]);
			}
			setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const goToStep = (stepId) => {
		setCurrentStep(stepId);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		// Final validation for all required fields
		const allErrors = [];
		for (let i = 1; i <= 4; i++) { // Include step 4 for location validation
			if (i === 3) continue; // Skip step 3 as it has no required fields
			const stepErrors = validateStep(i);
			allErrors.push(...stepErrors);
		}
		
		if (allErrors.length > 0) {
			setError(allErrors.join(" "));
			return;
		}
		
		setLoading(true);
		setError("");
		
		// Auto-geocode if coordinates are missing but address exists
		let finalFormData = { ...formData };
		
		if ((!finalFormData.latitude || !finalFormData.longitude) && 
			finalFormData.city && finalFormData.district) {
			
			try {
				toast.info(t("propertyForm.validation.autoGeocodingAttempt"));
				
				// Use the geocoding logic from LocationSelector
				const coordinates = await geocodeFromAddress(finalFormData);
				
				if (coordinates) {
					finalFormData = {
						...finalFormData,
						latitude: coordinates.latitude,
						longitude: coordinates.longitude
					};
					
					// Update location info state as well
					setLocationInfo({
						latitude: coordinates.latitude,
						longitude: coordinates.longitude,
						source: "auto-geocoded"
					});
					
					toast.success(t("propertyForm.validation.autoGeocodingSuccess"));
				} else {
					toast.warning(t("propertyForm.validation.autoGeocodingFailed"));
				}
			} catch (error) {
				console.error("Auto-geocoding error:", error);
				toast.warning(t("propertyForm.validation.autoGeocodingFailed"));
			}
		}

		console.log(finalFormData);
		console.log(images);

		try {
			const form = new FormData();

			for (const [key, value] of Object.entries(finalFormData)) {
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

			const response = await createProperty(form);
			if (response.success) {
				setSuccess(t("propertyForm.newProperty.publish"));
				setTimeout(() => {
					toast.success(t("propertyForm.newProperty.publish"));
					navigate("/user/my-properties");
				}, 1500);
			}
		} catch (err) {
			setError(
				err.response?.data?.message || err.message || t("propertyForm.validation.submitError")
			);
		} finally {
			setLoading(false);
		}
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<PropertyFormBasicInfo
						formData={formData}
						handleInputChange={handleInputChange}
					/>
				);
			case 2:
				return (
					<PropertyFormDetails
						formData={formData}
						handleInputChange={handleInputChange}
					/>
				);
			case 3:
				return (
					<PropertyFormFeatures
						formData={formData}
						handleInputChange={handleInputChange}
					/>
				);
			case 4:
				return (
					<PropertyFormLocation
						formData={formData}
						handleInputChange={handleInputChange}
						locationInfo={locationInfo}
						setLocationInfo={setLocationInfo}
						setFormData={setFormData}
						loading={loading}
						setLoading={setLoading}
					/>
				);
			case 5:
				return (
					<PropertyFormAdditional
						formData={formData}
						handleInputChange={handleInputChange}
					/>
				);
			case 6:
				return (
					<PropertyFormDates
						formData={formData}
						handleInputChange={handleInputChange}
					/>
				);
			case 7:
				return (
					<PropertyFormImages
						images={images}
						existingImages={[]}
						handleImageUpload={handleImageUpload}
						removeImage={removeImage}
						removeExistingImage={() => {}}
					/>
				);
			case 8:
				return (
					<div className="space-y-6">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							📋 {t("propertyForm.preview.title")}
						</h3>
						<div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
							<p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
								<strong>{t("propertyForm.preview.title")}:</strong> {formData.title}
							</p>
							<p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
								<strong>{t("propertyForm.preview.price")}:</strong> {formData.price}
							</p>
							<p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
								<strong>{t("propertyForm.preview.location")}:</strong> {formData.city},{" "}
								{formData.district}
							</p>
							<p className="text-sm text-gray-600 dark:text-gray-300">
								<strong>{t("propertyForm.preview.photoCount")}:</strong>{" "}
								{images.length} {t("propertyForm.preview.photos")}
							</p>
						</div>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{t("propertyForm.preview.instruction")}
						</p>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
			<div className="container mx-auto px-4 py-8">
				{/* Hero Section */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
						🏡 {t("propertyForm.newProperty.title")}
					</h1>
					<p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
						{t("propertyForm.newProperty.description")}
					</p>
					<div className="max-w-md mx-auto mb-8">
						<Progress
							progress={progressPercentage}
							color="blue"
							size="lg"
						/>
						<p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
							{t("propertyForm.progress.step")} {currentStep} {t("propertyForm.navigation.stepOf")} {steps.length} -{" "}
							{steps[currentStep - 1]?.title}
						</p>
					</div>
				</div>

				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
						{/* Steps Sidebar */}
						<div className="lg:col-span-1">
							<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-4">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
									{t("propertyForm.steps.stepsTitle")}
								</h3>
								<div className="space-y-3">
									{steps.map((step) => {
										const stepErrors = validateStep(step.id);
										const hasErrors = stepErrors.length > 0;
										const isCurrentStep = currentStep === step.id;
										const isCompleted = completedSteps.includes(step.id);
										
										return (
											<button
												key={step.id}
												onClick={() => goToStep(step.id)}
												className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
													isCurrentStep
														? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-300"
														: isCompleted && !hasErrors
														? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-2 border-green-300"
														: hasErrors
														? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-2 border-red-300"
														: "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
												}`}
											>
												<div className="flex-shrink-0">
													{isCompleted && !hasErrors ? (
														<HiCheck className="w-5 h-5 text-green-600" />
													) : hasErrors ? (
														<span className="flex items-center justify-center w-6 h-6 text-sm font-bold bg-red-200 dark:bg-red-600 text-red-600 dark:text-red-300 rounded-full">
															!
														</span>
													) : (
														<span className="flex items-center justify-center w-6 h-6 text-sm font-medium bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-full">
															{step.id}
														</span>
													)}
												</div>
												<span className="text-sm font-medium">
													{step.title}
												</span>
											</button>
										);
									})}
								</div>
							</div>
						</div>

						{/* Main Form Content */}
						<div className="lg:col-span-3">
							<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
								{/* Alerts */}
								{error && (
									<div className="p-6 pb-0">
										<Alert color="failure">{error}</Alert>
									</div>
								)}
								{success && (
									<div className="p-6 pb-0">
										<Alert color="success">{success}</Alert>
									</div>
								)}

								{/* Form Content */}
								<form>
									<div className="p-6">
										{renderStepContent()}
									</div>

									{/* Navigation Buttons */}
									<div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-between items-center">
										<Button
											type="button"
											color="gray"
											onClick={prevStep}
											disabled={currentStep === 1}
											className={
												currentStep === 1
													? "invisible"
													: ""
											}
										>
											<HiArrowLeft className="mr-2 h-4 w-4" />
											{t("propertyForm.navigation.previous")}
										</Button>

										<div className="text-sm text-gray-500 dark:text-gray-400">
											{currentStep} {t("propertyForm.navigation.stepOf")} {steps.length}
										</div>

										{currentStep === steps.length ? (
											<Button
												type="button"
												onClick={handleSubmit}
												color="blue"
												disabled={loading}
												className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
											>
												<HiSave className="mr-2 h-4 w-4" />
												{loading
													? t("propertyForm.newProperty.publishing")
													: t("propertyForm.newProperty.publish")}
											</Button>
										) : (
											<Button
												type="button"
												color="blue"
												onClick={nextStep}
												className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
											>
												{t("propertyForm.navigation.next")}
												<HiArrowLeft className="ml-2 h-4 w-4 rotate-180" />
											</Button>
										)}
									</div>
								</form>
							</div>

							{/* Help Section */}
							<div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
								<div className="flex items-start space-x-4">
									<div className="flex-shrink-0">
										<div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
											<HiHome className="w-4 h-4 text-blue-600 dark:text-blue-400" />
										</div>
									</div>
									<div>
										<h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
											{t("propertyForm.tips.title")}
										</h4>
										<p className="text-sm text-blue-800 dark:text-blue-200">
											{currentStep === 1 &&
												t("propertyForm.tips.step1")}
											{currentStep === 2 &&
												t("propertyForm.tips.step2")}
											{currentStep === 3 &&
												t("propertyForm.tips.step3")}
											{currentStep === 4 &&
												t("propertyForm.tips.step4")}
											{currentStep === 5 &&
												t("propertyForm.tips.step5")}
											{currentStep === 6 &&
												t("propertyForm.tips.step6")}
											{currentStep === 7 &&
												t("propertyForm.tips.step7")}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewProperty;
