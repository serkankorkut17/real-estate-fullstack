import { Select, Label } from "flowbite-react";
import { useTranslation } from "react-i18next";

const DeedStatusSelector = ({ 
    id = "deedStatus", 
    name = "deedStatus", 
    value = "", 
    onChange, 
    label = "Tapu Durumu",
    required = false,
    disabled = false,
    placeholder = "Seçiniz..."
}) => {
    const { t } = useTranslation();
    
    const deedStatusOptions = [
        { value: "", label: placeholder },
        { value: "Kat Mülkiyetli", label: t("propertyForm.deedStatuses.condominium") },
        { value: "Kat İrtifaklı", label: t("propertyForm.deedStatuses.easement") },
        { value: "Hisseli Tapu", label: t("propertyForm.deedStatuses.shared") },
        { value: "Müstakil Tapulu", label: t("propertyForm.deedStatuses.detached") },
        { value: "Arsa Tapulu", label: t("propertyForm.deedStatuses.land") },
        { value: "Tapu Kaydı Yok", label: t("propertyForm.deedStatuses.noRecord") },
    ];

    return (
        <div className="dark:bg-gray-800 dark:text-white">
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
                {deedStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Select>
        </div>
    );
};

export default DeedStatusSelector;