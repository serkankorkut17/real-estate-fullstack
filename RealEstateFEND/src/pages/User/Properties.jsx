import { useState, useEffect, useCallback } from "react";
import {
	Card,
	Button,
	Badge,
	TextInput,
	Select,
	Spinner,
	Checkbox,
	Label,
	RangeSlider,
	Pagination,
} from "flowbite-react";
import {
	HiHome,
	HiFilter,
	HiChevronDown,
	HiChevronUp,
	HiX,
} from "react-icons/hi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { getProperties } from "../../services/PropertyService";
import { useTranslation } from "react-i18next";
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
import PropertyCard from "../../components/Properties/PropertyCard";
import SortSelector from "../../components/Filters/SortSelector";
import ViewTypeSelector from "../../components/Filters/ViewTypeSelector";

const Properties = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const initialSearchTerm = queryParams.get("search") || "";
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(true);
	const [favorites, setFavorites] = useState([]);
	const [viewType, setViewType] = useState("grid"); // "grid" or "list"
	const [showFilters, setShowFilters] = useState(true);
	const [totalCount, setTotalCount] = useState(0);
	const [totalPages, setTotalPages] = useState(0);

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
	const [searchInput, setSearchInput] = useState(initialSearchTerm);
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
	const [sortByInput, setSortByInput] = useState("CreatedDate");
	const [sortDirectionInput, setSortDirectionInput] = useState("desc");

	// Actual filters that get sent to API
	const [filters, setFilters] = useState({
		searchTerm: initialSearchTerm,
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
		pageSize: 12,
		sortBy: "CreatedDate",
		sortDirection: "desc",
	});

	useEffect(() => {
		fetchProperties();
	}, [filters]);

	const fetchProperties = async () => {
		setLoading(true);
		try {
			console.log(filters);

			const response = await getProperties(filters);
			if (response.data && response.data.data) {
				setProperties(response.data.data);
				setTotalCount(response.data.totalCount || 0);
				setTotalPages(response.data.totalPages || 0);
			} else {
				setProperties([]);
				setTotalCount(0);
				setTotalPages(0);
			}
		} catch (error) {
			console.error("Error fetching properties:", error);
			toast.error(t("properties.toastError"));
			setProperties([]);
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
			pageSize: 12,
			sortBy: sortByInput,
			sortDirection: sortDirectionInput,
		});
	};

	const handleFilterChange = (key, value) => {
		setFilters((prev) => ({
			...prev,
			[key]: value,
			page: 1,
		}));
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
		setSortByInput("CreatedDate");
		setSortDirectionInput("desc");

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
			pageSize: 12,
			sortBy: "CreatedDate",
			sortDirection: "desc",
		});
	};

	// Pagination functions
	const handlePageChange = (newPage) => {
		setFilters((prev) => ({
			...prev,
			page: newPage,
		}));
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handlePageSizeChange = (newPageSize) => {
		setFilters((prev) => ({
			...prev,
			pageSize: parseInt(newPageSize),
			page: 1,
		}));
	};

	const toggleFilterSection = (section) => {
		setFilterSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	// Custom pagination with jump to last page
	const renderPaginationItems = () => {
		const items = [];
		const current = filters.page;
		const total = totalPages;

		// Always show first page
		if (current > 3) {
			items.push(
				<button
					key={1}
					onClick={() => handlePageChange(1)}
					className="px-3 py-2 text-sm leading-tight text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 rounded-l-lg"
				>
					1
				</button>
			);

			if (current > 4) {
				items.push(
					<span
						key="dots1"
						className="px-3 py-2 text-sm leading-tight text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
					>
						...
					</span>
				);
			}
		}

		// Show pages around current page
		const start = Math.max(1, current - 2);
		const end = Math.min(total, current + 2);

		for (let i = start; i <= end; i++) {
			items.push(
				<button
					key={i}
					onClick={() => handlePageChange(i)}
					className={`px-3 py-2 text-sm leading-tight border border-gray-300 dark:border-gray-600 ${
						i === current
							? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/70 hover:text-blue-700 dark:hover:text-blue-300 z-10"
							: "text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
					}`}
				>
					{i}
				</button>
			);
		}

		// Always show last page if not already shown
		if (current < total - 2) {
			if (current < total - 3) {
				items.push(
					<span
						key="dots2"
						className="px-3 py-2 text-sm leading-tight text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
					>
						...
					</span>
				);
			}

			items.push(
				<button
					key={total}
					onClick={() => handlePageChange(total)}
					className="px-3 py-2 text-sm leading-tight text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 rounded-r-lg"
				>
					{total}
				</button>
			);
		}

		return items;
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

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="container mx-auto px-4 py-6">
				{/* Header */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
					<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
								🏡{" "}{t("properties.title")}
							</h1>
							<p className="text-gray-600 dark:text-gray-300">
								{totalCount > 0 ? (
									<span>
										<span className="font-semibold text-blue-600">
											{totalCount}
										</span>{" "}
										{t("properties.found")}
									</span>
								) : (
									t("properties.noResults")
								)}
							</p>
						</div>

						<div className="flex items-center space-x-4">
							{/* View Type Selector */}
							<ViewTypeSelector
								viewType={viewType}
								setViewType={setViewType}
							/>

							{/* Sort Selector */}
							<SortSelector
								sortByInput={sortByInput}
								sortDirectionInput={sortDirectionInput}
								setSortByInput={setSortByInput}
								setSortDirectionInput={setSortDirectionInput}
								setFilters={setFilters}
							/>

							{/* Mobile Filter Toggle */}
							<Button
								color="gray"
								size="sm"
								className="lg:hidden"
								onClick={() => setShowFilters(!showFilters)}
							>
								<HiFilter className="mr-2 h-4 w-4" />
								{t("properties.filter")}
							</Button>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Filters Sidebar */}
					<div
						className={`lg:col-span-1 ${
							showFilters ? "block" : "hidden lg:block"
						}`}
					>
						<Card className="sticky top-4 dark:bg-gray-800 dark:border-gray-700">
							<div className="p-4">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
										{t("properties.filters")}
									</h3>
								</div>

								{/* Search */}
								<SearchFilter
									searchInput={searchInput}
									setSearchInput={setSearchInput}
								/>

								{/* Location Filters */}
								<FilterSection
									title={t("properties.location")}
									section="location"
								>
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
								<FilterSection
									title={t("properties.type")}
									section="type"
								>
									<PropertyTypeFilter
										propertyTypeInput={propertyTypeInput}
										setPropertyTypeInput={
											setPropertyTypeInput
										}
									/>
									<PropertyStatusFilter
										propertyStatusInput={
											propertyStatusInput
										}
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
										setHasElevatorInput={
											setHasElevatorInput
										}
										hasParkingInput={hasParkingInput}
										setHasParkingInput={setHasParkingInput}
										hasGardenInput={hasGardenInput}
										setHasGardenInput={setHasGardenInput}
										isFurnishedInput={isFurnishedInput}
										setIsFurnishedInput={
											setIsFurnishedInput
										}
										isInComplexInput={isInComplexInput}
										setIsInComplexInput={
											setIsInComplexInput
										}
										isEligibleForLoanInput={
											isEligibleForLoanInput
										}
										setIsEligibleForLoanInput={
											setIsEligibleForLoanInput
										}
										isExchangeableInput={
											isExchangeableInput
										}
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

								{/* Property Details */}
								<FilterSection
									title={t("properties.details")}
									section="details"
								>
									<GrossAreaFilter
										minGrossAreaInput={minGrossAreaInput}
										setMinGrossAreaInput={
											setMinGrossAreaInput
										}
										maxGrossAreaInput={maxGrossAreaInput}
										setMaxGrossAreaInput={
											setMaxGrossAreaInput
										}
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
										🗑️{" "}{t("properties.clearFilters")}
									</Button>
									<Button
										color="blue"
										size="sm"
										onClick={handleApplyFilters}
									>
										🔍{" "}{t("properties.filter")}
									</Button>
								</div>
							</div>
						</Card>
					</div>

					{/* Properties Grid/List */}
					<div className="lg:col-span-3">
						{loading ? (
							<div className="flex justify-center items-center h-64">
								<Spinner size="xl" />
								<span className="ml-3 text-gray-600 dark:text-gray-300">
									{t("properties.loading")}
								</span>
							</div>
						) : properties.length === 0 ? (
							<Card className="dark:bg-gray-800 dark:border-gray-700">
								<div className="text-center py-12">
									<HiHome className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
									<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
										{t("properties.noFound")}
									</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										{t("properties.noFoundDescription")}
									</p>
									<Button color="blue" onClick={clearFilters}>
										{t("properties.clearFilters")}
									</Button>
								</div>
							</Card>
						) : (
							<div className="space-y-6">
								{/* Properties Grid */}
								<div
									className={
										viewType === "grid"
											? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
											: "space-y-4"
									}
								>
									{properties.map((property) => (
										<PropertyCard
											key={property.id}
											property={property}
										/>
									))}
								</div>

								{/* Pagination */}
								{totalPages > 1 && (
									<Card className="dark:bg-gray-800 dark:border-gray-700">
										<div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
											<div className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300">
												<span>
													{t("properties.showing")}{" "}
													<span className="font-semibold">
														{(filters.page - 1) *
															filters.pageSize +
															1}
													</span>{" "}
													to{" "}
													<span className="font-semibold">
														{Math.min(
															filters.page *
																filters.pageSize,
															totalCount
														)}
													</span>{" "}
													of{" "}
													<span className="font-semibold">
														{totalCount}
													</span>{" "}
													{t("properties.properties")}
												</span>
												<Select
													value={filters.pageSize}
													onChange={(e) =>
														handlePageSizeChange(
															e.target.value
														)
													}
													sizing="sm"
													className="w-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
												>
													<option value="6">6</option>
													<option value="12">
														12
													</option>
													<option value="24">
														24
													</option>
													<option value="48">
														48
													</option>
												</Select>
												<span>{t("properties.perPage")}</span>
											</div>

											{/* Custom Pagination */}
											<div className="flex items-center">
												{/* Previous Button */}
												<button
													onClick={() =>
														handlePageChange(
															filters.page - 1
														)
													}
													disabled={
														filters.page === 1
													}
													className={`px-3 py-2 text-sm leading-tight border border-gray-300 dark:border-gray-600 rounded-l-lg ${
														filters.page === 1
															? "text-gray-300 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
															: "text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
													}`}
												>
													&laquo;{" "}{t("properties.before")}
												</button>

												{/* Page Numbers */}
												<div className="flex">
													{renderPaginationItems()}
												</div>

												{/* Next Button */}
												<button
													onClick={() =>
														handlePageChange(
															filters.page + 1
														)
													}
													disabled={
														filters.page ===
														totalPages
													}
													className={`px-3 py-2 text-sm leading-tight border border-gray-300 dark:border-gray-600 rounded-r-lg ${
														filters.page ===
														totalPages
															? "text-gray-300 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
															: "text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
													}`}
												>
													{t("properties.next")}{" "}&raquo;
												</button>
											</div>
										</div>
									</Card>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Properties;
