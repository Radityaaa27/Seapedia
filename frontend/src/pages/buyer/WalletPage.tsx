import { useState, useEffect, useCallback } from "react";
import { walletService } from "../../services/walletService";
import { Wallet, WalletTransaction } from "../../types/walletTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Wallet as WalletIcon,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw,
  TrendingUp,
  Loader2,
  X,
} from "lucide-react";

// Quick top-up amount presets
const PRESETS = [10000, 50000, 100000, 250000, 500000, 1000000];

const formatRupiah = (amount: number) =>
  `Rp ${Number(amount).toLocaleString("id-ID")}`;

const transactionConfig = {
  TOPUP: {
    label: "Top Up",
    icon: ArrowUpCircle,
    color: "text-green-500",
    bg: "bg-green-50",
    sign: "+",
  },
  PAYMENT: {
    label: "Payment",
    icon: ArrowDownCircle,
    color: "text-red-500",
    bg: "bg-red-50",
    sign: "-",
  },
  REFUND: {
    label: "Refund",
    icon: ArrowUpCircle,
    color: "text-blue-500",
    bg: "bg-blue-50",
    sign: "+",
  },
  EARNING: {
    label: "Earning",
    icon: TrendingUp,
    color: "text-purple-500",
    bg: "bg-purple-50",
    sign: "+",
  },
};

const WalletPage = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isToppingUp, setIsToppingUp] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchWallet = useCallback(async () => {
    try {
      const data = await walletService.getWallet();
      setWallet(data);
    } catch {
      toast.error("Failed to load wallet.");
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await walletService.getTransactions(page);
      setTransactions(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      setTransactions([]);
    }
  }, [page]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([fetchWallet(), fetchTransactions()]);
      setIsLoading(false);
    };
    init();
  }, [fetchWallet, fetchTransactions]);

  const handleTopUp = async () => {
    const amount = Number(topUpAmount);
    if (!amount || amount < 10000) {
      toast.error("Minimum top up is Rp 10.000.");
      return;
    }
    if (amount > 10000000) {
      toast.error("Maximum top up is Rp 10.000.000.");
      return;
    }

    setIsToppingUp(true);
    try {
      const result = await walletService.topUp(amount);
      setWallet(result.wallet);
      setTopUpAmount("");
      setShowTopUp(false);
      await fetchTransactions();
      toast.success(
        `Successfully topped up ${formatRupiah(amount)}! 🎉`
      );
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Top up failed. Please try again."
      );
    } finally {
      setIsToppingUp(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <h1 className="text-2xl font-bold text-foreground mb-6">My Wallet</h1>

      {/* Balance card */}
      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <WalletIcon className="w-5 h-5 text-orange-200" />
                <p className="text-orange-200 text-sm">Available Balance</p>
              </div>
              <p className="text-4xl font-bold tracking-tight">
                {formatRupiah(Number(wallet?.balance ?? 0))}
              </p>
              <p className="text-orange-200 text-xs mt-2">
                SEAPEDIA Wallet · {wallet?.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <Button
              onClick={() => setShowTopUp(true)}
              className="bg-white text-orange-600 hover:bg-orange-50 shrink-0"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Top Up
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Top Up Modal */}
      {showTopUp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Top Up Wallet</CardTitle>
              <button
                onClick={() => {
                  setShowTopUp(false);
                  setTopUpAmount("");
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Presets */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Quick Select
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setTopUpAmount(String(preset))}
                      className={`px-3 py-2 text-xs rounded-lg border transition-colors font-medium ${
                        topUpAmount === String(preset)
                          ? "border-orange-500 bg-orange-50 text-orange-600"
                          : "border-border hover:border-orange-300 text-foreground"
                      }`}
                    >
                      {formatRupiah(preset)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom amount */}
              <div className="space-y-1.5">
                <Label htmlFor="amount">Custom Amount (Rp)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount (min. 10.000)"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  min={10000}
                  max={10000000}
                />
                <p className="text-xs text-muted-foreground">
                  Min: Rp 10.000 · Max: Rp 10.000.000
                </p>
              </div>

              {/* Summary */}
              {Number(topUpAmount) >= 10000 && (
                <div className="bg-muted/50 rounded-lg p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Balance</span>
                    <span>{formatRupiah(Number(wallet?.balance ?? 0))}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-muted-foreground">Top Up Amount</span>
                    <span className="text-green-500">
                      +{formatRupiah(Number(topUpAmount))}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1 pt-1 border-t border-border font-semibold">
                    <span>New Balance</span>
                    <span className="text-orange-500">
                      {formatRupiah(
                        Number(wallet?.balance ?? 0) + Number(topUpAmount)
                      )}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowTopUp(false);
                    setTopUpAmount("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                  onClick={handleTopUp}
                  disabled={isToppingUp || !topUpAmount}
                >
                  {isToppingUp ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Top Up"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transaction History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Transaction History</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchTransactions}
            className="text-muted-foreground"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <WalletIcon className="w-12 h-12 text-muted-foreground/20 mb-3" />
              <p className="text-sm text-muted-foreground">
                No transactions yet.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Top up your wallet to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => {
                const config =
                  transactionConfig[tx.type] ?? transactionConfig.TOPUP;
                return (
                  <div
                    key={tx.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.bg}`}
                    >
                      <config.icon className={`w-5 h-5 ${config.color}`} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">
                          {config.label}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-xs px-1.5 py-0"
                        >
                          {tx.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {tx.description || "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="text-right shrink-0">
                      <p
                        className={`text-sm font-bold ${
                          tx.type === "PAYMENT"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {config.sign}
                        {formatRupiah(Number(tx.amount))}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRupiah(Number(tx.balanceAfter))}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletPage;