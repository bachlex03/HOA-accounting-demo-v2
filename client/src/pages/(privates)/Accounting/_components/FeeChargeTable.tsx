import { LoadingOverlay } from "@/components/customs/LoadingOverlay";
import { PublicKey } from "@solana/web3.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  DollarSign,
  Receipt,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import MakePaymentButton from "./MakePaymentButton";
import useFeeState from "@/domain/state-hooks/useFeeState";

type TFeeType = "monthly" | "special" | "unknown";
type TFeeStatus = "paid" | "unpaid" | "overdue" | "unknown";

type TFeeChargeAccount = {
  publicKey: PublicKey;
  data: {
    feeId: number;
    feeType: TFeeType;
    feeAmount: number;
    feeStatus: TFeeStatus;
    fromAdmin: PublicKey;
    toRenter: PublicKey;
    createdAt: number;
    updatedAt: number;
  };
};

// Get status badge variant and icon
const getStatusBadge = (status: TFeeStatus) => {
  switch (status) {
    case "paid":
      return {
        variant: "default" as const,
        className: "bg-green-100 text-green-800 hover:bg-green-200",
        icon: <CheckCircle className="w-3 h-3 mr-1" />,
      };
    case "unpaid":
      return {
        variant: "secondary" as const,
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        icon: <Clock className="w-3 h-3 mr-1" />,
      };
    case "overdue":
      return {
        variant: "destructive" as const,
        className: "bg-red-100 text-red-800 hover:bg-red-200",
        icon: <AlertCircle className="w-3 h-3 mr-1" />,
      };
    default:
      return {
        variant: "outline" as const,
        className: "bg-gray-100 text-gray-800",
        icon: <Receipt className="w-3 h-3 mr-1" />,
      };
  }
};

// Get fee type badge
const getFeeTypeBadge = (type: TFeeType) => {
  switch (type) {
    case "monthly":
      return {
        variant: "outline" as const,
        className: "bg-blue-50 text-blue-700 border-blue-200",
        icon: <Calendar className="w-3 h-3 mr-1" />,
      };
    case "special":
      return {
        variant: "outline" as const,
        className: "bg-purple-50 text-purple-700 border-purple-200",
        icon: <Receipt className="w-3 h-3 mr-1" />,
      };
    default:
      return {
        variant: "outline" as const,
        className: "bg-gray-50 text-gray-700 border-gray-200",
        icon: <Receipt className="w-3 h-3 mr-1" />,
      };
  }
};

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount); // Assuming amount is in cents
};

// Format date
const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const FeeChargeTable = () => {
  const { fees, isTransactionPending, isFetching, setIsTransactionPending } =
    useFeeState();

  console.log("isTransactionPending", isTransactionPending);

  console.log("[1] Fees:", fees);

  // // Re-fetch fees when renterAccount changes
  // useEffect(() => {
  //   if (!connection) return;

  //   try {
  //     const subscription = connection.onAccountChange(, (accountInfo) => {

  //     })
  //   }
  //   catch (err) {
  //     console.error("Error fetching fees:", err);
  //   }

  //   // Clean up subscription when component unmounts

  // }, [connection, program]);

  // Filter fees by status
  const filterFeesByStatus = (status?: TFeeStatus) => {
    if (!status) return fees;
    return fees.filter((fee) => fee.data.feeStatus === status);
  };

  // Render fee table
  const renderFeeTable = (filteredFees: TFeeChargeAccount[]) => {
    if (filteredFees.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Receipt className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No fees found
            </h3>
            <p className="text-gray-500 text-center max-w-sm">
              There are no fees matching the current filter criteria.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Fee Charges ({filteredFees.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Fee ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFees.map((fee) => {
                  const statusBadge = getStatusBadge(fee.data.feeStatus);
                  const typeBadge = getFeeTypeBadge(fee.data.feeType);

                  return (
                    <TableRow key={fee.publicKey.toString()}>
                      <TableCell className="font-medium">
                        #{fee.data.feeId}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={typeBadge.variant}
                          className={typeBadge.className}
                        >
                          {typeBadge.icon}
                          {fee.data.feeType.charAt(0).toUpperCase() +
                            fee.data.feeType.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-gray-500" />
                          {formatCurrency(fee.data.feeAmount)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusBadge.variant}
                          className={statusBadge.className}
                        >
                          {statusBadge.icon}
                          {fee.data.feeStatus.charAt(0).toUpperCase() +
                            fee.data.feeStatus.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(fee.data.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(fee.data.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {fee.data.feeStatus === "unpaid" ||
                          fee.data.feeStatus === "overdue" ? (
                            <MakePaymentButton
                              feeId={fee.data.feeId}
                              feeCreatorPubkey={fee.data.fromAdmin}
                              setIsTransactionPending={setIsTransactionPending}
                            />
                          ) : (
                            <Button size="sm" variant="outline" className="h-8">
                              View Details
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Calculate summary stats
  const summaryStats = {
    total: fees.length,
    paid: fees.filter((f) => f.data.feeStatus === "paid").length,
    unpaid: fees.filter((f) => f.data.feeStatus === "unpaid").length,
    overdue: fees.filter((f) => f.data.feeStatus === "overdue").length,
    totalAmount: fees.reduce((sum, f) => sum + f.data.feeAmount, 0),
    paidAmount: fees
      .filter((f) => f.data.feeStatus === "paid")
      .reduce((sum, f) => sum + f.data.feeAmount, 0),
    outstandingAmount: fees
      .filter((f) => f.data.feeStatus !== "paid")
      .reduce((sum, f) => sum + f.data.feeAmount, 0),
  };

  return (
    <div className="space-y-6">
      <LoadingOverlay isLoading={isFetching} fullScreen />

      {/* Main Content Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            All Fees
            <Badge variant="secondary" className="ml-1">
              {summaryStats.total}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="paid" className="flex items-center gap-2">
            Paid
            <Badge variant="secondary" className="ml-1">
              {summaryStats.paid}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unpaid" className="flex items-center gap-2">
            Unpaid
            <Badge variant="secondary" className="ml-1">
              {summaryStats.unpaid}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="overdue" className="flex items-center gap-2">
            Overdue
            <Badge variant="secondary" className="ml-1">
              {summaryStats.overdue}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {renderFeeTable(filterFeesByStatus())}
        </TabsContent>

        <TabsContent value="paid" className="space-y-4">
          {renderFeeTable(filterFeesByStatus("paid"))}
        </TabsContent>

        <TabsContent value="unpaid" className="space-y-4">
          {renderFeeTable(filterFeesByStatus("unpaid"))}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          {renderFeeTable(filterFeesByStatus("overdue"))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeeChargeTable;
