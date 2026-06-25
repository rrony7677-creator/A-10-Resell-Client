// import Image from "next/image";
// import Banner from "./component/Banner";
// import SustainabilityImpact from "./component/SustainImpact";
// import TrustedSellersShowcase from "./component/TrustedSeller";
// import HeroBanner from "./component/HeroBanner";
// import FeaturedProductsSection from "./component/FeaturedProduct";
// import PopularCategories from "./component/PopularCategories";


// export default function Home() {
//   return (
//     <div >
//      <Banner></Banner>
//      <HeroBanner></HeroBanner>
//      <FeaturedProductsSection></FeaturedProductsSection>
//      {/* <PopularCategories></PopularCategories> */}
//      <SustainabilityImpact></SustainabilityImpact>
//      <TrustedSellersShowcase></TrustedSellersShowcase>
//     </div>
//   );
// }

import { getPublicStats } from "@/lib/actions/stats";
import { getPublicProducts } from "@/lib/actions/products";
// import HeroBanner from "./component/HeroBanner";
import FeaturedProductsSection from "./component/FeaturedProduct";
import PopularCategories from "./component/PopularCategories";
import SuccessStories from "./component/SuccessStories";
import SustainabilityImpact from "./component/SustainImpact";
import TrustedSellersShowcase from "./component/TrustedSeller";
import Banner from "./component/Banner";
import MarketplaceStats from "./component/MarketPlaceStats";

const CATEGORIES = [
  { id: "electronics", label: "Electronics", emoji: "💻" },
  { id: "furniture", label: "Furniture", emoji: "🛋️" },
  { id: "fashion", label: "Fashion & Apparel", emoji: "👕" },
  { id: "vehicles", label: "Vehicles", emoji: "🚗" },
];

export default async function Home() {
  const [stats, featured, ...categoryResults] = await Promise.all([
    getPublicStats(),
    getPublicProducts({ page: 1, limit: 8 }),
    ...CATEGORIES.map((c) => getPublicProducts({ category: c.id, limit: 1 })),
  ]);

  const categoriesWithCounts = CATEGORIES.map((c, i) => ({
    ...c,
    count: categoryResults[i]?.totalCount || 0,
  }));

  return (
    <div>
      {/* <HeroBanner stats={stats} /> */}
      <Banner></Banner>
      <FeaturedProductsSection products={featured?.products || []} />
      <PopularCategories categories={categoriesWithCounts} />
      <SuccessStories />
      <MarketplaceStats stats={stats} />
      <SustainabilityImpact />
      <TrustedSellersShowcase />
    </div>
  );
}
