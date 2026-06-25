import { Suspense } from "react";
// import PaymentSuccessPage from "./SuccessPage";
import AllProductsPage from "./Products2";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <AllProductsPage></AllProductsPage>
    </Suspense>
  )}