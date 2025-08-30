import { Select, Label } from "flowbite-react";
import { useRealEstate } from "../../context/RealEstate";
import { useTranslation } from "react-i18next";

const CurrencySelector = ({ 
    id = "currencyId", 
    name = "currencyId", 
    value = "1", 
    onChange, 
    label = "Para Birimi",
    required = true,
    disabled = false,
    placeholder = "Seçiniz..."
}) => {
    const { t } = useTranslation("common");
    const currencies = [
        { id: "", value: "", label: placeholder },
        { id: 1, value: "TRY", label: t("form.lira") },
        { id: 2, value: "USD", label: t("form.dollar") },
        { id: 3, value: "EUR", label: t("form.euro") },
    ];

    return (
        <div className="dark:bg-gray-800 dark:text-white">
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
                {currencies.map((currency) => (
                    <option key={currency.id} value={currency.id}>
                        {currency.label}
                    </option>
                ))}
            </Select>
        </div>
    );
};

export default CurrencySelector;