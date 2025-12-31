import { Outlet } from "react-router-dom";
import HeaderEmployee from "./HeaderEmployee";
import SubHeaderEmployee from "./SubHeaderEmployee";
import ErrorBoundary from "../common/ErrorBoundary";
import EmployeeBottomNav from "./EmployeeBottomNav";
import TermsAcceptanceModal from "../auth/TermsAcceptanceModal";

function EmployeeLayout() {
  return (
    <ErrorBoundary>
      <TermsAcceptanceModal />
      <div className="bg-gray-light flex flex-col h-screen overflow-hidden">
        <HeaderEmployee />
        <SubHeaderEmployee />
        <main className="flex-1 p-6 overflow-y-auto pb-24">
          <Outlet />
        </main>
        <EmployeeBottomNav />
      </div>
    </ErrorBoundary>
  );
}

export default EmployeeLayout;
