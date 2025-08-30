import React from "react";
import { Label, TextInput } from "flowbite-react";
import { useTranslation } from "react-i18next";

const PriceFilter = ({
	minPriceInput,
	setMinPriceInput,
	maxPriceInput,
	setMaxPriceInput,
}) => {
	const { t } = useTranslation("common");
	return (
		<div className="grid grid-cols-2 gap-2">
			<div>
				<Label
					htmlFor="minPrice"
					className="mb-1 text-xs dark:text-gray-300"
				>
					{t("filters.minPrice")}
				</Label>
				<TextInput
					id="minPrice"
					type="number"
					placeholder="0"
					value={minPriceInput}
					onChange={(e) => setMinPriceInput(e.target.value)}
					sizing="sm"
					className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
				/>
			</div>
			<div>
				<Label
					htmlFor="maxPrice"
					className="mb-1 text-xs dark:text-gray-300"
				>
					{t("filters.maxPrice")}
				</Label>
				<TextInput
					id="maxPrice"
					type="number"
					placeholder="∞"
					value={maxPriceInput}
					onChange={(e) => setMaxPriceInput(e.target.value)}
					sizing="sm"
					className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
				/>
			</div>
		</div>
	);
};

export default PriceFilter;
