import { Card, Label, TextInput } from "flowbite-react";
import { useTranslation } from "react-i18next";
import RoomCountSelector from "./RoomCountSelector";
import HeatingTypeSelector from "./HeatingTypeSelector";

const PropertyFormDetails = ({ formData, handleInputChange }) => {
  const { t } = useTranslation("common");
  
  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t("propertyForm.steps.propertyDetails")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RoomCountSelector
            id="roomCount"
            name="roomCount"
            value={formData.roomCount}
            onChange={handleInputChange}
            label={t("propertyForm.details.roomCount")}
            placeholder={t("propertyForm.details.roomCountPlaceholder")}
          />
          <div>
            <Label htmlFor="grossArea" value={t("filters.grossArea")}>{t("filters.grossArea")}</Label>
            <TextInput
              id="grossArea"
              name="grossArea"
              type="number"
              value={formData.grossArea}
              onChange={handleInputChange}
              placeholder="105"
            />
          </div>
          <div>
            <Label htmlFor="netArea" value={t("filters.netArea")}>{t("filters.netArea")}</Label>
            <TextInput
              id="netArea"
              name="netArea"
              type="number"
              value={formData.netArea}
              onChange={handleInputChange}
              placeholder="85"
            />
          </div>
          <HeatingTypeSelector
            id="heatingType"
            name="heatingType"
            value={formData.heatingType}
            onChange={handleInputChange}
            label={t("singleProperty.heatingType")}
            placeholder={t("propertyForm.details.heatingTypePlaceholder")}
          />
          <div>
            <Label htmlFor="floorNumber" value={t("propertyForm.details.floor")}>{t("propertyForm.details.floor")}</Label>
            <TextInput
              id="floorNumber"
              name="floorNumber"
              type="number"
              value={formData.floorNumber}
              onChange={handleInputChange}
              placeholder="2"
            />
          </div>
          <div>
            <Label htmlFor="totalFloors" value={t("propertyForm.details.totalFloors")}>{t("propertyForm.details.totalFloors")}</Label>
            <TextInput
              id="totalFloors"
              name="totalFloors"
              type="number"
              value={formData.totalFloors}
              onChange={handleInputChange}
              placeholder="5"
            />
          </div>
          <div>
            <Label htmlFor="buildingAge" value={t("propertyForm.details.buildingAge")}>{t("propertyForm.details.buildingAge")}</Label>
            <TextInput
              id="buildingAge"
              name="buildingAge"
              type="number"
              value={formData.buildingAge}
              onChange={handleInputChange}
              placeholder="6"
            />
          </div>
          <div>
            <Label htmlFor="bathroomCount" value={t("propertyForm.details.bathroomCount")}>{t("propertyForm.details.bathroomCount")}</Label>
            <TextInput
              id="bathroomCount"
              name="bathroomCount"
              type="number"
              value={formData.bathroomCount}
              onChange={handleInputChange}
              placeholder="2"
            />
          </div>
          <div>
            <Label htmlFor="deposit" value={t("propertyForm.details.deposit")}>{t("propertyForm.details.deposit")}</Label>
            <TextInput
              id="deposit"
              name="deposit"
              type="number"
              value={formData.deposit}
              onChange={handleInputChange}
              placeholder="10000"
            />
          </div>
          <div>
            <Label htmlFor="monthlyFee" value={t("propertyForm.details.monthlyFee")}>{t("propertyForm.details.monthlyFee")}</Label>
            <TextInput
              id="monthlyFee"
              name="monthlyFee"
              type="number"
              value={formData.monthlyFee}
              onChange={handleInputChange}
              placeholder="250"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PropertyFormDetails;
