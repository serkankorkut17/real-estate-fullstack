import { Select, Label } from "flowbite-react";
import { useTranslation } from "react-i18next";

const UsageStatusSelector = ({ 
    id = "usageStatus", 
    name = "usageStatus", 
    value = "", 
    onChange, 
    label = "Kullanım Durumu",
    required = false,
    disabled = false,
    placeholder = "Seçiniz..."
}) => {
    const { t } = useTranslation();
    
    const usageStatusOptions = [
        { value: "", label: placeholder },
        { value: "Boş", label: t("propertyForm.usageStatuses.empty") },
        { value: "Kiracılı", label: t("propertyForm.usageStatuses.tenant") },
        { value: "Mülk Sahibi", label: t("propertyForm.usageStatuses.owner") },
    ];

    return (
        <div>
            {label && (
                <Label htmlFor={id} value={label}>
                    {label} {required && "*"}
                </Label>
            )}
            <Select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
            >
                {usageStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Select>
        </div>
    );
};

export default UsageStatusSelector;