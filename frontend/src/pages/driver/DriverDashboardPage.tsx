import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { driverService } from "../../services/driverService";
import { DriverEarnings } from "../../types/driverTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Truck,
  DollarSign,
  CheckCircle,
  Wallet,
  ArrowRight,
  Loader2,
  TrendingUp,
} from "lucide-react";

const formatRupiah = (n: number) =>
  `Rp ${Number(n).toLocaleString("id-ID")}`;

const DriverDashboardPage = () => {
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState<DriverEarnings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    driverService
      .getEarnings()
      .then(setEarnings)
      .catch(() => toast.error("Failed to load earnings."))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const stats = [
    {
      label: "Total Earnings",
      value: formatRupiah(earnings?.totalEarnings ?? 0),
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Wallet Balance",
      value: formatRupiah(earnings?.balance ?? 0),
      icon: Wallet,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Completed Deliveries",
      value: earnings?.completedDeliveries ?? 0,
      icon: CheckCircle,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Truck className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Driver Dashboard</h1>
        </div>
        <p className="text-yellow-100 text-sm">
          Deliver orders, earn money, grow your income.
        </p>
        <Button
          className="mt-4 bg-white text-yellow-600 hover:bg-yellow-50"
          onClick={() => navigate("/driver/jobs")}
        >
          Find Available Jobs{" "}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${stat.bg}`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="font-bold text-foreground text-lg">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Earnings */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-yellow-500" />
            Recent Earnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!earnings?.recentEarnings.length ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Truck className="w-12 h-12 text-muted-foreground/20 mb-3" />
              <p className="text-sm text-muted-foreground">
                No earnings yet.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Accept a delivery job to start earning.
              </p>
              <Button
                size="sm"
                className="mt-4 bg-yellow-500 hover:bg-yellow-600"
                onClick={() => navigate("/driver/jobs")}
              >
                Browse Jobs
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {earnings.recentEarnings.map((earning) => (
                <div
                  key={earning.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Delivery Earning
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {earning.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(earning.createdAt).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-green-500">
                    +{formatRupiah(Number(earning.amount))}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverDashboardPage;