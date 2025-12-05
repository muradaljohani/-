
import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, Flag } from 'lucide-react';
import { User } from '../../types';

interface Review {
    id: string;
    reviewerName: string;
    reviewerAvatar?: string;
    rating: number;
    comment: string;
    date: string;
    reply?: string;
}

interface Props {
    targetUser: User;
    reviews?: Review[]; // In real app, fetch these
}

export const ReviewSystem: React.FC<Props> = ({ targetUser, reviews = [] }) => {
    const [mockReviews, setMockReviews] = useState<Review[]>(reviews.length > 0 ? reviews : [
        { id: 'r1', reviewerName: 'عبدالله محمد', rating: 5, comment: 'تعامل راقي وسرعة في التوصيل. المنتج كما في الوصف تماماً.', date: '2023-10-15' },
        { id: 'r2', reviewerName: 'سعد القحطاني', rating: 4, comment: 'تجربة جيدة، لكن الشحن تأخر قليلاً.', date: '2023-10-10', reply: 'نعتذر عن التأخير بسبب شركة الشحن، شكراً لتفهمك.' }
    ]);
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRating === 0) return alert("يرجى اختيار التقييم");
        
        const review: Review = {
            id: `new_${Date.now()}`,
            reviewerName: 'أنت', // Current User
            rating: newRating,
            comment: newComment,
            date: new Date().toISOString().split('T')[0]
        };
        
        setMockReviews([review, ...mockReviews]);
        setNewComment('');
        setNewRating(0);
        setShowForm(false);
    };

    return (
        <div className="bg-[#1e293b] rounded-2xl border border-white/5 p-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500"/> تقييمات العملاء
                </h3>
                <button 
                    onClick={() => setShowForm(!showForm)} 
                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors font-bold"
                >
                    أضف تقييم
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-black/20 p-4 rounded-xl mb-6 border border-white/5">
                    <div className="flex gap-2 mb-3 justify-center">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button key={star} type="button" onClick={() => setNewRating(star)}>
                                <Star className={`w-6 h-6 transition-all hover:scale-110 ${star <= newRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}/>
                            </button>
                        ))}
                    </div>
                    <textarea 
                        value={newComment} 
                        onChange={e => setNewComment(e.target.value)} 
                        className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-3 text-white text-sm outline-none mb-3 min-h-[80px]"
                        placeholder="اكتب تعليقك هنا..."
                    />
                    <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-emerald-500">نشر التقييم</button>
                </form>
            )}

            <div className="space-y-4">
                {mockReviews.map(review => (
                    <div key={review.id} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                    {review.reviewerName.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-white text-sm font-bold">{review.reviewerName}</div>
                                    <div className="flex text-yellow-500 text-[10px]">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-700'}`}/>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-500">{review.date}</span>
                        </div>
                        
                        <p className="text-gray-300 text-xs leading-relaxed mb-2">{review.comment}</p>
                        
                        {review.reply && (
                            <div className="bg-blue-900/20 border-r-2 border-blue-500 p-2 mr-4 rounded-l-lg mt-2">
                                <div className="text-[10px] text-blue-400 font-bold mb-1">رد البائع:</div>
                                <p className="text-gray-400 text-[10px]">{review.reply}</p>
                            </div>
                        )}

                        <div className="flex gap-4 mt-2">
                            <button className="text-[10px] text-gray-500 flex items-center gap-1 hover:text-white"><ThumbsUp className="w-3 h-3"/> مفيد</button>
                            <button className="text-[10px] text-gray-500 flex items-center gap-1 hover:text-red-400"><Flag className="w-3 h-3"/> إبلاغ</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
