import { useState } from 'react';
import '../../styles/market.css';

const Market = () => {
  const [stocks, setStocks] = useState([
    { ticker: 'AAPL', price: 150, quantity: '', selected: false },
    { ticker: 'GOOGL', price: 2800, quantity: '', selected: false },
    { ticker: 'AMZN', price: 3400, quantity: '', selected: false },
    { ticker: 'MSFT', price: 330, quantity: '', selected: false },
    { ticker: 'TSLA', price: 700, quantity: '', selected: false },
    { ticker: 'META', price: 290, quantity: '', selected: false },
    { ticker: 'NFLX', price: 450, quantity: '', selected: false },
  ]);

  const handleInputChange = (index, event) => {
    const newStocks = [...stocks];
    newStocks[index][event.target.name] = event.target.value;
    setStocks(newStocks);
  };

  const handleCheckboxChange = (index) => {
    const newStocks = [...stocks];
    newStocks[index].selected = !newStocks[index].selected;
    setStocks(newStocks);
  };

  const handleSubmit = () => {
    const selectedStocks = stocks.filter(
      (stock) => stock.selected && stock.quantity
    );

    if (selectedStocks.length === 0) {
      alert('Please select at least one stock and enter quantity.');
      return;
    }

    alert(
      `Submitting purchase order:\n${selectedStocks
        .map((s) => `${s.ticker} - ${s.quantity} shares`)
        .join('\n')}`
    );
  };

  const handleClear = () => {
    const confirmClear = window.confirm('Clear all selections and inputs?');
    if (!confirmClear) return;

    const newStocks = stocks.map((stock) => ({
      ...stock,
      quantity: '',
      selected: false,
    }));
    setStocks(newStocks);
  };

  const isSubmitDisabled = !stocks.some(
    (s) => s.selected && s.quantity && parseInt(s.quantity) > 0
  );

  return (
    <div className="market-container">
      <h1>The Market</h1>
      <table className="market-table">
        <thead>
          <tr>
            <th>Stock Ticker</th>
            <th>Price ($)</th>
            <th>Quantity</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, index) => (
            <tr key={stock.ticker}>
              <td>{stock.ticker}</td>
              <td>{stock.price}</td>
              <td>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={stock.quantity}
                  onChange={(event) => handleInputChange(index, event)}
                  disabled={!stock.selected}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={stock.selected}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="market-actions">
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
        >
          Submit Purchase Order
        </button>
        <button className="clear-btn" onClick={handleClear}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default Market;