import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import '../../styles/Portfolio.css';
import '../../styles/Investment.css';

const Portfolio = ({ user }) => {
    const [portfolios, setPortfolios] = useState([]);
    const [selectedPortfolio, setSelectedPortfolio] = useState(null);
    const [investments, setInvestments] = useState([]);

    useEffect(() => {
        const url = `http://127.0.0.1:5000/portfolio/get-all/${user.userId}`;
        fetch(url)
            .then(async (res) => {
                if (!res.ok) {
                    const error = await res.json().catch(() => ({ error: "Unknown error" }));
                    toast.error(`Failed to get portfolios: ${error.message || error.error}`);
                } else {
                    const data = await res.json();
                    setPortfolios(data);
                }
            })
            .catch(err => toast.error(`Failed to get portfolios: ${err.message}`));
    }, [user]);

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

    const handleSellInvestment = (investment) => {
        const investId = investment.id;
        const qty = parseInt(prompt(`Enter quantity to sell for ${investment.ticker}:`));
        const price = parseFloat(prompt(`Enter sale price:`));

        if (isNaN(qty) || qty <= 0 || isNaN(price) || price <= 0) {
            toast.error('Invalid quantity or price.');
            return;
        }

        fetch('http://127.0.0.1:5000/investment/sell', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ investmentId: investId, qty, price })
        })
            .then(async (res) => {
                if (!res.ok) {
                    const data = await res.json().catch(() => ({ message: 'Unknown error' }));
                    toast.error(`Sell failed: ${data.message}`);
                } else {
                    toast.success(`Sold ${qty} of ${investment.ticker} at ${price}`);
                    handleShowInvestments(selectedPortfolio);
                }
            })
            .catch(err => toast.error(`Sell request error: ${err.message}`));
    };

    const handlePurchaseInvestment = () => {
        if (!selectedPortfolio) {
            toast.error("Select a portfolio first to purchase an investment.");
            return;
        }

        const ticker = prompt("Enter the ticker symbol:");
        const price = parseFloat(prompt("Enter the purchase price:"));
        const quantity = parseInt(prompt("Enter the quantity:"));
        const dateInput = prompt("Enter the purchase date (YYYY-MM-DD):");
        const purchase_date = new Date(dateInput);

        if (!ticker || isNaN(price) || isNaN(quantity) || isNaN(purchase_date.getTime())) {
            toast.error("Invalid input for purchase.");
            return;
        }

        fetch('http://127.0.0.1:5000/investment/purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                portfolio_id: selectedPortfolio.id,
                ticker,
                price,
                quantity,
                purchase_date: purchase_date.toISOString().split("T")[0]
            })
        })
            .then(async (res) => {
                if (!res.ok) {
                    const data = await res.json().catch(() => ({ message: 'Unknown error' }));
                    toast.error(`Purchase failed: ${data.message}`);
                } else {
                    toast.success(`Purchased ${quantity} of ${ticker} at ${price}`);
                    handleShowInvestments(selectedPortfolio);
                }
            })
            .catch(err => toast.error(`Purchase request error: ${err.message}`));
    };

    return (
        <div className="portfolio-container">
            <h1>User Portfolios</h1>
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
                    <p>No portfolios found.</p>
                )}
            </div>

            {selectedPortfolio && (
                <div style={{ textAlign: "right", margin: "1rem 0" }}>
                    <button className="portfolio-button" onClick={handlePurchaseInvestment}>
                        Purchase Investment
                    </button>
                </div>
            )}

            <h1>Investments</h1>
            {selectedPortfolio && investments.length === 0 && (
                <p>No investments in <strong>{selectedPortfolio.name}</strong>.</p>
            )}
            {investments.length > 0 && (
                <div className="investments-container">
                    <table className="investments-table">
                        <thead>
                            <tr>
                                <th>Portfolio</th>
                                <th>Ticker</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {investments.map((inv) => (
                                <tr key={inv.id}>
                                    <td>{selectedPortfolio.name}</td>
                                    <td>{inv.ticker}</td>
                                    <td>{inv.price ?? 'N/A'}</td>
                                    <td>{inv.quantity}</td>
                                    <td>{inv.date ? new Date(inv.date).toUTCString() : 'N/A'}</td>
                                    <td>
                                        <button
                                            className="portfolio-button"
                                            onClick={() => handleSellInvestment(inv)}
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
            <ToastContainer />
        </div>
    );
};

export default Portfolio;
