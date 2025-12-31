import { Outlet } from "react-router-dom";
import HeaderClient from "./HeaderClient";
import SubHeaderClient from "./SubHeaderClient";
import ErrorBoundary from "../common/ErrorBoundary";
import ClientBottomNav from "./ClientBottomNav";
import TermsAcceptanceModal from "../auth/TermsAcceptanceModal";

function ClientLayout() {
  return (
    <ErrorBoundary>
      <TermsAcceptanceModal />
      <div className="bg-gray-light flex flex-col h-full">
        <HeaderClient />
        <SubHeaderClient />
        <main className="flex-1 p-6 overflow-y-auto pb-24">
          <Outlet />
        </main>
        <ClientBottomNav />
      </div>
    </ErrorBoundary>
  );
}

export default ClientLayout;
