import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Dashboard</h3>
            </div>
            <div className="card-body text-center">
              <h4 className="mb-4">Welcome to KYC Portal</h4>
              <div className="d-grid gap-3">
                <button 
                  className="btn btn-success btn-lg"
                  onClick={() => navigate('/kyc')}
                >
                  Start New KYC Verification
                </button>
                {/* <button 
                  className="btn btn-info btn-lg"
                  onClick={() => navigate('/history')}
                >
                  View Verification History
                </button> */}
                <button 
                  className="btn btn-secondary btn-lg"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;