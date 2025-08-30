import { useState, useEffect } from "react";
import {
	Card,
	Button,
	Badge,
	Spinner,
	Modal,
	ModalBody,
	ModalHeader,
} from "flowbite-react";
import {
	HiPencil,
	HiTrash,
	HiHome,
	HiLocationMarker,
	HiEye,
	HiPlus,
	HiExclamationCircle,
} from "react-icons/hi";
import {
	getMyProperties,
	deleteProperty,
} from "../../services/PropertyService";
import { useAuthContext } from "../../context/Auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { formatPriceV2, getPrimaryImage, getPropertyType } from "../../utils";
import StatusBadge from "../../components/Properties/StatusBadge";
import TypeBadge from "../../components/Properties/TypeBadge";

const MyProperties = () => {
	const { user } = useAuthContext();
	const navigate = useNavigate();
	const { t } = useTranslation("common");
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(true);
	const [deleting, setDeleting] = useState(null); // ID of property being deleted
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [propertyToDelete, setPropertyToDelete] = useState(null);

	useEffect(() => {
		if (user) {
			fetchMyProperties();
		}
	}, [user]);

	const fetchMyProperties = async () => {
		setLoading(true);
		try {
			const response = await getMyProperties(user.id);
			console.log(response);

			if (response.success) {
				setProperties(response.data.data || response.data);
			} else {
				toast.error(t("myProperties.loadError"));
			}
		} catch (error) {
			console.error("Error fetching my properties:", error);
			toast.error(t("myProperties.loadError"));
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteClick = (property) => {
		setPropertyToDelete(property);
		setShowDeleteModal(true);
	};

	const confirmDelete = async () => {
		if (!propertyToDelete) return;

		setDeleting(propertyToDelete.id);
		try {
			const response = await deleteProperty(propertyToDelete.id);
			if (response.success) {
				toast.success(t("myProperties.deleteModal.successMessage"));
				setProperties((prev) =>
					prev.filter((property) => property.id !== propertyToDelete.id)
				);
			} else {
				toast.error(t("myProperties.deleteModal.errorMessage"));
			}
		} catch (error) {
			console.error("Error deleting property:", error);
			toast.error(t("myProperties.deleteModal.errorMessage"));
		} finally {
			setDeleting(null);
			setShowDeleteModal(false);
			setPropertyToDelete(null);
		}
	};

	const handleEdit = (propertyId) => {
		navigate(`/user/edit-property/${propertyId}`);
	};

	const handleView = (propertyId) => {
		navigate(`/properties/${propertyId}`);
	};

	const getStatusBadge = (status) => {
		const statusConfig = {
			"For Sale": {
				color: "success",
				text: t("myProperties.statusBadges.forSale"),
			},
			"For Rent": {
				color: "info",
				text: t("myProperties.statusBadges.forRent"),
			},
			Sold: { color: "gray", text: t("myProperties.statusBadges.sold") },
			Rented: { color: "warning", text: t("myProperties.statusBadges.rented") },
		};

		const config = statusConfig[status] || { color: "gray", text: status };
		return (
			<Badge color={config.color} size="sm">
				{config.text}
			</Badge>
		);
	};

	const getPrimaryImage = (media) => {
		if (!media || media.length === 0) return null;
		const primary = media.find((m) => m.isPrimary) || media[0];
		return primary?.url;
	};

	const PropertyCard = ({ property }) => (
		<Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
			<div className="relative overflow-hidden rounded-t-lg">
				{getPrimaryImage(property.media) ? (
					<img
						src={getPrimaryImage(property.media)}
						alt={property.title}
						className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
					/>
				) : (
					<div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
						<HiHome className="h-16 w-16 text-gray-400 dark:text-gray-500" />
					</div>
				)}

				{/* Status Badge */}
				<div className="absolute top-3 left-3">
					{/* {getStatusBadge(property.status?.name)} */}
					<StatusBadge status={property.status?.name} />
				</div>

				{/* Photo Count */}
				{property.media && property.media.length > 1 && (
					<div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs">
						{property.media.length} {t("myProperties.photos")}
					</div>
				)}
			</div>

			<div className="p-4">
				{/* Price and Type */}
				<div className="flex items-center justify-between mb-3">
					<h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
						{formatPriceV2(property.price, property.currency)}
					</h3>
					{property.type && (
						// <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
						// 	{getPropertyType(property.type.id)}
						// </span>
						<TypeBadge type={property.type.id} />
					)}
				</div>

				{/* Title */}
				<h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
					{property.title}
				</h4>

				{/* Location */}
				<div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
					<HiLocationMarker className="h-4 w-4 mr-1 flex-shrink-0" />
					<span className="text-sm truncate">
						{[property.location.district, property.location.city]
							.filter(Boolean)
							.join(", ")}
					</span>
				</div>

				{/* Property Details */}
				<div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
					<div className="flex items-center space-x-4">
						{property.details.roomCount && (
							<span className="flex items-center">
								<span className="font-medium">{property.details.roomCount}</span>
								{t("myProperties.room")}
							</span>
						)}
						{property.details.grossArea && (
							<span className="flex items-center">
								<span className="font-medium">{property.details.grossArea}</span>{" "}
								{t("myProperties.area")}
							</span>
						)}
					</div>
				</div>

				{/* Property Features */}
				<div className="flex flex-wrap gap-1 mb-4">
					{property.details.hasParking && (
						<Badge
							color="gray"
							size="xs"
							className="dark:bg-gray-600 dark:text-gray-200"
						>
							🚗 {t("myProperties.features.parking")}
						</Badge>
					)}
					{property.details.hasElevator && (
						<Badge
							color="gray"
							size="xs"
							className="dark:bg-gray-600 dark:text-gray-200"
						>
							🛗 {t("myProperties.features.elevator")}
						</Badge>
					)}
					{property.details.hasBalcony && (
						<Badge
							color="gray"
							size="xs"
							className="dark:bg-gray-600 dark:text-gray-200"
						>
							🌅 {t("myProperties.features.balcony")}
						</Badge>
					)}
					{property.details.isFurnished && (
						<Badge
							color="gray"
							size="xs"
							className="dark:bg-gray-600 dark:text-gray-200"
						>
							🛋️ {t("myProperties.features.furnished")}
						</Badge>
					)}
					{property.details.hasGarden && (
						<Badge
							color="gray"
							size="xs"
							className="dark:bg-gray-600 dark:text-gray-200"
						>
							🌿 {t("myProperties.features.garden")}
						</Badge>
					)}
				</div>

				{/* Action Buttons */}
				<div className="flex gap-2">
					<Button
						size="sm"
						color="gray"
						onClick={() => handleView(property.id)}
						className="flex-1 flex items-center justify-center"
					>
						<HiEye className="mr-1 h-4 w-4" />
						{t("myProperties.actions.view")}
					</Button>
					<Button
						size="sm"
						color="blue"
						onClick={() => handleEdit(property.id)}
						className="flex-1 flex items-center justify-center"
					>
						<HiPencil className="mr-1 h-4 w-4" />
						{t("myProperties.actions.edit")}
					</Button>
					<Button
						size="sm"
						color="red"
						onClick={() => handleDeleteClick(property)}
						className="flex-1 flex items-center justify-center"
						disabled={deleting === property.id}
					>
						<HiTrash className="mr-1 h-4 w-4" />
						{deleting === property.id
							? t("myProperties.actions.deleting")
							: t("myProperties.actions.delete")}
					</Button>
				</div>
			</div>
		</Card>
	);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="container mx-auto px-4 py-6">
				{/* Header */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
					<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
								{t("myProperties.title")}
							</h1>
							<p className="text-gray-600 dark:text-gray-300">
								{properties.length > 0 ? (
									<span>
										<span className="font-semibold text-blue-600">
											{properties.length}
										</span>{" "}
										{t("myProperties.subtitle")}
									</span>
								) : (
									t("myProperties.noPropertiesSubtitle")
								)}
							</p>
						</div>

						<Button
							color="blue"
							size="lg"
							onClick={() => navigate("/properties/new")}
							className="flex items-center gap-2"
						>
							<HiPlus className="h-5 w-5" />
							{t("myProperties.addNewProperty")}
						</Button>
					</div>
				</div>

				{/* Content */}
				{loading ? (
					<div className="flex justify-center items-center h-64">
						<Spinner size="xl" />
						<span className="ml-3 text-gray-600 dark:text-gray-300">
							{t("myProperties.loading")}
						</span>
					</div>
				) : properties.length === 0 ? (
					<Card className="dark:bg-gray-800 dark:border-gray-700">
						<div className="text-center py-12">
							<HiHome className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
							<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
								{t("myProperties.noPropertiesFound")}
							</h3>
							<p className="text-gray-600 dark:text-gray-300 mb-4">
								{t("myProperties.noPropertiesDescription")}
							</p>
							<Button
								color="blue"
								size="lg"
								onClick={() => navigate("/properties/new")}
								className="flex items-center gap-2 mx-auto"
							>
								<HiPlus className="h-5 w-5" />
								{t("myProperties.createFirstProperty")}
							</Button>
						</div>
					</Card>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
						{properties.map((property) => (
							<PropertyCard key={property.id} property={property} />
						))}
					</div>
				)}

				{/* Delete Confirmation Modal */}
				<Modal
					show={showDeleteModal}
					size="md"
					onClose={() => setShowDeleteModal(false)}
					popup
					className=""
				>
					<ModalHeader className="bg-white dark:bg-gray-800" />
					<ModalBody className="bg-white dark:bg-gray-800">
						<div className="text-center">
							<HiExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-500" />
							<h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-300">
								{t("myProperties.deleteModal.title")}
							</h3>
							{propertyToDelete && (
								<div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
									<p className="font-semibold text-gray-900 dark:text-white">
										{propertyToDelete.title}
									</p>
									<p className="text-sm text-gray-600 dark:text-gray-300">
										{propertyToDelete.location.district},{" "}
										{propertyToDelete.location.city}
									</p>
								</div>
							)}
							<div className="flex justify-center gap-4">
								<Button
									color="failure"
									onClick={confirmDelete}
									disabled={deleting}
									className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
								>
									{deleting
										? t("myProperties.actions.deleting")
										: t("myProperties.deleteModal.confirmDelete")}
								</Button>
								<Button
									color="gray"
									onClick={() => setShowDeleteModal(false)}
									disabled={deleting}
								>
									{t("myProperties.deleteModal.cancel")}
								</Button>
							</div>
						</div>
					</ModalBody>
				</Modal>
			</div>
		</div>
	);
};

export default MyProperties;
