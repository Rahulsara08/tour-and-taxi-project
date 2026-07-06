import React from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

const reviews = [
  {
    name: 'Rahul Sharma',
    date: '2 weeks ago',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150',
    content: 'Excellent service! Booked a taxi for Char Dham yatra. The driver was very polite and knew all the routes well. Highly recommended for safe travel in Rajasthan.',
    rating: 5
  },
  {
    name: 'Priya Patel',
    date: '1 month ago',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    content: 'We used Shri Gurukripa for our Jaipur to Udaipur trip. The Innova Crysta was very clean and comfortable. Best outstation cab service I have used so far.',
    rating: 5
  },
  {
    name: 'Vikram Singh',
    date: '3 months ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    content: 'Punctual and reliable airport transfer. The AI Chatbot on the website helped me get an instant quote and book in minutes. Very modern and professional.',
    rating: 5
  }
];

export default function CustomerReviews() {
  return (
    <section className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Loved by Travelers
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-4xl font-black text-[var(--text-primary)]">4.9</span>
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map(i => <Star fill="currentColor" key={i} />)}
            </div>
          </div>
          <p className="text-lg text-blue-700 dark:text-blue-200 bg-blue-550/10 py-3 px-6 rounded-full inline-flex font-medium border border-blue-500/10">
            "95% customers praised punctuality and clean vehicles." - AI Summary
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[var(--bg-card)] p-8 rounded-2xl shadow-sm border border-white/5"
            >
              <div className="flex items-center gap-4 mb-6">
                <img src={review.avatar} alt={review.name} className="w-14 h-14 rounded-full object-cover" referrerPolicy="no-referrer" crossOrigin="anonymous" />
                <div>
                  <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-1">
                    {review.name}
                    <CheckCircle size={16} className="text-blue-500" />
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <div className="flex text-yellow-400">
                      {[...Array(review.rating)].map((_, i) => <Star fill="currentColor" size={14} key={i} />)}
                    </div>
                    • {review.date}
                  </div>
                </div>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed italic">
                "{review.content}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
