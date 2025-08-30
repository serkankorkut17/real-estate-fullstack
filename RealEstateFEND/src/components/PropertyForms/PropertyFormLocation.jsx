import { Card, Label, TextInput } from "flowbite-react";
import { useTranslation } from "react-i18next";
import LocationSelector from "./LocationSelector";

const PropertyFormLocation = ({ formData, handleInputChange, locationInfo, setLocationInfo, setFormData, loading, setLoading }) => {
  const { t } = useTranslation("common");
  
  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("propertyForm.steps.location")}
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
            ({t("propertyForm.validation.requiredFieldsNote")})
          </span>
        </h3>
        <div className="space-y-4">
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="city">
                {t("filters.city")} <span className="text-red-500">*</span>
              </Label>
              <TextInput
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder={t("propertyForm.location.cityPlaceholder")}
                required
                color={!formData.city || formData.city.trim().length === 0 ? "failure" : "gray"}
              />
            </div>
            <div>
              <Label htmlFor="district">
                {t("filters.district")} <span className="text-red-500">*</span>
              </Label>
              <TextInput
                id="district"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                placeholder={t("propertyForm.location.districtPlaceholder")}
                required
                color={!formData.district || formData.district.trim().length === 0 ? "failure" : "gray"}
              />
            </div>
            <div>
              <Label htmlFor="neighborhood">{t("propertyForm.location.neighborhood")}</Label>
              <TextInput
                id="neighborhood"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleInputChange}
                placeholder={t("propertyForm.location.neighborhoodPlaceholder")}
              />
            </div>
            <div>
              <Label htmlFor="street">{t("propertyForm.location.street")}</Label>
              <TextInput
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder={t("propertyForm.location.streetPlaceholder")}
              />
            </div>
            <div>
              <Label htmlFor="country">{t("propertyForm.location.country")}</Label>
              <TextInput
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Türkiye"
                readOnly
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="addressLine">{t("propertyForm.location.addressLine")}</Label>
            <TextInput
              id="addressLine"
              name="addressLine"
              value={formData.addressLine}
              onChange={handleInputChange}
              placeholder={t("propertyForm.location.addressLinePlaceholder")}
            />
          </div>
          <LocationSelector
            formData={formData}
            setFormData={setFormData}
            locationInfo={locationInfo}
            setLocationInfo={setLocationInfo}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      </div>
    </Card>
  );
};

export default PropertyFormLocation;
