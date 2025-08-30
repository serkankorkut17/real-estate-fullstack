import { Card, Label, TextInput, Textarea } from "flowbite-react";
import { useTranslation } from "react-i18next";
import PropertyTypeSelector from "./PropertyTypeSelector";
import PropertyStatusSelector from "./PropertyStatusSelector";
import CurrencySelector from "./CurrencySelector";

const PropertyFormBasicInfo = ({ formData, handleInputChange }) => {
  const { t } = useTranslation("common");
  
  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("propertyForm.steps.basicInfo")}
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
            ({t("propertyForm.validation.requiredFieldsNote")})
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">
              {t("propertyForm.basicInfo.title")} <span className="text-red-500">*</span>
            </Label>
            <TextInput
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder={t("propertyForm.basicInfo.titlePlaceholder")}
              required
              color={!formData.title || formData.title.trim().length === 0 ? "failure" : "gray"}
              maxLength={100}
            />
            {formData.title && formData.title.length > 100 && (
              <p className="text-red-500 text-xs mt-1">{t("propertyForm.validation.titleMaxLength")}</p>
            )}
          </div>
          <PropertyTypeSelector
            id="propertyTypeId"
            name="propertyTypeId"
            value={formData.propertyTypeId}
            onChange={handleInputChange}
            label={t("propertyForm.basicInfo.propertyType")}
            required={true}
            placeholder={t("propertyForm.basicInfo.propertyTypePlaceholder")}
          />
          <PropertyStatusSelector
            id="propertyStatusId"
            name="propertyStatusId"
            value={formData.propertyStatusId}
            onChange={handleInputChange}
            label={t("propertyForm.basicInfo.status")}
            required={true}
            placeholder={t("propertyForm.basicInfo.statusPlaceholder")}
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="price">
                {t("propertyForm.basicInfo.price")} <span className="text-red-500">*</span>
              </Label>
              <TextInput
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0"
                required
                color={!formData.price || formData.price <= 0 ? "failure" : "gray"}
              />
            </div>
            <CurrencySelector
              id="currencyId"
              name="currencyId"
              value={formData.currencyId}
              onChange={handleInputChange}
              label={t("form.currency")}
              placeholder={t("form.placeholder")}
              required={true}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="description">{t("propertyForm.basicInfo.description")}</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={t("propertyForm.basicInfo.descriptionPlaceholder")}
              rows={4}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PropertyFormBasicInfo;
