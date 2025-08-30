import { useState, useEffect, useRef } from "react";
import {
	Card,
	Button,
	Badge,
	TextInput,
	Select,
	Spinner,
} from "flowbite-react";
import {
	HiLocationMarker,
	HiEye,
	HiFilter,
	HiSearch,
	HiHome,
	HiViewList,
	HiMap,
} from "react-icons/hi";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getProperties } from "../../services/PropertyService";
import { useTranslation } from "react-i18next";
import { getPrimaryImage, getPropertyType, formatPrice } from "../../utils";

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

// Custom marker icons for different property types
const getMarkerIcon = (propertyStatus, isSelected = false) => {
	const color =
		propertyStatus?.name === "For Sale"
			? "#22c55e"
			: propertyStatus?.name === "For Rent"
			? "#3b82f6"
			: propertyStatus?.name === "Sold"
			? "#6b7280"
			: propertyStatus?.name === "Rented"
			? "#f59e0b"
			: "#6b7280";

	const size = isSelected ? 35 : 25;

	return L.divIcon({
		className: "custom-marker",
		html: `<div style="
      background-color: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: ${size > 30 ? "14px" : "12px"};
    ">${
		propertyStatus?.name === "For Sale"
			? "🏷️"
			: propertyStatus?.name === "For Rent"
			? "🔑"
			: propertyStatus?.name === "Sold"
			? "✅"
			: propertyStatus?.name === "Rented"
			? "🏠"
			: "📍"
	}</div>`,
		iconSize: [size, size],
		iconAnchor: [size / 2, size / 2],
	});
};

