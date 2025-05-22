# TW-TradeWallet

TW-TradeWallet is a web-based application designed to simplify and streamline trading operations. It features a modern frontend with a robust backend architecture to support a seamless user experience.

-- A Project by Ayushi, Sudhansh, Nivedita, Kuldeepsinhji

## Getting Started
To run the project locally, follow these steps:

### Prerequisites

- Node.js (v14+)
- Python 3.7+
- npm (v6+)
- Git
- [Optional] Virtual Environment (recommended for Python)

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/TW-TradeWallet.git
cd TW-TradeWallet


### 2. Start the Frontend : This will start the frontend server on http://localhost:5173
cd TradeWallet-Frontend
npm install
npm run dev


### 3. Start the Backend : This will start the backend server.
cd TW-TradeWallet
# [Optional] Create and activate a virtual environment
# python3 -m venv venv
# source venv/bin/activate

pip install -r requirements.txt
python3 -m app.main

#Access the Application

Open your browser and navigate to:
http://localhost:5173/


#Project Structure
TW-TradeWallet/
├── TradeWallet-Frontend/      # React or Vue frontend
│   └── ...
├── app/                       # Python backend (FastAPI/Flask/etc.)
│   └── main.py
├── requirements.txt
└── README.md

#Features
1. User authentication
2. Portfolio tracking
3. Trade execution and history
4. Responsive UI
5. RESTful API backend