import React from "react";
import { Label, TextInput } from "flowbite-react";
import { useTranslation } from "react-i18next";

const NetAreaFilter = ({ minNetAreaInput, setMinNetAreaInput, maxNetAreaInput, setMaxNetAreaInput }) => {
	const { t } = useTranslation("common");
	return (
		<div>
			<Label className="mb-2 text-xs dark:text-gray-300">
				📐{" "}{t("filters.netArea")}
			</Label>
			<div className="grid grid-cols-2 gap-2">
				<div>
					<Label
						htmlFor="minNetArea"
						className="mb-1 text-xs dark:text-gray-300"
					>
						{t("filters.minNetArea")}
					</Label>
					<TextInput
						id="minNetArea"
						type="number"
						placeholder="0"
						value={minNetAreaInput}
						onChange={(e) => setMinNetAreaInput(e.target.value)}
						sizing="sm"
						className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					/>
				</div>
				<div>
					<Label
						htmlFor="maxNetArea"
						className="mb-1 text-xs dark:text-gray-300"
					>
						{t("filters.maxNetArea")}
					</Label>
					<TextInput
						id="maxNetArea"
						type="number"
						placeholder="∞"
						value={maxNetAreaInput}
						onChange={(e) => setMaxNetAreaInput(e.target.value)}
						sizing="sm"
						className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					/>
				</div>
			</div>
		</div>
	);
};

export default NetAreaFilter;
