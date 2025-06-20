import {Route,BrowserRouter,  Routes } from "react-router-dom";
import Login from "./Pages/Login";

import DashboardLayout from "./Pages/Dashboard";

export default function App() {
  return (
    <>
<BrowserRouter>
<Routes>
  <Route path="/" element={<Login/>}/>
  <Route path="/dashboard" element={<DashboardLayout/>}/>
  
</Routes>
</BrowserRouter>
    </>
   
  )
}