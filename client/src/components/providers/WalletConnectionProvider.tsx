import React, { useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

const WalletConnectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // const network = WalletAdapterNetwork.Devnet;

  // const endpoint = useMemo(() => {
  //   if (network === WalletAdapterNetwork.Devnet) {
  //     return clusterApiUrl(network);
  //   }

  //   return clusterApiUrl(network);
  // }, [network]);

  // const wallets = useMemo(
  //   () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
  //   [network]
  // );

  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletConnectionProvider;
