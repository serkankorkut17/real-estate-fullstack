import React from "react";
import { HiViewGrid, HiViewList } from "react-icons/hi";

const ViewTypeSelector = ({ viewType, setViewType }) => {
	return (
		<div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
			<button
				onClick={() => setViewType("grid")}
				className={`p-2 rounded ${
					viewType === "grid"
						? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow"
						: "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200"
				}`}
			>
				<HiViewGrid className="h-5 w-5" />
			</button>
			<button
				onClick={() => setViewType("list")}
				className={`p-2 rounded ${
					viewType === "list"
						? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow"
						: "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200"
				}`}
			>
				<HiViewList className="h-5 w-5" />
			</button>
		</div>
	);
};

export default ViewTypeSelector;
