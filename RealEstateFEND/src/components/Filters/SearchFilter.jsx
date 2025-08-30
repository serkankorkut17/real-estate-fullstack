import React from "react";
import { TextInput } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { useTranslation } from "react-i18next";

const SearchFilter = ({ searchInput, setSearchInput }) => {
	const { t } = useTranslation("common");
	return (
		<div className="mb-6">
			<TextInput
				icon={HiSearch}
				placeholder={t("filters.searchPlaceholder")}
				value={searchInput}
				onChange={(e) => setSearchInput(e.target.value)}
				className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
			/>
		</div>
	);
};

export default SearchFilter;
