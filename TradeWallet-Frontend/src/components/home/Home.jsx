import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import '../../styles/Home.css';

const Home = ({ user, onLogout }) => {
    const [userBalance, setUserBalance] = useState(0);
    const [totalInvestmentValue, setTotalInvestmentValue] = useState(0);
    const [portfolioCount, setPortfolioCount] = useState(0);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        if (user) {
            loadFinancialSummary();
            loadRecentActivity();
        }
    }, [user]);

    const loadFinancialSummary = async () => {
        try {
            // Load user balance
            const userId = user.userId || user.id || user.user_id;
            if (userId) {
                await Promise.all([
                    loadUserBalance(userId),
                    loadTotalInvestmentValue(userId),
                    loadPortfolioCount(userId)
                ]);
            }
        } catch (err) {
            console.error('Failed to load financial summary:', err);
        }
    };

    const loadUserBalance = async (userId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/user/balance/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setUserBalance(data.balance || 0);
            }
        } catch (err) {
            console.error('Failed to load user balance:', err);
        }
    };

    const loadTotalInvestmentValue = async (userId) => {
        try {
            const portfoliosResponse = await fetch(`http://127.0.0.1:5000/portfolio/get-all/${userId}`);
            if (!portfoliosResponse.ok) return;
            
            const portfoliosData = await portfoliosResponse.json();
            setPortfolioCount(portfoliosData.length);
            let totalValue = 0;

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
            console.error('Failed to calculate total investment value:', err);
        }
    };

    const loadPortfolioCount = async (userId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/portfolio/get-all/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setPortfolioCount(data.length);
            }
        } catch (err) {
            console.error('Failed to load portfolio count:', err);
        }
    };

    const loadRecentActivity = async () => {
        // Mock recent activity - you can implement this based on your needs
        setRecentActivity([
            { type: 'purchase', ticker: 'AAPL', quantity: 10, price: 185.43, date: '2025-01-15' },
            { type: 'sale', ticker: 'GOOGL', quantity: 2, price: 2850.00, date: '2025-01-12' },
            { type: 'purchase', ticker: 'TSLA', quantity: 5, price: 698.12, date: '2025-01-10' }
        ]);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="home-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Welcome Header */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '2rem',
                padding: '1.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #dee2e6'
            }}>
                <div>
                    <h1 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
                        Welcome to TradeWallet, {user?.username || 'Investor'}!
                    </h1>
                    <p style={{ margin: 0, color: '#6c757d', fontSize: '1.1rem' }}>
                        Your comprehensive investment portfolio dashboard
                    </p>
                </div>
                <button
                    onClick={onLogout}
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    Logout
                </button>
            </div>

            {/* Financial Summary Dashboard */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '1.5rem', 
                marginBottom: '3rem' 
            }}>
                {/* Available Balance Card */}
                <div style={{
                    backgroundColor: '#e8f5e8',
                    border: '2px solid #28a745',
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ fontSize: '1rem', color: '#155724', marginBottom: '0.5rem', fontWeight: '600' }}>
                        💰 Available Balance
                    </div>
                    <div style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: 'bold', 
                        margin: '0.5rem 0', 
                        color: '#28a745' 
                    }}>
                        {formatCurrency(userBalance)}
                    </div>
                    <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                        Cash available for investment
                    </div>
                </div>

                {/* Total Investment Value Card */}
                <div style={{
                    backgroundColor: '#e3f2fd',
                    border: '2px solid #007bff',
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ fontSize: '1rem', color: '#004085', marginBottom: '0.5rem', fontWeight: '600' }}>
                        📈 Total Investment Value
                    </div>
                    <div style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: 'bold', 
                        margin: '0.5rem 0', 
                        color: '#007bff' 
                    }}>
                        {formatCurrency(totalInvestmentValue)}
                    </div>
                    <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                        Current value of all investments
                    </div>
                </div>

                {/* Total Portfolio Value Card */}
                <div style={{
                    backgroundColor: '#fff3cd',
                    border: '2px solid #ffc107',
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ fontSize: '1rem', color: '#856404', marginBottom: '0.5rem', fontWeight: '600' }}>
                        🎯 Total Portfolio Value
                    </div>
                    <div style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: 'bold', 
                        margin: '0.5rem 0', 
                        color: '#856404' 
                    }}>
                        {formatCurrency(userBalance + totalInvestmentValue)}
                    </div>
                    <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                        Balance + Investments
                    </div>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1rem', 
                marginBottom: '3rem' 
            }}>
                <div style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6f42c1' }}>
                        {portfolioCount}
                    </div>
                    <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                        Active Portfolios
                    </div>
                </div>

                <div style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#17a2b8' }}>
                        {((totalInvestmentValue / (userBalance + totalInvestmentValue)) * 100).toFixed(1)}%
                    </div>
                    <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                        Investment Allocation
                    </div>
                </div>

                <div style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fd7e14' }}>
                        {recentActivity.length}
                    </div>
                    <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                        Recent Transactions
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div style={{
                backgroundColor: 'white',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '2rem',
                marginBottom: '2rem'
            }}>
                <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>Recent Activity</h2>
                {recentActivity.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recentActivity.map((activity, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '6px',
                                border: '1px solid #e9ecef'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: activity.type === 'purchase' ? '#28a745' : '#dc3545'
                                    }}></div>
                                    <div>
                                        <strong>{activity.type === 'purchase' ? 'Purchased' : 'Sold'}</strong> {activity.quantity} shares of <strong>{activity.ticker}</strong>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 'bold' }}>
                                        {formatCurrency(activity.price * activity.quantity)}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                                        {formatDate(activity.date)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: '#6c757d' }}>No recent activity to display.</p>
                )}
            </div>

            {/* Quick Actions */}
            <div style={{
                backgroundColor: 'white',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '2rem'
            }}>
                <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>Quick Actions</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <button style={{
                        padding: '1rem',
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500'
                    }}>
                        🏠 Home Dashboard
                    </button>
                    <button style={{
                        padding: '1rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500'
                    }}>
                        📊 View Portfolios
                    </button>
                    <button style={{
                        padding: '1rem',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500'
                    }}>
                        🛒 Browse Market
                    </button>
                    <button style={{
                        padding: '1rem',
                        backgroundColor: '#6f42c1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500'
                    }}>
                        ➕ Create Portfolio
                    </button>
                </div>
            </div>
        </div>
    );
};

Home.propTypes = {
    user: PropTypes.object.isRequired,
    onLogout: PropTypes.func.isRequired, // Fixed: should be func, not object
};

export default Home;