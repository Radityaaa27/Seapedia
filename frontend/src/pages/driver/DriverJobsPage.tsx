import { useState, useEffect } from "react";
import { driverService } from "../../services/driverService";
import { Delivery } from "../../types/driverTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Truck,
  MapPin,
  Package,
  CheckCircle,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react";

const formatRupiah = (n: number) =>
  `Rp ${Number(n).toLocaleString("id-ID")}`;

const deliveryStatusConfig = {
  WAITING_FOR_DRIVER: {
    label: "Waiting",
    color: "bg-yellow-100 text-yellow-700",
  },
  ASSIGNED: { label: "Assigned to You", color: "bg-blue-100 text-blue-700" },
  PICKED_UP: { label: "Picked Up", color: "bg-purple-100 text-purple-700" },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-700" },
};

const DriverJobsPage = () => {
  const [availableJobs, setAvailableJobs] = useState<Delivery[]>([]);
  const [myJobs, setMyJobs] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"available" | "my">("available");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const [available, my] = await Promise.all([
        driverService.getAvailableJobs(),
        driverService.getMyJobs(),
      ]);
      setAvailableJobs(available);
      setMyJobs(my);
    } catch {
      toast.error("Failed to load jobs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleAccept = async (deliveryId: string) => {
    setActionLoading(deliveryId);
    try {
      await driverService.acceptJob(deliveryId);
      toast.success("Job accepted! Head to the store for pickup.");
      await fetchJobs();
      setActiveTab("my");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to accept job.");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePickUp = async (deliveryId: string) => {
    setActionLoading(deliveryId);
    try {
      await driverService.pickUpOrder(deliveryId);
      toast.success("Pickup confirmed! Head to the buyer.");
      await fetchJobs();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to confirm pickup.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (deliveryId: string) => {
    setActionLoading(deliveryId);
    try {
      await driverService.completeDelivery(deliveryId);
      toast.success("Delivery complete! Earnings credited to your wallet. 🎉");
      await fetchJobs();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to complete delivery.");
    } finally {
      setActionLoading(null);
    }
  };

  const activeJobs = myJobs.filter((j) =>
    ["ASSIGNED", "PICKED_UP"].includes(j.status)
  );
  const completedJobs = myJobs.filter((j) => j.status === "DELIVERED");

  const renderJobCard = (job: Delivery, isMyJob = false) => {
    const statusConfig =
      deliveryStatusConfig[job.status] ?? deliveryStatusConfig.WAITING_FOR_DRIVER;

    return (
      <Card key={job.id} className="hover:shadow-sm transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-xs text-muted-foreground">
                Order #{job.order.id.slice(0, 8).toUpperCase()}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {job.order.store.name}
              </p>
            </div>
            <Badge
              className={`${statusConfig.color} border-none text-xs shrink-0`}
            >
              {statusConfig.label}
            </Badge>
          </div>

          {/* Delivery address */}
          <div className="flex items-start gap-2 mb-3 text-sm">
            <MapPin className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-foreground">
                {job.order.address.recipientName}
              </p>
              <p className="text-muted-foreground text-xs">
                {job.order.address.street}, {job.order.address.city},{" "}
                {job.order.address.province}
              </p>
              <p className="text-muted-foreground text-xs">
                {job.order.address.phone}
              </p>
            </div>
          </div>

          {/* Items preview */}
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              {job.order.items
                .slice(0, 2)
                .map((i) => `${i.productName} ×${i.quantity}`)
                .join(", ")}
              {job.order.items.length > 2 &&
                ` +${job.order.items.length - 2} more`}
            </p>
          </div>

          {/* Fee and action */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Delivery Fee</p>
              <p className="font-bold text-green-500">
                {formatRupiah(Number(job.fee))}
              </p>
            </div>

            <div className="flex gap-2">
              {/* Available job — accept */}
              {!isMyJob && job.status === "WAITING_FOR_DRIVER" && (
                <Button
                  size="sm"
                  className="bg-yellow-500 hover:bg-yellow-600 text-xs"
                  disabled={actionLoading === job.id}
                  onClick={() => handleAccept(job.id)}
                >
                  {actionLoading === job.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      <Truck className="w-3 h-3 mr-1" /> Accept Job
                    </>
                  )}
                </Button>
              )}

              {/* My job — confirm pickup */}
              {isMyJob && job.status === "ASSIGNED" && (
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-xs"
                  disabled={actionLoading === job.id}
                  onClick={() => handlePickUp(job.id)}
                >
                  {actionLoading === job.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      <Package className="w-3 h-3 mr-1" /> Confirm Pickup
                    </>
                  )}
                </Button>
              )}

              {/* My job — complete delivery */}
              {isMyJob && job.status === "PICKED_UP" && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-xs"
                  disabled={actionLoading === job.id}
                  onClick={() => handleComplete(job.id)}
                >
                  {actionLoading === job.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" /> Complete
                      Delivery
                    </>
                  )}
                </Button>
              )}

              {/* Delivered */}
              {isMyJob && job.status === "DELIVERED" && (
                <Badge className="bg-green-100 text-green-700 border-none">
                  <CheckCircle className="w-3 h-3 mr-1" /> Done
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Delivery Jobs
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchJobs}
          className="text-muted-foreground"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Active job banner */}
      {activeJobs.length > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-yellow-600" />
            <p className="text-sm font-semibold text-yellow-700">
              You have an active delivery!
            </p>
          </div>
          <p className="text-xs text-yellow-600">
            Complete your current delivery before accepting new jobs.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        {[
          {
            key: "available",
            label: "Available Jobs",
            count: availableJobs.length,
          },
          {
            key: "my",
            label: "My Jobs",
            count: myJobs.length,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as "available" | "my")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-orange-500 text-orange-500"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key
                    ? "bg-orange-100 text-orange-600"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Available Jobs tab */}
      {activeTab === "available" && (
        <div className="space-y-4">
          {availableJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Truck className="w-16 h-16 text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground font-medium">
                No jobs available right now.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Check back soon — new orders appear here when sellers mark
                them ready.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={fetchJobs}
              >
                <RefreshCw className="w-4 h-4 mr-1" /> Refresh
              </Button>
            </div>
          ) : (
            availableJobs.map((job) => renderJobCard(job, false))
          )}
        </div>
      )}

      {/* My Jobs tab */}
      {activeTab === "my" && (
        <div className="space-y-6">
          {/* Active */}
          {activeJobs.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">
                Active ({activeJobs.length})
              </p>
              <div className="space-y-4">
                {activeJobs.map((job) => renderJobCard(job, true))}
              </div>
            </div>
          )}

          {/* Completed */}
          {completedJobs.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">
                Completed ({completedJobs.length})
              </p>
              <div className="space-y-4">
                {completedJobs.map((job) => renderJobCard(job, true))}
              </div>
            </div>
          )}

          {myJobs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="w-16 h-16 text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground">No jobs yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Accept a job from the Available tab.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DriverJobsPage;