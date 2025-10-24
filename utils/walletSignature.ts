import { Wallet } from '../types';

/**
 * Request signature from user's wallet for a transaction
 * This is only required when authType is 'wallet' (user connected their own wallet)
 * Custodial wallets don't require user signatures
 */
export interface TransactionDetails {
  amount: number;
  token: 'usdc' | 'idrx' | 'eth';
  type: 'save' | 'withdraw';
  timestamp: number;
}

export interface SignatureRequest {
  wallet: Wallet;
  transaction: TransactionDetails;
}

export interface SignatureResult {
  success: boolean;
  signature?: string;
  error?: string;
}

/**
 * Request user to sign a transaction with their wallet
 * In production, this would integrate with wallet providers like WalletConnect or MetaMask
 */
export async function requestWalletSignature(
  request: SignatureRequest
): Promise<SignatureResult> {
  const { wallet, transaction } = request;

  // Check if wallet requires signature (only for 'wallet' auth type)
  if (wallet.authType === 'custodial') {
    // Custodial wallets don't require user signature
    return {
      success: true,
      signature: 'custodial-auto-signed',
    };
  }

  // For wallet auth type, request signature from user
  try {
    // In production, this would:
    // 1. Connect to the user's wallet provider (WalletConnect, MetaMask, etc.)
    // 2. Create a typed message with transaction details
    // 3. Request the user to sign it
    // 4. Return the signature

    // For now, simulate the signature request
    const message = createSignatureMessage(transaction);

    // Simulate user signing (in production, use wallet.signMessage or similar)
    // This would open the user's wallet app/extension to approve
    console.log('Requesting signature for:', message);

    // Simulate a delay for user interaction
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate a mock signature (in production, this comes from the wallet)
    const signature = `0x${Math.random().toString(16).slice(2)}`;

    return {
      success: true,
      signature,
    };
  } catch (error) {
    console.error('Signature request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Signature request failed',
    };
  }
}

/**
 * Create a human-readable message for the user to sign
 */
function createSignatureMessage(transaction: TransactionDetails): string {
  const { amount, token, type, timestamp } = transaction;
  const date = new Date(timestamp).toLocaleString();

  return `
StackSave Transaction Signature

Action: ${type === 'save' ? 'Save Funds' : 'Withdraw Funds'}
Amount: ${amount} ${token.toUpperCase()}
Date: ${date}

By signing this message, you authorize StackSave to process this transaction on your behalf.

Wallet Address: ${transaction}
  `.trim();
}

/**
 * Check if a payment method requires wallet signature
 */
export function requiresSignature(
  wallet: Wallet | null,
  paymentMethod: string
): boolean {
  if (!wallet) return false;

  // Only crypto payment methods require signatures
  const cryptoMethods = ['usdc', 'idrx', 'eth'];
  const isCryptoPayment = cryptoMethods.includes(paymentMethod.toLowerCase());

  // Only require signature if using wallet auth AND crypto payment
  return wallet.authType === 'wallet' && isCryptoPayment;
}

/**
 * Show a user-friendly explanation of why signature is needed
 */
export function getSignatureExplanation(token: string): string {
  return `This transaction requires your signature because you're using your own wallet. This ensures that only you can authorize transfers of your ${token.toUpperCase()} tokens.`;
}
