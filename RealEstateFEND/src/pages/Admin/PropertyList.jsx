import { useState, useEffect } from "react";
import {
	Card,
	Button,
	Badge,
	TextInput,
	Select,
	Table,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
	TableHeadCell,
	Modal,
	ModalBody,
	ModalContext,
	ModalFooter,
	ModalHeader,
	Spinner,
	Pagination,
} from "flowbite-react";
import {
	HiPlus,
	HiSearch,
	HiEye,
	HiPencil,
	HiTrash,
	HiFilter,
	HiHome,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getProperties, deleteProperty } from "../../services/PropertyService";
import { useTranslation } from "react-i18next";
import StatusBadge from "../../components/Properties/StatusBadge";
import TypeBadge from "../../components/Properties/TypeBadge";
import { formatPrice, formatDateRange, getPrimaryImage} from "../../utils";

const PropertyList = () => {
	const navigate = useNavigate();
	const { t } = useTranslation("common");
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedProperty, setSelectedProperty] = useState(null);
	const [totalCount, setTotalCount] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [searchInput, setSearchInput] = useState(""); // UI'daki search input
	const [minPriceInput, setMinPriceInput] = useState(""); // UI'daki min price input
	const [maxPriceInput, setMaxPriceInput] = useState(""); // UI'daki max price input
	const [startDateInput, setStartDateInput] = useState(""); // UI'daki start date input
	const [endDateInput, setEndDateInput] = useState(""); // UI'daki end date input
	const [sortByInput, setSortByInput] = useState("Title"); // UI'daki sort by input
	const [sortDirectionInput, setSortDirectionInput] = useState("desc"); // UI'daki sort direction input
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
		pageSize: 10,
		sortBy: "CreatedDate",
		sortDirection: "desc",
	});

	// Manual filter function
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

	// Clear all filters
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
			pageSize: 10,
			sortBy: "CreatedDate",
			sortDirection: "desc",
		});
	};

	useEffect(() => {
		setLoading(true);
		getProperties(filters)
			.then((response) => {
				console.log("API Response:", response);
				if (response.data && response.data.data) {
					setProperties(response.data.data);
					setTotalCount(response.data.totalCount || 0);
					setTotalPages(response.data.totalPages || 0);
				} else {
					setProperties([]);
					setTotalCount(0);
					setTotalPages(0);
				}
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching properties:", error);
				setProperties([]);
				setTotalCount(0);
				setTotalPages(0);
				setLoading(false);
			});
	}, [filters]);

	const handleFilterChange = (key, value) => {
		setFilters((prev) => ({
			...prev,
			[key]: value,
			page: 1, // Reset to first page when filter changes
		}));
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

	const handleDeleteProperty = (property) => {
		setSelectedProperty(property);
		setShowDeleteModal(true);
	};

	const confirmDelete = () => {
		if (!selectedProperty) return;
		deleteProperty(selectedProperty.id)
			.then(() => {
				toast.success(t("adminPropertyList.deleteModal.successMessage"));
				setProperties((prev) =>
					prev.filter((p) => p.id !== selectedProperty.id)
				);
				setShowDeleteModal(false);
				setSelectedProperty(null);
			})
			.catch((error) => {
				console.error("Error deleting property:", error);
				toast.error(t("adminPropertyList.deleteModal.errorMessage"));
			});
	};

	const getStatusBadge = (status) => {
		const colors = {
			"For Sale": "success",
			"For Rent": "info",
			Sold: "gray",
			Rented: "warning",
		};
		return <Badge color={colors[status] || "gray"}>{status}</Badge>;
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<Spinner size="xl" />
			</div>
		);
	}

	return (
		<div className="w-full space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						{t("adminPropertyList.title")}{" "}
						{totalCount > 0 && (
							<span className="text-lg text-gray-500 dark:text-gray-400">
								({totalCount})
							</span>
						)}
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						{t("adminPropertyList.description")}
					</p>
				</div>
				<Button as={Link} to="/admin/properties/new" color="blue">
					<HiPlus className="mr-2 h-5 w-5" />
					{t("adminPropertyList.addNewProperty")}
				</Button>
			</div>

			{/* Filters */}
			<Card className="w-full bg-white dark:bg-gray-800">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 w-full">
					<TextInput
						icon={HiSearch}
						placeholder={t("filters.searchPlaceholder")}
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						className="dark:bg-gray-700 dark:text-white"
					/>

					<Select
						value={filters.propertyStatusId}
						onChange={(e) =>
							handleFilterChange("propertyStatusId", e.target.value)
						}
						className="dark:bg-gray-700 dark:text-white"
					>
						<option value="">
							{t("adminPropertyList.filters.allStatuses")}
						</option>
						<option value="1">{t("filters.statusForSale")}</option>
						<option value="2">{t("filters.statusForRent")}</option>
						<option value="3">Sold</option>
						<option value="4">Rented</option>
					</Select>

					<Select
						value={filters.propertyTypeId}
						onChange={(e) =>
							handleFilterChange("propertyTypeId", e.target.value)
						}
						className="dark:bg-gray-700 dark:text-white"
					>
						<option value="">{t("filters.allTypes")}</option>
						<option value="1">{t("filters.apartment")}</option>
						<option value="2">{t("filters.villa")}</option>
						<option value="3">{t("filters.office")}</option>
						<option value="4">{t("filters.land")}</option>
						<option value="5">{t("filters.detachedHouse")}</option>
						<option value="6">{t("filters.building")}</option>
						<option value="7">{t("filters.timeshare")}</option>
						<option value="8">{t("filters.touristicFacility")}</option>
					</Select>

					<Select
						value={filters.currencyId}
						onChange={(e) => handleFilterChange("currencyId", e.target.value)}
						className="dark:bg-gray-700 dark:text-white"
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
						className="dark:bg-gray-700 dark:text-white"
					/>

					<TextInput
						type="number"
						placeholder={t("filters.maxPrice")}
						value={maxPriceInput}
						onChange={(e) => setMaxPriceInput(e.target.value)}
						className="dark:bg-gray-700 dark:text-white"
					/>

					<TextInput
						type="date"
						placeholder={t("filters.startDate")}
						value={startDateInput}
						onChange={(e) => setStartDateInput(e.target.value)}
						className="dark:bg-gray-700 dark:text-white"
					/>

					<TextInput
						type="date"
						placeholder={t("filters.endDate")}
						value={endDateInput}
						onChange={(e) => setEndDateInput(e.target.value)}
						className="dark:bg-gray-700 dark:text-white"
					/>

					<Select
						value={sortByInput}
						onChange={(e) => setSortByInput(e.target.value)}
						className="dark:bg-gray-700 dark:text-white"
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
						className="dark:bg-gray-700 dark:text-white"
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
					<Button
						color="gray"
						size="sm"
						onClick={handleClearFilters}
						className="dark:bg-gray-700 dark:text-white"
					>
						🗑️ {t("properties.clearFilters")}
					</Button>
					<Button
						color="blue"
						size="sm"
						onClick={handleApplyFilters}
						className="dark:bg-gray-700 dark:text-white"
					>
						🔍 {t("properties.filter")}
					</Button>
				</div>
			</Card>

			{/* Properties Table */}
			<Card className="w-full bg-white dark:bg-gray-800">
				<div className="overflow-x-auto w-full">
					<Table hoverable>
						<TableHead>
							<TableHeadCell className="dark:text-gray-400">
								{t("adminPropertyList.table.photo")}
							</TableHeadCell>
							<TableHeadCell className="dark:text-gray-400">
								{t("adminPropertyList.table.title")}
							</TableHeadCell>
							<TableHeadCell className="dark:text-gray-400">
								{t("adminPropertyList.table.type")}
							</TableHeadCell>
							<TableHeadCell className="dark:text-gray-400">
								{t("adminPropertyList.table.status")}
							</TableHeadCell>
							<TableHeadCell className="dark:text-gray-400">
								{t("adminPropertyList.table.dateRange")}
							</TableHeadCell>
							<TableHeadCell className="dark:text-gray-400">
								{t("adminPropertyList.table.price")}
							</TableHeadCell>
							<TableHeadCell className="dark:text-gray-400">
								{t("adminPropertyList.table.actions")}
							</TableHeadCell>
						</TableHead>
						<TableBody className="divide-y border-t">
							{properties.map((property) => (
								<TableRow
									key={property.id}
									className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
								>
									<TableCell className="w-20">
										{getPrimaryImage(property.media) ? (
											<img
												src={getPrimaryImage(property.media)}
												alt={property.title}
												className="w-16 h-12 object-cover rounded"
											/>
										) : (
											<div className="w-16 h-12 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
												<HiHome className="h-6 w-6 text-gray-400 dark:text-gray-300" />
											</div>
										)}
									</TableCell>
									<TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
										{property.title}
									</TableCell>
									<TableCell className="dark:text-gray-400">
										<TypeBadge type={property.type?.id} />
									</TableCell>
									<TableCell><StatusBadge status={property.status?.name} /></TableCell>
									<TableCell className="dark:text-gray-400">
										{formatDateRange(property.startDate, property.endDate)}
									</TableCell>
									<TableCell className="font-semibold dark:text-white">
										{formatPrice(property.price, property.currency)}
									</TableCell>
									<TableCell>
										<div className="flex space-x-2">
											<Button
												size="xs"
												color="gray"
												onClick={() =>
													navigate(`/admin/properties/${property.id}`)
												}
												className="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-500 dark:hover:bg-gray-400 dark:text-white"
											>
												<HiEye className="h-4 w-4" />
											</Button>
											<Button
												size="xs"
												color="warning"
												onClick={() =>
													navigate(`/admin/properties/${property.id}/edit`)
												}
												className="bg-yellow-300 hover:bg-yellow-400 text-white dark:bg-yellow-400 hover:dark:bg-yellow-600 dark:text-white"
											>
												<HiPencil className="h-4 w-4" />
											</Button>
											<Button
												size="xs"
												color="failure"
												onClick={() => handleDeleteProperty(property)}
												className="bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 hover:dark:bg-red-700 dark:text-white"
											>
												<HiTrash className="h-4 w-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</Card>

			{/* Pagination */}
			{totalPages > 1 && (
				<Card className="bg-white dark:bg-gray-800">
					<div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
						<div className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-400">
							<span>
								{t("adminPropertyList.pagination.showing")}{" "}
								<span className="font-semibold dark:text-white">
									{(filters.page - 1) * filters.pageSize + 1}
								</span>{" "}
								{t("adminPropertyList.pagination.to")}{" "}
								<span className="font-semibold dark:text-white">
									{Math.min(filters.page * filters.pageSize, totalCount)}
								</span>{" "}
								{t("adminPropertyList.pagination.of")}{" "}
								<span className="font-semibold dark:text-white">
									{totalCount}
								</span>{" "}
								{t("adminPropertyList.pagination.properties")}
							</span>
							<Select
								value={filters.pageSize}
								onChange={(e) => handlePageSizeChange(e.target.value)}
								sizing="sm"
								className="w-20 dark:bg-gray-700 dark:text-white"
							>
								<option value="5">5</option>
								<option value="10">10</option>
								<option value="20">20</option>
								<option value="50">50</option>
							</Select>
							<span>{t("adminPropertyList.pagination.perPage")}</span>
						</div>

						{/* Custom Pagination */}
						<div className="flex items-center">
							{/* Previous Button */}
							<button
								onClick={() => handlePageChange(filters.page - 1)}
								disabled={filters.page === 1}
								className={`px-3 py-2 text-sm leading-tight border border-gray-300 dark:border-gray-600 rounded-l-lg ${
									filters.page === 1
										? "text-gray-300 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
										: "text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
								}`}
							>
								&laquo; {t("properties.before")}
							</button>

							{/* Page Numbers */}
							<div className="flex">{renderPaginationItems()}</div>

							{/* Next Button */}
							<button
								onClick={() => handlePageChange(filters.page + 1)}
								disabled={filters.page === totalPages}
								className={`px-3 py-2 text-sm leading-tight border border-gray-300 dark:border-gray-600 rounded-r-lg ${
									filters.page === totalPages
										? "text-gray-300 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
										: "text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
								}`}
							>
								{t("properties.next")} &raquo;
							</button>
						</div>
					</div>
				</Card>
			)}

			{/* Delete Confirmation Modal */}
			<Modal
				show={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				className="dark:bg-gray-800 dark:text-white"
			>
				<ModalHeader className="border-b border-gray-200">
					{t("adminPropertyList.deleteModal.title")}
				</ModalHeader>
				<ModalBody>
					<div className="space-y-6 bg-white dark:bg-gray-800 p-4 rounded-lg">
						<p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
							"{selectedProperty?.title}"{" "}
							{t("adminPropertyList.deleteModal.confirmationText")}
						</p>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button
						color="failure"
						onClick={confirmDelete}
						className="bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 hover:dark:bg-red-700 dark:text-white"
					>
						{t("adminPropertyList.deleteModal.confirmDelete")}
					</Button>
					<Button
						color="gray"
						onClick={() => setShowDeleteModal(false)}
						className="bg-gray-500 hover:bg-gray-600 text-white dark:bg-gray-500 hover:dark:bg-gray-400 dark:text-white"
					>
						{t("adminPropertyList.deleteModal.cancel")}
					</Button>
				</ModalFooter>
			</Modal>

			{/* Empty State */}
			{properties.length === 0 && !loading && (
				<Card className="bg-white dark:bg-gray-800">
					<div className="text-center py-12">
						<HiHome className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300" />
						<h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
							{t("adminPropertyList.emptyState.title")}
						</h3>
						<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
							{t("adminPropertyList.emptyState.description")}
						</p>
					</div>
				</Card>
			)}
		</div>
	);
};

export default PropertyList;
