import { Building2 } from 'lucide-react'
import { WalletConnectionButton } from '@/components/ConnectionWalletBtn'

const LoginPage = () => {
   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
         <div className="max-w-md w-full space-y-8">
            {/* Header */}
            <div className="text-center">
               <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-white" />
               </div>
               <h2 className="text-3xl font-bold text-gray-900">
                  HOA Admin Portal
               </h2>
               <p className="mt-2 text-sm text-gray-600">
                  Sign in to manage your community
               </p>
            </div>

            {/* Login Form */}
            <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
               <div>
                  <WalletConnectionButton />
               </div>
               {/* Additional Links */}
               <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                     Need help?{' '}
                     <a
                        href="#"
                        className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out"
                     >
                        Contact Support
                     </a>
                  </p>
               </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500">
               <p>© 2024 HOA Management System. All rights reserved.</p>
            </div>
         </div>
      </div>
   )
}

export default LoginPage
