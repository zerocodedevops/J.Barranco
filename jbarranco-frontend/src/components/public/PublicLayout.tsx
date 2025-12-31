import { Outlet } from "react-router-dom";
import PublicHeader from "./PublicHeader";
import SubHeaderPublic from "./SubHeaderPublic";
import CookieBanner from "../common/CookieBanner";
import ScrollToTop from "../common/ScrollToTop";
import ErrorBoundary from "../common/ErrorBoundary";
import Footer from "./Footer";

function PublicLayout() {
  return (
    <ErrorBoundary>
      <a href="#main-content" className="skip-to-main">
        Saltar al contenido principal
      </a>

      <div className="min-h-screen bg-gray-light flex flex-col">
        {/* Header + SubHeader sticky como bloque */}
        <div className="sticky top-0 z-50">
          <PublicHeader />
          <SubHeaderPublic />
        </div>

        <main id="main-content" className="flex-1">
          <Outlet />
        </main>

        <Footer />
        <ScrollToTop />
        <CookieBanner />
      </div>
    </ErrorBoundary>
  );
}

export default PublicLayout;
