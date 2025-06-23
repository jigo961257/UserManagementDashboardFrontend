import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserMnagement from "./components/ui/Dashboard/UserMnagement";
import ContentManagement from "./components/ui/Dashboard/ContentManagement";
import AutomationManagement from "./components/ui/Dashboard/AutomationManagement";
import RulesManagement from "./components/ui/Dashboard/RulesManagement";
import Reports from "./components/ui/Dashboard/Reports";
import Settings from "./components/ui/Dashboard/Settings";
import DashboardLayout from "./Pages/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./Pages/ProtectedRoute";
import PublicRoute from "./Pages/PublicRoute";
import LoginPage from "./Pages/login";
import NotFound from "./Pages/NotFound";


export default function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="user-management" element={<UserMnagement />} />
            <Route path="content-management" element={<ContentManagement />} />
            <Route path="user-management" element={<UserMnagement />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="rules-management" element={<RulesManagement />} />
            <Route path="automation-management" element={<AutomationManagement />} />
          </Route>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/*" element={<NotFound />} />
          <Route
            path="/login"
            element={
              sessionStorage.getItem("accessToken") ? (
                <Navigate to="/user-management" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />


        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}
