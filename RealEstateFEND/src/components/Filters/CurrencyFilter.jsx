import React from "react";
import { Label, Select } from "flowbite-react";
import { useTranslation } from "react-i18next";

const CurrencyFilter = ({ currencyInput, setCurrencyInput }) => {
	const { t } = useTranslation("common");

	const options = [
		{ value: "", label: t("filters.allCurrencies") },
		{ value: "1", label: t("filters.turkishLira") },
		{ value: "2", label: t("filters.americanDollar") },
		{ value: "3", label: t("filters.euro") },
	];

	return (
		<div>
			<Label className="mb-2 text-xs dark:text-gray-300">
				{t("filters.currency")}
			</Label>
			<Select
				value={currencyInput}
				onChange={(e) => setCurrencyInput(e.target.value)}
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

export default CurrencyFilter;
