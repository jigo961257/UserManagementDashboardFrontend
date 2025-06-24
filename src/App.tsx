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
import RegisterPage from "./Pages/Register";
import DashboardHome from "./Pages/DashboardHome";
import UserManagementPage from "./components/ui/AdminDashboard/ShowUserMnagement";
import RoleRoute from "./Pages/RoleRoute";
import ShowUserManagementPage from "./components/ui/AdminDashboard/ShowUserMnagement";
import ProfilePage from "./components/Profile";
import ViewProfile from "./Pages/ViewProfile";


export default function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
  {/* <Route index element={<DashboardHome />} /> This is your main dashboard home screen */}
            <Route element={<RoleRoute allowedRoles={["SuperAdmin"]} />}>
            <Route path="/:role/user-management" element={<ShowUserManagementPage/>} />
          </Route>

        <Route path="/:role/view-profile" element={<ViewProfile />} />
  {/* <Route path=":role/user-management" element={<UserMnagement />} /> */}
  <Route path=":role/content-management" element={<ContentManagement />} />
  <Route path=":role/reports" element={<Reports />} />
  <Route path=":role/settings" element={<Settings />} />
  <Route path=":role/rules-management" element={<RulesManagement />} />
  <Route path=":role/automation-management" element={<AutomationManagement />} />
          <Route path="/*" element={<NotFound />} />
</Route>

          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          {/* <Route path="/register" element={<RegisterPage/>} /> */}
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          <Route
            path="/login"
            element={
              sessionStorage.getItem("accessToken") ? (
                <Navigate to="/:role/user-management" replace />
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
