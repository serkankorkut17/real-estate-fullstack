import { useState, useEffect } from "react";
import { Card, Button, Badge } from "flowbite-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getProperties } from "../../services/PropertyService";
import PropertyCard from "../../components/Properties/PropertyCard";

const HomePage = () => {
	const { data, error, isLoading } = useQuery({
		queryKey: ["properties"],
		queryFn: () =>
			getProperties({
				searchTerm: "",
				propertyTypeId: "",
				propertyStatusId: "",
				minPrice: "",
				maxPrice: "",
				currencyId: "",
				startDate: "",
				endDate: "",
				page: 1,
				pageSize: 6,
				sortBy: "CreatedDate",
				sortDirection: "desc",
			}),
	});
	const [featuredProperties, setFeaturedProperties] = useState([]);
	const { t } = useTranslation("common");

	useEffect(() => {
		const properties = data?.data.data || [];
		console.log(properties);

		if (properties && properties.length > 0) {
			// Get first 6 properties as featured
			setFeaturedProperties(properties.slice(0, 6));
		}
	}, [data]);


	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section
				className="relative text-white py-20"
				style={{
					backgroundImage: "url('/istanbul.webp')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			>
				{/* Saydam mavi overlay */}
				<div className="absolute inset-0 bg-gradient-to-r from-blue-600/85 to-blue-800/85 dark:from-gray-800/85 dark:to-gray-900/85"></div>

				<div className="relative max-w-7xl mx-auto px-4 text-center z-10">
					<h1 className="text-4xl md:text-6xl font-bold mb-6">
						{t("hero.title")}
						<br />
						<span className="text-blue-200">{t("hero.subtitle")}</span>
					</h1>
					<p className="text-xl md:text-2xl mb-8 text-blue-100">
						{t("hero.description")}
					</p>
					<div className="flex justify-center space-x-4">
						<Button size="xl" color="light" as={Link} to="/properties">
							{t("hero.button.viewListings")}
						</Button>
						<Button size="xl" color="blue" as={Link} to="/properties/new">
							{t("hero.button.postListing")}
						</Button>
					</div>
				</div>
			</section>

			{/* Quick Stats */}
			<section className="py-12 bg-gray-50 dark:bg-gray-800">
				<div className="max-w-7xl mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
						<div>
							<div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
								300+
							</div>
							<div className="text-gray-600 dark:text-gray-400">
								{t("stats.activeListings")}
							</div>
						</div>
						<div>
							<div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
								10+
							</div>
							<div className="text-gray-600 dark:text-gray-400">
								{t("stats.happyCustomers")}
							</div>
						</div>
						<div>
							<div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
								60+
							</div>
							<div className="text-gray-600 dark:text-gray-400">
								{t("stats.regions")}
							</div>
						</div>
						<div>
							<div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
								5+
							</div>
							<div className="text-gray-600 dark:text-gray-400">
								{t("stats.experience")}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Featured Properties */}
			<section className="py-16 bg-white dark:bg-gray-900">
				<div className="max-w-7xl mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
							{t("featuredProperties.title")}
						</h2>
						<p className="text-xl text-gray-600 dark:text-gray-400">
							{t("featuredProperties.description")}
						</p>
					</div>

					{isLoading ? (
						<div className="text-center">
							<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{featuredProperties.map((property) => (
								<PropertyCard
									key={property.id}
									property={property}
									buttonName={t("buttons.viewDetails")}
								/>
							))}
						</div>
					)}

					<div className="text-center mt-12">
						<Button as={Link} to="/properties" color="gray" size="lg">
							{t("buttons.viewAllListings")}
						</Button>
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section
				className="relative text-white py-16"
				style={{
					backgroundImage: "url('/istanbul-2.webp')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			>
				<div className="absolute inset-0 bg-gradient-to-r from-blue-600/85 to-blue-800/85 dark:from-gray-800/85 dark:to-gray-900/85"></div>

				<div className="relative max-w-4xl mx-auto px-4 text-center z-10">
					<h2 className="text-3xl md:text-4xl font-bold mb-6">
						{t("callToAction.title")}
					</h2>
					<p className="text-xl mb-8 text-blue-100">
						{t("callToAction.description")}
					</p>
					<div className="flex justify-center space-x-4">
						<Button size="xl" color="light" as={Link} to="/properties/new">
							{t("callToAction.button")}
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
};

export default HomePage;
