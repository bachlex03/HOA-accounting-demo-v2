import useProgram from "@/hooks/useProgram";
import getProvider from "@/infrastructure/utils/getProvider";
import type { PublicKey } from "@solana/web3.js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* eslint-disable @typescript-eslint/no-explicit-any */
const WithAuthHoc = (WrappedComponent: React.ComponentType<any>) => {
  const WithAuth = (props: any) => {
    console.log("WithAuthHoc");

    const navigate = useNavigate();
    const { disconnect, publicKey, connecting, connected } = useProgram();
    const provider = getProvider();

    // Handle navigation based on auth state - use useLayoutEffect to prevent flash
    useEffect(() => {
      if (!connecting) {
        if (connected && publicKey) {
          // Both connected and publicKey exist - navigate to accounting
          navigate("/renter/accounting");
        } else if (!publicKey) {
          // Not connected and no publicKey - navigate to sign-in
          navigate("/sign-in");
        }
      }
    }, [navigate, publicKey, connecting, connected]);

    useEffect(() => {
      if (provider) {
        // Store user's public key once they connect
        provider.on("connect", (publicKey: PublicKey) => {
          console.log("Connected public key:", publicKey.toBase58());
        });

        // Will either automatically connect to Phantom, or do nothing.
        provider
          .connect({ onlyIfTrusted: true })
          .then(({ publicKey }) => {
            // Handle successful eager connection
            console.log(`Eagerly connected to ${publicKey.toBase58()}`);
          })
          .catch(() => {
            // Handle connection failure as usual
            console.error("Failed to eagerly connect to Phantom wallet.");
          });

        // Handle account changes
        provider.on("accountChanged", (publicKey) => {
          if (publicKey) {
            console.log(`Switched to account ${publicKey.toBase58()}`);
            disconnect();
          }
        });
      }
    }, [disconnect, provider]);

    return <WrappedComponent {...props} />;
  };

  return WithAuth;
};

export default WithAuthHoc;
