import { Building2 } from "lucide-react";
import { WalletConnectionButton } from "@/components/customs/WalletConnectionBtn";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const LoginPage = () => {
  console.log("LoginPage rendered");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            HOA Accounting
          </h1>
          <p className="text-gray-600">Sign in to manage your community</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div>
            <WalletConnectionButton />
            <WalletMultiButton />
          </div>
          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  New to HOA Accounting?
                </span>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Contact us
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2024 HOA Accounting Demo. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
