import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWalletAuth } from '../../lib/hooks/useWalletAuth';

export default function WalletButton() {
  // Initialize the hook to handle store updates
  useWalletAuth();
  
  return <ConnectButton />;
} 