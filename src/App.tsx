import { BrowserRouter, Routes, Route } from "react-router-dom";
// import DashboardLayout from "@/Pages/sidebar"; // layout
import UserMnagement from "./Dashboard/UserMnagement";
import ContentManagement from "./Dashboard/ContentManagement";
import AutomationManagement from "./Dashboard/AutomationManagement";
import RulesManagement from "./Dashboard/RulesManagement";
import Reports from "./Dashboard/Reports";
import Settings from "./Dashboard/Settings";
import Login from "./Pages/login";
import DashboardLayout from "./Pages/Sidebar";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* <Route index element={<DashboardHome/>} />  */}
          <Route path="user-management" element={<UserMnagement />} />
          <Route path="content-management" element={<ContentManagement />} />
          <Route path="user-management" element={<UserMnagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="rules-management" element={<RulesManagement />} />
          <Route path="automation-management" element={<AutomationManagement />} />  
        </Route>
                  <Route path="/" element={<Login />} />  

      </Routes>
    </BrowserRouter>
  );
}
