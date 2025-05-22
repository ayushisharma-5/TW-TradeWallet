import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import '../../styles/Portfolio.css';
import '../../styles/Investment.css';

const Portfolio = ({ user }) => {
    const [portfolios, setPortfolios] = useState([]);
    const [selectedPortfolio, setSelectedPortfolio] = useState(null);
    const [investments, setInvestments] = useState([]);
    const [sellModal, setSellModal] = useState(null);
    const [sellData, setSellData] = useState({ quantity: '', price: '' });
    const [sellLoading, setSellLoading] = useState(false);
    
    // New Portfolio Creation State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createPortfolioData, setCreatePortfolioData] = useState({
        name: '',
        strategy: ''
    });
    const [createLoading, setCreateLoading] = useState(false);

    // Available strategies for portfolio creation
    const [availableStrategies] = useState([
        { value: 'real_estate', label: 'Real Estate' },
        { value: 'ai_equity', label: 'AI Equity' },
        { value: 'growth_equity', label: 'Growth Equity' },
        { value: 'growth', label: 'Growth' },
        { value: 'value', label: 'Value' },
        { value: 'income', label: 'Income' },
        { value: 'balanced', label: 'Balanced' },
        { value: 'aggressive_growth', label: 'Aggressive Growth' },
        { value: 'conservative', label: 'Conservative' },
        { value: 'dividend_focused', label: 'Dividend Focused' },
        { value: 'index_tracking', label: 'Index Tracking' }
    ]);

    useEffect(() => {
        loadPortfolios();
    }, [user]);

    const loadUserBalance = async () => {
        try {
            // Try different possible user ID field names
            const userId = user.userId || user.id || user.user_id;
            console.log('Attempting to load balance for user ID:', userId);
            
            if (!userId) {
                console.error('No user ID found in user object:', user);
                return;
            }
            
            const response = await fetch(`http://127.0.0.1:5000/user/balance/${userId}`);
            console.log('Balance API response status:', response.status);
            
            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: "Unknown error" }));
                console.error(`Failed to get user balance: ${error.message || error.error}`);
            } else {
                const data = await response.json();
                console.log('Balance API response data:', data);
                setUserBalance(data.balance || 0);
            }
        } catch (err) {
            console.error(`Failed to get user balance: ${err.message}`);
        }
    };

    const loadTotalInvestmentValue = async () => {
        try {
            // Get all portfolios for the user
            const userId = user.userId || user.id || user.user_id;
            if (!userId) return;
            
            const portfoliosResponse = await fetch(`http://127.0.0.1:5000/portfolio/get-all/${userId}`);
            if (!portfoliosResponse.ok) return;
            
            const portfoliosData = await portfoliosResponse.json();
            let totalValue = 0;

            // For each portfolio, get investments and calculate total value
            for (const portfolio of portfoliosData) {
                try {
                    const investmentsResponse = await fetch(`http://127.0.0.1:5000/investment/get-all/${portfolio.id}`);
                    if (investmentsResponse.ok) {
                        const investmentsData = await investmentsResponse.json();
                        const portfolioValue = investmentsData.reduce((sum, inv) => {
                            return sum + (inv.price * inv.quantity || 0);
                        }, 0);
                        totalValue += portfolioValue;
                    }
                } catch (err) {
                    console.error(`Error loading investments for portfolio ${portfolio.id}:`, err);
                }
            }
            
            setTotalInvestmentValue(totalValue);
        } catch (err) {
            console.error(`Failed to calculate total investment value: ${err.message}`);
        }
    };
    const loadPortfolios = async () => {
        try {
            const userId = user.userId || user.id || user.user_id;
            if (!userId) {
                console.error('No user ID found for loading portfolios');
                return;
            }
            
            const url = `http://127.0.0.1:5000/portfolio/get-all/${userId}`;
            const res = await fetch(url);
            if (!res.ok) {
                const error = await res.json().catch(() => ({ error: "Unknown error" }));
                toast.error(`Failed to get portfolios: ${error.message || error.error}`);
            } else {
                const data = await res.json();
                setPortfolios(data);
            }
        } catch (err) {
            toast.error(`Failed to get portfolios: ${err.message}`);
        }
    };

    const formatStrategy = (strategy) =>
        strategy.split('_').map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(' ');

    const handleShowInvestments = (portfolio) => {
        const url = `http://127.0.0.1:5000/investment/get-all/${portfolio.id}`;
        fetch(url)
            .then(async (res) => {
                if (!res.ok) {
                    const error = await res.json().catch(() => ({ error: "Unknown error" }));
                    toast.error(`Failed to get investments: ${error.message || error.error}`);
                } else {
                    const data = await res.json();
                    setSelectedPortfolio(portfolio);
                    setInvestments(data);
                }
            })
            .catch(err => toast.error(`Error fetching investments: ${err.message}`));
    };

    // Enhanced Sell with Modal and Validation (REQUIREMENT 2)
    const handleSellClick = (investment) => {
        setSellModal(investment);
        setSellData({ quantity: '', price: '' });
    };

    const handleSellInvestment = async () => {
        const quantity = parseInt(sellData.quantity);
        const price = parseFloat(sellData.price);

        // REQUIREMENT 2.1: Error handling - prevent selling more than owned
        if (quantity > sellModal.quantity) {
            toast.error(`Cannot sell ${quantity} shares. You only own ${sellModal.quantity} shares of ${sellModal.ticker}.`);
            return;
        }

        if (isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
            toast.error('Invalid quantity or price.');
            return;
        }

        setSellLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:5000/investment/sell', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ investmentId: sellModal.id, qty: quantity, price })
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({ message: 'Unknown error' }));
                toast.error(`Sell failed: ${data.message}`);
            } else {
                toast.success(`Successfully sold ${quantity} shares of ${sellModal.ticker} at ${price.toFixed(2)} each!`);
                setSellModal(null);
                setSellData({ quantity: '', price: '' });
                handleShowInvestments(selectedPortfolio); // Refresh investments
                
                // Refresh balance and total investment value after selling
                loadUserBalance();
                loadTotalInvestmentValue();
            }
        } catch (err) {
            toast.error(`Sell request error: ${err.message}`);
        } finally {
            setSellLoading(false);
        }
    };

    // NEW FEATURE: Create Portfolio
    const handleCreatePortfolio = async (e) => {
        e.preventDefault();
        
        const { name, strategy } = createPortfolioData;
        
        if (!name || !strategy) {
            toast.error('Please fill in all fields.');
            return;
        }

        if (name.length < 3) {
            toast.error('Portfolio name must be at least 3 characters long.');
            return;
        }

        setCreateLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:5000/portfolio/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.userId,
                    name: name.trim(),
                    strategy: strategy
                })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Failed to create portfolio' }));
                throw new Error(error.error || error.message || 'Unknown error');
            }

            const result = await response.json();
            toast.success(`Portfolio "${name}" created successfully!`);
            
            // Reset form and close modal
            setCreatePortfolioData({ name: '', strategy: '' });
            setShowCreateModal(false);
            
            // Reload portfolios to show the new one
            loadPortfolios();
            
        } catch (err) {
            toast.error(`Failed to create portfolio: ${err.message}`);
        } finally {
            setCreateLoading(false);
        }
    };

    const handleCreateModalClose = () => {
        setShowCreateModal(false);
        setCreatePortfolioData({ name: '', strategy: '' });
    };

    return (
        <div className="portfolio-container">
            {/* Header with Create Portfolio Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>User Portfolios</h1>
                <button
                    className="portfolio-button"
                    onClick={() => setShowCreateModal(true)}
                    style={{
                        backgroundColor: '#28a745',
                        fontSize: '1rem',
                        padding: '0.75rem 1.5rem'
                    }}
                >
                    + Create New Portfolio
                </button>
            </div>

            {/* Existing Portfolios Display */}
            <div className="portfolio-content">
                {portfolios.length > 0 ? (
                    portfolios.map((portfolio) => (
                        <div className="portfolio-card" key={portfolio.id}>
                            <h2>{portfolio.name}</h2>
                            <p><strong>Strategy:</strong> {formatStrategy(portfolio.strategy)}</p>
                            <button
                                className="portfolio-button"
                                onClick={() => handleShowInvestments(portfolio)}
                            >
                                Show Investments
                            </button>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
                        <h3>No portfolios found</h3>
                        <p>Create your first portfolio to start investing!</p>
                        <button
                            className="portfolio-button"
                            onClick={() => setShowCreateModal(true)}
                            style={{ backgroundColor: '#007bff', marginTop: '1rem' }}
                        >
                            Create Your First Portfolio
                        </button>
                    </div>
                )}
            </div>

            {/* Investments Display - REMOVED PURCHASE BUTTON */}
            <h1>Investments</h1>
            {selectedPortfolio && investments.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px', margin: '1rem 0' }}>
                    <p>No investments in <strong>{selectedPortfolio.name}</strong>.</p>
                    <p style={{ color: '#6c757d', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                        Go to the <strong>Market</strong> tab to purchase investments for this portfolio.
                    </p>
                </div>
            )}
            {investments.length > 0 && (
                <div className="investments-container">
                    {/* Portfolio Summary */}
                    <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                        <strong>Portfolio: {selectedPortfolio.name}</strong> - {formatStrategy(selectedPortfolio.strategy)}
                        <div style={{ fontSize: '0.9rem', color: '#1976d2', marginTop: '0.5rem' }}>
                            Total Investments: {investments.length} | 
                            Total Value: ${investments.reduce((total, inv) => total + (inv.price * inv.quantity || 0), 0).toFixed(2)}
                        </div>
                    </div>

                    <table className="investments-table">
                        <thead>
                            <tr>
                                <th>Portfolio</th>
                                <th>Ticker</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total Value</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {investments.map((inv) => (
                                <tr key={inv.id}>
                                    <td>{selectedPortfolio.name}</td>
                                    <td><strong>{inv.ticker}</strong></td>
                                    <td>${inv.price?.toFixed(2) ?? 'N/A'}</td>
                                    <td>{inv.quantity}</td>
                                    <td style={{ fontWeight: 'bold', color: '#28a745' }}>
                                        ${inv.price && inv.quantity ? (inv.price * inv.quantity).toFixed(2) : 'N/A'}
                                    </td>
                                    <td>{inv.date ? new Date(inv.date).toLocaleDateString() : 'N/A'}</td>
                                    <td>
                                        <button
                                            className="portfolio-button"
                                            onClick={() => handleSellClick(inv)}
                                            style={{ backgroundColor: '#dc3545' }}
                                        >
                                            Sell
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create Portfolio Modal */}
            {showCreateModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        maxWidth: '500px',
                        width: '90%',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ margin: 0 }}>Create New Portfolio</h2>
                            <button
                                onClick={handleCreateModalClose}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    color: '#6c757d'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                Portfolio Name: <span style={{ color: '#dc3545' }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={createPortfolioData.name}
                                onChange={(e) => setCreatePortfolioData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter portfolio name (e.g., 2025 Tech Growth)"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '1rem'
                                }}
                                maxLength={50}
                            />
                            <small style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                                Minimum 3 characters, maximum 50 characters
                            </small>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                Investment Strategy: <span style={{ color: '#dc3545' }}>*</span>
                            </label>
                            <select
                                value={createPortfolioData.strategy}
                                onChange={(e) => setCreatePortfolioData(prev => ({ ...prev, strategy: e.target.value }))}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="">Select a strategy...</option>
                                {availableStrategies.map(strategy => (
                                    <option key={strategy.value} value={strategy.value}>
                                        {strategy.label}
                                    </option>
                                ))}
                            </select>
                            <small style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                                Choose an investment strategy that matches your goals
                            </small>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={handleCreateModalClose}
                                className="portfolio-button"
                                style={{
                                    backgroundColor: '#6c757d'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreatePortfolio}
                                disabled={createLoading || !createPortfolioData.name.trim() || !createPortfolioData.strategy}
                                className="portfolio-button"
                                style={{
                                    backgroundColor: createLoading ? '#ccc' : '#28a745',
                                    cursor: createLoading ? 'not-allowed' : 'pointer',
                                    opacity: (!createPortfolioData.name.trim() || !createPortfolioData.strategy) ? 0.5 : 1
                                }}
                            >
                                {createLoading ? 'Creating...' : 'Create Portfolio'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Sell Modal */}
            {sellModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        maxWidth: '400px',
                        width: '90%',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginBottom: '1rem' }}>Sell {sellModal.ticker}</h3>
                        <p><strong>Available shares:</strong> {sellModal.quantity}</p>
                        <p><strong>Current price:</strong> ${sellModal.price?.toFixed(2)}</p>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                Quantity to sell:
                            </label>
                            <input
                                type="number"
                                max={sellModal.quantity}
                                min="1"
                                value={sellData.quantity}
                                onChange={(e) => setSellData(prev => ({ ...prev, quantity: e.target.value }))}
                                style={{ 
                                    width: '100%', 
                                    padding: '0.5rem', 
                                    border: '1px solid #ddd', 
                                    borderRadius: '4px' 
                                }}
                                placeholder="Enter quantity"
                            />
                        </div>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                Sell price per share:
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={sellData.price}
                                onChange={(e) => setSellData(prev => ({ ...prev, price: e.target.value }))}
                                style={{ 
                                    width: '100%', 
                                    padding: '0.5rem', 
                                    border: '1px solid #ddd', 
                                    borderRadius: '4px' 
                                }}
                                placeholder="Enter price"
                            />
                        </div>

                        {sellData.quantity && sellData.price && (
                            <div style={{ 
                                backgroundColor: '#f0f8ff', 
                                padding: '1rem', 
                                borderRadius: '4px', 
                                marginBottom: '1rem',
                                textAlign: 'center'
                            }}>
                                <strong>Total proceeds: ${(parseFloat(sellData.price || 0) * parseInt(sellData.quantity || 0)).toFixed(2)}</strong>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setSellModal(null)}
                                className="portfolio-button"
                                style={{
                                    backgroundColor: '#6c757d'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSellInvestment}
                                disabled={sellLoading || !sellData.quantity || !sellData.price}
                                className="portfolio-button"
                                style={{
                                    backgroundColor: sellLoading ? '#ccc' : '#dc3545',
                                    cursor: sellLoading ? 'not-allowed' : 'pointer',
                                    opacity: (!sellData.quantity || !sellData.price) ? 0.5 : 1
                                }}
                            >
                                {sellLoading ? 'Selling...' : 'Confirm Sale'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <ToastContainer />
        </div>
    );
};

export default Portfolio;