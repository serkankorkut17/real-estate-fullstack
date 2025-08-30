import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
	HiLocationMarker,
	HiEye,
	HiHeart,
	HiOutlineHeart,
	HiX,
} from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { Badge, Button } from "flowbite-react";
import { formatPrice, getPrimaryImage } from "../../utils";
import StatusBadge from "./StatusBadge";
import TypeBadge from "./TypeBadge";
import { useAuthContext } from "../../context/Auth";

const SelectedMapProperty = ({ selectedProperty, setSelectedProperty }) => {
	const navigate = useNavigate();
	const { t } = useTranslation("common");
	const { favorites, addFavoriteToContext, removeFavoriteFromContext } =
		useAuthContext();

	const [isFavorite, setIsFavorite] = useState(
		favorites.some((fav) => fav.id === selectedProperty.id)
	);

	useEffect(() => {
		setIsFavorite(favorites.some((fav) => fav.id === selectedProperty.id));
	}, [favorites, selectedProperty.id]);

	const toggleFavorite = async () => {
		if (isFavorite) {
			await removeFavoriteFromContext(selectedProperty.id);
		} else {
			await addFavoriteToContext(selectedProperty);
		}
	};

	return (
		<div className="space-y-4">
			<div className="border-b pb-4">
				{getPrimaryImage(selectedProperty.media) && (
					<img
						src={getPrimaryImage(selectedProperty.media)}
						alt={selectedProperty.title}
						className="w-full h-32 object-cover rounded-lg mb-3"
					/>
				)}
				<h4 className="font-semibold text-lg line-clamp-2 dark:text-white">
					{selectedProperty.title}
				</h4>
				<p className="text-gray-600 dark:text-gray-300 text-sm flex items-center mt-1">
					<HiLocationMarker className="h-4 w-4 mr-1" />
					{[selectedProperty.location.district, selectedProperty.location.city]
						.filter(Boolean)
						.join(", ")}
				</p>
			</div>

			<div className="space-y-3 text-sm">
				<div className="flex justify-between items-center">
					<span className="text-gray-600 dark:text-gray-300">
						{" "}
						{t("card.price")}:
					</span>
					<span className="font-bold text-blue-600 dark:text-blue-400">
						{formatPrice(selectedProperty.price, selectedProperty.currency)}
					</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-gray-600 dark:text-gray-300">
						{" "}
						{t("card.type")}:
					</span>
					<span className="text-gray-900 dark:text-white">
						<TypeBadge type={selectedProperty.propertyTypeId} />
					</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-gray-600 dark:text-gray-300">
						{t("card.status")}:
					</span>
					{/* {getStatusBadge(selectedProperty.status?.name)} */}
					<StatusBadge status={selectedProperty.status?.name} />
				</div>
				{selectedProperty.details.grossArea && (
					<div className="flex justify-between items-center">
						<span className="text-gray-600 dark:text-gray-300">
							{t("card.area")}:
						</span>
						<span className="text-gray-900 dark:text-white">
							{selectedProperty.details.grossArea}
							m²
						</span>
					</div>
				)}
				{selectedProperty.details.roomCount && (
					<div className="flex justify-between items-center">
						<span className="text-gray-600 dark:text-gray-300">
							{t("card.room")}:
						</span>
						<span className="text-gray-900 dark:text-white">
							{selectedProperty.details.roomCount} {t("card.rooms")}
						</span>
					</div>
				)}
			</div>

			<div className="pt-4 border-t space-y-2">
				<Button
					size="sm"
					className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
					onClick={() => navigate(`/properties/${selectedProperty.id}`)}
				>
					<HiEye className="mr-2 h-4 w-4" />
					{t("buttons.viewDetails")}
				</Button>
				{/* <div className="grid"> */}
				<div className="grid grid-cols-2 gap-2">
					<Button
						size="sm"
						color="gray"
						onClick={() => toggleFavorite(selectedProperty.id)}
					>
						{isFavorite ? (
							<HiHeart className="mr-1 h-3 w-3 text-red-500" />
						) : (
							<HiOutlineHeart className="mr-1 h-3 w-3" />
						)}
						Favori
					</Button>
					<Button
						size="sm"
						color="gray"
						onClick={() => setSelectedProperty(null)}
					>
						<HiX className="mr-1 h-3 w-3" />
						{t("card.close")}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default SelectedMapProperty;
