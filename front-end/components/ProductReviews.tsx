'use client';

import { useState, useEffect } from 'react';
import { Star, User, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '@/context/Authcontext';

interface Review {
  id: number;
  review: string;
  reviewer: string;
  reviewer_email: string;
  rating: number;
  date_created: string;
}

export default function ProductReviews({ productId }: { productId: number }) {
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/reviews?product_id=${productId}`)
      .then(res => res.json())
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please sign in to leave a review.');
      return;
    }
    if (!comment.trim()) {
      setError('Please write a review.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          review: comment,
          rating,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post');
      // Добавляем новый отзыв в список (без перезагрузки)
      setReviews(prev => [data, ...prev]);
      setComment('');
      setRating(5);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="animate-pulse h-40 bg-gray-100 rounded-2xl" />;

  return (
    <div className="mt-12 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-[#FFCAB3] flex items-center justify-center">
          <MessageSquare size={15} className="text-gray-700" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Customer Reviews</h2>
      </div>

      {/* Список отзывов */}
      {reviews.length === 0 ? (
        <p className="text-gray-400 text-sm">No reviews yet. Be the first to review this product!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={14}
                      className={star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400 ml-2">
                  {new Date(review.date_created).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{review.review}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                <User size={12} />
                <span>{review.reviewer}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Форма добавления отзыва */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <h3 className="font-bold text-gray-800 mb-3">Write a review</h3>
        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    size={24}
                    className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2 mt-2">Your review</label>
            <textarea
              rows={3}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex mt-2 items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-900 transition-colors disabled:opacity-50"
          >
            <Send size={14} />
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}