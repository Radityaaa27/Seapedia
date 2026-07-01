import { useEffect, useState } from "react";
import { reviewService } from "../../services/reviewService";
import { AppReview } from "../../types/reviewTypes";
import { useAuth } from "../../hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, MessageSquare, Send, Quote } from "lucide-react";
import { toast } from "sonner";

const ReviewSection = () => {
  const { user } = useAuth();

  const [reviews, setReviews] = useState<AppReview[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill name for logged-in users
  useEffect(() => {
    if (user?.name) setReviewerName(user.name);
  }, [user]);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const res = await reviewService.getReviews(12);
      setReviews(res.reviews);
      setAvgRating(res.avgRating);
      setTotal(res.total);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewerName.trim() || !comment.trim() || rating === 0) {
      toast.error("Please fill in your name, rating, and comment.");
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.submitReview({
        reviewerName: reviewerName.trim(),
        rating,
        comment: comment.trim(),
      });
      toast.success("Thanks for your feedback!");
      setComment("");
      setRating(0);
      loadReviews();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          <MessageSquare className="w-5 h-5 text-orange-500" /> What People Say About SEAPEDIA
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Share your experience with the app — no purchase needed.
        </p>
        {total > 0 && (
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-foreground">{avgRating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({total} reviews)</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Review Form */}
        <Card className="lg:col-span-2 border border-border/60 rounded-2xl h-fit">
          <CardContent className="p-6">
            <h3 className="font-bold text-foreground mb-4">Leave a review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="reviewerName">Name</Label>
                <Input
                  id="reviewerName"
                  placeholder="Your name"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  maxLength={60}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Rating</Label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-0.5"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= (hoverRating || rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                  id="comment"
                  placeholder="Tell us about your experience using SEAPEDIA..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={500}
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold"
              >
                {isSubmitting ? "Submitting..." : (
                  <span className="flex items-center gap-2">
                    Submit Review <Send className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Review List */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-36 bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 border border-dashed rounded-3xl text-center bg-muted/20">
              <Quote className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-semibold text-muted-foreground">
                No reviews yet — be the first to share your experience!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <Card key={review.id} className="border border-border/60 rounded-2xl">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-muted-foreground/20"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                      "{review.comment}"
                    </p>
                    <p className="text-xs font-bold text-foreground pt-1 border-t border-border/50">
                      {review.reviewerName}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;