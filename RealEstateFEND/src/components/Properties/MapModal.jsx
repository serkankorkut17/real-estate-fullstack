import { useEffect } from "react";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { HiMap } from "react-icons/hi";
import { useTranslation } from "react-i18next";

const MapModal = ({ showMapModal, setShowMapModal, location }) => {
	const { t } = useTranslation();

	// CSS for modal z-index fix
	useEffect(() => {
		const style = document.createElement("style");
		style.textContent = `
				.map-modal-overlay {
					z-index: 10000 !important;
				}
				.map-modal-overlay [data-testid="modal"] {
					z-index: 10001 !important;
				}
				.leaflet-container {
					z-index: 1 !important;
				}
			`;
		document.head.appendChild(style);
		return () => document.head.removeChild(style);
	}, []);

	if (!location || !location.latitude || !location.longitude) return null;
	return (
		<Modal
			show={showMapModal}
			onClose={() => setShowMapModal(false)}
			size="6xl"
			className="map-modal-overlay dark"
		>
			<ModalHeader className="dark:bg-gray-800 dark:border-gray-700">
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center">
						<HiMap className="mr-2 h-5 w-5 text-blue-500 dark:text-blue-400" />
						<span className="dark:text-white">
							{t("singleProperty.locationMap")}
						</span>
					</div>
				</div>
			</ModalHeader>
			<ModalBody className="dark:bg-gray-900">
				<div className="space-y-4">
					{/* Interactive Map */}
					<div className="h-[70vh] w-full border dark:border-gray-700 rounded-lg overflow-hidden">
						<MapContainer
							center={[location.latitude, location.longitude]}
							zoom={16}
							style={{
								height: "100%",
								width: "100%",
							}}
						>
							<TileLayer
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							/>
							<Marker position={[location.latitude, location.longitude]} />
						</MapContainer>
					</div>

					{/* Map Controls Info */}
					<div className="text-xs text-gray-500 dark:text-gray-400 text-center">
						💡 <strong>{t("singleProperty.mapControls")}</strong>{" "}
						{t("singleProperty.mapControlsDescription")}
					</div>
				</div>
			</ModalBody>
		</Modal>
	);
};

export default MapModal;
