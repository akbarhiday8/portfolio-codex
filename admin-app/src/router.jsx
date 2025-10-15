import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/Profile';
import AboutPage from './pages/About';
import ToolTypesPage from './pages/Tools/Types';
import ToolCategoriesPage from './pages/Tools/Categories';
import ToolsPage from './pages/Tools/Tools';
import ProjectsList from './pages/Projects/List';
import ProjectCreate from './pages/Projects/Create';
import ProjectEdit from './pages/Projects/Edit';
import ProjectCategoriesPage from './pages/Projects/Categories';
import SettingsPage from './pages/Settings';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/tools/types', element: <ToolTypesPage /> },
      { path: '/tools/categories', element: <ToolCategoriesPage /> },
      { path: '/tools', element: <ToolsPage /> },
      { path: '/projects', element: <ProjectsList /> },
      { path: '/projects/categories', element: <ProjectCategoriesPage /> },
      { path: '/projects/new', element: <ProjectCreate /> },
      { path: '/projects/:projectId', element: <ProjectEdit /> },
      { path: '/settings', element: <SettingsPage /> },
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);
