import React from 'react';
import { Quote, Star } from 'lucide-react';
import { PROFILE_CONFIG } from '../../config';
import { use3DCard } from '../hooks/use3DCard';
import SectionWrapper from '../layout/SectionWrapper';

interface Testimonial {
  id: string;
  author: string;
  role: string;
  content: string;
  rating: number;
  funny: boolean;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    author: 'His Computer',
    role: 'Workstation',
    content: `${PROFILE_CONFIG.personal.firstName} once fixed a bug by turning me off and on again. 10/10 would hire. He also knows that Ctrl+Z is the most powerful command in the universe.`,
    rating: 5,
    funny: true
  },
  {
    id: '2',
    author: `Future ${PROFILE_CONFIG.personal.firstName}`,
    role: 'Time Traveler',
    content: "He writes code that even he can't understand 6 months later. Perfect for job security! But seriously, his code works, and that's what matters.",
    rating: 4,
    funny: true
  },
  {
    id: '3',
    author: 'Stack Overflow',
    role: 'The Oracle',
    content: "This developer has asked 0 questions because he always finds the answer in the comments of a 10-year-old post. A true master of the craft.",
    rating: 5,
    funny: true
  },
  {
    id: '4',
    author: 'Git',
    role: 'Version Control',
    content: "His commit messages range from 'Fixed bug' to 'Fixed bug (again)' to 'Actually fixed bug this time'. Consistency is key!",
    rating: 4,
    funny: true
  },
  {
    id: '5',
    author: 'Coffee Machine',
    role: 'Life Support System',
    content: "We have a special bond. He drinks my coffee, I keep him awake. It's a symbiotic relationship. Without me, this portfolio wouldn't exist.",
    rating: 5,
    funny: true
  },
  {
    id: '6',
    author: 'The Bug He Fixed',
    role: 'Former Bug',
    content: `I was a feature, not a bug. But ${PROFILE_CONFIG.personal.firstName} insisted otherwise. Now I'm fixed, and honestly? I feel better. Thanks, ${PROFILE_CONFIG.personal.firstName}!`,
    rating: 5,
    funny: true
  }
];

const Testimonials: React.FC = () => {
  return (
    <SectionWrapper id="testimonials" variant="gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What People Say About Me
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Real testimonials from real... things. 100% authentic. Probably.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => {
            const card3D = use3DCard({ intensity: 10, enableGlow: true });
            return (
            <div
              key={testimonial.id}
              ref={card3D.ref}
              style={card3D.style}
              onMouseMove={card3D.onMouseMove}
              onMouseLeave={card3D.onMouseLeave}
              onMouseEnter={card3D.onMouseEnter}
              className="relative bg-slate-900/80 border border-slate-800/50 rounded-xl p-6 backdrop-blur-sm hover:border-primary transition-all flex flex-col group overflow-hidden"
            >
              {/* Glow effect */}
              <div 
                className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"
                style={card3D.glowStyle}
              />
              <div className="relative z-10">
                <Quote size={24} className="text-primary mb-4 opacity-50" />
                
                <p className="text-slate-300 mb-4 flex-1 italic">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div>
                  <div className="font-bold text-white">{testimonial.author}</div>
                  <div className="text-sm text-slate-400">{testimonial.role}</div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}
                    />
                  ))}
                </div>
              </div>
              </div>
            </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-500 text-sm italic">
            * These testimonials may or may not be from real people. But they're definitely real feelings. 😄
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Testimonials;

