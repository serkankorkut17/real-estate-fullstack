import React from "react";
import { Label, TextInput } from "flowbite-react";
import { useTranslation } from "react-i18next";

const DateFilter = ({ startDateInput, setStartDateInput, endDateInput, setEndDateInput }) => {
	const { t } = useTranslation("common");

	return (
		<div className="space-y-3">
			<div>
				<Label htmlFor="startDate" className="mb-1 text-xs dark:text-gray-300">
					{t("filters.startDate")}
				</Label>
				<TextInput
					id="startDate"
					type="date"
					value={startDateInput}
					onChange={(e) => setStartDateInput(e.target.value)}
					sizing="sm"
					className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
				/>
			</div>
			<div>
				<Label htmlFor="endDate" className="mb-1 text-xs dark:text-gray-300">
					{t("filters.endDate")}
				</Label>
				<TextInput
					id="endDate"
					type="date"
					value={endDateInput}
					onChange={(e) => setEndDateInput(e.target.value)}
					sizing="sm"
					className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
				/>
			</div>
		</div>
	);
};

export default DateFilter;
