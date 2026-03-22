import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SurveyProvider } from "./context/SurveyContext";
import { AuthProvider } from "./context/AuthContext";
import SurveyPage from "./pages/SurveyPage";
import ResultPage from "./pages/ResultPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSurveyDetail from "./pages/admin/AdminSurveyDetail";
import AdminLogin from "./pages/admin/AdminLogin";
import RequireAdmin from "./components/RequireAdmin";
import "./styles/index.css";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <SurveyProvider>
          <Routes>
            {/* Public / User survey routes */}
            <Route path="/" element={<SurveyPage />} />
            <Route path="/results/:id" element={<ResultPage />} />

            {/* Admin auth */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin routes (protected) */}
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/surveys/:id"
              element={
                <RequireAdmin>
                  <AdminLayout>
                    <AdminSurveyDetail />
                  </AdminLayout>
                </RequireAdmin>
              }
            />
          </Routes>
        </SurveyProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
