import React from "react";
import { Checkbox, Label } from "flowbite-react";
import { useTranslation } from "react-i18next";

const FeaturesFilter = ({
	hasKitchenInput,
	setHasKitchenInput,
	hasBalconyInput,
	setHasBalconyInput,
	hasElevatorInput,
	setHasElevatorInput,
	hasParkingInput,
	setHasParkingInput,
	hasGardenInput,
	setHasGardenInput,
	isFurnishedInput,
	setIsFurnishedInput,
	isInComplexInput,
	setIsInComplexInput,
	isEligibleForLoanInput,
	setIsEligibleForLoanInput,
	isExchangeableInput,
	setIsExchangeableInput,
}) => {

	const { t } = useTranslation("common");

	return (
		<div className="space-y-2">
			<div className="flex items-center">
				<Checkbox
					id="hasKitchen"
					checked={hasKitchenInput}
					onChange={(e) => setHasKitchenInput(e.target.checked)}
				/>
				<Label
					htmlFor="hasKitchen"
					className="ml-2 text-sm dark:text-gray-300"
				>
					🍳{" "}{t("filters.kitchen")}
				</Label>
			</div>
			<div className="flex items-center">
				<Checkbox
					id="hasBalcony"
					checked={hasBalconyInput}
					onChange={(e) => setHasBalconyInput(e.target.checked)}
				/>
				<Label
					htmlFor="hasBalcony"
					className="ml-2 text-sm dark:text-gray-300"
				>
					🌅{" "}{t("filters.balcony")}
				</Label>
			</div>
			<div className="flex items-center">
				<Checkbox
					id="hasElevator"
					checked={hasElevatorInput}
					onChange={(e) => setHasElevatorInput(e.target.checked)}
				/>
				<Label
					htmlFor="hasElevator"
					className="ml-2 text-sm dark:text-gray-300"
				>
					🛗{" "}{t("filters.elevator")}
				</Label>
			</div>
			<div className="flex items-center">
				<Checkbox
					id="hasParking"
					checked={hasParkingInput}
					onChange={(e) => setHasParkingInput(e.target.checked)}
				/>
				<Label
					htmlFor="hasParking"
					className="ml-2 text-sm dark:text-gray-300"
				>
					🚗{" "}{t("filters.parking")}
				</Label>
			</div>
			<div className="flex items-center">
				<Checkbox
					id="hasGarden"
					checked={hasGardenInput}
					onChange={(e) => setHasGardenInput(e.target.checked)}
				/>
				<Label
					htmlFor="hasGarden"
					className="ml-2 text-sm dark:text-gray-300"
				>
					🌿{" "}{t("filters.garden")}
				</Label>
			</div>
			<div className="flex items-center">
				<Checkbox
					id="isFurnished"
					checked={isFurnishedInput}
					onChange={(e) => setIsFurnishedInput(e.target.checked)}
				/>
				<Label
					htmlFor="isFurnished"
					className="ml-2 text-sm dark:text-gray-300"
				>
					🛋️{" "}{t("filters.furnished")}
				</Label>
			</div>
			<div className="flex items-center">
				<Checkbox
					id="isInComplex"
					checked={isInComplexInput}
					onChange={(e) => setIsInComplexInput(e.target.checked)}
				/>
				<Label
					htmlFor="isInComplex"
					className="ml-2 text-sm dark:text-gray-300"
				>
					🏢{" "}{t("filters.inComplex")}
				</Label>
			</div>
			<div className="flex items-center">
				<Checkbox
					id="isEligibleForLoan"
					checked={isEligibleForLoanInput}
					onChange={(e) =>
						setIsEligibleForLoanInput(e.target.checked)
					}
				/>
				<Label
					htmlFor="isEligibleForLoan"
					className="ml-2 text-sm dark:text-gray-300"
				>
					💳{" "}{t("filters.eligibleForLoan")}
				</Label>
			</div>
			<div className="flex items-center">
				<Checkbox
					id="isExchangeable"
					checked={isExchangeableInput}
					onChange={(e) => setIsExchangeableInput(e.target.checked)}
				/>
				<Label
					htmlFor="isExchangeable"
					className="ml-2 text-sm dark:text-gray-300"
				>
					🔄{" "}{t("filters.exchangeable")}
				</Label>
			</div>
		</div>
	);
};

export default FeaturesFilter;
