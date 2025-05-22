import '../../styles/market.css';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// REQUIREMENT 3: Market Component - Purchase New Investments Only
const Market = ({ user }) => {
  // State Management
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState('');
  const [purchaseForm, setPurchaseForm] = useState({
    ticker: '',
    price: '',
    quantity: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedStocks, setSelectedStocks] = useState([]);

  // Mock Market Data - REQUIREMENT 3.1: Market tab in UI
  const [availableStocks] = useState([
    { ticker: 'AAPL', name: 'Apple Inc.', currentPrice: 185.43, sector: 'Technology' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', currentPrice: 2847.52, sector: 'Technology' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.', currentPrice: 3442.78, sector: 'E-commerce' },
    { ticker: 'MSFT', name: 'Microsoft Corp.', currentPrice: 334.89, sector: 'Technology' },
    { ticker: 'TSLA', name: 'Tesla Inc.', currentPrice: 698.12, sector: 'Automotive' },
    { ticker: 'META', name: 'Meta Platforms Inc.', currentPrice: 289.45, sector: 'Social Media' },
    { ticker: 'NFLX', name: 'Netflix Inc.', currentPrice: 449.87, sector: 'Entertainment' },
    { ticker: 'NVDA', name: 'NVIDIA Corp.', currentPrice: 789.23, sector: 'Semiconductors' }
  ]);

  // Load user portfolios on component mount
  useEffect(() => {
    loadUserPortfolios();
  }, [user]);

  const loadUserPortfolios = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/portfolio/get-all/${user.userId}`);
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to fetch portfolios' }));
        throw new Error(error.error || error.message);
      }
      const data = await response.json();
      setPortfolios(data);
      
      // Auto-select first portfolio if available
      if (data.length > 0 && !selectedPortfolioId) {
        setSelectedPortfolioId(data[0].id);
      }
    } catch (err) {
      toast.error(`Failed to load portfolios: ${err.message}`);
    }
  };

  // Handle stock selection from market list
  const handleStockSelect = (stock) => {
    setPurchaseForm(prev => ({
      ...prev,
      ticker: stock.ticker,
      price: stock.currentPrice.toString()
    }));
  };

  // Add stock to purchase basket
  const addToBasket = (stock) => {
    const quantity = prompt(`How many shares of ${stock.ticker} would you like to purchase?`);
    if (quantity && parseInt(quantity) > 0) {
      const newSelection = {
        ...stock,
        quantity: parseInt(quantity),
        totalCost: stock.currentPrice * parseInt(quantity)
      };
      
      setSelectedStocks(prev => {
        const existing = prev.find(s => s.ticker === stock.ticker);
        if (existing) {
          return prev.map(s => 
            s.ticker === stock.ticker 
              ? { ...s, quantity: s.quantity + parseInt(quantity), totalCost: s.currentPrice * (s.quantity + parseInt(quantity)) }
              : s
          );
        }
        return [...prev, newSelection];
      });
      toast.success(`Added ${quantity} shares of ${stock.ticker} to basket`);
    }
  };

  // Remove stock from basket
  const removeFromBasket = (ticker) => {
    setSelectedStocks(prev => prev.filter(s => s.ticker !== ticker));
    toast.info(`Removed ${ticker} from basket`);
  };

  // REQUIREMENT 3.2: Single purchase handler
  const handleSinglePurchase = async (e) => {
    e.preventDefault();
    
    if (!selectedPortfolioId) {
      toast.error('Please select a portfolio first.');
      return;
    }

    const { ticker, price, quantity } = purchaseForm;
    
    if (!ticker || !price || !quantity) {
      toast.error('Please fill in all fields.');
      return;
    }

    const numPrice = parseFloat(price);
    const numQuantity = parseInt(quantity);

    if (numPrice <= 0 || numQuantity <= 0) {
      toast.error('Price and quantity must be positive numbers.');
      return;
    }

    await executePurchase([{
      ticker,
      currentPrice: numPrice,
      quantity: numQuantity
    }]);
  };

  // REQUIREMENT 3.2 & 3.3: Execute purchase through backend endpoint
  const executePurchase = async (purchaseList) => {
    if (!selectedPortfolioId) {
      toast.error('Please select a portfolio first.');
      return;
    }

    setLoading(true);
    const successfulPurchases = [];
    const failedPurchases = [];

    try {
      // Process each purchase individually
      for (const item of purchaseList) {
        try {
          const response = await fetch('http://127.0.0.1:5000/investment/purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              portfolio_id: parseInt(selectedPortfolioId),
              ticker: item.ticker,
              price: item.currentPrice,
              quantity: item.quantity
            })
          });

          if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Purchase failed' }));
            throw new Error(error.error || error.message || 'Unknown error');
          }

          const result = await response.json();
          successfulPurchases.push({
            ticker: item.ticker,
            quantity: item.quantity,
            price: item.currentPrice,
            message: result.message || result
          });

        } catch (err) {
          failedPurchases.push({
            ticker: item.ticker,
            error: err.message
          });
        }
      }

      // Show results
      if (successfulPurchases.length > 0) {
        const successMessage = successfulPurchases
          .map(p => `${p.ticker}: ${p.quantity} shares at $${p.price}`)
          .join(', ');
        toast.success(`Successfully purchased: ${successMessage}`);
        
        // Clear forms after successful purchase
        setPurchaseForm({ ticker: '', price: '', quantity: '' });
        setSelectedStocks([]);
      }

      if (failedPurchases.length > 0) {
        const failMessage = failedPurchases
          .map(p => `${p.ticker}: ${p.error}`)
          .join('; ');
        toast.error(`Failed purchases: ${failMessage}`);
      }

    } catch (err) {
      toast.error(`Purchase error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchPurchase = () => {
    if (selectedStocks.length === 0) {
      toast.error('Please add some stocks to your purchase basket.');
      return;
    }
    executePurchase(selectedStocks);
  };

  const getTotalBasketCost = () => {
    return selectedStocks.reduce((total, stock) => total + stock.totalCost, 0).toFixed(2);
  };

  const getSinglePurchaseCost = () => {
    const price = parseFloat(purchaseForm.price || 0);
    const quantity = parseInt(purchaseForm.quantity || 0);
    return (price * quantity).toFixed(2);
  };

  return (
    <div className="portfolio-container">
      <h1>Market - Purchase New Investments</h1>
      
      {/* Portfolio Selection */}
      <div style={{ 
        marginBottom: '2rem', 
        padding: '1.5rem', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ marginBottom: '1rem', color: '#495057' }}>Select Portfolio for Investment</h3>
        <select
          value={selectedPortfolioId}
          onChange={(e) => setSelectedPortfolioId(e.target.value)}
          className="portfolio-button"
          style={{ 
            minWidth: '300px', 
            padding: '0.75rem',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '1rem'
          }}
        >
          <option value="">Choose a portfolio...</option>
          {portfolios.map(portfolio => (
            <option key={portfolio.id} value={portfolio.id}>
              {portfolio.name} ({portfolio.strategy?.replace('_', ' ') || 'No Strategy'})
            </option>
          ))}
        </select>
        {!selectedPortfolioId && (
          <p style={{ color: '#dc3545', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Please select a portfolio to enable purchasing
          </p>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Available Stocks Market View */}
        <div>
          <h2 style={{ marginBottom: '1rem', color: '#495057' }}>Available Stocks</h2>
          <div className="investments-container" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <table className="investments-table">
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Company</th>
                  <th>Price</th>
                  <th>Sector</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {availableStocks.map((stock) => (
                  <tr key={stock.ticker}>
                    <td><strong>{stock.ticker}</strong></td>
                    <td style={{ fontSize: '0.9rem' }}>{stock.name}</td>
                    <td style={{ color: '#28a745', fontWeight: 'bold' }}>
                      ${stock.currentPrice.toFixed(2)}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: '#6c757d' }}>{stock.sector}</td>
                    <td>
                      <button
                        onClick={() => handleStockSelect(stock)}
                        disabled={!selectedPortfolioId}
                        className="portfolio-button"
                        style={{ 
                          marginRight: '0.5rem',
                          padding: '0.4rem 0.8rem',
                          fontSize: '0.8rem',
                          opacity: selectedPortfolioId ? 1 : 0.5
                        }}
                      >
                        Select
                      </button>
                      <button
                        onClick={() => addToBasket(stock)}
                        disabled={!selectedPortfolioId}
                        className="portfolio-button"
                        style={{ 
                          backgroundColor: '#28a745',
                          padding: '0.4rem 0.8rem',
                          fontSize: '0.8rem',
                          opacity: selectedPortfolioId ? 1 : 0.5
                        }}
                      >
                        Add to Basket
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Purchase Interface */}
        <div>
          {/* Quick Purchase Form */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', color: '#495057' }}>Quick Purchase</h2>
            <div style={{ 
              border: '1px solid #dee2e6', 
              borderRadius: '8px', 
              padding: '1.5rem',
              backgroundColor: 'white'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Stock Ticker:
                </label>
                <input
                  type="text"
                  value={purchaseForm.ticker}
                  onChange={(e) => setPurchaseForm(prev => ({ ...prev, ticker: e.target.value.toUpperCase() }))}
                  placeholder="e.g., AAPL"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #ced4da', 
                    borderRadius: '4px' 
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Price per Share ($):
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={purchaseForm.price}
                  onChange={(e) => setPurchaseForm(prev => ({ ...prev, price: e.target.value }))}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #ced4da', 
                    borderRadius: '4px' 
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Quantity:
                </label>
                <input
                  type="number"
                  min="1"
                  value={purchaseForm.quantity}
                  onChange={(e) => setPurchaseForm(prev => ({ ...prev, quantity: e.target.value }))}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #ced4da', 
                    borderRadius: '4px' 
                  }}
                />
              </div>

              {purchaseForm.price && purchaseForm.quantity && (
                <div style={{ 
                  backgroundColor: '#e8f5e8', 
                  padding: '1rem', 
                  borderRadius: '4px', 
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  <strong style={{ fontSize: '1.1rem' }}>
                    Total Cost: ${getSinglePurchaseCost()}
                  </strong>
                </div>
              )}

              <button
                onClick={handleSinglePurchase}
                disabled={loading || !selectedPortfolioId || !purchaseForm.ticker || !purchaseForm.price || !purchaseForm.quantity}
                className="portfolio-button"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: loading ? '#6c757d' : '#007bff',
                  cursor: (loading || !selectedPortfolioId) ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  opacity: (!selectedPortfolioId || !purchaseForm.ticker || !purchaseForm.price || !purchaseForm.quantity) ? 0.5 : 1
                }}
              >
                {loading ? 'Processing...' : 'Purchase Now'}
              </button>
            </div>
          </div>

          {/* Purchase Basket */}
          <div>
            <h2 style={{ marginBottom: '1rem', color: '#495057' }}>Purchase Basket</h2>
            <div style={{ 
              border: '1px solid #dee2e6', 
              borderRadius: '8px', 
              backgroundColor: 'white',
              minHeight: '200px'
            }}>
              {selectedStocks.length === 0 ? (
                <div style={{ 
                  padding: '2rem', 
                  textAlign: 'center', 
                  color: '#6c757d' 
                }}>
                  No stocks in basket. Click "Add to Basket" to add stocks.
                </div>
              ) : (
                <>
                  <div style={{ padding: '1rem' }}>
                    {selectedStocks.map((stock) => (
                      <div key={stock.ticker} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '0.75rem',
                        borderBottom: '1px solid #e9ecef'
                      }}>
                        <div>
                          <strong>{stock.ticker}</strong>
                          <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                            {stock.quantity} shares × ${stock.currentPrice.toFixed(2)}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 'bold' }}>${stock.totalCost.toFixed(2)}</div>
                          <button
                            onClick={() => removeFromBasket(stock.ticker)}
                            className="portfolio-button"
                            style={{
                              backgroundColor: '#dc3545',
                              fontSize: '0.8rem',
                              padding: '0.25rem 0.5rem',
                              marginTop: '0.25rem'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ 
                    padding: '1rem',
                    borderTop: '2px solid #dee2e6',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <strong style={{ fontSize: '1.1rem' }}>Total Basket Cost:</strong>
                      <strong style={{ fontSize: '1.2rem', color: '#28a745' }}>
                        ${getTotalBasketCost()}
                      </strong>
                    </div>
                    
                    <button
                      onClick={handleBatchPurchase}
                      disabled={loading || !selectedPortfolioId}
                      className="portfolio-button"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: loading ? '#6c757d' : '#28a745',
                        cursor: (loading || !selectedPortfolioId) ? 'not-allowed' : 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        opacity: (!selectedPortfolioId) ? 0.5 : 1
                      }}
                    >
                      {loading ? 'Processing...' : 'Purchase All Items'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;