import React, { useState } from 'react';
import { Star, Send, User, MessageSquare } from 'lucide-react';

const ReviewForm = ({ onSubmit, loading, currentUser }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment) return;
    if (rating === 0) {
      alert("Please select a rating star!");
      return;
    }
    
    onSubmit({
      userName: currentUser ? currentUser.name : name,
      userEmail: currentUser ? currentUser.email : '',
      rating,
      comment,
      isGuest: !currentUser,
      userImage: currentUser ? currentUser.image : ''
    });

    setComment('');
    setRating(0);
    setName('');
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
        <div className="bg-blue-50 p-2 rounded-xl">
          <MessageSquare className="text-blue-500" size={20} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Rating</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transform transition-all active:scale-95"
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  size={24}
                  className={`transition-colors ${
                    star <= (hover || rating) 
                      ? 'text-amber-500 fill-amber-500' 
                      : 'text-gray-200'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm font-bold text-gray-900">{rating}/5</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!currentUser && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all text-[15px] font-medium"
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Review</label>
          <textarea
            required
            rows="4"
            placeholder="Tell us about your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all text-[15px] font-medium resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || (!currentUser && !name)}
          className="w-full md:w-auto px-6 py-3 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl shadow-md shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
          {!loading && <Send size={18} />}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
