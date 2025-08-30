import { Card, Label, TextInput } from "flowbite-react";
import { useTranslation } from "react-i18next";

const PropertyFormDates = ({ formData, handleInputChange }) => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("propertyForm.steps.dates")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate" value={t("propertyForm.dates.startDate")}>
              {t("propertyForm.dates.startDate")}
            </Label>
            <TextInput
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              placeholder={t("propertyForm.dates.startDatePlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="endDate" value={t("propertyForm.dates.endDate")}>
              {t("propertyForm.dates.endDate")}
            </Label>
            <TextInput
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
              placeholder={t("propertyForm.dates.endDatePlaceholder")}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PropertyFormDates;
