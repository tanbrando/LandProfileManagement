# Land Profile Management

A blockchain-based system for managing land profiles, land transfers, and ownership records securely using **Hyperledger Fabric**. This application provides a transparent, immutable, and decentralized way to digitize land registry, ensuring that all records of land ownership and transfers are tamper-proof and easily verifiable.

## Key Features

- **Decentralized Land Registry**: Immutable storage of land profiles using blockchain technology.
- **Land Transfer Management**: Secure and transparent execution of land transfer workflows between parties.
- **Account Management**: Role-based access control and identity management for different system users (citizens, government officials, etc.).
- **Audit & History**: Track the complete history of land ownership and modifications.
- **RESTful API**: A robust Node.js backend acting as a bridge between the frontend application and the Hyperledger Fabric network.
- **Interactive Dashboard**: A responsive React.js frontend for users to interact with the system, view their properties, and initiate transfers.

## Technology Stack

### Blockchain (Smart Contracts / Chaincode)
- **Hyperledger Fabric** (v2.2.x)
- **Node.js Chaincode** (`fabric-contract-api`, `fabric-shim`)

### Backend Server
- **Node.js & Express.js**
- **Hyperledger Fabric SDK** (`fabric-network`, `fabric-ca-client`)
- **Authentication**: JWT (JSON Web Tokens)
- **Other Utilities**: `pdfkit` (PDF generation), `multer` (file uploads), `fast-csv`

### Frontend Application
- **React.js** (v18)
- **Styling**: React Bootstrap, Bootstrap 5
- **Data Visualization**: Recharts
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## Project Structure

```text
LandProfileManagement/
├── backend/            # Express.js REST API server & Fabric client
│   ├── config/         # Connection profiles and network configurations
│   ├── controllers/    # API endpoint controllers
│   ├── routes/         # Express route definitions
│   ├── services/       # Business logic and Fabric SDK interaction
│   └── ...
├── chaincode/          # Hyperledger Fabric Smart Contracts (Node.js)
│   ├── qlthongtindat.js # Land information management logic
│   ├── qlchuyennhuong.js # Land transfer logic
│   └── qltaikhoan.js   # Account management logic
└── frontend/           # React.js user interface
    ├── public/
    └── src/            # React components, pages, and API integration
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher recommended)
- Hyperledger Fabric network (`fabric-samples`) set up on VMHyperLedger
- Docker & Docker Compose
- Git

### 1. Installation & Preparation

**1.1 Prepare the project directory**
Extract and copy the `LandProfileManagement` folder into the `/fabric-samples/` directory on your VMHyperLedger, or clone the repository directly:
```bash
cd /fabric-samples/
git clone https://github.com/tanbrando/LandProfileManagement
```

**1.2 Chaincode Setup**
```bash
cd LandProfileManagement/chaincode
npm install
```

**1.3 Backend Setup**
```bash
cd ../backend
# Create .env based on the example format
cp config/.env.example config/.env 
# Note: Configure your Gmail account and App Password in the .env file for OTP emails
npm install
```

**1.4 Frontend Setup**
```bash
cd ../frontend
cp .env.example .env
npm install
```

### 2. Running the Application

**2.1 Start the Chaincode (Fabric Network)**
Navigate to the test-network directory and execute the network scripts:
```bash
cd /fabric-samples/test-network
./network.sh down
./network.sh up -ca
./network.sh createChannel
./network.sh deployCC -ccn qlthongtindat -ccp ../LandProfileManagement/chaincode -ccl javascript
```

**2.2 Start the Backend Server**
After successfully deploying the chaincode, initialize the identities and start the backend API:
```bash
cd /fabric-samples/LandProfileManagement/backend
node enrollAdmin.js
node registerUser.js
node server.js
```

**2.3 Start the Frontend Dashboard**
Finally, start the React frontend application:
```bash
cd /fabric-samples/LandProfileManagement/frontend
npm start
```

## 📄 License
This project is licensed under the MIT License.
