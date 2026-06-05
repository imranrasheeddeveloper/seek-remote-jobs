import React from "react";
import "../styles/Sidebar.css";

const Icons = {
  LayoutDashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  FileText: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  ),
  Sparkles: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
      <path d="M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75z"/>
      <path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5z"/>
    </svg>
  ),
  Bookmark: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Briefcase: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  LogOut: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

export default function Sidebar({ activeTab, onTabChange, user, onLogout }) {
  const menuItems = [
    { id: "home",         label: "Dashboard",          icon: Icons.LayoutDashboard },
    { id: "resumes",      label: "My Resumes",          icon: Icons.FileText },
    { id: "tailored",     label: "Tailored Variations", icon: Icons.Sparkles },
    { id: "saved-jobs",   label: "Saved Jobs",          icon: Icons.Bookmark },
    { id: "applications", label: "Applications",        icon: Icons.Briefcase },
  ];

  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="4"/>
            <path d="M9 15l3-3 3 3" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <h1>SeekRemoteJobs</h1>
      </div>

      {/* User Profile */}
      <div className="sidebar-user">
        <div className="user-avatar">{user?.name?.charAt(0)?.toUpperCase() || "U"}</div>
        <div className="user-info">
          <p className="user-name">{user?.name || "User"}</p>
          <p className="user-email">{user?.email || "user@example.com"}</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h2 className="nav-section-title">Navigation</h2>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => onTabChange(item.id)}
            >
              <span className="nav-icon">
                <item.icon />
              </span>
              <span className="nav-label">{item.label}</span>
              {activeTab === item.id && <span className="nav-active-indicator" />}
            </button>
          ))}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <button className="nav-item nav-logout" onClick={onLogout}>
          <span className="nav-icon">
            <Icons.LogOut />
          </span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}
