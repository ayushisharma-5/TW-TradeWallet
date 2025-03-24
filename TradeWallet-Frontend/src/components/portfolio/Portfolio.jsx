import React from 'react';
import '../../styles/portfolio.css';

const Portfolio = () => {
    return (
        <div className="portfolio-container">
            <h1>My Portfolio</h1>
            <div className="portfolio-content">
                <div className="portfolio-card">
                    <h2>Stock Holdings</h2>
                    <p>Here you can view your current stock holdings and their performance.</p>
                    <button className="portfolio-button">View Details</button>
                </div>
                <div className="portfolio-card">
                    <h2>Transaction History</h2>
                    <p>Review your past transactions and trading activity.</p>
                    <button className="portfolio-button">View History</button>
                </div>
                <div className="portfolio-card">
                    <h2>Analytics</h2>
                    <p>Access detailed analytics and insights about your portfolio.</p>
                    <button className="portfolio-button">View Analytics</button>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;