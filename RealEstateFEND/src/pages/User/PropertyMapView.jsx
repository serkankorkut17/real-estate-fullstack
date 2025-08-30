import { useState, useEffect, useRef, useCallback } from "react";
import {
	Card,
	Button,
	Badge,
	TextInput,
	Select,
	Spinner,
	Label,
	Checkbox,
} from "flowbite-react";
import {
	HiLocationMarker,
	HiEye,
	HiFilter,
	HiSearch,
	HiHome,
	HiViewList,
	HiMap,
	HiHeart,
	HiOutlineHeart,
	HiPhone,
	HiMail,
	HiX,
	HiAdjustments,
	HiChevronDown,
	HiChevronUp,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getProperties } from "../../services/PropertyService";
import RoomCountFilter from "../../components/Filters/RoomCountFilter";
import NetAreaFilter from "../../components/Filters/NetAreaFilter";
import GrossAreaFilter from "../../components/Filters/GrossAreaFilter";
import FeaturesFilter from "../../components/Filters/FeaturesFilter";
import PropertyStatusFilter from "../../components/Filters/PropertyStatusFilter";
import PropertyTypeFilter from "../../components/Filters/PropertyTypeFilter";
import FastPriceRangeFilter from "../../components/Filters/FastPriceRangeFilter";
import PriceFilter from "../../components/Filters/PriceFilter";
import CurrencyFilter from "../../components/Filters/CurrencyFilter";
import DistrictFilter from "../../components/Filters/DistrictFilter";
import CityFilter from "../../components/Filters/CityFilter";
import SearchFilter from "../../components/Filters/SearchFilter";
import DateFilter from "../../components/Filters/DateFilter";
import MapStats from "../../components/Properties/MapStats";
import MapList from "../../components/Properties/MapList";
import SelectedMapProperty from "../../components/Properties/SelectedMapProperty";
import { useTranslation } from "react-i18next";
import MapArea from "../../components/Properties/MapArea";


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

