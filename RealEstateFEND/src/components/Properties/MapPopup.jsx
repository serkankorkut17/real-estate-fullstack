import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Button } from "flowbite-react";
import {
	HiLocationMarker,
	HiEye,
	HiHome,
	HiHeart,
	HiOutlineHeart,
} from "react-icons/hi";
import TypeBadge from "./TypeBadge";
import StatusBadge from "./StatusBadge";
import { formatPrice, getPropertyType, getPrimaryImage } from "../../utils";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/Auth";
import { addFavorite, removeFavorite } from "../../services/FavoriteService";

const MapPopup = ({ property }) => {
	const { t } = useTranslation("common");
	const navigate = useNavigate();

	const { favorites, addFavoriteToContext, removeFavoriteFromContext } =
		useAuthContext();

	const [isFavorite, setIsFavorite] = useState(
		favorites.some((fav) => fav.id === property.id)
	);

	useEffect(() => {
		setIsFavorite(favorites.some((fav) => fav.id === property.id));
	}, [favorites, property.id]);

	const toggleFavorite = async () => {
		if (isFavorite) {
			await removeFavoriteFromContext(property.id);
		} else {
			await addFavoriteToContext(property);
		}
	};

	return (
		<Popup className="custom-popup">
			<div className="p-2 min-w-72 max-w-80">
				<div className="flex items-start space-x-3">
					{getPrimaryImage(property.media) ? (
						<img
							src={getPrimaryImage(property.media)}
							alt={property.title}
							className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
						/>
					) : (
						<div className="w-20 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
							<HiHome className="h-8 w-8 text-gray-400" />
						</div>
					)}
					<div className="flex-1 min-w-0">
						<h4 className="font-semibold text-sm mb-1 line-clamp-2">
							{property.title}
						</h4>
						<p className="text-xs text-gray-600 mb-2 flex items-center">
							<HiLocationMarker className="h-3 w-3 mr-1" />
							{[property.location.district, property.location.city]
								.filter(Boolean)
								.join(", ")}
						</p>
						<div className="flex justify-between items-center mb-2">
							<span className="text-sm font-bold text-blue-600">
								{formatPrice(property.price, property.currency)}
							</span>
							<StatusBadge status={property.status?.name} />
						</div>
						<div className="text-xs text-gray-500 mb-3">
							{getPropertyType(property.type?.id)} •{" "}
							{property.details.grossArea && `${property.details.grossArea}m²`}
						</div>
						<div className="flex gap-2">
							<Button
								size="xs"
								className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
								onClick={() => navigate(`/properties/${property.id}`)}
							>
								<HiEye className="mr-1 h-3 w-3" />
								{t("properties.details")}
							</Button>
							<Button
								size="xs"
								color="gray"
								onClick={(e) => {
									e.stopPropagation();
									toggleFavorite();
								}}
							>
								{isFavorite ? (
									<HiHeart className="h-3 w-3 text-red-500" />
								) : (
									<HiOutlineHeart className="h-3 w-3" />
								)}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</Popup>
	);
};

export default MapPopup;
