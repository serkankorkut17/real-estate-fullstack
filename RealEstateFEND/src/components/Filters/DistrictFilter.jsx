import React from "react";
import { Label, TextInput } from "flowbite-react";
import { useTranslation } from "react-i18next";

const DistrictFilter = ({ districtInput, setDistrictInput }) => {
	const { t } = useTranslation("common");

	return (
		<div>
			<Label
				htmlFor="district"
				className="mb-1 text-xs dark:text-gray-300"
			>
				{t("filters.district")}
			</Label>
			<TextInput
				id="district"
				placeholder={t("filters.districtPlaceholder")}
				value={districtInput}
				onChange={(e) => setDistrictInput(e.target.value)}
				sizing="sm"
				className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
			/>
		</div>
	);
};

export default DistrictFilter;
