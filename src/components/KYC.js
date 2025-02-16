import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function KYC() {
  const [step, setStep] = useState(1); // 1: PAN, 2: Bank, 3: Result
  const [pan_number, setPan] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [result, setResult] = useState(null);
  const [ifscCode, setIfscCode] = useState('');
  const [attemptId, setAttemptId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePANSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        // Call PAN Verification API
        const response = await axios.post('/kyc/initiate-pan', 
          { pan_number }, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('PAN Verification Response:', response.data);
        if (response.data.failure_reason !== '') {
          setError(response.data.failure_reason);
        } 
        if (response.data.pan_verification_status === 'SUCCESS' && response.data.name_match_status === 'pan_matched') {
          setAttemptId(response.data.id);
          setStep(2);
        }
      } catch (err) {
        // Handle HTTP errors (4xx, 5xx)
        const errorMessage = err.response?.data?.detail || 
                             err.response?.data?.message || 
                             'PAN verification failed. Please check the number.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
  };

  const handleBankSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        console.log("attemptId");
        console.log(attemptId);
        console.log(accountNumber);
        console.log(ifscCode);
      // Call Bank Verification API
      const response = await axios.post('/kyc/initiate-bank', {
        attempt_id: attemptId,
        account_number: accountNumber,
        ifsc_code: ifscCode
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Bank Verification Response:', response.data);
      if (response.data.failure_reason !== '') {
        setError(response.data.failure_reason);
      }
      if (response.data.overall_status === 'success') {
        setStep(3);
        setResult(response.data);
      }
    } catch (err) {
      setError('Bank account verification failed. Please check the details.');
    }
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">KYC Verification</h3>
              <div className="progress mt-3" style={{ height: '5px' }}>
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{ width: `${step * 33}%` }}
                ></div>
              </div>
            </div>

            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}

              {step === 1 && (
                <form onSubmit={handlePANSubmit}>
                  <h4 className="mb-4">Step 1: PAN Verification</h4>
                  <div className="mb-3">
                    <label className="form-label">PAN Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ABCDE1234F"
                      value={pan_number}
                      onChange={(e) => setPan(e.target.value.toUpperCase())}
                      pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                      required
                    />
                    <small className="form-text text-muted">
                      Format: AAAAA9999A
                    </small>
                  </div>
                  <button 
                    className="btn btn-primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Verify PAN'}
                  </button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleBankSubmit}>
                  <h4 className="mb-4">Step 2: Bank Account Verification</h4>
                  <div className="mb-3">
                    <label className="form-label">Account Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="1234567890"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">IFSC Code</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ABCD0123456"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                      pattern="^[A-Za-z]{4}0[A-Za-z0-9]{6}$"
                      required
                    />
                    <small className="form-text text-muted">
                      Format: ABCD0123456
                    </small>
                  </div>
                  <button 
                    className="btn btn-primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Verify Account'}
                  </button>
                </form>
              )}

              {step === 3 && (
                <div className="text-center">
                  {result?.overall_status ? (
                    <div className="alert alert-success">
                        Verification Successful! 
                      {/* <p>PAN: {result.pan_details}</p>
                      <p>Account: {result.account_details}</p> */}
                    </div>
                  ) : (
                    <div className="alert alert-danger">
                        Verification Failed
                      <p>{result?.error}</p>
                      <button 
                        className="btn btn-warning"
                        onClick={() => setStep(1)}
                      >
                        Retry KYC
                      </button>
                    </div>
                  )}
                  <button 
                    className="btn btn-secondary mt-3"
                    onClick={() => navigate('/dashboard')}
                  >
                    Return to Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KYC;