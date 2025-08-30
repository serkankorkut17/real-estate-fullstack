import React from "react";
import { Badge } from "flowbite-react";
import { useTranslation } from "react-i18next";

const StatusBadge = ({ status, size="sm" }) => {
	const { t } = useTranslation("common");
	const statusConfig = {
		"For Sale": { color: "success", text: t("card.forSale") },
		"For Rent": { color: "info", text: t("card.forRent") },
		Sold: { color: "gray", text: t("card.sold") },
		Rented: { color: "warning", text: t("card.rented") },
	};
	const config = statusConfig[status] || { color: "gray", text: status };
	return (
		<Badge color={config.color} className={` ${size === "lg" ? "text-md" : "text-xs"}`}>
			{config.text}
		</Badge>
	);
};

export default StatusBadge;
