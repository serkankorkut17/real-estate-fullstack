import React from "react";
import { Label, Select } from "flowbite-react";
import { useTranslation } from "react-i18next";

const PropertyTypeFilter = ({ propertyTypeInput, setPropertyTypeInput }) => {
	const { t } = useTranslation("common");
	const options = [
		{ value: "", label: t("filters.allTypes") },
		{ value: "1", label: t("filters.apartment") },
		{ value: "2", label: t("filters.villa") },
		{ value: "3", label: t("filters.office") },
		{ value: "4", label: t("filters.land") },
		{ value: "5", label: t("filters.detachedHouse") },
		{ value: "6", label: t("filters.building") },
		{ value: "7", label: t("filters.timeshare") },
		{ value: "8", label: t("filters.touristicFacility") },
	];

	return (
		<div>
			<Label
				htmlFor="propertyType"
				className="mb-1 text-xs dark:text-gray-300"
			>
				{t("filters.propertyType")}
			</Label>
			<Select
				id="propertyType"
				value={propertyTypeInput}
				onChange={(e) => setPropertyTypeInput(e.target.value)}
				sizing="sm"
				className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</Select>
		</div>
	);
};

export default PropertyTypeFilter;
