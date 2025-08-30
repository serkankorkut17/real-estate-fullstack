import { Select, Label } from "flowbite-react";
import { useTranslation } from "react-i18next";

const PropertyTypeSelector = ({
	id = "propertyTypeId",
	name = "propertyTypeId",
	value = "",
	onChange,
	label = "Emlak Tipi",
	required = false,
	disabled = false,
	placeholder = "Seçiniz...",
}) => {
	const { t } = useTranslation("common");
	
	const propertyTypes = [
		{ id: "", name: placeholder },
		{ id: 1, name: t("propertyTypes.Apartment") },
		{ id: 2, name: t("propertyTypes.Villa") },
		{ id: 3, name: t("propertyTypes.Office") },
		{ id: 4, name: t("propertyTypes.Land") },
		{ id: 5, name: t("propertyTypes.Detached House") },
		{ id: 6, name: t("propertyTypes.Building") },
		{ id: 7, name: t("propertyTypes.Timeshare") },
		{ id: 8, name: t("propertyTypes.Touristic Facility") },
	];

	return (
		<div>
			{label && (
				<Label htmlFor={id}>
					{label} {required && <span className="text-red-500">*</span>}
				</Label>
			)}
			<Select
				id={id}
				name={name}
				value={value}
				onChange={onChange}
				required={required}
				disabled={disabled}
				color={required && (!value || value === "") ? "failure" : "gray"}
			>
				{propertyTypes.map((type) => (
					<option key={type.id} value={type.id}>
						{type.name}
					</option>
				))}
			</Select>
		</div>
	);
};

export default PropertyTypeSelector;
