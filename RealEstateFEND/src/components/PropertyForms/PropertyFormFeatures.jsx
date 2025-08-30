import { Card, Label } from "flowbite-react";
import { useTranslation } from "react-i18next";

const PropertyFormFeatures = ({ formData, handleInputChange }) => {
  const { t } = useTranslation("common");
  
  const featuresList = [
    { key: "hasKitchen", label: t("filters.kitchen") },
    { key: "hasBalcony", label: t("filters.balcony") },
    { key: "hasParking", label: t("filters.parking") },
    { key: "hasElevator", label: t("filters.elevator") },
    { key: "hasGarden", label: t("filters.garden") },
    { key: "isFurnished", label: t("filters.furnished") },
    { key: "isInComplex", label: t("filters.inComplex") },
    { key: "isEligibleForLoan", label: t("filters.eligibleForLoan") },
    { key: "isExchangeable", label: t("filters.exchangeable") },
  ];

  return (
    <Card>
      <div className="p-6">
        <Label value={t("propertyForm.steps.features")} className="mb-3 block">{t("propertyForm.steps.features")}</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuresList.map((feature) => (
            <div key={feature.key} className="flex items-center">
              <input
                id={feature.key}
                name={feature.key}
                type="checkbox"
                checked={formData[feature.key]}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={feature.key} className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                {feature.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PropertyFormFeatures;
