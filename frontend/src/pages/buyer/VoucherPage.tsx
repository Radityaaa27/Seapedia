import { useState, useEffect } from "react";
import { voucherService } from "../../services/voucherService";
import { Voucher } from "../../types/voucherTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Tag,
  Copy,
  CheckCircle,
  Clock,
  Loader2,
  Search,
} from "lucide-react";

const formatRupiah = (n: number) =>
  `Rp ${Number(n).toLocaleString("id-ID")}`;

const VoucherPage = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchCode, setSearchCode] = useState("");
  const [validating, setValidating] = useState(false);
  const [validResult, setValidResult] = useState<{
    voucher: Voucher;
    discount: number;
  } | null>(null);
  const [testAmount, setTestAmount] = useState("");

  useEffect(() => {
    voucherService
      .getActiveVouchers()
      .then(setVouchers)
      .catch(() => setVouchers([]))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied "${code}" to clipboard!`);
  };

  const handleValidate = async () => {
    if (!searchCode) {
      toast.error("Enter a voucher code.");
      return;
    }
    if (!testAmount || Number(testAmount) <= 0) {
      toast.error("Enter an order amount to test with.");
      return;
    }
    setValidating(true);
    setValidResult(null);
    try {
      const result = await voucherService.validateVoucher(
        searchCode,
        Number(testAmount)
      );
      setValidResult(result);
      toast.success("Voucher is valid!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid voucher.");
    } finally {
      setValidating(false);
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        My Vouchers
      </h1>

      {/* Voucher checker */}
      <Card className="mb-6 border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Check a Voucher Code
          </h2>
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Enter voucher code (e.g. SAVE10)"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
              className="bg-white uppercase"
            />
            <Input
              placeholder="Order amount (Rp)"
              type="number"
              value={testAmount}
              onChange={(e) => setTestAmount(e.target.value)}
              className="bg-white w-40"
            />
            <Button
              onClick={handleValidate}
              disabled={validating}
              className="bg-orange-500 hover:bg-orange-600 shrink-0"
            >
              {validating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          {validResult && (
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-semibold">Valid Voucher!</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Code:{" "}
                <span className="font-mono font-bold text-foreground">
                  {validResult.voucher.code}
                </span>
              </p>
              <p className="text-sm text-green-600 font-semibold">
                You save: {formatRupiah(validResult.discount)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available vouchers */}
      {vouchers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Tag className="w-16 h-16 text-muted-foreground/20 mb-4" />
          <p className="text-muted-foreground">No vouchers available.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Check back later for deals!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {vouchers.map((voucher) => {
            const isExpiringSoon =
              voucher.expiresAt &&
              new Date(voucher.expiresAt).getTime() - Date.now() 
                3 * 24 * 60 * 60 * 1000;

            return (
              <Card
                key={voucher.id}
                className="border-2 border-dashed border-orange-200 hover:border-orange-400 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Tag className="w-5 h-5 text-orange-500" />
                    </div>
                    {isExpiringSoon && (
                      <Badge className="bg-red-100 text-red-600 border-none text-xs">
                        <Clock className="w-3 h-3 mr-1" /> Expiring Soon
                      </Badge>
                    )}
                  </div>

                  <div className="mb-3">
                    <p className="font-mono text-lg font-bold text-foreground">
                      {voucher.code}
                    </p>
                    <p className="text-orange-500 font-semibold text-sm">
                      {voucher.type === "PERCENTAGE"
                        ? `${voucher.value}% off`
                        : `${formatRupiah(voucher.value)} off`}
                      {voucher.maxDiscount &&
                        ` (max ${formatRupiah(voucher.maxDiscount)})`}
                    </p>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground mb-3">
                    {voucher.minOrderAmount && (
                      <p>
                        Min. order:{" "}
                        {formatRupiah(Number(voucher.minOrderAmount))}
                      </p>
                    )}
                    {voucher.expiresAt && (
                      <p>
                        Expires:{" "}
                        {new Date(voucher.expiresAt).toLocaleDateString(
                          "id-ID",
                          { day: "numeric", month: "short", year: "numeric" }
                        )}
                      </p>
                    )}
                    {voucher.usageLimit && (
                      <p>
                        Used: {voucher.usedCount}/{voucher.usageLimit}
                      </p>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-orange-300 text-orange-500 hover:bg-orange-50"
                    onClick={() => handleCopy(voucher.code)}
                  >
                    <Copy className="w-3 h-3 mr-1" /> Copy Code
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VoucherPage;