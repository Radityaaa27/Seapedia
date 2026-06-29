import { useState, useEffect } from "react";
import { driverService } from "../../services/driverService";
import { DeliveryJob, DriverEarnings } from "../../types/driverTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, Clock, Loader2, MapPin, Wallet } from "lucide-react";

const formatRupiah = (n: number) => `Rp ${Number(n).toLocaleString("id-ID")}`;

const statusLabel: Record<string, { label: string; color: string }> = {
  ASSIGNED: { label: "In Progress", color: "bg-orange-100 text-orange-700" },
  DELIVERED: { label: "Completed", color: "bg-green-100 text-green-700" },
  WAITING_FOR_DRIVER: { label: "Open", color: "bg-blue-100 text-blue-700" },
};

const JobHistoryPage = () => {
  const [jobs, setJobs] = useState<DeliveryJob[]>([]);
  const [earnings, setEarnings] = useState<DriverEarnings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [histRes, earnRes] = await Promise.all([
          driverService.getMyJobs(page),
          driverService.getEarnings(),
        ]);
        setJobs(histRes.data);
        setTotalPages(histRes.meta?.totalPages ?? 1);
        setEarnings(earnRes);
      } catch {
        toast.error("Failed to load job history.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [page]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Job History & Earnings</h1>

      {/* Earnings card */}
      {earnings && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4 pb-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Earnings</p>
              <p className="text-xl font-bold text-green-700">
                {formatRupiah(earnings.totalEarnings)}
              </p>
              <p className="text-xs text-gray-500">
                from {earnings.completedJobs} completed job(s)
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="pt-8 pb-8 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No delivery history yet.</p>
          </CardContent>
        </Card>
      ) : (
        jobs.map((job) => {
          const statusInfo = statusLabel[job.status] ?? {
            label: job.status,
            color: "bg-gray-100 text-gray-700",
          };
          return (
            <Card key={job.id}>
              <CardContent className="pt-4 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">
                    {job.order.store.name}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>
                <p className="text-sm text-gray-500 flex items-start gap-1">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  {job.order.address.recipientName} —{" "}
                  {job.order.address.city}, {job.order.address.province}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {job.order.items.length} item(s)
                  </span>
                  <span className="font-bold text-green-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {formatRupiah(job.fee)}
                  </span>
                </div>
                {job.deliveredAt && (
                  <p className="text-xs text-gray-400">
                    Delivered:{" "}
                    {new Date(job.deliveredAt).toLocaleString("id-ID")}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>
          <span className="text-sm text-gray-600 self-center">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobHistoryPage;