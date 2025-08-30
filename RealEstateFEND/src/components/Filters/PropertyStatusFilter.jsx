import React from "react";
import { Label, Select } from "flowbite-react";
import { useTranslation } from "react-i18next";

const PropertyStatusFilter = ({
	propertyStatusInput,
	setPropertyStatusInput,
}) => {
	const { t } = useTranslation("common");
	const options = [
		{ value: "", label: t("filters.statusAll") },
		{ value: "1", label: t("filters.statusForSale") },
		{ value: "2", label: t("filters.statusForRent") },
	];

	return (
		<div>
			<Label
				htmlFor="propertyStatus"
				className="mb-1 text-xs dark:text-gray-300"
			>
				{t("filters.propertyStatus")}
			</Label>
			<Select
				id="propertyStatus"
				value={propertyStatusInput}
				onChange={(e) => setPropertyStatusInput(e.target.value)}
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

export default PropertyStatusFilter;
