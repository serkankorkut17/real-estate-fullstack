import { Select, Label } from "flowbite-react";
import { useTranslation } from "react-i18next";

const PropertyStatusSelector = ({ 
    id = "propertyStatusId", 
    name = "propertyStatusId", 
    value = "", 
    onChange, 
    label = "Durum",
    required = false,
    disabled = false,
    placeholder = "Seçiniz..."
}) => {
    const { t } = useTranslation("common");
    
    const propertyStatuses = [
        { id: "", name: placeholder },
        { id: 1, name: t("filters.statusForSale") },
        { id: 2, name: t("filters.statusForRent") },
        // { id: 3, name: "Satıldı" },
        // { id: 4, name: "Kiralandı" },
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
                {propertyStatuses.map((status) => (
                    <option key={status.id} value={status.id}>
                        {status.name}
                    </option>
                ))}
            </Select>
        </div>
    );
};

export default PropertyStatusSelector;