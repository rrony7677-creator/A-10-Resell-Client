import { Suspense } from "react";
import PaymentSuccessPage from "./SuccessPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
     <PaymentSuccessPage></PaymentSuccessPage>
    </Suspense>
  )
}