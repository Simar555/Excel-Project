import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [files, setFiles] = useState([]);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const navigate = useNavigate();

  const username = user?.name || localStorage.getItem('username') || 'User';

  const handleLogout = () => {
    logout();
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newFile = {
        id: files.length + 1,
        fileName: file.name,
        dateUploaded: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        size: `${(file.size / 1024).toFixed(1)} KB`
      };
      setFiles([newFile, ...files]);
      alert(`File "${file.name}" uploaded successfully!`);
      event.target.value = '';
    }
  };

  const handleAnalyze = (fileName) => {
    alert(`Analyzing ${fileName}...\nThis would normally open the analysis view.`);
  };

  const handleDelete = (id, fileName) => {
    if (window.confirm(`Are you sure you want to delete ${fileName}?`)) {
      setFiles(files.filter(file => file.id !== id));
      alert(`${fileName} has been deleted.`);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Quick Actions Sidebar */}
      <div className={`quick-actions-sidebar ${showQuickActions ? 'show' : ''}`}>
        <div className="sidebar-content">
          <h3>Quick Actions</h3>
          <button className="sidebar-btn">
            📤 Upload
          </button>
          <button className="sidebar-btn">
            📊 Graphs Created
          </button>
          <button className="sidebar-btn">
            📁 Recent Uploads
          </button>
        </div>
      </div>

      {/* Overlay */}
      {showQuickActions && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setShowQuickActions(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <button 
              className="quick-action-btn"
              onClick={() => setShowQuickActions(!showQuickActions)}
              title="Quick Actions"
            >
              📊
            </button>
            <h1>Excel Analytics</h1>
          </div>
          <nav className="header-nav">
            <span className="nav-link active">Dashboard</span>
            <span className="nav-link">Upload</span>
            <span className="user-info">
              <span className="welcome-text">Welcome back, {username}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </span>
          </nav>
        </header>

        {/* Welcome Section */}
        <div className="welcome-section">
          <h2>Welcome back, {username}</h2>
          <p>Here's an overview of your Excel analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card upload-card">
            <div className="card-icon">📤</div>
            <div className="card-content">
              <h3>Upload Excel File</h3>
              <p>Import new data for analysis</p>
              <input
                type="file"
                id="file-upload"
                className="file-input"
                onChange={handleFileUpload}
                accept=".xlsx,.xls,.csv"
              />
              <label htmlFor="file-upload" className="upload-btn">
                Choose File
              </label>
            </div>
          </div>

          <div className="stat-card charts-card">
            <div className="stat-number">0</div>
            <div className="stat-label">Charts created</div>
          </div>

          <div className="stat-card files-card">
            <div className="stat-number">{files.length}</div>
            <div className="stat-label">Files uploaded</div>
          </div>
        </div>

        {/* Recent Files Section */}
        <div className="recent-files-section">
          <div className="section-header">
            <h3>Recent Files</h3>
            <label htmlFor="file-upload-new" className="upload-new-btn">
              + Upload New
            </label>
            <input
              type="file"
              id="file-upload-new"
              className="file-input"
              onChange={handleFileUpload}
              accept=".xlsx,.xls,.csv"
            />
          </div>

          <div className="files-table-container">
            {files.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📁</div>
                <h4>No files uploaded yet</h4>
                <p>Upload your first Excel file to get started with analytics</p>
                <label htmlFor="file-upload" className="upload-btn-empty">
                  Upload File
                </label>
              </div>
            ) : (
              <table className="files-table">
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Date Uploaded</th>
                    <th>Size</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map(file => (
                    <tr key={file.id}>
                      <td>{file.fileName}</td>
                      <td>{file.dateUploaded}</td>
                      <td>{file.size}</td>
                      <td>
                        <button 
                          onClick={() => handleAnalyze(file.fileName)}
                          className="analyze-btn"
                        >
                          Analyze
                        </button>
                        <button 
                          onClick={() => handleDelete(file.id, file.fileName)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>&copy; 2025 Excel Analytics. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
