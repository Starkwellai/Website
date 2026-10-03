import { createBrowserRouter, Navigate } from "react-router";
import { AccountsComingSoon } from "./pages/AccountsComingSoon";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { DocumentUpload } from "./pages/DocumentUpload";
import { Success } from "./pages/Success";
import { TermsAndConditions } from "./pages/TermsAndConditions";
import { HipaaPrivacy } from "./pages/HipaaPrivacy";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { SubscriptionTiers } from "./pages/SubscriptionTiers";
import { Trust } from "./pages/Trust";
import { Help } from "./pages/Help";
import { About } from "./pages/About";
import { Utah } from "./pages/Utah";
import { NotFound } from "./pages/NotFound";
import { PriceSearch } from "./pages/PriceSearch";
import { FacilityProfile } from "./pages/FacilityProfile";
import { HospitalStays } from "./pages/HospitalStays";
import { DrugPrices } from "./pages/DrugPrices";
import { NewPatientGuide } from "./pages/NewPatientGuide";
import { SavedItems } from "./pages/SavedItems";
import { Profile } from "./pages/Profile";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AuditLog } from "./pages/AuditLog";
import { ProviderDashboard } from "./pages/ProviderDashboard";
import { SupportDashboard } from "./pages/SupportDashboard";
import { Notifications } from "./pages/Notifications";
import { Settings } from "./pages/Settings";
import { ProviderSignup } from "./pages/ProviderSignup";
import { ProvidersLanding } from "./pages/ProvidersLanding";
import { ProviderVerificationPending } from "./pages/ProviderVerificationPending";
import { DatabaseScan } from "./pages/DatabaseScan";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/signup",
    element: <AccountsComingSoon />,
  },
  {
    path: "/signup-consumer",
    element: <AccountsComingSoon />,
  },
  {
    path: "/signup-provider",
    element: <Navigate to="/provider-signup" replace />,
  },
  {
    path: "/signup-simple",
    element: <AccountsComingSoon />,
  },
  {
    path: "/signup-minimal",
    element: <AccountsComingSoon />,
  },
  {
    path: "/signup-original",
    element: <AccountsComingSoon />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/upload-documents",
    element: <DocumentUpload />,
  },
  {
    path: "/success",
    element: <Success />,
  },
  {
    path: "/terms",
    element: <TermsAndConditions />,
  },
  {
    path: "/hipaa-privacy",
    element: <HipaaPrivacy />,
  },
  {
    path: "/privacy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/subscription-tiers",
    element: <SubscriptionTiers />,
  },
  {
    path: "/trust",
    element: <Trust />,
  },
  {
    path: "/help",
    element: <Help />,
  },
  {
    path: "/new-patient-guide",
    element: <NewPatientGuide />,
  },
  {
    path: "/saved",
    element: <SavedItems />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/utah",
    element: <Utah />,
  },
  {
    // Procedure-first search over the published price slice.
    // URL is deliberate: programmatic SEO will grow service x city beneath it
    // (/prices/mri-knee/provo), and URLs are expensive to change once indexed.
    path: "/prices",
    element: <PriceSearch />,
  },
  {
    // address/city come as query params, not just the facility_key path
    // param — see getFacilityProfile()'s docstring for why the key alone
    // can't be reversed back into a place.
    path: "/facility/:facilityKey",
    element: <FacilityProfile />,
  },
  {
    path: "/drug-prices",
    element: <DrugPrices />,
  },
  {
    path: "/hospital-stays",
    element: <HospitalStays />,
  },

  // Account pages (patient-facing, share Dashboard.tsx's internal header pattern).
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/notifications",
    element: <Notifications />,
  },
  {
    path: "/audit-log",
    element: <AuditLog />,
  },

  // Role-gated dashboards. Role state is local/mock only (UserContext) —
  // there is no real auth backend, so these routes are not actually gated,
  // only styled as if a role check happened. See RoleSwitcher to preview each.
  // Exception: /provider-dashboard now checks a real session itself (see
  // ProviderDashboard.tsx) and redirects to /provider-signup if there isn't
  // one -- /provider-login is intentionally unrouted for now (see
  // ProviderLogin.tsx) since it collects a password and the site has no
  // HTTPS yet.
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/provider-dashboard",
    element: <ProviderDashboard />,
  },
  {
    path: "/support-dashboard",
    element: <SupportDashboard />,
  },

  // Provider recruitment funnel: marketing page -> multi-step clinic
  // registration -> pending-verification confirmation. Every patient sign-up
  // path above lands on AccountsComingSoon (no patient accounts exist yet);
  // /signup-provider forwards here.
  {
    path: "/providers",
    element: <ProvidersLanding />,
  },
  {
    path: "/provider-signup",
    element: <ProviderSignup />,
  },
  {
    path: "/provider-verification-pending",
    element: <ProviderVerificationPending />,
  },

  // Internal/debug tool, not linked from any nav.
  {
    path: "/database-scan",
    element: <DatabaseScan />,
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);