import React from "react";
import { Label, Select } from "flowbite-react";
import { useTranslation } from "react-i18next";

const CityFilter = ({ cityInput, setCityInput }) => {
	const { t } = useTranslation("common");

	const cities = [
		"Adana",
		"Afyonkarahisar",
		"Ankara",
		"Antalya",
		"Aydın",
		"Balıkesir",
		"Bursa",
		"Denizli",
		"Diyarbakır",
		"Elazığ",
		"Erzurum",
		"Eskişehir",
		"Gaziantep",
		"Hatay",
		"İstanbul",
		"İzmir",
		"Kayseri",
		"Kocaeli",
		"Konya",
		"Malatya",
		"Manisa",
		"Mersin",
		"Muğla",
		"Sakarya",
		"Samsun",
		"Şanlıurfa",
		"Tekirdağ",
		"Trabzon",
		"Van",
		"Aksaray",
		"Bartın",
		"Bilecik",
		"Bolu",
		"Çanakkale",
		"Çankırı",
		"Düzce",
		"Edirne",
		"Giresun",
		"Hakkari",
		"Iğdır",
		"Karabük",
		"Karaman",
		"Kars",
		"Kastamonu",
		"Kırklareli",
		"Kırşehir",
		"Kilis",
		"Nevşehir",
		"Niğde",
		"Ordu",
		"Osmaniye",
		"Rize",
		"Siirt",
		"Sinop",
		"Sivas",
		"Tokat",
		"Tunceli",
		"Uşak",
		"Yalova",
		"Yozgat",
		"Zonguldak",
	];

	return (
		<div>
			<Label htmlFor="city" className="mb-1 text-xs dark:text-gray-300">
				{t("filters.city")}
			</Label>
			<Select
				id="city"
				value={cityInput}
				onChange={(e) => setCityInput(e.target.value)}
				sizing="sm"
				className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
			>
				<option value="">{t("filters.allCities")}</option>
				{cities.map((city) => (
					<option key={city} value={city}>
						{city}
					</option>
				))}
			</Select>
		</div>
	);
};

export default CityFilter;
