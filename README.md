# Land Profile Management (Quản Lý Hồ Sơ Đất Đai)

A blockchain-based system for managing land profiles, land transfers, and ownership records securely using **Hyperledger Fabric**. This application provides a transparent, immutable, and decentralized way to digitize land registry, ensuring that all records of land ownership and transfers are tamper-proof and easily verifiable.

## 🌟 Key Features

- **Decentralized Land Registry**: Immutable storage of land profiles using blockchain technology.
- **Land Transfer Management (Chuyển nhượng)**: Secure and transparent execution of land transfer workflows between parties.
- **Account Management**: Role-based access control and identity management for different system users (citizens, government officials, etc.).
- **Audit & History**: Track the complete history of land ownership and modifications.
- **RESTful API**: A robust Node.js backend acting as a bridge between the frontend application and the Hyperledger Fabric network.
- **Interactive Dashboard**: A responsive React.js frontend for users to interact with the system, view their properties, and initiate transfers.

## 🛠️ Technology Stack

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

## 📁 Project Structure

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

## 🚀 Getting Started

*(Instructions for setting up the local Hyperledger Fabric network, deploying the chaincode, and running the backend/frontend should be added here depending on your specific network configuration script)*

### Prerequisites
- Node.js (v14 or higher recommended)
- Docker & Docker Compose (for Hyperledger Fabric network)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd LandProfileManagement
   ```

2. **Setup Chaincode & Network:**
   - Refer to your Fabric network setup scripts to deploy the chaincode from the `chaincode/` directory.

3. **Run the Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. **Run the Frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 📄 License
This project is licensed under the MIT License.
