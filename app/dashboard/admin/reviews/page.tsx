"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  StarIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  PhotoIcon,
  CheckCircleIcon,
  XCircleIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

interface Review {
  id: string;
  clientName: string;
  photographerName: string;
  photographerAverageRating: number;
  photographerTotalReviews: number;
  rating: number;
  comment: string;
  bookingType: string | null;
  createdAt: string | null;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("ALL");
  const [photographerFilter, setPhotographerFilter] = useState<string>("ALL");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data;
      console.log("Fetched reviews:", data);

      // Handle both array and paginated response
      const reviewsData = Array.isArray(data) ? data : data.content || [];
      setReviews(reviewsData);
      setFilteredReviews(reviewsData);
    } catch (error) {
      console.error(error);
      toast.error("There was an error fetching reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Get unique photographers for filter
  const uniquePhotographers = Array.from(
    new Set(reviews.map((r) => r.photographerName))
  );

  // Apply filters
  useEffect(() => {
    let filtered = reviews;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.photographerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.comment?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Rating filter
    if (ratingFilter !== "ALL") {
      filtered = filtered.filter((r) => r.rating === parseInt(ratingFilter));
    }

    // Photographer filter
    if (photographerFilter !== "ALL") {
      filtered = filtered.filter((r) => r.photographerName === photographerFilter);
    }

    setFilteredReviews(filtered);
  }, [searchTerm, ratingFilter, photographerFilter, reviews]);

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarSolidIcon
            key={star}
            className={cn(
              "w-4 h-4",
              star <= rating ? "text-yellow-400" : "text-gray-200"
            )}
          />
        ))}
      </div>
    );
  };

  // Get rating color
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600 bg-green-50";
    if (rating >= 3) return "text-blue-600 bg-blue-50";
    if (rating >= 2) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  // Get rating label
  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4) return "Very Good";
    if (rating >= 3) return "Good";
    if (rating >= 2) return "Average";
    return "Poor";
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Statistics
  const stats = {
    total: reviews.length,
    averageRating: reviews.length > 0 
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "0",
    totalPhotographers: uniquePhotographers.length,
    fiveStar: reviews.filter((r) => r.rating === 5).length,
    fourStar: reviews.filter((r) => r.rating === 4).length,
    threeStar: reviews.filter((r) => r.rating === 3).length,
    twoStar: reviews.filter((r) => r.rating === 2).length,
    oneStar: reviews.filter((r) => r.rating === 1).length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <StarIcon className="w-7 h-7 text-yellow-500" />
        Reviews Management
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="text-sm text-gray-500">Total Reviews</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="text-sm text-gray-500">Average Rating</div>
          <div className="text-2xl font-bold flex items-center gap-2">
            {stats.averageRating}
            <StarSolidIcon className="w-5 h-5 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="text-sm text-gray-500">Photographers</div>
          <div className="text-2xl font-bold">{stats.totalPhotographers}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="text-sm text-gray-500">5-Star Reviews</div>
          <div className="text-2xl font-bold text-green-600">{stats.fiveStar}</div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Rating Distribution</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats[`${star}Star` as keyof typeof stats] as number;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-8">{star} ★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      star >= 4 ? "bg-green-500" :
                      star >= 3 ? "bg-yellow-500" :
                      "bg-red-500"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-12">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by client, photographer, or comment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border px-3 py-2 pl-10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>

        {/* Rating Filter */}
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[130px]"
        >
          <option value="ALL">All Ratings</option>
          <option value="5">5 ★</option>
          <option value="4">4 ★</option>
          <option value="3">3 ★</option>
          <option value="2">2 ★</option>
          <option value="1">1 ★</option>
        </select>

        {/* Photographer Filter */}
        <select
          value={photographerFilter}
          onChange={(e) => setPhotographerFilter(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
        >
          <option value="ALL">All Photographers</option>
          {uniquePhotographers.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        {/* Refresh Button */}
        <button
          onClick={fetchReviews}
          className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 text-sm font-medium transition flex items-center gap-2"
        >
          <svg
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>

        {/* Results count */}
        <div className="ml-auto flex items-center text-sm text-gray-600">
          Showing <strong className="mx-1">{filteredReviews.length}</strong> of{" "}
          <strong className="mx-1">{reviews.length}</strong> reviews
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading reviews...</span>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Photographer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Photographer Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                          {review.clientName?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {review.clientName || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium text-sm">
                          {review.photographerName?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span className="text-sm text-gray-900">
                          {review.photographerName || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating)}
                          <span className="text-sm font-semibold">
                            {review.rating}
                          </span>
                        </div>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full inline-block",
                          getRatingColor(review.rating)
                        )}>
                          {getRatingLabel(review.rating)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {review.comment || "No comment"}
                        </p>
                        {review.bookingType && (
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full inline-block mt-1">
                            {review.bookingType}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm font-semibold">
                            {review.photographerAverageRating?.toFixed(1) || "N/A"}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {review.photographerTotalReviews || 0} reviews
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <StarIcon className="w-12 h-12 text-gray-300" />
                      <p>No reviews found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Export Button */}
      {!loading && filteredReviews.length > 0 && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              // Export to CSV
              const headers = [
                "Client",
                "Photographer",
                "Rating",
                "Comment",
                "Photographer Avg Rating",
                "Photographer Total Reviews",
                "Date",
              ];
              const csvData = filteredReviews.map((r) => [
                r.clientName,
                r.photographerName,
                r.rating,
                r.comment,
                r.photographerAverageRating || "",
                r.photographerTotalReviews || 0,
                r.createdAt || "",
              ]);
              const csvContent =
                "data:text/csv;charset=utf-8," +
                [headers.join(","), ...csvData.map((row) => row.join(","))].join(
                  "\n"
                );
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute(
                "download",
                `reviews_${new Date().toISOString().split("T")[0]}.csv`
              );
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              toast.success("CSV exported successfully!");
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      )}
    </div>
  );
}

// Utility function for className merging
function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}