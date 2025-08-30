import React from "react";
import { HiLocationMarker } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import StatusBadge from "./StatusBadge";
import TypeBadge from "./TypeBadge";
import { formatPrice } from "../../utils";

const MapList = ({ properties, handlePropertyClick }) => {
	const { t } = useTranslation();

	return (
		<div className="space-y-3 max-h-96 overflow-y-auto">
			{properties.length === 0 ? (
				<div className="text-center py-8 text-gray-500 dark:text-gray-400">
					<HiLocationMarker className="mx-auto h-12 w-12 mb-2" />
					<p className="text-sm">{t("card.noFound")}</p>
				</div>
			) : (
				properties.map((property) => (
					<div
						key={property.id}
						className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-500 transition-all duration-200 group dark:bg-gray-700"
						onClick={() => handlePropertyClick(property)}
					>
						<div className="flex justify-between items-start mb-2">
							<h4 className="font-medium text-sm line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
								{property.title}
							</h4>
							<StatusBadge status={property.status?.name} />
						</div>
						<p className="text-xs text-gray-600 dark:text-gray-300 mb-2 flex items-center">
							<HiLocationMarker className="h-3 w-3 mr-1" />
							{[property.location.district, property.location.city]
								.filter(Boolean)
								.join(", ")}
						</p>
						<div className="flex justify-between items-center">
							<span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
								{formatPrice(property.price, property.currency)}
							</span>
							<span className="text-xs text-gray-500 dark:text-gray-400">
								{/* {getPropertyType(property.type?.id)} */}
								<TypeBadge type={property.propertyTypeId} />
							</span>
						</div>
					</div>
				))
			)}
		</div>
	);
};

export default MapList;
