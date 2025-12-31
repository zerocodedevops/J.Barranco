import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import HeaderAdmin from "./HeaderAdmin";
import SubHeaderAdmin from "./SubHeaderAdmin";
import ErrorBoundary from "../../common/ErrorBoundary";
import TermsAcceptanceModal from "../../auth/TermsAcceptanceModal";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ErrorBoundary>
      <TermsAcceptanceModal />
      <div className="bg-gray-light flex flex-col h-full">
        <HeaderAdmin onMenuClick={() => setSidebarOpen(true)} />
        <SubHeaderAdmin />
        <div className="flex flex-1 overflow-hidden">
          <AdminSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <main className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default AdminLayout;
