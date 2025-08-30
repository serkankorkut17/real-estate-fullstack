import {
	Footer as FlowbiteFooter,
	FooterBrand,
	FooterTitle,
	FooterLink,
	FooterLinkGroup,
	FooterDivider,
	FooterIcon,
	FooterCopyright,
} from "flowbite-react";
import { BsFacebook, BsInstagram, BsTwitter, BsLinkedin } from "react-icons/bs";
import { HiHome } from "react-icons/hi";
import { useTranslation } from "react-i18next";

const Footer = () => {
	const { t } = useTranslation("common");
	return (
		<FlowbiteFooter
			container
			className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-none"
		>
			<div className="w-full mt-0 mx-8">
				<div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
					<div>
						<div className="flex items-center mb-4">
							<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
								<HiHome className="w-5 h-5 text-white" />
							</div>
							<span className="text-xl font-semibold text-gray-900 dark:text-white">
								Real Estate
							</span>
						</div>
						<p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
							{t("common:footer.description")}
						</p>
					</div>
					<div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
						<div>
							<FooterTitle title={t("footer.properties")} />
							<FooterLinkGroup col>
								<FooterLink href="/properties">
									{t("footer.allProperties")}
								</FooterLink>
								<FooterLink href="/map">
									{t("footer.mapView")}
								</FooterLink>
							</FooterLinkGroup>
						</div>
						<div>
							<FooterTitle title={t("footer.myProperties")} />
							<FooterLinkGroup col>
								<FooterLink href="/user/my-properties">
									{t("footer.myProperties")}
								</FooterLink>
								<FooterLink href="/properties/new">
									{t("footer.post")}
								</FooterLink>
							</FooterLinkGroup>
						</div>
					</div>
				</div>
				<FooterDivider />
				<div className="w-full sm:flex sm:items-center sm:justify-between">
					<FooterCopyright
						href="/"
						by={t("footer.copyright")}
						year={new Date().getFullYear()}
					/>
					<div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
						<FooterIcon href="#" icon={BsFacebook} />
						<FooterIcon href="#" icon={BsInstagram} />
						<FooterIcon href="#" icon={BsTwitter} />
						<FooterIcon href="#" icon={BsLinkedin} />
					</div>
				</div>
			</div>
		</FlowbiteFooter>
	);
};

export default Footer;
