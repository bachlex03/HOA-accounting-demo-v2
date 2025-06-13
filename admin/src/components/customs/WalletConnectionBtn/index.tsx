import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ChevronDown, Copy, LogOut, Wallet } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface WalletConnectionButtonProps {
  className?: string;
}

export const WalletConnectionButton = ({
  className,
}: WalletConnectionButtonProps) => {
  const { connected, disconnect, publicKey, wallet } = useWallet();
  const { setVisible } = useWalletModal();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleConnect = () => setVisible(true);

  const handleDisconnect = () => {
    disconnect();
    setShowDropdown(false);
  };

  const copyAddress = async () => {
    if (publicKey) {
      try {
        await navigator.clipboard.writeText(publicKey.toString());
        // You might want to show a toast notification here
        console.log("Address copied to clipboard");
        setShowDropdown(false);
      } catch (err) {
        console.error("Failed to copy address:", err);
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (connected) {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-3 w-full p-2 rounded-lg transition-colors hover:bg-gray-100"
        >
          <div className="flex items-center gap-2">
            {wallet?.adapter.icon ? (
              <img
                src={wallet.adapter.icon}
                alt={wallet.adapter.name}
                className="w-5 h-5"
              />
            ) : (
              <Wallet className="w-5 h-5" />
            )}

            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">
                {wallet?.adapter.name || "Connected"}
              </span>
              <span className="text-xs text-gray-500">
                {publicKey?.toString().slice(0, 4)}...
                {publicKey?.toString().slice(-4)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`}
            />
          </div>
        </button>

        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-999999 overflow-hidden">
            <button
              onClick={copyAddress}
              className="flex items-center gap-3 w-full p-3 text-sm hover:bg-gray-50 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Address</span>
            </button>
            <div className="border-t border-gray-100" />
            <button
              onClick={handleDisconnect}
              className="flex items-center gap-3 w-full p-3 text-sm hover:bg-gray-50 transition-colors text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnect</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors hover:bg-gray-100 ${className}`}
    >
      <div className="flex items-center gap-2">
        <Wallet className="w-5 h-5" />
        <span className="text-sm font-medium">Connect Wallet</span>
      </div>
      <div className="ml-auto w-2 h-2 rounded-full bg-gray-400" />
    </button>
  );
};
