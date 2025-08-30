import React from "react";
import { Card, Button } from "flowbite-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MapPopup from "../../components/Properties/MapPopup";
import { useTranslation } from "react-i18next";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	iconUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icons for different property types and statuses
const getMarkerIcon = (propertyStatus, propertyType, isSelected = false) => {
	const statusColors = {
		"For Sale": "#10b981", // green-500
		"For Rent": "#3b82f6", // blue-500
		Sold: "#6b7280", // gray-500
		Rented: "#f59e0b", // amber-500
	};

	const color = statusColors[propertyStatus?.name] || "#6b7280";
	const size = isSelected ? 40 : 30;
	const iconSize = isSelected ? "16px" : "12px";

	const statusIcons = {
		"For Sale": "🏷️",
		"For Rent": "🔑",
		Sold: "✅",
		Rented: "🏠",
	};

	const icon = statusIcons[propertyStatus?.name] || "📍";

	return L.divIcon({
		className: "custom-marker",
		html: `<div style="
			background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
			width: ${size}px;
			height: ${size}px;
			border-radius: 50%;
			border: 3px solid white;
			box-shadow: 0 4px 12px rgba(0,0,0,0.3);
			display: flex;
			align-items: center;
			justify-content: center;
			color: white;
			font-weight: bold;
			font-size: ${iconSize};
			cursor: pointer;
			transform: ${isSelected ? "scale(1.2)" : "scale(1)"};
			transition: all 0.2s ease;
		">${icon}</div>`,
		iconSize: [size, size],
		iconAnchor: [size / 2, size / 2],
	});
};

const MapArea = ({
	properties,
	selectedProperty,
	mapRef,
  handlePropertyClick,
  clearFilters,
	showSidebar,
}) => {
  const { t } = useTranslation("common");
	// Get map center and bounds based on properties
	const getMapCenter = () => {
		if (properties.length === 0) {
			return [39.9334, 32.8597]; // Turkey center
		}

		if (
			selectedProperty?.location.latitude &&
			selectedProperty?.location.longitude
		) {
			return [
				selectedProperty.location.latitude,
				selectedProperty.location.longitude,
			];
		}

		const validProperties = properties.filter(
			(p) => p.location.latitude && p.location.longitude
		);
		if (validProperties.length === 0) {
			return [39.9334, 32.8597];
		}

		const avgLat =
			validProperties.reduce((sum, p) => sum + p.location.latitude, 0) /
			validProperties.length;
		const avgLng =
			validProperties.reduce((sum, p) => sum + p.location.longitude, 0) /
			validProperties.length;
		return [avgLat, avgLng];
	};

	const getMapZoom = () => {
		if (selectedProperty) return 15;
		if (properties.length === 0) return 6;

		const validProperties = properties.filter(
			(p) => p.location.latitude && p.location.longitude
		);

		if (validProperties.length === 0) return 6;
		if (validProperties.length === 1) return 12;

		// Calculate the bounding box
		const lats = validProperties.map((p) => p.location.latitude);
		const lngs = validProperties.map((p) => p.location.longitude);

		const minLat = Math.min(...lats);
		const maxLat = Math.max(...lats);
		const minLng = Math.min(...lngs);
		const maxLng = Math.max(...lngs);

		const latDiff = maxLat - minLat;
		const lngDiff = maxLng - minLng;
		const maxDiff = Math.max(latDiff, lngDiff);

		if (maxDiff > 10) return 5;
		if (maxDiff > 5) return 6;
		if (maxDiff > 2) return 7;
		if (maxDiff > 1) return 8;
		if (maxDiff > 0.5) return 9;
		if (maxDiff > 0.2) return 10;
		if (maxDiff > 0.1) return 11;
		if (maxDiff > 0.05) return 12;
		return 13;
	};

	return (
		<div className={showSidebar ? "lg:col-span-3" : "col-span-1"}>
			<Card className="dark:bg-gray-800 dark:border-gray-700">
				<div className="p-0">
					{/* Map Container */}
					<div
						className={`rounded-lg overflow-hidden ${
							showSidebar ? "h-[600px]" : "h-[700px]"
						}`}
					>
						{properties.length > 0 ? (
							<MapContainer
								center={getMapCenter()}
								zoom={getMapZoom()}
								style={{
									height: "100%",
									width: "100%",
								}}
								ref={mapRef}
							>
								<TileLayer
									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
								/>

								{properties.map(
									(property) =>
										property.location.latitude &&
										property.location.longitude && (
											<Marker
												key={property.id}
												position={[
													property.location.latitude,
													property.location.longitude,
												]}
												icon={getMarkerIcon(
													property.status,
													property.type,
													selectedProperty?.id === property.id
												)}
												eventHandlers={{
													click: () => handlePropertyClick(property),
												}}
											>
												<MapPopup property={property} />
											</Marker>
										)
								)}
							</MapContainer>
						) : (
							<div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
								<div className="text-center">
									<HiLocationMarker className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
									<h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
										{t("properties.noFoundLocation")}
									</h3>
									<p className="text-gray-500 dark:text-gray-400 mb-4">
										{t("properties.noFoundLocationDescription")}
									</p>
									<Button color="blue" onClick={clearFilters}>
										{t("properties.clearFilters")}
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>
			</Card>
		</div>
	);
};

export default MapArea;
