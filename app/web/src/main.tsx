import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "react-hot-toast";
import Routes from "./router/routes";
import { BrowserRouter } from "react-router";
import store from "./store/store";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
// import SmoothScrollWrapper from "./components/Common/ScrollSmooth";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Provider store={store}>
            {/* <SmoothScrollWrapper> */}
            <Routes />
            {/* </SmoothScrollWrapper> */}
            <Toaster reverseOrder={false} />
          </Provider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
