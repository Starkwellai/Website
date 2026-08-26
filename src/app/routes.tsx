import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Landing } from "./pages/Landing";
import { SignupSimple } from "./pages/SignupSimple";
import { SignupSplit } from "./pages/SignupSplit";
import { SignupMinimal } from "./pages/SignupMinimal";
import { Dashboard } from "./pages/Dashboard";
import { DocumentUpload } from "./pages/DocumentUpload";
import { Success } from "./pages/Success";
import { TermsAndConditions } from "./pages/TermsAndConditions";
import { HipaaPrivacy } from "./pages/HipaaPrivacy";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { SubscriptionTiers } from "./pages/SubscriptionTiers";
import { Trust } from "./pages/Trust";
import { About } from "./pages/About";
import { Utah } from "./pages/Utah";
import { NotFound } from "./pages/NotFound";
import { PriceSearch } from "./pages/PriceSearch";
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
    element: <SignupSplit />,
  },
  {
    path: "/signup-consumer",
    element: <SignupSplit />,
  },
  {
    path: "/signup-provider",
    element: <SignupSplit />,
  },
  {
    path: "/signup-simple",
    element: <SignupSimple />,
  },
  {
    path: "/signup-minimal",
    element: <SignupMinimal />,
  },
  {
    path: "/signup-original",
    element: <Landing />,
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
  // registration -> pending-verification confirmation. Distinct from the
  // existing /signup-provider (SignupSplit), which is the simpler consumer
  // vs. provider split used elsewhere on the site.
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