import React from "react";
import { Card, Select } from "@material-tailwind/react";

const Pagination = ({ totalPages, filters, setFilters }) => {
	const handlePageSizeChange = (newPageSize) => {
		setFilters((prev) => ({
			...prev,
			pageSize: parseInt(newPageSize),
			page: 1,
		}));
	};

	// Pagination functions
	const handlePageChange = (newPage) => {
		setFilters((prev) => ({
			...prev,
			page: newPage,
		}));
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// Custom pagination with jump to last page
	const renderPaginationItems = () => {
		const items = [];
		const current = filters.page;
		const total = totalPages;

		// Always show first page
		if (current > 3) {
			items.push(
				<button
					key={1}
					onClick={() => handlePageChange(1)}
					className="px-3 py-2 text-sm leading-tight text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 rounded-l-lg"
				>
					1
				</button>
			);

			if (current > 4) {
				items.push(
					<span
						key="dots1"
						className="px-3 py-2 text-sm leading-tight text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
					>
						...
					</span>
				);
			}
		}

		// Show pages around current page
		const start = Math.max(1, current - 2);
		const end = Math.min(total, current + 2);

		for (let i = start; i <= end; i++) {
			items.push(
				<button
					key={i}
					onClick={() => handlePageChange(i)}
					className={`px-3 py-2 text-sm leading-tight border border-gray-300 dark:border-gray-600 ${
						i === current
							? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/70 hover:text-blue-700 dark:hover:text-blue-300 z-10"
							: "text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
					}`}
				>
					{i}
				</button>
			);
		}

		// Always show last page if not already shown
		if (current < total - 2) {
			if (current < total - 3) {
				items.push(
					<span
						key="dots2"
						className="px-3 py-2 text-sm leading-tight text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
					>
						...
					</span>
				);
			}

			items.push(
				<button
					key={total}
					onClick={() => handlePageChange(total)}
					className="px-3 py-2 text-sm leading-tight text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 rounded-r-lg"
				>
					{total}
				</button>
			);
		}

		return items;
	};

	return (
		<>
			{totalPages > 1 && (
				<Card className="dark:bg-gray-800 dark:border-gray-700">
					<div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
						<div className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300">
							<span>
								Showing{" "}
								<span className="font-semibold">
									{(filters.page - 1) * filters.pageSize + 1}
								</span>{" "}
								to{" "}
								<span className="font-semibold">
									{Math.min(
										filters.page * filters.pageSize,
										totalCount
									)}
								</span>{" "}
								of{" "}
								<span className="font-semibold">
									{totalCount}
								</span>{" "}
								properties
							</span>
							<Select
								value={filters.pageSize}
								onChange={(e) =>
									handlePageSizeChange(e.target.value)
								}
								sizing="sm"
								className="w-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
							>
								<option value="6">6</option>
								<option value="12">12</option>
								<option value="24">24</option>
								<option value="48">48</option>
							</Select>
							<span>per page</span>
						</div>

						{/* Custom Pagination */}
						<div className="flex items-center">
							{/* Previous Button */}
							<button
								onClick={() =>
									handlePageChange(filters.page - 1)
								}
								disabled={filters.page === 1}
								className={`px-3 py-2 text-sm leading-tight border border-gray-300 dark:border-gray-600 rounded-l-lg ${
									filters.page === 1
										? "text-gray-300 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
										: "text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
								}`}
							>
								&laquo; Önceki
							</button>

							{/* Page Numbers */}
							<div className="flex">
								{renderPaginationItems()}
							</div>

							{/* Next Button */}
							<button
								onClick={() =>
									handlePageChange(filters.page + 1)
								}
								disabled={filters.page === totalPages}
								className={`px-3 py-2 text-sm leading-tight border border-gray-300 dark:border-gray-600 rounded-r-lg ${
									filters.page === totalPages
										? "text-gray-300 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
										: "text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
								}`}
							>
								Sonraki &raquo;
							</button>
						</div>
					</div>
				</Card>
			)}
		</>
	);
};

export default Pagination;
