import { useEffect, useState } from "react";
import { Card, Badge, Button } from "flowbite-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
	HiHome,
	HiLocationMarker,
	HiOutlineHeart,
	HiHeart,
} from "react-icons/hi";
import { useTranslation } from "react-i18next";
import StatusBadge from "./StatusBadge";
import TypeBadge from "./TypeBadge";
import { getPrimaryImage, formatPrice } from "../../utils";
import { useAuthContext } from "../../context/Auth";
import { addFavorite, removeFavorite } from "../../services/FavoriteService";

const PropertyCard = ({ property, buttonName }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const { t } = useTranslation("common");
	const { favorites, refreshFavorites, addFavoriteToContext, removeFavoriteFromContext } = useAuthContext();

	const [isFavorite, setIsFavorite] = useState(
		favorites.some((fav) => fav.id === property.id)
	);

	useEffect(() => {
		setIsFavorite(favorites.some((fav) => fav.id === property.id));
	}, [favorites, property.id]);

	const viewButton = buttonName ?? t("card.seeDetails");

	const toggleFavorite = async () => {
		if (isFavorite) {
			await removeFavoriteFromContext(property.id);
			// setIsFavorite(false);
		} else {
			await addFavoriteToContext(property);
			// setIsFavorite(true);
		}
	};

	return (
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
					<StatusBadge status={property.status?.name} />
				</div>

				{/* Type Badge */}
				<div className="absolute top-3 right-3">
					<TypeBadge type={property.type?.id} />
				</div>

				{/* Favorite Button */}
				<button
					onClick={toggleFavorite}
					className="absolute bottom-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
				>
					{isFavorite ? (
						<HiHeart className="h-5 w-5 text-red-500" />
					) : (
						<HiOutlineHeart className="h-5 w-5 text-gray-600" />
					)}
				</button>

				{/* Image Count */}
				{property.media && property.media.length > 1 && (
					<div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded text-xs">
						{property.media.length} {t("card.images")}
					</div>
				)}
			</div>

			<div className="p-4">
				{/* Title */}
				<div className="flex items-start justify-between mb-2">
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
						{property.title}
					</h3>
				</div>
				{/* Price */}
				<div className="flex items-center justify-between mb-3">
					<h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
						{formatPrice(property.price, property.currency)}
					</h3>
				</div>

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
								<span className="font-medium">
									{property.details.roomCount}
								</span>{" "}
								{t("card.rooms")}
							</span>
						)}
						{property.details.grossArea && (
							<span className="flex items-center">
								<span className="font-medium">
									{property.details.grossArea}
								</span>{" "}
								m²
							</span>
						)}
					</div>
				</div>

				{/* Features */}
				<div className="flex flex-wrap gap-1 mb-4">
					{property.details.hasParking && (
						<Badge color="gray" size="xs">
							{t("card.park")}
						</Badge>
					)}
					{property.details.hasElevator && (
						<Badge color="gray" size="xs">
							{t("card.elevator")}
						</Badge>
					)}
					{property.details.hasBalcony && (
						<Badge color="gray" size="xs">
							{t("card.balcony")}
						</Badge>
					)}
					{property.details.isFurnished && (
						<Badge color="gray" size="xs">
							{t("card.furnished")}
						</Badge>
					)}
				</div>

				{/* View Button */}
				<Button
					size="sm"
					color="blue"
					className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
					onClick={() => navigate(`/properties/${property.id}`)}
				>
					{viewButton}
				</Button>
			</div>
		</Card>
	);
};

export default PropertyCard;
