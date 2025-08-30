import { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import {
	Card,
	Button,
	Badge,
	Spinner,
	Alert,
	Modal,
	ModalHeader,
	ModalBody,
} from "flowbite-react";
import {
	HiArrowLeft,
	HiHeart,
	HiOutlineHeart,
	HiShare,
	HiPhone,
	HiMail,
	HiLocationMarker,
	HiHome,
	HiCurrencyDollar,
	HiCalendar,
	HiUser,
	HiCheck,
	HiX,
	HiEye,
	HiChevronLeft,
	HiChevronRight,
	HiMap,
	HiChat,
} from "react-icons/hi";
import { toast } from "react-toastify";
import { getPropertyById } from "../../services/PropertyService";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../utils";
import StatusBadge from "../../components/Properties/StatusBadge";
import TypeBadge from "../../components/Properties/TypeBadge";
import { getPrimaryImage, formatDate } from "../../utils";
import { useAuthContext } from "../../context/Auth";
import { addFavorite, removeFavorite } from "../../services/FavoriteService";
import MapModal from "../../components/Properties/MapModal";
import ImageModal from "../../components/Properties/ImageModal";
import MapCard from "../../components/Properties/MapCard";
import ChatModal from "../../components/Chat/ChatModal";

const Property = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { t } = useTranslation("common");

	const [property, setProperty] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [showImageModal, setShowImageModal] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [showContactInfo, setShowContactInfo] = useState(false);
	const [showMapModal, setShowMapModal] = useState(false);
	const [showChatModal, setShowChatModal] = useState(false);

	const { favorites, addFavoriteToContext, removeFavoriteFromContext } =
		useAuthContext();

	const [isFavorite, setIsFavorite] = useState(
		favorites.some((fav) => fav.id === id)
	);

	useEffect(() => {
		setIsFavorite(favorites.some((fav) => fav.id == id));
	}, [favorites, id]);

	const toggleFavorite = async () => {
		if (isFavorite) {
			await removeFavoriteFromContext(property.id);
		} else {
			await addFavoriteToContext(property);
		}
	};

	useEffect(() => {
		fetchProperty();
	}, [id]);


	const fetchProperty = async () => {
		try {
			setLoading(true);
			const response = await getPropertyById(id);
			setProperty(response.data);
			console.log(response.data);

			setError("");
		} catch (err) {
			console.error("Error fetching property:", err);
			setError(t("singleProperty.error"));
		} finally {
			setLoading(false);
		}
	};

	const nextImage = () => {
		if (property?.media && property.media.length > 0) {
			setSelectedImageIndex((prev) =>
				prev === property.media.length - 1 ? 0 : prev + 1
			);
		}
	};

	const prevImage = () => {
		if (property?.media && property.media.length > 0) {
			setSelectedImageIndex((prev) =>
				prev === 0 ? property.media.length - 1 : prev - 1
			);
		}
	};

	const shareProperty = () => {
		if (navigator.share && false) {
			navigator.share({
				title: property.title,
				text: property.description,
				url: window.location.href,
			});
		} else {
			navigator.clipboard.writeText(window.location.href);
			toast.success(t("singleProperty.copyLink"));
		}
	};

	const contactHandler = () => {
		console.log("Chat button clicked (no contact) - setting showChatModal to true");
		console.log("Property:", property?.id, "Owner:", property?.owner?.id);
		setShowChatModal(true);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
				<div className="text-center">
					<Spinner size="xl" />
					<p className="mt-4 text-gray-600 dark:text-gray-300">
						{t("singleProperty.loading")}
					</p>
				</div>
			</div>
		);
	}

	if (error || !property) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
				<Card className="max-w-md w-full dark:bg-gray-800 dark:border-gray-700">
					<div className="text-center py-8">
						<HiHome className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
						<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
							{t("singleProperty.notFound")}
						</h3>
						<p className="text-gray-600 dark:text-gray-300 mb-4">
							{error || t("singleProperty.notFoundDescription")}
						</p>
						<Button color="blue" onClick={() => navigate("/properties")}>
							{t("singleProperty.backToListings")}
						</Button>
					</div>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="container mx-auto px-4 py-6">
				{/* Navigation Header */}
				<div className="flex items-center justify-between mb-6">
					<Button
						color="gray"
						onClick={() => navigate("/properties")}
						className="flex items-center"
					>
						<HiArrowLeft className="mr-2 h-4 w-4" />
						{t("singleProperty.goBack")}
					</Button>
					<div className="flex items-center space-x-3">
						<Button
							color="light"
							onClick={toggleFavorite}
							className="flex items-center"
						>
							{isFavorite ? (
								<HiHeart className="mr-2 h-4 w-4 text-red-500" />
							) : (
								<HiOutlineHeart className="mr-2 h-4 w-4" />
							)}
							{isFavorite
								? t("singleProperty.removeFavorite")
								: t("singleProperty.addFavorite")}
						</Button>
						<Button
							color="light"
							onClick={shareProperty}
							className="flex items-center"
						>
							<HiShare className="mr-2 h-4 w-4" />
							{t("singleProperty.share")}
						</Button>
					</div>
				</div>

				{/* Main Content */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Images Section - Left Side */}
					<div className="lg:col-span-2 space-y-4">
						{/* Primary Image */}
						<div className="relative">
							{getPrimaryImage(property?.media) ? (
								<div className="relative overflow-hidden rounded-xl">
									<img
										src={
											property.media[selectedImageIndex]?.url ||
											getPrimaryImage(property?.media)
										}
										alt={property.title}
										className="w-full h-96 lg:h-[500px] object-cover cursor-pointer"
										onClick={() => setShowImageModal(true)}
									/>
									{property.media && property.media.length > 1 && (
										<>
											<button
												onClick={prevImage}
												className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
											>
												<HiChevronLeft className="h-6 w-6" />
											</button>
											<button
												onClick={nextImage}
												className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
											>
												<HiChevronRight className="h-6 w-6" />
											</button>
											<div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm">
												{selectedImageIndex + 1} / {property.media.length}
											</div>
										</>
									)}
									<div className="absolute top-4 left-4">
										<StatusBadge status={property.status?.name} size="lg" />
									</div>
								</div>
							) : (
								<div className="w-full h-96 lg:h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center">
									<HiHome className="h-24 w-24 text-gray-400 dark:text-gray-500" />
								</div>
							)}
						</div>

						{/* Thumbnail Images */}
						{property.media && property.media.length > 1 && (
							<div className="grid grid-cols-6 gap-2">
								{property.media.map((media, index) => (
									<button
										key={media.id}
										onClick={() => setSelectedImageIndex(index)}
										className={`relative overflow-hidden rounded-lg aspect-square ${
											selectedImageIndex === index
												? "ring-2 ring-blue-500 ring-offset-2"
												: "hover:opacity-75"
										}`}
									>
										<img
											src={media.url}
											alt={`${property.title} - ${index + 1}`}
											className="w-full h-full object-cover"
										/>
									</button>
								))}
							</div>
						)}

						{/* Property Description */}
						<Card className="dark:bg-gray-800 dark:border-gray-700">
							<div className="p-6">
								<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
									{t("singleProperty.description")}
								</h3>
								<p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
									{property.description || t("singleProperty.noDescription")}
								</p>
							</div>
						</Card>

						{/* Location Map Placeholder */}
						<MapCard
							location={property.location}
							setShowMapModal={setShowMapModal}
						/>
					</div>

					{/* Property Details - Right Side */}
					<div className="lg:col-span-1 space-y-6">
						{/* Price & Basic Info */}
						<Card className="dark:bg-gray-800 dark:border-gray-700">
							<div className="p-6">
								<div className="flex items-center justify-between mb-4">
									<h1 className="text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400">
										{formatPrice(property.price, property.currency)}
									</h1>
									{property.type && (
										<TypeBadge type={property.type.id} size="lg" />
									)}
								</div>

								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
									{property.title}
								</h2>

								<div className="flex items-center text-gray-600 dark:text-gray-300 mb-6">
									<HiLocationMarker className="h-5 w-5 mr-2" />
									<span>
										{[property.location.district, property.location.city]
											.filter(Boolean)
											.join(", ")}
									</span>
								</div>

								{/* Key Details Grid */}
								<div className="grid grid-cols-2 gap-4 mb-6">
									{property.details.grossArea && (
										<div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
											<div className="text-2xl font-bold text-gray-900 dark:text-white">
												{property.details.grossArea}
											</div>
											<div className="text-sm text-gray-600 dark:text-gray-300">
												{t("singleProperty.grossArea")}
											</div>
										</div>
									)}
									{property.details.netArea && (
										<div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
											<div className="text-2xl font-bold text-gray-900 dark:text-white">
												{property.details.netArea}
											</div>
											<div className="text-sm text-gray-600 dark:text-gray-300">
												{t("singleProperty.netArea")}
											</div>
										</div>
									)}
									{property.details.roomCount && (
										<div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
											<div className="text-2xl font-bold text-gray-900 dark:text-white">
												{property.details.roomCount}
											</div>
											<div className="text-sm text-gray-600 dark:text-gray-300">
												{t("singleProperty.roomCount")}
											</div>
										</div>
									)}
									{property.details.buildingAge && (
										<div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
											<div className="text-2xl font-bold text-gray-900 dark:text-white">
												{property.details.buildingAge}
											</div>
											<div className="text-sm text-gray-600 dark:text-gray-300">
												{t("singleProperty.buildingAge")}
											</div>
										</div>
									)}
								</div>

								{/* Additional Costs */}
								{(property.deposit > 0 || property.monthlyFee > 0) && (
									<div className="border-t dark:border-gray-600 pt-4">
										{property.deposit > 0 && (
											<div className="flex justify-between text-sm mb-2">
												<span className="text-gray-600 dark:text-gray-300">
													{t("singleProperty.deposit")}:
												</span>
												<span className="font-medium dark:text-white">
													{formatPrice(property.deposit, property.currency)}
												</span>
											</div>
										)}
										{property.monthlyFee > 0 && (
											<div className="flex justify-between text-sm">
												<span className="text-gray-600 dark:text-gray-300">
													{t("singleProperty.monthlyFee")}:
												</span>
												<span className="font-medium dark:text-white">
													{formatPrice(property.monthlyFee, property.currency)}
												</span>
											</div>
										)}
									</div>
								)}
							</div>
						</Card>

						{/* Property Features */}
						<Card className="dark:bg-gray-800 dark:border-gray-700">
							<div className="p-6">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
									{t("singleProperty.features")}
								</h3>
								<div className="space-y-3">
									<div className="grid grid-cols-1 gap-2">
										{[
											{
												key: "hasKitchen",
												label: t("singleProperty.kitchen"),
												value: property.details.hasKitchen,
											},
											{
												key: "hasBalcony",
												label: t("singleProperty.balcony"),
												value: property.details.hasBalcony,
											},
											{
												key: "hasElevator",
												label: t("singleProperty.elevator"),
												value: property.details.hasElevator,
											},
											{
												key: "hasParking",
												label: t("singleProperty.parking"),
												value: property.details.hasParking,
											},
											{
												key: "hasGarden",
												label: t("singleProperty.garden"),
												value: property.details.hasGarden,
											},
											{
												key: "isFurnished",
												label: t("singleProperty.furnished"),
												value: property.details.isFurnished,
											},
											{
												key: "isInComplex",
												label: t("singleProperty.inComplex"),
												value: property.details.isInComplex,
											},
											{
												key: "isEligibleForLoan",
												label: t("singleProperty.eligibleForLoan"),
												value: property.details.isEligibleForLoan,
											},
											{
												key: "isExchangeable",
												label: t("singleProperty.exchangeable"),
												value: property.details.isExchangeable,
											},
										].map((feature) => (
											<div
												key={feature.key}
												className="flex items-center justify-between py-1"
											>
												<span className="text-sm text-gray-600 dark:text-gray-300">
													{feature.label}
												</span>
												{feature.value ? (
													<HiCheck className="h-5 w-5 text-green-500 dark:text-green-400" />
												) : (
													<HiX className="h-5 w-5 text-gray-300 dark:text-gray-500" />
												)}
											</div>
										))}
									</div>
								</div>
							</div>
						</Card>

						{/* Additional Details */}
						<Card className="dark:bg-gray-800 dark:border-gray-700">
							<div className="p-6">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
									{t("singleProperty.details")}
								</h3>
								<div className="space-y-2 text-sm">
									{property.details.heatingType && (
										<div className="flex justify-between">
											<span className="text-gray-600 dark:text-gray-300">
												{t("singleProperty.heatingType")}:
											</span>
											<span className="font-medium dark:text-white">
												{property.details.heatingType}
											</span>
										</div>
									)}
									{property.details.floorNumber && (
										<div className="flex justify-between">
											<span className="text-gray-600 dark:text-gray-300">
												{t("singleProperty.floorNumber")}:
											</span>
											<span className="font-medium dark:text-white">
												{property.details.floorNumber}
											</span>
										</div>
									)}
									{property.details.totalFloors && (
										<div className="flex justify-between">
											<span className="text-gray-600 dark:text-gray-300">
												{t("singleProperty.totalFloors")}:
											</span>
											<span className="font-medium dark:text-white">
												{property.details.totalFloors}
											</span>
										</div>
									)}
									{property.details.bathroomCount && (
										<div className="flex justify-between">
											<span className="text-gray-600 dark:text-gray-300">
												{t("singleProperty.bathroomCount")}:
											</span>
											<span className="font-medium dark:text-white">
												{property.details.bathroomCount}
											</span>
										</div>
									)}
									{property.details.usageStatus && (
										<div className="flex justify-between">
											<span className="text-gray-600 dark:text-gray-300">
												{t("singleProperty.usageStatus")}:
											</span>
											<span className="font-medium dark:text-white">
												{property.details.usageStatus}
											</span>
										</div>
									)}
									{property.details.deedStatus && (
										<div className="flex justify-between">
											<span className="text-gray-600 dark:text-gray-300">
												{t("singleProperty.deedStatus")}:
											</span>
											<span className="font-medium dark:text-white">
												{property.details.deedStatus}
											</span>
										</div>
									)}
									{property.details.listedBy && (
										<div className="flex justify-between">
											<span className="text-gray-600 dark:text-gray-300">
												{t("singleProperty.listedBy")}:
											</span>
											<span className="font-medium dark:text-white">
												{property.details.listedBy}
											</span>
										</div>
									)}
								</div>
							</div>
						</Card>

						{/* Owner Contact */}
						<Card className="dark:bg-gray-800 dark:border-gray-700">
							<div className="p-6">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
									{t("singleProperty.contact")}
								</h3>
								<div className="flex items-center space-x-3 mb-4">
									<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
										<HiUser className="h-6 w-6 text-blue-600 dark:text-blue-400" />
									</div>
									<div>
										<p className="font-medium text-gray-900 dark:text-white">
											{property.owner.firstName} {property.owner.lastName}
										</p>
										<p className="text-sm text-gray-600 dark:text-gray-300">
											{t("singleProperty.propertyOwner")}
										</p>
									</div>
								</div>

								{showContactInfo ? (
									<div className="space-y-4">
										<div className="space-y-3">
											<div className="flex items-center space-x-3">
												<HiMail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
												<span className="text-sm dark:text-gray-300">
													{property.owner.email}
												</span>
											</div>
											{property.owner.phoneNumber && (
												<div className="flex items-center space-x-3">
													<HiPhone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
													<span className="text-sm dark:text-gray-300">
														{property.owner.phoneNumber}
													</span>
												</div>
											)}
										</div>
										
										{/* Chat Button */}
										<Button
											color="success"
											className="w-full bg-green-600 hover:bg-green-700"
											onClick={() => {
												console.log("Chat button clicked - setting showChatModal to true");
												console.log("Property:", property?.id, "Owner:", property?.owner?.id);
												setShowChatModal(true);
											}}
										>
											<HiChat className="mr-2 h-4 w-4" />
											{t("singleProperty.startChat")}
										</Button>
									</div>
								) : (
									<div className="space-y-3">
										<Button
											color="blue"
											className="w-full"
											onClick={() => setShowContactInfo(true)}
										>
											<HiPhone className="mr-2 h-4 w-4" />
											{t("singleProperty.showContactInfo")}
										</Button>
										
										<Button
											color="success"
											className="w-full bg-green-600 hover:bg-green-700"
											onClick={contactHandler}
										>
											<HiChat className="mr-2 h-4 w-4" />
											{t("singleProperty.startChat")}
										</Button>
									</div>
								)}
							</div>
						</Card>

						{/* Date Information */}
						<Card className="dark:bg-gray-800 dark:border-gray-700">
							<div className="p-6">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
									{t("singleProperty.dateInfos")}
								</h3>
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-gray-600 dark:text-gray-300">
											{t("singleProperty.createdDate")}:
										</span>
										<span className="font-medium dark:text-white">
											{formatDate(property.createdDate)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600 dark:text-gray-300">
											{t("singleProperty.startDate")}:
										</span>
										<span className="font-medium dark:text-white">
											{formatDate(property.startDate)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600 dark:text-gray-300">
											{t("singleProperty.endDate")}:
										</span>
										<span className="font-medium dark:text-white">
											{formatDate(property.endDate)}
										</span>
									</div>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>

			{/* Image Modal */}
			<ImageModal
				showImageModal={showImageModal}
				setShowImageModal={setShowImageModal}
				property={property}
				selectedImageIndex={selectedImageIndex}
				setSelectedImageIndex={setSelectedImageIndex}
			/>

			{/* Map Modal */}
			<MapModal
				showMapModal={showMapModal}
				setShowMapModal={setShowMapModal}
				location={property.location}
			/>

			{/* Chat Modal */}
			<ChatModal
				show={showChatModal}
				onClose={() => {
					console.log("Chat modal onClose called - setting showChatModal to false");
					setShowChatModal(false);
				}}
				property={property}
				owner={property.owner}
			/>
		</div>
	);
};

export default Property;
