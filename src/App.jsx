import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import PublicSearch from "./pages/PublicSearch";
import PublicDetail from "./pages/PublicDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OAuthCallback from "./pages/OAuthCallback";

import GraduateDashboard from "./pages/GraduateDashboard";
import MyWorks from "./pages/MyWorks";
import WorkForm from "./pages/WorkForm";
import Profile from "./pages/Profile";
import ActivityHistory from "./pages/ActivityHistory";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import WorkManagement from "./pages/admin/WorkManagement";
import CategoryTagManagement from "./pages/admin/CategoryTagManagement";
import AuditLogs from "./pages/admin/AuditLogs";

import "./index.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* HOME */}
            <Route path="/" element={<PublicSearch />} />

            {/* PUBLIC */}
            <Route path="/projects/:id" element={<PublicDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />
            <Route path="/api/auth/google/callback" element={<OAuthCallback />} />

            {/* GRADUATE */}
            <Route
              path="/graduate"
              element={
                <ProtectedRoute role="graduate">
                  <GraduateDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/graduate/works"
              element={
                <ProtectedRoute role="graduate">
                  <MyWorks />
                </ProtectedRoute>
              }
            />

            <Route
              path="/graduate/works/new"
              element={
                <ProtectedRoute role="graduate">
                  <WorkForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/graduate/works/:id/edit"
              element={
                <ProtectedRoute role="graduate">
                  <WorkForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/graduate/profile"
              element={
                <ProtectedRoute role="graduate">
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/graduate/activity"
              element={
                <ProtectedRoute role="graduate">
                  <ActivityHistory />
                </ProtectedRoute>
              }
            />

            {/* ADMIN */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute role="admin">
                  <UserManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/works"
              element={
                <ProtectedRoute role="admin">
                  <WorkManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute role="admin">
                  <CategoryTagManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/audit"
              element={
                <ProtectedRoute role="admin">
                  <AuditLogs />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}
