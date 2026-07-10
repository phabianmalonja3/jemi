import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import { apiClient } from '@/lib/api';
import { Review } from '@/lib/models/review';

function TestMonies() {
  const [testimonials, setTestimonials] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/reviews');

        // console.log("Fetched reviews:", res.data); // Debugging line
        setTestimonials(res.data);
      } catch (err: any) {
        console.error("Error loading reviews:", err);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <section className="py-20 text-center text-zinc-500">
        <p>Loading testimonials...</p>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 px-4 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">What Our Clients Say</h2>
        
        {error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <p className="text-zinc-500 dark:text-zinc-400">No reviews yet.</p>
            <p className="text-sm mt-2 text-zinc-400">Be the first to share your experience with Jemigraph!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div 
           
                key={t.id} 
                className="testimonial-card bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-4">
              
                  <div className="w-12 h-12 relative rounded-full overflow-hidden ring-2 ring-[#25632D]">
                    <Image 
                      src={t.imageUrl || '/default_user.svg'} 
                      alt={t.id.toString()} 
                      fill 
                      unoptimized 
                      className="object-cover" 
                    />
                  </div>
                  <div>
                    <h4 className="font-bold dark:text-white">{t.clientName}</h4>
                    <div className="flex text-yellow-400 text-xs mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < t.rating ? "opacity-100" : "opacity-20"} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm italic text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  "{t.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default TestMonies;