const PropertyMapView = () => {
	const navigate = useNavigate();
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedProperty, setSelectedProperty] = useState(null);
	const [showSidebar, setShowSidebar] = useState(true);
	const [showFilters, setShowFilters] = useState(false);
	// const [favorites, setFavorites] = useState([]);
	const [totalCount, setTotalCount] = useState(0);
	const mapRef = useRef(null);

	const { t } = useTranslation("common");

	// Filter sections collapse state
	const [filterSections, setFilterSections] = useState({
		location: true,
		price: true,
		type: true,
		date: true,
		features: false,
		details: false,
	});

	// UI state for filters (before applying)
	const [searchInput, setSearchInput] = useState("");
	const [propertyTypeInput, setPropertyTypeInput] = useState("");
	const [propertyStatusInput, setPropertyStatusInput] = useState("");
	const [minPriceInput, setMinPriceInput] = useState("");
	const [maxPriceInput, setMaxPriceInput] = useState("");
	const [currencyInput, setCurrencyInput] = useState("");
	const [cityInput, setCityInput] = useState("");
	const [districtInput, setDistrictInput] = useState("");
	const [minGrossAreaInput, setMinGrossAreaInput] = useState("");
	const [maxGrossAreaInput, setMaxGrossAreaInput] = useState("");
	const [minNetAreaInput, setMinNetAreaInput] = useState("");
	const [maxNetAreaInput, setMaxNetAreaInput] = useState("");
	const [roomCountInput, setRoomCountInput] = useState("");
	const [bedroomsInput, setBedroomsInput] = useState("");
	const [hasKitchenInput, setHasKitchenInput] = useState(false);
	const [hasBalconyInput, setHasBalconyInput] = useState(false);
	const [hasElevatorInput, setHasElevatorInput] = useState(false);
	const [hasParkingInput, setHasParkingInput] = useState(false);
	const [hasGardenInput, setHasGardenInput] = useState(false);
	const [isFurnishedInput, setIsFurnishedInput] = useState(false);
	const [isInComplexInput, setIsInComplexInput] = useState(false);
	const [isEligibleForLoanInput, setIsEligibleForLoanInput] = useState(false);
	const [isExchangeableInput, setIsExchangeableInput] = useState(false);
	const [startDateInput, setStartDateInput] = useState("");
	const [endDateInput, setEndDateInput] = useState("");

	// Actual filters that get sent to API
	const [filters, setFilters] = useState({
		searchTerm: "",
		propertyTypeId: "",
		propertyStatusId: "",
		minPrice: "",
		maxPrice: "",
		currencyId: "",
		city: "",
		district: "",
		minGrossArea: "",
		maxGrossArea: "",
		minNetArea: "",
		maxNetArea: "",
		roomCount: "",
		bedrooms: "",
		hasKitchen: false,
		hasBalcony: false,
		hasElevator: false,
		hasParking: false,
		hasGarden: false,
		isFurnished: false,
		isInComplex: false,
		isEligibleForLoan: false,
		isExchangeable: false,
		startDate: "",
		endDate: "",
		page: 1,
		pageSize: 0,
		sortBy: "CreatedDate",
		sortDirection: "desc",
	});

	useEffect(() => {
		fetchProperties();
	}, [filters]);

	const fetchProperties = async () => {
		setLoading(true);
		try {
			const response = await getProperties(filters);
			if (response.data && response.data.data) {
				// Filter properties that have valid coordinates
				const propertiesWithCoords = response.data.data.filter(
					(property) => property.location.latitude && property.location.longitude
				);
				setProperties(propertiesWithCoords);
				setTotalCount(response.data.totalCount || 0);
			} else {
				setProperties([]);
				setTotalCount(0);
			}
		} catch (error) {
			console.error("Error fetching properties for map:", error);
			setProperties([]);
			setTotalCount(0);
			toast.error(t("mapView.toastError"));
		} finally {
			setLoading(false);
		}
	};

	// Apply filters function
	const handleApplyFilters = () => {
		setFilters({
			searchTerm: searchInput,
			propertyTypeId: propertyTypeInput,
			propertyStatusId: propertyStatusInput,
			minPrice: minPriceInput,
			maxPrice: maxPriceInput,
			currencyId: currencyInput,
			city: cityInput,
			district: districtInput,
			minGrossArea: minGrossAreaInput,
			maxGrossArea: maxGrossAreaInput,
			minNetArea: minNetAreaInput,
			maxNetArea: maxNetAreaInput,
			roomCount: roomCountInput,
			bedrooms: bedroomsInput,
			hasKitchen: hasKitchenInput,
			hasBalcony: hasBalconyInput,
			hasElevator: hasElevatorInput,
			hasParking: hasParkingInput,
			hasGarden: hasGardenInput,
			isFurnished: isFurnishedInput,
			isInComplex: isInComplexInput,
			isEligibleForLoan: isEligibleForLoanInput,
			isExchangeable: isExchangeableInput,
			startDate: startDateInput,
			endDate: endDateInput,
			page: 1,
			pageSize: 100,
			sortBy: "CreatedDate",
			sortDirection: "desc",
		});
	};

	const clearFilters = () => {
		// Clear UI inputs
		setSearchInput("");
		setPropertyTypeInput("");
		setPropertyStatusInput("");
		setMinPriceInput("");
		setMaxPriceInput("");
		setCurrencyInput("");
		setCityInput("");
		setDistrictInput("");
		setMinGrossAreaInput("");
		setMaxGrossAreaInput("");
		setMinNetAreaInput("");
		setMaxNetAreaInput("");
		setRoomCountInput("");
		setBedroomsInput("");
		setHasKitchenInput(false);
		setHasBalconyInput(false);
		setHasElevatorInput(false);
		setHasParkingInput(false);
		setHasGardenInput(false);
		setIsFurnishedInput(false);
		setIsInComplexInput(false);
		setIsEligibleForLoanInput(false);
		setIsExchangeableInput(false);
		setStartDateInput("");
		setEndDateInput("");

		// Clear actual filters
		setFilters({
			searchTerm: "",
			propertyTypeId: "",
			propertyStatusId: "",
			minPrice: "",
			maxPrice: "",
			currencyId: "",
			city: "",
			district: "",
			minGrossArea: "",
			maxGrossArea: "",
			minNetArea: "",
			maxNetArea: "",
			roomCount: "",
			bedrooms: "",
			hasKitchen: false,
			hasBalcony: false,
			hasElevator: false,
			hasParking: false,
			hasGarden: false,
			isFurnished: false,
			isInComplex: false,
			isEligibleForLoan: false,
			isExchangeable: false,
			startDate: "",
			endDate: "",
			page: 1,
			pageSize: 0,
			sortBy: "CreatedDate",
			sortDirection: "desc",
		});
	};

	const toggleFilterSection = (section) => {
		setFilterSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	// Resize map when sidebar toggle changes
	useEffect(() => {
		if (mapRef.current) {
			setTimeout(() => {
				mapRef.current.invalidateSize();
			}, 300);
		}
	}, [showSidebar]);


	const handlePropertyClick = (property) => {
		setSelectedProperty(property);

		// Focus on selected property in map with moderate zoom
		if (mapRef.current && property.location.latitude && property.location.longitude) {
			mapRef.current.setView(
				[property.location.latitude, property.location.longitude],
				15,
				{
					animate: true,
					duration: 1,
				}
			);
		}
	};


	const FilterSection = useCallback(
		({ title, section, children }) => (
			<div className="border-b border-gray-200 dark:border-gray-600 pb-4 mb-4">
				<button
					onClick={() => toggleFilterSection(section)}
					className="flex items-center justify-between w-full text-left text-sm font-semibold text-gray-900 dark:text-white mb-3"
				>
					{title}
					{filterSections[section] ? (
						<HiChevronUp className="h-4 w-4" />
					) : (
						<HiChevronDown className="h-4 w-4" />
					)}
				</button>
				{filterSections[section] && (
					<div className="space-y-3">{children}</div>
				)}
			</div>
		),
		[filterSections]
	);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="text-center">
					<Spinner size="xl" />
					<p className="mt-4 text-gray-600 dark:text-gray-300">
						{t("mapView.loading")}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="container mx-auto px-4 py-6">
				{/* Header */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
					<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
								{t("mapView.title")}
							</h1>
							<p className="text-gray-600 dark:text-gray-300">
								{totalCount > 0 ? (
									<span>
										<span className="font-semibold text-blue-600">
											{properties.length}
										</span>{" "}
										{t("mapView.countText")}{" "}
										{totalCount})
									</span>
								) : (
									"Haritada gösterilecek emlak bulunamadı"
								)}
							</p>
						</div>

						<div className="flex items-center space-x-4">
							{/* Legend */}
							<div className="hidden md:flex items-center space-x-4 text-xs bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg">
								<div className="flex items-center space-x-1">
									<div className="w-3 h-3 bg-green-500 rounded-full"></div>
									<span className="text-gray-700 dark:text-gray-300">
										{t("mapView.forSale")}
									</span>
								</div>
								<div className="flex items-center space-x-1">
									<div className="w-3 h-3 bg-blue-500 rounded-full"></div>
									<span className="text-gray-700 dark:text-gray-300">
										{t("mapView.forRent")}
									</span>
								</div>
								<div className="flex items-center space-x-1">
									<div className="w-3 h-3 bg-gray-500 rounded-full"></div>
									<span className="text-gray-700 dark:text-gray-300">
										{t("mapView.other")}
									</span>
								</div>
							</div>

							{/* Filters Toggle */}
							<Button
								color={showFilters ? "blue" : "gray"}
								size="sm"
								onClick={() => setShowFilters(!showFilters)}
								className="flex items-center gap-2"
							>
								<HiAdjustments className="h-4 w-4" />
								{showFilters ? t("mapView.hideFilters") : t("mapView.showFilters")}
							</Button>

							{/* Sidebar Toggle */}
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
				</div>

				{/* Advanced Filters */}
				{showFilters && (
					<Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
						<div className="p-4">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
									{t("mapView.filters")}
								</h3>
							</div>

							{/* Search Input */}
							<SearchFilter
								searchInput={searchInput}
								setSearchInput={setSearchInput}
							/>

							{/* Location Filters */}
							<FilterSection title={t("properties.location")} section="location">
								<CityFilter
									cityInput={cityInput}
									setCityInput={setCityInput}
								/>
								<DistrictFilter
									districtInput={districtInput}
									setDistrictInput={setDistrictInput}
								/>
							</FilterSection>

							{/* Price Filters */}
							<FilterSection title={t("properties.price")} section="price">
								<CurrencyFilter
									currencyInput={currencyInput}
									setCurrencyInput={setCurrencyInput}
								/>
								<PriceFilter
									minPriceInput={minPriceInput}
									setMinPriceInput={setMinPriceInput}
									maxPriceInput={maxPriceInput}
									setMaxPriceInput={setMaxPriceInput}
								/>
								<FastPriceRangeFilter
									minPriceInput={minPriceInput}
									maxPriceInput={maxPriceInput}
									setMinPriceInput={setMinPriceInput}
									setMaxPriceInput={setMaxPriceInput}
								/>
							</FilterSection>

							{/* Type and Status */}
							<FilterSection title={t("properties.type")} section="type">
								<PropertyTypeFilter
									propertyTypeInput={propertyTypeInput}
									setPropertyTypeInput={setPropertyTypeInput}
								/>
								<PropertyStatusFilter
									propertyStatusInput={propertyStatusInput}
									setPropertyStatusInput={
										setPropertyStatusInput
									}
								/>
							</FilterSection>

							{/* Property Features */}
							<FilterSection
								title={t("properties.features")}
								section="features"
							>
								<FeaturesFilter
									hasKitchenInput={hasKitchenInput}
									setHasKitchenInput={setHasKitchenInput}
									hasBalconyInput={hasBalconyInput}
									setHasBalconyInput={setHasBalconyInput}
									hasElevatorInput={hasElevatorInput}
									setHasElevatorInput={setHasElevatorInput}
									hasParkingInput={hasParkingInput}
									setHasParkingInput={setHasParkingInput}
									hasGardenInput={hasGardenInput}
									setHasGardenInput={setHasGardenInput}
									isFurnishedInput={isFurnishedInput}
									setIsFurnishedInput={setIsFurnishedInput}
									isInComplexInput={isInComplexInput}
									setIsInComplexInput={setIsInComplexInput}
									isEligibleForLoanInput={
										isEligibleForLoanInput
									}
									setIsEligibleForLoanInput={
										setIsEligibleForLoanInput
									}
									isExchangeableInput={isExchangeableInput}
									setIsExchangeableInput={
										setIsExchangeableInput
									}
								/>
							</FilterSection>

							{/* Date Filters */}
							<FilterSection
								title={t("properties.dateInterval")}
								section="date"
							>
								<DateFilter
									startDateInput={startDateInput}
									setStartDateInput={setStartDateInput}
									endDateInput={endDateInput}
									setEndDateInput={setEndDateInput}
								/>
							</FilterSection>

							{/* Details */}
							<FilterSection
								title={t("properties.details")}
								section="details"
							>
								<GrossAreaFilter
									minGrossAreaInput={minGrossAreaInput}
									setMinGrossAreaInput={setMinGrossAreaInput}
									maxGrossAreaInput={maxGrossAreaInput}
									setMaxGrossAreaInput={setMaxGrossAreaInput}
								/>
								<NetAreaFilter
									minNetAreaInput={minNetAreaInput}
									setMinNetAreaInput={setMinNetAreaInput}
									maxNetAreaInput={maxNetAreaInput}
									setMaxNetAreaInput={setMaxNetAreaInput}
								/>
								<RoomCountFilter
									roomCountInput={roomCountInput}
									setRoomCountInput={setRoomCountInput}
								/>
							</FilterSection>

							{/* Filter Buttons */}
							<div className="flex justify-end gap-3 pt-4">
								<Button
									color="gray"
									size="sm"
									onClick={clearFilters}
								>
									{t("properties.clearFilters")}
								</Button>
								<Button
									color="blue"
									size="sm"
									onClick={handleApplyFilters}
								>
									{t("properties.filter")}
								</Button>
							</div>
						</div>
					</Card>
				)}

				{/* Main Content */}
				<div
					className={`grid gap-6 ${
						showSidebar
							? "grid-cols-1 lg:grid-cols-4"
							: "grid-cols-1"
					}`}
				>
					{/* Map Area */}
					<MapArea
						properties={properties}
						selectedProperty={selectedProperty}
						mapRef={mapRef}
						handlePropertyClick={handlePropertyClick}
						clearFilters={clearFilters}
						showSidebar={showSidebar}
					/>

					{/* Property Details Sidebar */}
					{showSidebar && (
						<div className="lg:col-span-1 space-y-6">
							<Card className="dark:bg-gray-800 dark:border-gray-700">
								<div className="p-6">
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
										{selectedProperty
											? t("mapView.selectedProperty")
											: t("mapView.propertyList")}
									</h3>

									{selectedProperty ? (
										// Selected Property Details
										<SelectedMapProperty
											selectedProperty={selectedProperty}
											setSelectedProperty={
												setSelectedProperty
											}
										/>
									) : (
										// Property List
										<MapList
											properties={properties}
											handlePropertyClick={
												handlePropertyClick
											}
										/>
									)}
								</div>
							</Card>

							{/* Map Statistics */}
							<MapStats properties={properties} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PropertyMapView;
