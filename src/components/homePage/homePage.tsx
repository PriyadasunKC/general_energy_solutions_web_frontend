
import HeroSection from "@/components/homePageComponents/heroSection";
import FeaturedSolarPackagesSection from "@/components/homePageComponents/featuredSolarPackagesSection";
import PopularCategoriesSection from "@/components/homePageComponents/popularCategoriesSection";
import WhyChooseUsSection from "@/components/homePageComponents/whyChooseUsSection";
import TestimonialsSection from "@/components/homePageComponents/testimonialsSection";

export default function homePage() {
    return (
        <div className="">
            <HeroSection />
            <FeaturedSolarPackagesSection />
            <PopularCategoriesSection />
            <WhyChooseUsSection />
            <TestimonialsSection />
        </div>
    );
}