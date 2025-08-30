import React from "react";
import { Card } from "flowbite-react";
import { useTranslation } from "react-i18next";

const MapStats = ({ properties }) => {
    const { t } = useTranslation("common");
	return (
		<Card className="dark:bg-gray-800 dark:border-gray-700">
			<div className="p-6">
				<h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
					📊{" "}{t("properties.statistics")}
				</h4>
				<div className="grid grid-cols-1 gap-3">
					<div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
						<div className="text-lg font-bold text-green-600 dark:text-green-400">
							{
								properties.filter(
									(p) => p.status?.name === "For Sale"
								).length
							}
						</div>
						<div className="text-sm text-green-700 dark:text-green-300">
							{t("properties.forSale")}
						</div>
					</div>
					<div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
						<div className="text-lg font-bold text-blue-600 dark:text-blue-400">
							{
								properties.filter(
									(p) => p.status?.name === "For Rent"
								).length
							}
						</div>
						<div className="text-sm text-blue-700 dark:text-blue-300">
							{t("properties.forRent")}
						</div>
					</div>
					<div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
						<div className="text-lg font-bold text-gray-600 dark:text-gray-300">
							{properties.length}
						</div>
						<div className="text-sm text-gray-700 dark:text-gray-400">
							{t("properties.allOnMap")}
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
};

export default MapStats;
