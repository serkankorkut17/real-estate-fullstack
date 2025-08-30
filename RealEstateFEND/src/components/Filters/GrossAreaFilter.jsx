import React from "react";
import { Label, TextInput } from "flowbite-react";
import { useTranslation } from "react-i18next";

const GrossAreaFilter = ({
	minGrossAreaInput,
	setMinGrossAreaInput,
	maxGrossAreaInput,
	setMaxGrossAreaInput,
}) => {
	const { t } = useTranslation("common");
	return (
		<div>
			<Label className="mb-2 text-xs dark:text-gray-300">
				📏{" "}{t("filters.grossArea")}
			</Label>
			<div className="grid grid-cols-2 gap-2">
				<div>
					<Label
						htmlFor="minGrossArea"
						className="mb-1 text-xs dark:text-gray-300"
					>
						{t("filters.minGrossArea")}
					</Label>
					<TextInput
						id="minGrossArea"
						type="number"
						placeholder="0"
						value={minGrossAreaInput}
						onChange={(e) => setMinGrossAreaInput(e.target.value)}
						sizing="sm"
						className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					/>
				</div>
				<div>
					<Label
						htmlFor="maxGrossArea"
						className="mb-1 text-xs dark:text-gray-300"
					>
						{t("filters.maxGrossArea")}
					</Label>
					<TextInput
						id="maxGrossArea"
						type="number"
						placeholder="∞"
						value={maxGrossAreaInput}
						onChange={(e) => setMaxGrossAreaInput(e.target.value)}
						sizing="sm"
						className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					/>
				</div>
			</div>
		</div>
	);
};

export default GrossAreaFilter;
