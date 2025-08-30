import React from "react";
import { Label, Button } from "flowbite-react";
import { useTranslation } from "react-i18next";

const FastPriceRangeFilter = ({ minPriceInput, maxPriceInput, setMinPriceInput, setMaxPriceInput }) => {
	const { t } = useTranslation("common");

	const handlePriceRangeSelect = (min, max) => {
		setMinPriceInput(min.toString());
		setMaxPriceInput(max.toString());
	};
	const priceRanges = [
		{ label: "0 - 50K", min: 0, max: 50000 },
		{ label: "50K - 100K", min: 50000, max: 100000 },
		{ label: "100K - 500K", min: 100000, max: 500000 },
		{ label: "500K - 1M", min: 500000, max: 1000000 },
		{ label: "1M - 2M", min: 1000000, max: 2000000 },
		{ label: "2M+", min: 2000000, max: "" },
	];

	return (
		<div>
			<Label className="mb-2 text-xs dark:text-gray-300">
				{t("filters.fastPriceRange")}
			</Label>
			<div className="grid grid-cols-2 gap-2">
				{priceRanges.map((range, index) => (
					<Button
						key={index}
						size="xs"
						color="gray"
						onClick={() =>
							handlePriceRangeSelect(range.min, range.max)
						}
						className={`text-xs ${
							minPriceInput == range.min &&
							maxPriceInput == range.max
								? "bg-blue-600 text-white dark:bg-blue-700 dark:text-white"
								: ""
						}`}
					>
						{range.label}
					</Button>
				))}
			</div>
		</div>
	);
};

export default FastPriceRangeFilter;
