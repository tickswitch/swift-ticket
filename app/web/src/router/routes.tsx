import { Route, Routes as ReactRouterRoutes, Navigate } from "react-router";
import { Suspense, lazy } from "react";
import LoadingSpinner from "@/components/Loader/LoadingSpinner";
import MainLayout from "@/layouts/MainLayout";
import HowItWorks from "@/pages/HowItWorks";
import HowToSell from "@/pages/HowToSell";
import About from "@/pages/About";
import Magazine from "@/pages/Magazine";
import Jobs from "@/pages/Jobs";
import TicketAlerts from "@/pages/TicketAlerts";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Error from "@/pages/Error";
import PublicOnlyRoute from "./PublicOnlyRoute";
import AuthLayout from "@/layouts/AuthLayout";
import Forgot_password from "@/pages/auth/Forgot_password";
import VarificationCode from "@/pages/auth/VarificationCode";
import NewPassword from "@/pages/auth/NewPassword";
import DiscoverDetails from "@/components/Magazine/DiscoverDetails";
import AvailableTickets from "@/pages/AvailableTickets";
import AddToCart from "@/pages/AddToCart";
import PaymentMethod from "@/pages/PaymentMethod";
import DiscountCarts from "@/pages/DiscountCarts";
import SellTickets from "@/pages/SellTickets";
import SelectEvents from "@/components/SellTicketsComponents/SelectEvents";
import Help from "@/pages/Help";
import TicketsUpload from "@/components/SellTicketsComponents/TicketsUpload";
import AddTicketDetails from "@/components/SellTicketsComponents/AddTicketDetails";
import TicketPrice from "@/components/SellTicketsComponents/TicketPrice";
import YourTicketPrice from "@/components/SellTicketsComponents/YourTicketPrice";
import YourAddress from "@/components/SellTicketsComponents/YourAddress";
import BankDetail from "@/components/SellTicketsComponents/BankDetail";
import ReviewAndFinish from "@/components/SellTicketsComponents/ReviewAndFinish";
import CollectionArticles from "@/components/Help/CollectionArticles";
import ArticlesDetails from "@/components/Help/ArticlesDetails";
import Events from "@/components/TicketAlerts/Events";
import ProtectedRoute from "./ProtectedRoute";
import Tickets from "@/pages/Tickets";
import Listing from "@/pages/Listing";
import Cart from "@/pages/Cart";
import { Profile } from "@/pages/Profile";
import Email from "@/pages/Account/Email";
import Phone from "@/pages/Account/Phone";
import IdentyVerify from "@/pages/Account/IdentyVerify";
import ContactDetails from "@/pages/Account/ContactDetails";
import BankDetails from "@/pages/Account/BankDetails";
import AllSportsEvents from "@/components/HomePage/AllSportsEvents";
import AllConcerts from "@/components/HomePage/AllConcerts";
import ExploreAllEvents from "@/components/HomePage/ExploreAllEvents";

const HomePage = lazy(() => import("@/pages/HomePage"));

const Routes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ReactRouterRoutes>
        {/* Public routes with main layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/howitworks" element={<HowItWorks />} />
          <Route path="/howtosell" element={<HowToSell />} />
          <Route path="/about" element={<About />} />
          <Route path="/magazine" element={<Magazine />} />
          <Route path="/magazine/:id" element={<DiscoverDetails />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event-details/:id" element={<TicketAlerts />} />
          <Route
            path="/availabletickets/:id/:name"
            element={<AvailableTickets />}
          />
          <Route path="/addtocart/:id" element={<AddToCart />} />
          <Route path="/discountcart" element={<DiscountCarts />} />
          <Route path="/paymentmethod" element={<PaymentMethod />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="bank-details"
            element={
              <ProtectedRoute>
                <BankDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="tickets"
            element={
              <ProtectedRoute>
                <Tickets />
              </ProtectedRoute>
            }
          />
          <Route
            path="listing"
            element={
              <ProtectedRoute>
                <Listing />
              </ProtectedRoute>
            }
          />
          <Route
            path="cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route path="all-sports-events" element={<AllSportsEvents />} />
          <Route path="all-concerts" element={<AllConcerts />} />
          <Route path="all-events" element={<ExploreAllEvents />} />
          <Route path="email" element={<Email />} />
          <Route path="phone" element={<Phone />} />
          <Route path="identy-verify" element={<IdentyVerify />} />
          <Route path="contact-details" element={<ContactDetails />} />
        </Route>

        {/* Sell tickets routes */}
        <Route path="/" element={<SellTickets />}>
          <Route path="help" element={<Help />} />
          <Route
            path="sell-tickets"
            element={
              <ProtectedRoute>
                <SelectEvents />
              </ProtectedRoute>
            }
          />

          <Route path="upload-tickets" element={<TicketsUpload />} />
          <Route path="add-ticket-details" element={<AddTicketDetails />} />
          <Route path="ticket-price" element={<TicketPrice />} />
          <Route path="your-ticket-price" element={<YourTicketPrice />} />
          <Route path="your-address" element={<YourAddress />} />
          <Route path="bank-details" element={<BankDetail />} />
          <Route path="review-finish" element={<ReviewAndFinish />} />
          <Route path="collection-articles" element={<CollectionArticles />} />
          <Route path="article-details" element={<ArticlesDetails />} />
        </Route>

        {/* Error routes */}
        <Route path="404" element={<Error />} />
        {/* <Route path="401" element={<UnauthorizedPage />} /> */}

        {/* Auth routes with auth layout */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route
            path="login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="forgot-password"
            element={
              <PublicOnlyRoute>
                <Forgot_password />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="varification-code"
            element={
              <PublicOnlyRoute>
                <VarificationCode />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="new-password"
            element={
              <PublicOnlyRoute>
                <NewPassword />
              </PublicOnlyRoute>
            }
          />
        </Route>

        {/* Protected dashboard routes */}
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route> */}

        {/* Redirects */}
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route
          path="/register"
          element={<Navigate to="/auth/register" replace />}
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </ReactRouterRoutes>
    </Suspense>
  );
};

export default Routes;
