import { Card } from "flowbite-react";
import { useTranslation } from "react-i18next";
import UsageStatusSelector from "./UsageStatusSelector";
import DeedStatusSelector from "./DeedStatusSelector";
import ListedBySelector from "./ListedBySelector";

const PropertyFormAdditional = ({ formData, handleInputChange }) => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("propertyForm.steps.additionalInfo")}
        </h3>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <UsageStatusSelector
            id="usageStatus"
            name="usageStatus"
            value={formData.usageStatus}
            onChange={handleInputChange}
            label={t("propertyForm.additional.usageStatus")}
            placeholder={t("propertyForm.additional.usageStatusPlaceholder")}
          />
          <DeedStatusSelector
            id="deedStatus"
            name="deedStatus"
            value={formData.deedStatus}
            onChange={handleInputChange}
            label={t("propertyForm.additional.deedStatus")}
            placeholder={t("propertyForm.additional.deedStatusPlaceholder")}
          />
          <ListedBySelector
            id="listedBy"
            name="listedBy"
            value={formData.listedBy}
            onChange={handleInputChange}
            label={t("propertyForm.additional.listedBy")}
            placeholder={t("propertyForm.additional.listedByPlaceholder")}
          />
        </div>
      </div>
    </Card>
  );
};

export default PropertyFormAdditional;
