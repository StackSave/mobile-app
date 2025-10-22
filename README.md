# StackSave Mobile App

A simple crypto savings mobile app built with React Native, Expo, and TypeScript. This is a prototype with dummy data for the Base Sepolia testnet.

## Features

- **Daily Progress Widget** - Duolingo-style progress tracker showing daily money growth percentage
  - Circular progress ring with animated counters
  - Real-time growth percentage display
  - Money earned today with visual indicators
  - Integrated streak tracking
  - Motivational messages based on performance
- **Wallet Management** - View your testnet wallet address and balances
- **Dashboard** - Track total balance, staked amounts, and earnings
- **Save/Deposit** - Deposit USDC into DeFi strategies
- **Faucet** - Mint testnet USDC and get testnet ETH
- **Strategies** - Choose from Conservative, Balanced, or Aggressive yield strategies
- **Withdraw** - Unstake and withdraw funds anytime
- **Daily Streaks** - Track your saving consistency with streak badges

## Tech Stack

- **React Native** - Mobile app framework
- **Expo** - Development tooling and managed workflow
- **TypeScript** - Type-safe development
- **Expo Router** - File-based navigation
- **React Native Paper** - Material Design UI components
- **Context API** - State management

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Running the App

Start the development server:
```bash
npm start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan the QR code with Expo Go app on your phone

## Project Structure

```
stacksave-mobile/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── home.tsx       # Dashboard
│   │   ├── save.tsx       # Deposit screen
│   │   ├── faucet.tsx     # Faucet screen
│   │   ├── strategies.tsx # Strategies screen
│   │   └── withdraw.tsx   # Withdraw screen
│   ├── _layout.tsx        # Root layout with providers
│   └── index.tsx          # Welcome screen
├── components/            # Reusable UI components
│   ├── BalanceCard.tsx
│   ├── StrategyCard.tsx
│   └── StreakBadge.tsx
├── contexts/              # Context API providers
│   ├── WalletContext.tsx
│   ├── SavingsContext.tsx
│   └── StreakContext.tsx
├── constants/             # Dummy data and configuration
│   └── dummyData.ts
└── types/                 # TypeScript type definitions
    └── index.ts
```

## Usage Guide

### 1. Get Started
- Tap "Get Started" on the welcome screen

### 2. Mint Testnet Tokens
- Go to the Faucet tab
- Tap any amount to mint testnet USDC (100, 500, 1000, or 5000)
- Visit Coinbase Faucet to get testnet ETH (for gas fees)

### 3. Make Your First Deposit
- Go to the Save tab
- Enter an amount or tap a quick amount button
- The Conservative strategy is selected by default
- Tap "Deposit & Stake"

### 4. Choose a Strategy
- Go to the Strategies tab
- Review the three available strategies:
  - **Conservative** (5.5% APY) - Low risk
  - **Balanced** (8.2% APY) - Medium risk
  - **Aggressive** (12.5% APY) - High risk
- Tap to select your preferred strategy

### 5. Track Your Progress
- Go to the Home tab to see:
  - **Daily Progress Widget** - Shows your daily growth percentage with a beautiful circular progress ring
  - Daily earnings with animated counters
  - Growth percentage (green for positive, red for negative)
  - Total balance
  - Staked amount
  - Total earned
  - Daily streak progress

### 6. Withdraw Funds
- Go to the Withdraw tab
- Enter amount or use percentage buttons
- Tap "Withdraw" to get funds back instantly

## Dummy Data Features

This app uses simulated blockchain interactions:
- All transactions are instant (no real blockchain delays)
- Balances and earnings are calculated locally
- Network is set to Base Sepolia testnet
- No real money or crypto is used

## Next Steps

To integrate with real blockchain:
1. Install and configure wagmi/viem or ethers.js
2. Connect to actual Base Sepolia testnet
3. Integrate with smart contracts for deposits/withdrawals
4. Add real wallet connection (WalletConnect, Coinbase Wallet, etc.)
5. Implement actual DeFi strategy contracts
6. Add transaction confirmations and error handling

## Development

### Type Checking
```bash
npx tsc --noEmit
```

### Build
```bash
npm run android  # Build for Android
npm run ios      # Build for iOS
```

## License

0BSD
