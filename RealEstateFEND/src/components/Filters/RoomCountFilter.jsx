import React from "react";
import { Select, Label } from "flowbite-react";
import { useTranslation } from "react-i18next";

const RoomCountFilter = ({ roomCountInput, setRoomCountInput }) => {
	const { t } = useTranslation("common");
	const roomOptions = [
		{ value: "", label: t("filters.roomAll") },
		{ value: "1+0", label: "1+0" },
		{ value: "1+1", label: "1+1" },
		{ value: "1.5+1", label: "1.5+1" },
		{ value: "2+0", label: "2+0" },
		{ value: "2+1", label: "2+1" },
		{ value: "2.5+1", label: "2.5+1" },
		{ value: "2+2", label: "2+2" },
		{ value: "3+0", label: "3+0" },
		{ value: "3+1", label: "3+1" },
		{ value: "3.5+1", label: "3.5+1" },
		{ value: "3+2", label: "3+2" },
		{ value: "3+3", label: "3+3" },
		{ value: "4+0", label: "4+0" },
		{ value: "4+1", label: "4+1" },
		{ value: "4.5+1", label: "4.5+1" },
		{ value: "4.5+2", label: "4.5+2" },
		{ value: "4+2", label: "4+2" },
		{ value: "4+3", label: "4+3" },
		{ value: "4+4", label: "4+4" },
		{ value: "5+1", label: "5+1" },
		{ value: "5.5+1", label: "5.5+1" },
		{ value: "5+2", label: "5+2" },
		{ value: "5+3", label: "5+3" },
		{ value: "5+4", label: "5+4" },
		{ value: "6+1", label: "6+1" },
		{ value: "6+2", label: "6+2" },
		{ value: "6.5+1", label: "6.5+1" },
		{ value: "6+3", label: "6+3" },
		{ value: "6+4", label: "6+4" },
		{ value: "7+1", label: "7+1" },
		{ value: "7+2", label: "7+2" },
		{ value: "7+3", label: "7+3" },
		{ value: "8+1", label: "8+1" },
		{ value: "8+2", label: "8+2" },
		{ value: "8+3", label: "8+3" },
		{ value: "8+4", label: "8+4" },
		{ value: "9+1", label: "9+1" },
		{ value: "9+2", label: "9+2" },
		{ value: "9+3", label: "9+3" },
		{ value: "9+4", label: "9+4" },
		{ value: "9+5", label: "9+5" },
		{ value: "9+6", label: "9+6" },
		{ value: "10+1", label: "10+1" },
		{ value: "10+2", label: "10+2" },
		{ value: "10+", label: "10+" },
	];

	return (
		<div>
			<Label
				htmlFor="roomCount"
				className="mb-1 text-xs dark:text-gray-300"
			>
				{t("filters.roomCount")}
			</Label>
			<Select
				id="roomCount"
				value={roomCountInput}
				onChange={(e) => setRoomCountInput(e.target.value)}
				sizing="sm"
				className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
			>
				{roomOptions.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</Select>
		</div>
	);
};

export default RoomCountFilter;
