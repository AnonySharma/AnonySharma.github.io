import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music as MusicIcon, Mic2 } from 'lucide-react';
import { SONGS } from '../constants';

const MusicSection: React.FC = () => {
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio object once
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    const audio = audioRef.current;

    // Handle playback
    const handlePlay = async () => {
      if (playing) {
        const song = SONGS.find((s) => s.id === playing);
        if (song && song.audioUrl) {
          // Change source only if different
          if (audio.src !== song.audioUrl) {
            audio.src = song.audioUrl;
            audio.load(); // Ensure new source is loaded
          }
          
          try {
            await audio.play();
          } catch (error) {
            console.error("Playback failed:", error);
            setPlaying(null);
          }
        }
      } else {
        audio.pause();
      }
    };

    handlePlay();

    // Event listeners
    const onEnded = () => setPlaying(null);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('ended', onEnded);
      // Only pause on unmount if we want to stop music when leaving section, 
      // but typically in single page apps music persists. 
      // However, if the component unmounts, we should pause to avoid memory leaks/ghost audio.
      // audio.pause(); 
    };
  }, [playing]);

  const togglePlay = (id: string) => {
    if (playing === id) {
      setPlaying(null);
    } else {
      setPlaying(id);
    }
  };

  return (
    <section id="music" className="py-24 relative overflow-hidden bg-slate-900/30">
      {/* Decorative Vinyl */}
      <div className="absolute -right-20 top-20 opacity-10 animate-spin-slow hidden lg:block pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full border-[40px] border-slate-800 flex items-center justify-center bg-black">
            <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-secondary to-rose-600"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
            <div className="flex items-center gap-3 mb-4 text-secondary">
                <Mic2 size={24} />
                <span className="uppercase tracking-widest font-bold text-sm">The Musician Side</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 serif">
              Rhythm in Code.<br/>Melody in Soul.
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Music is my escape and my inspiration. Whether I'm covering classics or composing originals, 
              singing teaches me about flow, harmony, and connecting with an audience—skills I bring back to my UI design.
            </p>
            
            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 backdrop-blur-sm">
               <h3 className="text-white font-bold mb-4">Featured Tracks</h3>
               <div className="space-y-4">
                 {SONGS.map((song) => (
                   <div key={song.id} className={`flex items-center justify-between p-3 rounded-lg transition-all ${playing === song.id ? 'bg-white/10 border-l-4 border-secondary' : 'hover:bg-white/5 border-l-4 border-transparent'}`}>
                     <div className="flex items-center gap-4">
                        <button 
                          onClick={() => togglePlay(song.id)}
                          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white hover:bg-rose-600 transition-colors flex-shrink-0"
                        >
                          {playing === song.id ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                        </button>
                        <div>
                          <p className="text-white font-medium">{song.title}</p>
                          <p className="text-slate-400 text-sm">{song.artist}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        {playing === song.id && (
                            <div className="flex items-end gap-1 h-4">
                                <div className="w-1 bg-secondary rounded-t music-bar animate-[bounce_1s_infinite]"></div>
                                <div className="w-1 bg-secondary rounded-t music-bar animate-[bounce_1.2s_infinite]"></div>
                                <div className="w-1 bg-secondary rounded-t music-bar animate-[bounce_0.8s_infinite]"></div>
                                <div className="w-1 bg-secondary rounded-t music-bar animate-[bounce_1.1s_infinite]"></div>
                            </div>
                        )}
                        <span className="text-slate-500 text-sm">{song.duration}</span>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center">
             {/* Visual Card */}
             <div className="relative w-full max-w-md aspect-[3/4] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 group">
                <img 
                  src="https://picsum.photos/600/800?grayscale" 
                  alt="Ankit Singing" 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8">
                   <p className="text-secondary font-bold mb-1">Live Performance</p>
                   <h3 className="text-2xl text-white font-bold">Open Mic Night</h3>
                   <p className="text-slate-400 text-sm mt-2">Bangalore, India</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MusicSection;