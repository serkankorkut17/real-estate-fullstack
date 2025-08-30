import { Select, Label } from "flowbite-react";
import { useTranslation } from "react-i18next";

const ListedBySelector = ({ 
    id = "listedBy", 
    name = "listedBy", 
    value = "", 
    onChange, 
    label = "Listeleyen",
    required = false,
    disabled = false,
    placeholder = "Seçiniz..."
}) => {
    const { t } = useTranslation();
    
    const listedByOptions = [
        { value: "", label: placeholder },
        { value: "Sahibinden", label: t("propertyForm.listedBy.owner") },
        { value: "Emlak Ofisinden", label: t("propertyForm.listedBy.realEstateOffice") },
        { value: "İnşaat Firmasından", label: t("propertyForm.listedBy.constructionCompany") },
        { value: "Bankadan", label: t("propertyForm.listedBy.bank") },
        { value: "Turizm İşletmesinden", label: t("propertyForm.listedBy.tourismBusiness") },
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
                {listedByOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Select>
        </div>
    );
};

export default ListedBySelector;