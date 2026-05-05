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
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#f1f5f9',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                },
                success: {
                  iconTheme: { primary: '#22c55e', secondary: '#f1f5f9' },
                  style: {
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#f1f5f9',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    borderLeft: '3px solid #22c55e',
                  },
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' },
                  style: {
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#f1f5f9',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    borderLeft: '3px solid #ef4444',
                  },
                },
              }}
            />
          </Provider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
