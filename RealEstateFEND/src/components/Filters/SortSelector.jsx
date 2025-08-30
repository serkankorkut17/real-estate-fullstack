import React from "react";
import { Select } from "flowbite-react";
import { useTranslation } from "react-i18next";

const SortSelector = ({
	sortByInput,
	sortDirectionInput,
	setSortByInput,
	setSortDirectionInput,
	setFilters,
}) => {
	const { t } = useTranslation("common");
	return (
		<Select
			value={`${sortByInput}-${sortDirectionInput}`}
			onChange={(e) => {
				const [sortBy, sortDirection] = e.target.value.split("-");
				setSortByInput(sortBy);
				setSortDirectionInput(sortDirection);
				setFilters((prev) => ({
					...prev,
					sortBy: sortBy,
					sortDirection: sortDirection,
				}));
			}}
			sizing="sm"
		>
			<option value="CreatedDate-desc">{t("filters.newest")}</option>
			<option value="Price-asc">{t("filters.priceASC")}</option>
			<option value="Price-desc">{t("filters.priceDESC")}</option>
			<option value="Area-asc">{t("filters.areaASC")}</option>
			<option value="Area-desc">{t("filters.areaDESC")}</option>
			<option value="Title-asc">{t("filters.titleASC")}</option>
			<option value="Title-desc">{t("filters.titleDESC")}</option>
		</Select>
	);
};

export default SortSelector;
