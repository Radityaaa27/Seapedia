import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { driverService } from "../../services/driverService";
import { DeliveryJob, DriverEarnings } from "../../types/driverTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Truck,
  Package,
  Wallet,
  CheckCircle2,
  Loader2,
  MapPin,
  ArrowRight,
} from "lucide-react";

const formatRupiah = (n: number) => `Rp ${Number(n).toLocaleString("id-ID")}`;

const DriverDashboardPage = () => {
  const [activeJob, setActiveJob] = useState<DeliveryJob | null>(null);
  const [earnings, setEarnings] = useState<DriverEarnings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [active, earn] = await Promise.all([
        driverService.getActiveJob(),
        driverService.getEarnings(),
      ]);
      setActiveJob(active);
      setEarnings(earn);
    } catch {
      toast.error("Failed to load dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleComplete = async () => {
    if (!activeJob) return;
    try {
      await driverService.completeJob(activeJob.id);
      toast.success("Delivery completed! Earnings added to wallet.");
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to complete delivery.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>

      {/* Earnings Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-5 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Wallet className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Earnings</p>
              <p className="font-bold text-gray-900">
                {formatRupiah(earnings?.totalEarnings ?? 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Completed Jobs</p>
              <p className="font-bold text-gray-900">
                {earnings?.completedJobs ?? 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Job */}
      {activeJob ? (
        <Card className="border-2 border-orange-400">
          <CardContent className="pt-5 space-y-4">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-orange-500" />
              <h2 className="font-semibold text-orange-600">Active Delivery</h2>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium">Store:</span>{" "}
                {activeJob.order.store.name}
              </p>
              <p className="flex items-start gap-1">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                {activeJob.order.address.recipientName} —{" "}
                {activeJob.order.address.street}, {activeJob.order.address.city}
              </p>
              <p>
                <span className="font-medium">Delivery Fee:</span>{" "}
                {formatRupiah(activeJob.fee)}
              </p>
              <p>
                <span className="font-medium">Items:</span>{" "}
                {activeJob.order.items.length} item(s)
              </p>
            </div>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleComplete}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirm Delivered
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-dashed border-gray-300 bg-gray-50">
          <CardContent className="pt-5 text-center space-y-3">
            <Package className="w-10 h-10 text-gray-400 mx-auto" />
            <p className="text-gray-500 text-sm">No active delivery right now.</p>
            <Link to="/driver/jobs">
              <Button variant="outline" size="sm">
                Find Available Jobs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/driver/jobs">
          <Button variant="outline" className="w-full">
            <Package className="w-4 h-4 mr-2" />
            Available Jobs
          </Button>
        </Link>
        <Link to="/driver/history">
          <Button variant="outline" className="w-full">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Job History
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DriverDashboardPage;