import { Select, Label } from "flowbite-react";
import { useTranslation } from "react-i18next";

const HeatingTypeSelector = ({ 
    id = "heatingType", 
    name = "heatingType", 
    value = "", 
    onChange, 
    label = "Isıtma Tipi",
    required = false,
    disabled = false,
    placeholder = "Seçiniz..."
}) => {
    const { t } = useTranslation("common");
    
    const heatingOptions = [
        { value: "", label: placeholder },
        { value: "Yok", label: t("propertyForm.heatingTypes.none") },
        { value: "Soba", label: t("propertyForm.heatingTypes.stove") },
        { value: "Doğalgaz Sobası", label: t("propertyForm.heatingTypes.gasStove") },
        { value: "Kat Kaloriferi", label: t("propertyForm.heatingTypes.floorHeating") },
        { value: "Merkezi", label: t("propertyForm.heatingTypes.central") },
        { value: "Merkezi (Pay Ölçer)", label: t("propertyForm.heatingTypes.centralWithMeter") },
        { value: "Kombi (Doğalgaz)", label: t("propertyForm.heatingTypes.gasBoiler") },
        { value: "Kombi (Elektrik)", label: t("propertyForm.heatingTypes.electricBoiler") },
        { value: "Yerden Isıtma", label: t("propertyForm.heatingTypes.underfloorHeating") },
        { value: "Klima", label: t("propertyForm.heatingTypes.airConditioning") },
        { value: "Isı Pompası", label: t("propertyForm.heatingTypes.heatPump") },
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
                {heatingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Select>
        </div>
    );
};

export default HeatingTypeSelector;