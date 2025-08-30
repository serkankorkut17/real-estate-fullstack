import { useEffect, useState } from "react";
import { Card } from "flowbite-react";
import {
	HiHome,
	HiCurrencyDollar,
	HiTrendingUp,
	HiUsers,
} from "react-icons/hi";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { getDashboardData } from "../../services/AdminService";
import { useTranslation } from "react-i18next";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const Dashboard = () => {
	const { t } = useTranslation("common");
	const [activeUsers, setActiveUsers] = useState(0);
	const [totalProperties, setTotalProperties] = useState(0);
	const [forSaleProperties, setForSaleProperties] = useState(0);
	const [forRentProperties, setForRentProperties] = useState(0);
	const [propertyTypes, setPropertyTypes] = useState([]);
	const [recentActivities, setRecentActivities] = useState([]);
	const [chartData, setChartData] = useState({
		labels: [],
		datasets: []
	});

	const widgets = [
		{
			title: t("dashboard.widgets.totalProperties"),
			value: totalProperties,
			icon: HiHome,
			color: "blue",
		},
		{
			title: t("dashboard.widgets.forSaleProperties"),
			value: forSaleProperties,
			icon: HiCurrencyDollar,
			color: "green",
		},
		{
			title: t("dashboard.widgets.forRentProperties"),
			value: forRentProperties,
			icon: HiTrendingUp,
			color: "purple",
		},
		{
			title: t("dashboard.widgets.activeUsers"),
			value: activeUsers,
			icon: HiUsers,
			color: "orange",
		},
	];

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top",
				labels: {
					color: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches 
						? '#ffffff' : '#374151'
				}
			},
			title: {
				display: true,
				text: t("dashboard.chart.title"),
				color: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches 
					? '#ffffff' : '#374151'
			},
		},
		scales: {
			x: {
				ticks: {
					color: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches 
						? '#9CA3AF' : '#6B7280'
				},
				grid: {
					color: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches 
						? '#374151' : '#E5E7EB'
				}
			},
			y: {
				ticks: {
					color: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches 
						? '#9CA3AF' : '#6B7280'
				},
				grid: {
					color: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches 
						? '#374151' : '#E5E7EB'
				}
			}
		}
	};

  const getPropertyType = (id) => {
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

	const fetchData = async () => {
		try {
			const data = await getDashboardData();
			setActiveUsers(data.activeUsers);
			setTotalProperties(data.totalProperties);
			setForSaleProperties(data.forSaleProperties);
			setForRentProperties(data.forRentProperties);
			setPropertyTypes(data.propertyTypeStats);
			setRecentActivities(data.recentActivities);
			
			// Chart data'sını API'den gelen veriye göre oluştur
			if (data.chartData) {
				const forSaleData = data.chartData.datasets.find(d => d.label === 'For Sale')?.data || [];
				const forRentData = data.chartData.datasets.find(d => d.label === 'For Rent')?.data || [];
				
				setChartData({
					labels: data.chartData.labels,
					datasets: [
						{
							label: t("dashboard.chart.forSale"),
							data: forSaleData,
							borderColor: "rgb(59, 130, 246)",
							backgroundColor: "rgba(59, 130, 246, 0.5)",
							tension: 0.1
						},
						{
							label: t("dashboard.chart.forRent"),
							data: forRentData,
							borderColor: "rgb(16, 185, 129)",
							backgroundColor: "rgba(16, 185, 129, 0.5)",
							tension: 0.1
						},
					],
				});
			}
			
			console.log("Dashboard data:", data);
		} catch (error) {
			console.error("Error fetching dashboard data:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className="w-full space-y-6">
			{/* Page Header */}
			<div>
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
					{t("dashboard.title")}
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					{t("dashboard.description")}
				</p>
			</div>

			{/* Widgets */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 w-full">
				{widgets.map((widget, index) => {
					const Icon = widget.icon;
					return (
						<Card
							key={index}
							className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800"
						>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
										{widget.title}
									</p>
									<p className="text-3xl font-bold text-gray-900 dark:text-white">
										{widget.value}
									</p>
									{/* <p
                    className={`text-sm ${
                      widget.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {widget.change}
                  </p> */}
								</div>
								<div
									className={`p-3 rounded-full bg-${widget.color}-100 dark:bg-${widget.color}-900`}
								>
									<Icon
										className={`w-8 h-8 text-${widget.color}-600 dark:text-${widget.color}-400`}
									/>
								</div>
							</div>
						</Card>
					);
				})}
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 w-full">
				{/* Chart */}
				<Card className="w-full bg-white dark:bg-gray-800">
					<div className="p-6">
						<div className="h-80 w-full">
							{chartData.labels.length > 0 ? (
								<Line data={chartData} options={chartOptions} />
							) : (
								<div className="flex items-center justify-center h-full">
									<div className="text-center">
										<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
										<p className="text-gray-500 dark:text-gray-400 text-sm">{t("dashboard.chart.loading")}</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</Card>

				{/* Property Types */}
				<Card className="w-full bg-white dark:bg-gray-800">
					<div className="p-6">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
							{t("dashboard.propertyTypes.title")}
						</h3>
						<div className="space-y-4">
							{propertyTypes.map((type, index) => (
								<div
									key={index}
									className="flex items-center justify-between"
								>
									<div className="flex items-center space-x-3">
										<div
											className={`w-4 h-4 rounded-full ${
												index === 0
													? "bg-blue-500 dark:bg-blue-400"
													: index === 1
													? "bg-green-500 dark:bg-green-400"
													: index === 2
													? "bg-purple-500 dark:bg-purple-400"
													: index === 3
													? "bg-red-500 dark:bg-red-400"
													: index === 4
													? "bg-yellow-500 dark:bg-yellow-400"
													: index === 5
													? "bg-orange-500 dark:bg-orange-400"
													: index === 6
													? "bg-teal-500 dark:bg-teal-400"
													: index === 7
													? "bg-pink-500 dark:bg-pink-400"
													: index === 8
													? "bg-indigo-500 dark:bg-indigo-400"
													: index === 9
													? "bg-gray-500 dark:bg-gray-400"
													: ""
											}`}
										></div>
										<span className="text-sm font-medium text-gray-900 dark:text-white">
											{getPropertyType(index+1)}
										</span>
									</div>
									<div className="flex items-center space-x-2">
										<span className="text-sm text-gray-500 dark:text-gray-400">
											{type.count}
										</span>
										<div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
											<div
												className={`h-2 rounded-full ${
													index === 0
														? "bg-blue-500 dark:bg-blue-400"
														: index === 1
														? "bg-green-500 dark:bg-green-400"
														: index === 2
														? "bg-purple-500 dark:bg-purple-400"
														: index === 3
														? "bg-red-500 dark:bg-red-400"
														: index === 4
														? "bg-yellow-500 dark:bg-yellow-400"
														: index === 5
														? "bg-orange-500 dark:bg-orange-400"
														: index === 6
														? "bg-teal-500 dark:bg-teal-400"
														: index === 7
														? "bg-pink-500 dark:bg-pink-400"
														: index === 8
														? "bg-indigo-500 dark:bg-indigo-400"
														: index === 9
														? "bg-gray-500 dark:bg-gray-400"
														: ""
												}`}
												style={{
													width: `${type.percentage}%`,
												}}
											></div>
										</div>
										<span className="text-sm text-gray-500 dark:text-gray-400">
											{type.percentage.toFixed(2)}%
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</Card>
			</div>

			{/* Recent Activities */}
			<Card className="w-full bg-white dark:bg-gray-800">
				<div className="p-6">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
						{t("dashboard.recentActivities.title")}
					</h3>
					<div className="space-y-3">
						{recentActivities.map((activity, index) => {
							// Zaman formatını Türkçe'ye çevir
							const formatTime = (timeStr) => {
								const date = new Date(timeStr);
								const now = new Date();
								const diffMs = now - date;
								const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
								const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
								
								if (diffDays > 0) {
									return `${diffDays} ${t("dashboard.recentActivities.daysAgo")}`;
								} else if (diffHours > 0) {
									return `${diffHours} ${t("dashboard.recentActivities.hoursAgo")}`;
								} else {
									return t("dashboard.recentActivities.justNow");
								}
							};

							// Action type'ları Türkçe'ye çevir
							const getActionText = (action) => {
								switch(action) {
									case 'Sale': return t("dashboard.recentActivities.actionSale");
									case 'Rent': return t("dashboard.recentActivities.actionRent");
									case 'User Signup': return t("dashboard.recentActivities.actionSignup");
									default: return action;
								}
							};

							return (
								<div
									key={index}
									className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
								>
									<div>
										<p className="text-sm font-medium text-gray-900 dark:text-white">
											{getActionText(activity.action)}
										</p>
										<p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[100px] sm:max-w-xs md:max-w-md">
											{activity.item}
										</p>
									</div>
									<span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap ml-2">
										{formatTime(activity.time)}
									</span>
								</div>
							);
						})}
						{recentActivities.length === 0 && (
							<p className="text-gray-500 dark:text-gray-400 text-center py-4">
								{t("dashboard.recentActivities.noActivities")}
							</p>
						)}
					</div>
				</div>
			</Card>
		</div>
	);
};

export default Dashboard;
