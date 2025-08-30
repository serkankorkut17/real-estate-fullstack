import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
// Leaflet CSS
import "leaflet/dist/leaflet.css";

import { Card, Button } from "flowbite-react";
import { HiLocationMarker, HiMap } from "react-icons/hi";
import { useTranslation } from "react-i18next";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	iconUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapCard = ({ location, setShowMapModal }) => {
  const { t } = useTranslation();

	return (
		<Card className="dark:bg-gray-800 dark:border-gray-700">
			<div className="p-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-xl font-bold text-gray-900 dark:text-white">
						{t("singleProperty.location")}
					</h3>
					{location.latitude && location.longitude && (
						<Button
							size="sm"
							color="blue"
							onClick={() => setShowMapModal(true)}
						>
							<HiMap className="mr-2 h-4 w-4" />
							{t("singleProperty.viewOnMap")}
						</Button>
					)}
				</div>

				{location.latitude && location.longitude ? (
					<div className="space-y-4">
						{/* Mini Harita */}
						<div className="h-80 w-full border rounded-lg overflow-hidden">
							<MapContainer
								center={[
									location.latitude,
									location.longitude,
								]}
								zoom={15}
								style={{
									height: "100%",
									width: "100%",
								}}
								scrollWheelZoom={false}
							>
								<TileLayer
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								/>
								<Marker
									position={[
										location.latitude,
										location.longitude,
									]}
								/>
							</MapContainer>
						</div>

						{/* Adres Bilgileri */}
						<div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
							<div className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
								<HiLocationMarker className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
								<span className="font-medium">
									{t("singleProperty.addressInfo")}
								</span>
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
								{location.addressLine && (
									<p>
										<span className="font-medium">
											{t("singleProperty.address")}:
										</span>{" "}
										{location.addressLine}
									</p>
								)}
								{location.street && (
									<p>
										<span className="font-medium">
											{t("singleProperty.street")}:
										</span>{" "}
										{location.treet}
									</p>
								)}
								{location.neighborhood && (
									<p>
										<span className="font-medium">
											{t("singleProperty.neighborhood")}:
										</span>{" "}
										{location.neighborhood}
									</p>
								)}
								<p>
									<span className="font-medium">
										{t("singleProperty.districtCity")}:
									</span>{" "}
									{[location.district, location.city]
										.filter(Boolean)
										.join(", ")}
								</p>
							</div>
						</div>
					</div>
				) : (
					<div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-8 text-center">
						<HiLocationMarker className="mx-auto h-12 w-12 text-blue-500 dark:text-blue-400 mb-4" />
						<p className="text-gray-700 dark:text-gray-300 mb-2">
							{[location.neighborhood,location.district,location.city,
							]
								.filter(Boolean)
								.join(", ")}
						</p>
						{location.street && (
							<p className="text-gray-600 dark:text-gray-400 mt-1">
								{property.location.street}
							</p>
						)}
						{location.addressLine && (
							<p className="text-gray-600 dark:text-gray-400 mt-1">
								{location.addressLine}
							</p>
						)}
						<p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
							{t("singleProperty.noLocation")}
						</p>
					</div>
				)}
			</div>
		</Card>
	);
};

export default MapCard;
