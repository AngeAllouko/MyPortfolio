import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import DiplomasPage from "./pages/DiplomasPage";
import ExperiencesPage from "./pages/ExperiencesPage";
import SkillsPage from "./pages/SkillsPage";
import ProjectsPage from "./pages/ProjectsPage";
import ContactsPage from "./pages/ContactsPage";

export default function App() {
  return (
    <Router>
      <div className="admin-layout">
        <Sidebar />
        <main className="admin-main">
          <div className="admin-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/diplomas" element={<DiplomasPage />} />
              <Route path="/experiences" element={<ExperiencesPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}
