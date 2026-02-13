import React, { useState, useRef } from 'react';
import './FinancingReview.css';
import axios from 'axios';
import ApprovalDonutChart from './ApprovalDonutChart';
import ChatBot from './Chatbot';
const FinancingReview = () => {
    const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    annualIncome: '',
    loanAmount: '',
    creditScore: '',
    loanTerm: '',
    apr: '',
    downPayment: ''
  });
      const [isChatOpen, setIsChatOpen] = useState(false); // Add this new state

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const summaryRef = useRef(null);



  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setLoading(true);
    setError(null);

   try {
          // Concatenate address fields
      const fullAddress = [
        formData.address,
        formData.city,
        formData.state,
        formData.zipCode
      ].filter(Boolean).join(', ');

      const response = await axios.post(
        'http://127.0.0.1:5000/api/finance-application/analyse',
        {
          address: fullAddress,
          credit_score: formData.creditScore,
          income: formData.annualIncome,
          loan_amount: formData.loanAmount,
          loan_term: formData.loanTerm,
          apr: formData.apr,
          down_payment: formData.downPayment
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      setAnalysisResult(response.data.response);
      console.log('API Response:', response.data.response);

        // Scroll to the summary
        setTimeout(() => {
            if (summaryRef.current) {
                summaryRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
      
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="financing-review">
      <header className="header">
        <span>
            <img id="cosworth-subnav-amazon-autos-logo" alt="" src="https://m.media-amazon.com/images/G/01/cosworth-discovery/AmazonAutosLogoNew.svg"/>
        </span>
      </header>

        {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="financing-form">
        <div className="form-container">
          <div className="left-column">
            <h2>Review your financing plan before continuing to a credit application</h2>

            {/* Address Section */}
            <div className="form-section">
              <h3>Current address</h3>
              <div className="input-group">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street Address"
                  className="full-width"
                  required
                />
                <div className="address-details">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    required
                  />
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="ZIP Code"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="finance-inputs">
                <div className="input-group">
                  <label>Annual Income ($)</label>
                  <input
                    type="number"
                    name="annualIncome"
                    value={formData.annualIncome}
                    onChange={handleInputChange}
                    placeholder="Annual Income"
                    required
                />
                </div>
                <div className="input-group">
                  <label>Loan Amount ($)</label>
                <input
                    type="number"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleInputChange}
                    placeholder="Loan Amount"
                    required
                />
                </div>
                <div className='input-group'>
                    <label>Credit Score</label>
                <select
                    name="creditScore"
                    value={formData.creditScore}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Choose here</option>
                    <option value="(750+)">Excellent (750+)</option>
                    <option value="(700-749)">Good (700-749)</option>
                    <option value="(640-699)">Fair (640-699)</option>
                    <option value="(639 or less)">Poor (639 or less)</option>
                </select>
                </div>
            </div>
            </div>

            {/* Finance Terms Section */}
            <div className="form-section">
              <h3>Finance terms</h3>
              <div className="finance-inputs">
                <div className="input-group">
                  <label>Loan Term (months)</label>
                  <input
                    type="number"
                    name="loanTerm"
                    value={formData.loanTerm}
                    onChange={handleInputChange}
                    placeholder='Loan Term'
                    required
                  />
                </div>
                <div className="input-group">
                  <label>APR (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="apr"
                    value={formData.apr}
                    onChange={handleInputChange}
                    placeholder='APR'
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Down Payment ($)</label>
                  <input
                    type="number"
                    name="downPayment"
                    value={formData.downPayment}
                    onChange={handleInputChange}
                    placeholder='Down Payment'
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="continue-button">{loading ? 'Processing...' : 'Analyse credit application'}</button>
        </div>
      </form>

      {analysisResult && (
        <div className="summary-box" ref={summaryRef}>
          <ApprovalDonutChart approval_chance={analysisResult.approval_chance} />

          <div className='suggestion-box'>
            <strong>Reasons:</strong>
            <ul>
              {analysisResult.reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>

          <div className='suggestion-box'>
            <strong>Suggestions:</strong>
            <ul>
              {analysisResult.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

<button 
                className="chat-toggle-button"
                onClick={() => setIsChatOpen(!isChatOpen)}
            >
                {isChatOpen ? '✕' : '💬'}
            </button>

            {isChatOpen && (
                <div className="chat-popup">
                    <ChatBot formData={formData} />
                </div>
            )}

    </div>
  );
};

export default FinancingReview;