import React from 'react';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';

const ReviewItem = ({ review }) => {
  const { userName, rating, comment, createdAt, isGuest, userImage } = review;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={`${i < rating ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`}
      />
    ));
  };

  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="py-6 space-y-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/20 transition-colors px-4 rounded-2xl -mx-4 group">
      {/* 1. Header (Avatar + Info) */}
      <div className="flex items-center gap-3">
        <div className="relative">
          {userImage ? (
            <img src={userImage} alt={userName} className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm" />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              {initial}
            </div>
          )}
          {isGuest && (
            <div className="absolute -bottom-1 -right-1 bg-white px-1 py-0.5 rounded border border-gray-100 shadow-xs">
              <span className="text-[7px] font-black text-gray-400 uppercase tracking-tighter">Guest</span>
            </div>
          )}
        </div>
        <div>
          <h4 className="font-bold text-[15px] text-gray-900 leading-tight">{userName}</h4>
          <p className="text-xs text-blue-400/80 font-bold">{formatDate(createdAt)}</p>
        </div>
      </div>

      {/* 2. Metadata Row (Stars + 5/5) */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-0.5 text-black">
          {renderStars(rating)}
        </div>
        <span className="text-[13px] font-bold text-gray-900">{rating}/5</span>
      </div>

      {/* 4. Review Body */}
      <p className="text-[15px] text-gray-600 leading-relaxed font-medium">
        {comment}
      </p>
    </div>
  );
};

export default ReviewItem;
