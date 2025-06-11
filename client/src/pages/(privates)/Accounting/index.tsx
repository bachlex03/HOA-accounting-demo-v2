import { WalletConnectionButton } from "@/components/customs/WalletConnectionBtn";
import FeeChargeTable from "./_components/FeeChargeTable";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  CreditCard,
  Receipt,
  Calendar,
  Download,
  Eye,
  AlertCircle,
  CircleUserRound,
} from "lucide-react";

const AccountingPage = () => {
  const { renterAccount } = useAuth();

  // Mock data - replace with actual data from your API
  const accountSummary = {
    currentBalance: -1250.0,
    totalPaid: 8750.0,
    totalDue: 10000.0,
    nextPaymentDue: "2024-02-01",
    status: "overdue" as const,
  };

  const recentTransactions = [
    {
      id: 1,
      date: "2024-01-15",
      description: "Monthly HOA Fee",
      amount: -500.0,
      status: "pending",
    },
    {
      id: 2,
      date: "2024-01-01",
      description: "Payment Received",
      amount: 500.0,
      status: "completed",
    },
    {
      id: 3,
      date: "2023-12-15",
      description: "Late Fee",
      amount: -25.0,
      status: "completed",
    },
    {
      id: 4,
      date: "2023-12-01",
      description: "Monthly HOA Fee",
      amount: -500.0,
      status: "completed",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "overdue":
        return "destructive";
      case "pending":
        return "secondary";
      case "current":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Accounting Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your HOA fees, payments, and financial records
          </p>
        </div>
        <WalletConnectionButton />
      </div>

      {/* Account Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Renter Information
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-4 bg-white border-gray-200 hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <CircleUserRound className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500">
                    Renter name
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {renterAccount.data.renterName}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white hover:border-green-300 transition-colors text-xs">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500">
                  Account Created
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(renterAccount.data.createAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Paid
            </CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">
              ${accountSummary.totalPaid.toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-xs text-gray-500">This year</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Outstanding Balance
            </CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Receipt className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 mb-1">
              ${accountSummary.totalDue.toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <p className="text-xs text-gray-500">Amount due</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Account Status
            </CardTitle>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Status</span>
              <Badge
                variant={getStatusColor(accountSummary.status)}
                className="text-xs font-medium"
              >
                {accountSummary.status.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Next Payment</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(accountSummary.nextPaymentDue).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  }
                )}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Pending Fees</span>
                <span className="font-medium text-red-600">2 items</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="fees">Fee Schedule</TabsTrigger>
          <TabsTrigger value="statements">Statements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest account activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.slice(0, 4).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-medium ${
                            transaction.amount > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.amount > 0 ? "+" : ""}$
                          {Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        <Badge
                          variant={
                            transaction.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Eye className="mr-2 h-4 w-4" />
                  View All Transactions
                </Button>
              </CardContent>
            </Card>

            {/* Payment Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Manage your account and payments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="lg">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Make Payment
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Set Up Auto-Pay
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Statement
                </Button>
                <Button variant="outline" className="w-full">
                  <Receipt className="mr-2 h-4 w-4" />
                  Payment History
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Complete record of all account transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* This would be your enhanced transaction table */}
              <div className="text-center py-8 text-muted-foreground">
                <Receipt className="mx-auto h-12 w-12 mb-4" />
                <p>Detailed transaction table will be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fee Schedule</CardTitle>
              <CardDescription>Current HOA fees and charges</CardDescription>
            </CardHeader>
            <CardContent>
              <FeeChargeTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Statements</CardTitle>
              <CardDescription>
                Download and view your monthly statements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Download className="mx-auto h-12 w-12 mb-4" />
                <p>Statement management will be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default AccountingPage;