const MapView = () => {
	const { t } = useTranslation();
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedProperty, setSelectedProperty] = useState(null);
	const [showSidebar, setShowSidebar] = useState(true);
	const mapRef = useRef(null);

	// Filter states - similar to PropertyList
	const [searchInput, setSearchInput] = useState("");
	const [minPriceInput, setMinPriceInput] = useState("");
	const [maxPriceInput, setMaxPriceInput] = useState("");
	const [startDateInput, setStartDateInput] = useState("");
	const [endDateInput, setEndDateInput] = useState("");
	const [sortByInput, setSortByInput] = useState("CreatedDate");
	const [sortDirectionInput, setSortDirectionInput] = useState("desc");
	const [filters, setFilters] = useState({
		searchTerm: "",
		propertyTypeId: "",
		propertyStatusId: "",
		minPrice: "",
		maxPrice: "",
		currencyId: "",
		startDate: "",
		endDate: "",
		page: 1,
		pageSize: 0,
		sortBy: "CreatedDate",
		sortDirection: "desc",
	});

	// Manual filter functions
	const handleApplyFilters = () => {
		setFilters((prev) => ({
			...prev,
			searchTerm: searchInput,
			minPrice: minPriceInput,
			maxPrice: maxPriceInput,
			startDate: startDateInput,
			endDate: endDateInput,
			sortBy: sortByInput,
			sortDirection: sortDirectionInput,
			page: 1,
		}));
	};

	const handleClearFilters = () => {
		setSearchInput("");
		setMinPriceInput("");
		setMaxPriceInput("");
		setStartDateInput("");
		setEndDateInput("");
		setSortByInput("CreatedDate");
		setSortDirectionInput("desc");
		setFilters({
			searchTerm: "",
			propertyTypeId: "",
			propertyStatusId: "",
			minPrice: "",
			maxPrice: "",
			currencyId: "",
			startDate: "",
			endDate: "",
			page: 1,
			pageSize: 100,
			sortBy: "CreatedDate",
			sortDirection: "desc",
		});
	};

	useEffect(() => {
		setLoading(true);
		getProperties(filters)
			.then((response) => {
				console.log("Map API Response:", response);
				if (response.data && response.data.data) {
					// Filter properties that have valid coordinates
					const propertiesWithCoords = response.data.data.filter(
						(property) => property.location.latitude && property.location.longitude
					);
					setProperties(propertiesWithCoords);
				} else {
					setProperties([]);
				}
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching properties for map:", error);
				setProperties([]);
				setLoading(false);
				toast.error(t("mapView.toastError"));
			});
	}, [filters]);

	useEffect(() => {
		if (mapRef.current) {
			setTimeout(() => {
				mapRef.current.invalidateSize();
			}, 300);
		}
	}, [showSidebar]);

	const handleFilterChange = (key, value) => {
		setFilters((prev) => ({
			...prev,
			[key]: value,
			page: 1,
		}));
	};

	const getStatusBadge = (status) => {
		const statusConfig = {
			"For Sale": { color: "success", text: t("card.forSale") },
			"For Rent": { color: "info", text: t("card.forRent") },
			Sold: { color: "gray", text: t("card.sold") },
			Rented: { color: "warning", text: t("card.rented") },
		};
		const config = statusConfig[status] || { color: "gray", text: status };
		return <Badge color={config.color}>{config.text}</Badge>;
	};


	const handlePropertyClick = (property) => {
		setSelectedProperty(property);

		// Focus on selected property in map with moderate zoom
		if (mapRef.current && property.location.latitude && property.location.longitude) {
			mapRef.current.setView([property.location.latitude, property.location.longitude], 14);
		}
	};


	// Get map center and bounds based on properties
	const getMapCenter = () => {
		if (properties.length === 0) {
			return [39.9334, 32.8597]; // Turkey center
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

	// Calculate appropriate zoom level based on property spread
	const getMapZoom = () => {
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

		// Calculate the diagonal distance to determine zoom level
		const latDiff = maxLat - minLat;
		const lngDiff = maxLng - minLng;
		const maxDiff = Math.max(latDiff, lngDiff);

		// Return appropriate zoom level based on spread
		if (maxDiff > 10) return 5; // Very spread out (country level)
		if (maxDiff > 5) return 6; // Regional
		if (maxDiff > 2) return 7; // Multi-city
		if (maxDiff > 1) return 8; // City region
		if (maxDiff > 0.5) return 9; // Large city
		if (maxDiff > 0.2) return 10; // City district
		if (maxDiff > 0.1) return 11; // Neighborhood
		if (maxDiff > 0.05) return 12; // Local area
		return 13; // Very local
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<Spinner size="xl" />
				<span className="ml-2">{t("mapView.loading")}</span>
			</div>
		);
	}
	return (
		<div className="w-full space-y-6 dark:bg-gray-900 dark:text-white">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						🗺️ {t("mapView.mapTitle")}
					</h1>
					<p className="text-gray-600 dark:text-gray-300">
						{t("mapView.description")}
					</p>
				</div>
				<div className="flex items-center gap-4">
					<div className="text-sm text-gray-500 dark:text-gray-400">
						<span className="font-semibold">
							{properties.length}
						</span>{" "}
						{t("mapView.countText2")}
					</div>
					{/* Sidebar Toggle Button */}
					<Button
						color={showSidebar ? "blue" : "gray"}
						size="sm"
						onClick={() => setShowSidebar(!showSidebar)}
						className="flex items-center gap-2"
					>
						{showSidebar ? (
							<>
								<HiMap className="h-4 w-4" />
								{t("mapView.showMap")}
							</>
						) : (
							<>
								<HiViewList className="h-4 w-4" />
								{t("mapView.showList")}
							</>
						)}
					</Button>
				</div>
			</div>

			{/* Filters */}
			<Card className="w-full dark:bg-gray-800">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 w-full">
					<TextInput
						icon={HiSearch}
						placeholder={t("filters.searchPlaceholder")}
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					/>

					<Select
						value={filters.propertyStatusId}
						onChange={(e) =>
							handleFilterChange(
								"propertyStatusId",
								e.target.value
							)
						}
						className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					>
						<option value="">{t("filters.statusAll")}</option>
						<option value="1">{t("filters.statusForSale")}</option>
						<option value="2">{t("filters.statusForRent")}</option>
						<option value="3">{t("card.sold")}</option>
						<option value="4">{t("card.rented")}</option>
					</Select>

					<Select
						value={filters.propertyTypeId}
						onChange={(e) =>
							handleFilterChange("propertyTypeId", e.target.value)
						}
						className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					>
						<option value="">{t("filters.allTypes")}</option>
						<option value="1">{t("filters.apartment")}</option>
						<option value="2">{t("filters.villa")}</option>
						<option value="3">{t("filters.office")}</option>
						<option value="4">{t("filters.land")}</option>
						<option value="5">{t("filters.detachedHouse")}</option>
						<option value="6">{t("filters.building")}</option>
						<option value="7">{t("filters.timeshare")}</option>
						<option value="8">
							{t("filters.touristicFacility")}
						</option>
					</Select>

					<Select
						value={filters.currencyId}
						onChange={(e) =>
							handleFilterChange("currencyId", e.target.value)
						}
						className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					>
						<option value="">{t("filters.allCurrencies")}</option>
						<option value="1">{t("filters.turkishLira")}</option>
						<option value="2">{t("filters.americanDollar")}</option>
						<option value="3">{t("filters.euro")}</option>
					</Select>

					<TextInput
						type="number"
						placeholder={t("filters.minPrice")}
						value={minPriceInput}
						onChange={(e) => setMinPriceInput(e.target.value)}
						className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					/>

					<TextInput
						type="number"
						placeholder={t("filters.maxPrice")}
						value={maxPriceInput}
						onChange={(e) => setMaxPriceInput(e.target.value)}
						className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					/>

					<TextInput
						type="date"
						placeholder={t("filters.startDate")}
						value={startDateInput}
						onChange={(e) => setStartDateInput(e.target.value)}
						className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					/>

					<TextInput
						type="date"
						placeholder={t("filters.endDate")}
						value={endDateInput}
						onChange={(e) => setEndDateInput(e.target.value)}
						className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					/>

					<Select
						value={sortByInput}
						onChange={(e) => setSortByInput(e.target.value)}
						className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					>
						<option value="Title">
							🏷️ {t("adminPropertyList.sortBy.title")}
						</option>
						<option value="Area">
							📐 {t("adminPropertyList.sortBy.area")}
						</option>
						<option value="Price">
							💰 {t("adminPropertyList.sortBy.price")}
						</option>
						<option value="CreatedDate">
							📅 {t("adminPropertyList.sortBy.date")}
						</option>
					</Select>

					<Select
						value={sortDirectionInput}
						onChange={(e) => setSortDirectionInput(e.target.value)}
						className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					>
						<option value="desc">
							⬇️ {t("adminPropertyList.sortDirection.desc")}
						</option>
						<option value="asc">
							⬆️ {t("adminPropertyList.sortDirection.asc")}
						</option>
					</Select>
				</div>

				{/* Filter Buttons */}
				<div className="flex justify-end gap-3 p-4 pt-0">
					<Button color="gray" size="sm" onClick={handleClearFilters}>
						🗑️ {t("properties.clearFilters")}
					</Button>
					<Button color="blue" size="sm" onClick={handleApplyFilters}>
						🔍 {t("properties.filter")}
					</Button>
				</div>
			</Card>

			<div
				className={`grid gap-6 ${
					showSidebar ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"
				}`}
			>
				{/* Map Area */}
				<div className={showSidebar ? "lg:col-span-2" : "col-span-1"}>
					<Card className="dark:bg-gray-800">
						<div className="p-6">
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
									🌍 {t("mapView.title")}
								</h3>
								<div className="flex items-center space-x-4 text-xs">
									<div className="flex items-center space-x-1">
										<div className="w-3 h-3 bg-green-500 rounded-full"></div>
										<span className="dark:text-gray-300">
											{t("mapView.forSale")}
										</span>
									</div>
									<div className="flex items-center space-x-1">
										<div className="w-3 h-3 bg-blue-500 rounded-full"></div>
										<span className="dark:text-gray-300">
											{t("mapView.forRent")}
										</span>
									</div>
									<div className="flex items-center space-x-1">
										<div className="w-3 h-3 bg-gray-500 rounded-full"></div>
										<span className="dark:text-gray-300">
											{t("mapView.other")}
										</span>
									</div>
								</div>
							</div>

							{/* OpenStreetMap */}
							<div
								className={`rounded-lg overflow-hidden border ${
									showSidebar ? "h-96" : "h-[600px]"
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
															selectedProperty?.id ===
																property.id
														)}
														eventHandlers={{
															click: () =>
																handlePropertyClick(
																	property
																),
														}}
													>
														<Popup>
															<div className="p-2 min-w-64">
																<div className="flex items-start space-x-3">
																	{getPrimaryImage(
																		property.media
																	) ? (
																		<img
																			src={getPrimaryImage(
																				property.media
																			)}
																			alt={
																				property.title
																			}
																			className="w-16 h-12 object-cover rounded"
																		/>
																	) : (
																		<div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
																			<HiHome className="h-6 w-6 text-gray-400" />
																		</div>
																	)}
																	<div className="flex-1">
																		<h4 className="font-semibold text-sm mb-1">
																			{
																				property.title
																			}
																		</h4>
																		<p className="text-xs text-gray-600 mb-2">
																			{
																				property.location.neighborhood
																			}
																			,{" "}
																			{
																				property.location.district
																			}{" "}
																			/{" "}
																			{
																				property.location.city
																			}
																		</p>
																		<div className="flex justify-between items-center">
																			<span className="text-sm font-bold text-green-600">
																				{formatPrice(
																					property.price,
																					property.currency
																				)}
																			</span>
																			{getStatusBadge(
																				property
																					.status
																					?.name
																			)}
																		</div>
																		<div className="mt-2">
																			<Button
																				as={
																					Link
																				}
																				to={`/admin/properties/${property.id}`}
																				size="xs"
																				className="w-full text-white"
																			>
																				<HiEye className="mr-1 h-3 w-3 text-white" />
																				<p className="text-white">
																					{t(
																						"card.seeDetails"
																					)}
																				</p>
																			</Button>
																		</div>
																	</div>
																</div>
															</div>
														</Popup>
													</Marker>
												)
										)}
									</MapContainer>
								) : (
									<div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
										<div className="text-center">
											<HiLocationMarker className="mx-auto h-12 w-12 text-gray-400 mb-2" />
											<p className="text-gray-500 dark:text-gray-400">
												{t("card.noFound")}
											</p>
										</div>
									</div>
								)}
							</div>
						</div>
					</Card>
				</div>

				{/* Property Details Sidebar */}
				{showSidebar && (
					<div>
						<Card className="dark:bg-gray-800">
							<div className="p-6">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
									{selectedProperty
										? `📍 ${t("mapView.selectedProperty")}`
										: `🏘️ ${t("mapView.propertyList")}`}
								</h3>

								{selectedProperty ? (
									// Selected Property Details
									<div className="space-y-4">
										<div className="border-b dark:border-gray-700 pb-4">
											{getPrimaryImage(
												selectedProperty.media
											) && (
												<img
													src={getPrimaryImage(
														selectedProperty.media
													)}
													alt={selectedProperty.title}
													className="w-full h-32 object-cover rounded mb-3"
												/>
											)}
											<h4 className="font-semibold text-lg dark:text-white">
												{selectedProperty.title}
											</h4>
											<p className="text-gray-600 dark:text-gray-300 text-sm">
												{selectedProperty.location.neighborhood},{" "}
												{selectedProperty.location.district} /{" "}
												{selectedProperty.location.city}
											</p>
										</div>

										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span className="text-gray-600 dark:text-gray-400">
													💰 {t("card.price")}:
												</span>
												<span className="font-semibold dark:text-white">
													{formatPrice(
														selectedProperty.price,
														selectedProperty.currency
													)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-600 dark:text-gray-400">
													🏠 {t("card.type")}:
												</span>
												<span className="dark:text-white">
													{getPropertyType(
														selectedProperty
															.type?.id
													)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-600 dark:text-gray-400">
													📊 {t("card.status")}:
												</span>
												{getStatusBadge(
													selectedProperty
														.status?.name
												)}
											</div>
											<div className="flex justify-between">
												<span className="text-gray-600 dark:text-gray-400">
													📐 {t("card.area")}:
												</span>
												<span className="dark:text-white">
													{selectedProperty.details.grossArea}
													m² /{" "}
													{selectedProperty.details.netArea}m²
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-600 dark:text-gray-400">
													🛏️ {t("card.room")}:
												</span>
												<span className="dark:text-white">
													{selectedProperty.details.roomCount}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-600 dark:text-gray-400">
													🌍{" "}
													{t(
														"singleProperty.location"
													)}
													:
												</span>
												<span className="text-xs dark:text-white">
													{selectedProperty.location.latitude?.toFixed(
														4
													)}
													,{" "}
													{selectedProperty.location.longitude?.toFixed(
														4
													)}
												</span>
											</div>
										</div>

										<div className="pt-4 border-t dark:border-gray-700 space-y-2">
											<Button
												as={Link}
												to={`/admin/properties/${selectedProperty.id}`}
												size="sm"
												className="w-full"
											>
												<HiEye className="mr-2 h-4 w-4" />
												{t("card.viewDetails")}
											</Button>
											<Button
												size="sm"
												color="gray"
												className="w-full"
												onClick={() =>
													setSelectedProperty(null)
												}
											>
												❌{" "}
												{t("properties.clearFilters")}
											</Button>
										</div>
									</div>
								) : (
									// Property List
									<div className="space-y-3 max-h-96 overflow-y-auto">
										{properties.map((property) => (
											<div
												key={property.id}
												className="p-3 border dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
												onClick={() =>
													handlePropertyClick(
														property
													)
												}
											>
												<div className="flex justify-between items-start mb-2">
													<h4 className="font-medium text-sm line-clamp-2 dark:text-white">
														{property.title}
													</h4>
													{getStatusBadge(
														property.status
															?.name
													)}
												</div>
												<p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
													{property.location.neighborhood},{" "}
													{property.location.district}
												</p>
												<div className="flex justify-between items-center">
													<span className="text-sm font-semibold text-green-600 dark:text-green-400">
														{formatPrice(
															property.price,
															property.currency
														)}
													</span>
													<span className="text-xs text-gray-500 dark:text-gray-400">
														{getPropertyType(
															property
																.type
																?.id
														)}
													</span>
												</div>
												{property.location.latitude &&
												property.location.longitude ? (
													<div className="text-xs text-green-600 dark:text-green-400 mt-1">
														📍{" "}
														{t("properties.onMap")}
													</div>
												) : (
													<div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
														📍{" "}
														{t(
															"properties.noLocationInfo"
														)}
													</div>
												)}
											</div>
										))}

										{properties.length === 0 && (
											<div className="text-center py-8 text-gray-500 dark:text-gray-400">
												<HiLocationMarker className="mx-auto h-12 w-12 mb-2" />
												<p>
													{t(
														"properties.noFoundLocationDescription"
													)}
												</p>
											</div>
										)}
									</div>
								)}
							</div>
						</Card>
					</div>
				)}
			</div>

			{/* Map Stats */}
			<Card className="dark:bg-gray-800">
				<div className="p-4">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
						<div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
							<div className="text-2xl font-bold text-green-600 dark:text-green-300">
								{
									properties.filter(
										(p) =>
											p.status?.name ===
											"For Sale"
									).length
								}
							</div>
							<div className="text-sm text-green-700 dark:text-green-300">
								{t("properties.forSale")}
							</div>
						</div>
						<div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
							<div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
								{
									properties.filter(
										(p) =>
											p.status?.name ===
											"For Rent"
									).length
								}
							</div>
							<div className="text-sm text-blue-700 dark:text-blue-300">
								{t("properties.forRent")}
							</div>
						</div>
						<div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
							<div className="text-2xl font-bold text-gray-600 dark:text-gray-300">
								{
									properties.filter(
										(p) => p.location.latitude && p.location.longitude
									).length
								}
							</div>
							<div className="text-sm text-gray-700 dark:text-gray-300">
								{t("properties.allOnMap")}
							</div>
						</div>
						<div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-300">
								{properties.length}
							</div>
							<div className="text-sm text-purple-700 dark:text-purple-300">
								{t("dashboard.widgets.totalProperties")}
							</div>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default MapView;
