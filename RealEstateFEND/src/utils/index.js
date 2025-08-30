import { t } from "i18next";

export const getPrimaryImage = (media) => {
	if (!media || media.length === 0) return null;
	const primary = media.find((m) => m.isPrimary) || media[0];
	return primary?.url;
};

// export const formatPrice = (price, currency) => {
// 	const currencySymbol =
// 		currency?.code === "TRY" ? "₺" : currency?.code === "USD" ? "$" : "€";
// 	return new Intl.NumberFormat("tr-TR").format(price) + " " + currencySymbol;
// };

export const formatPrice = (price, currency) => {
	const currencyCode = currency?.code || "TRY";
	const formattedPrice = new Intl.NumberFormat("tr-TR", {
		style: "currency",
		currency: currencyCode,
		maximumFractionDigits: 0,
	}).format(price);

	// If currency is TRY, move the symbol to the end
	if (currencyCode === "TRY") {
		return formattedPrice.replace("₺", "").trim() + " ₺";
	}

	return formattedPrice;
};

export const formatPriceV2 = (price, currency) => {
	const currencySymbols = {
		1: "₺",
		2: "$",
		3: "€",
	};

	const symbol = currencySymbols[currency?.id] || "₺";

	if (price >= 1000000) {
		return `${(price / 1000000).toFixed(1)}M ${symbol}`;
	} else if (price >= 1000) {
		return `${(price / 1000).toFixed(0)}K ${symbol}`;
	}
	return `${price?.toLocaleString()} ${symbol}`;
};

export const formatDate = (dateStr) => {
	if (!dateStr || dateStr === "0001-01-01T00:00:00")
		return t("singleProperty.notSpecified");
	return new Date(dateStr).toLocaleDateString("tr-TR");
};

export const getPropertyType = (id) => {
	const options = [
		{ value: "", label: t("filters.allTypes") },
		{ value: "1", label: t("filters.apartment") },
		{ value: "2", label: t("filters.villa") },
		{ value: "3", label: t("filters.office") },
		{ value: "4", label: t("filters.land") },
		{ value: "5", label: t("filters.detachedHouse") },
		{ value: "6", label: t("filters.building") },
		{ value: "7", label: t("filters.timeshare") },
		{ value: "8", label: t("filters.touristicFacility") },
	];
	return options.find((option) => option.value == id)?.label || id;
};

export const formatDateRange = (startDate, endDate) => {
	const formatDate = (dateStr) => {
		if (!dateStr || dateStr === "0001-01-01T00:00:00") return "-";
		return new Date(dateStr).toLocaleDateString("tr-TR");
	};

	const start = formatDate(startDate);
	const end = formatDate(endDate);

	if (start === "-" && end === "-")
		return t("adminPropertyList.dateRange.indefinite");
	if (start === "-")
		return `${t("adminPropertyList.dateRange.endDate")}: ${end}`;
	if (end === "-")
		return `${t("adminPropertyList.dateRange.startDate")}: ${start}`;

	return `${start} - ${end}`;
};
