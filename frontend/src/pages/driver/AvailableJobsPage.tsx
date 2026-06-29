import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { driverService } from "../../services/driverService";
import { DeliveryJob } from "../../types/driverTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Truck, MapPin, Package, Loader2, ChevronRight } from "lucide-react";

const formatRupiah = (n: number) => `Rp ${Number(n).toLocaleString("id-ID")}`;

const AvailableJobsPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<DeliveryJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [takingId, setTakingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await driverService.getAvailableJobs(page);
      setJobs(res.data);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch {
      toast.error("Failed to load available jobs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const handleTakeJob = async (jobId: string) => {
    setTakingId(jobId);
    try {
      await driverService.takeJob(jobId);
      toast.success("Job accepted! Go pick up the order.");
      navigate("/driver/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to take job.");
    } finally {
      setTakingId(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
      <div className="flex items-center gap-2">
        <Truck className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Available Jobs</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="pt-8 pb-8 text-center space-y-2">
            <Package className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-gray-500">No jobs available right now.</p>
            <p className="text-xs text-gray-400">
              Jobs appear when sellers mark orders ready for pickup.
            </p>
          </CardContent>
        </Card>
      ) : (
        jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">
                  {job.order.store.name}
                </span>
                <span className="text-green-700 font-bold text-sm bg-green-50 px-2 py-0.5 rounded">
                  {formatRupiah(job.fee)}
                </span>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p className="flex items-start gap-1">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                  <span>
                    {job.order.address.recipientName} —{" "}
                    {job.order.address.street}, {job.order.address.city},{" "}
                    {job.order.address.province}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Items:</span>{" "}
                  {job.order.items.map((i) => `${i.productName} x${i.quantity}`).join(", ")}
                </p>
                <p>
                  <span className="font-medium">Order Total:</span>{" "}
                  {formatRupiah(job.order.totalAmount)}
                </p>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => handleTakeJob(job.id)}
                disabled={takingId === job.id}
              >
                {takingId === job.id ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <ChevronRight className="w-4 h-4 mr-2" />
                )}
                Accept This Job
              </Button>
            </CardContent>
          </Card>
        ))
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

export default AvailableJobsPage;