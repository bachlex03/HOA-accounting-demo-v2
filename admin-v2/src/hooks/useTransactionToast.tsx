import { useEffect, useRef, useState } from "react";
import { Check, ClipboardCopy } from "lucide-react";
import { type MouseEvent } from "react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

type TUseTransactionToastProps = {
  transactionSignature: string | null;
};

const useTransactionToast = ({
  transactionSignature,
}: TUseTransactionToastProps) => {
  const toastIdRef = useRef<string | number | null>(null);

  const [isContentCopied, setIsContentCopied] = useState(false);

  const handleContentCopy = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (transactionSignature) {
      navigator.clipboard.writeText(transactionSignature);
      setIsContentCopied(true);
      setTimeout(() => setIsContentCopied(false), 500);
    }
  };
  // Display toast when transaction signature is available
  useEffect(() => {
    if (transactionSignature) {
      const explorerUrl = `https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`;

      // Dismiss previous toast if exists
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }

      // Create toast with custom component that manages its own state
      toastIdRef.current = toast.success("Transaction Sent!", {
        description: (
          <div className="mt-2">
            <div className="text-xs font-mono bg-black/30 rounded p-1.5 border border-gray-800 mb-3 overflow-auto">
              {transactionSignature}
            </div>
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                className={`h-8 px-2 text-xs flex-1 ${
                  isContentCopied
                    ? "bg-purple-900/20 border-purple-500/50"
                    : "bg-black/20 hover:bg-purple-900/20 border-purple-800/30"
                }`}
                onClick={handleContentCopy}
              >
                {isContentCopied ? (
                  <Check className="h-3.5 w-3.5 mr-1.5 text-green-400" />
                ) : (
                  <ClipboardCopy className="h-3.5 w-3.5 mr-1.5" />
                )}
                {isContentCopied ? "Copied!" : "Copy Signature"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs flex-1 bg-black/20 hover:bg-blue-900/20 border-blue-800/30"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(explorerUrl, "_blank");
                }}
              >
                <svg
                  className="h-3.5 w-3.5 mr-1.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                View in Explorer
              </Button>
            </div>
          </div>
        ),
        style: {
          backgroundColor: "#1f1f23",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
        },
        duration: 8000,
      });
    }
  }, [transactionSignature]);
};

export default useTransactionToast;
