import React from 'react';
import { Mail, MapPin, Linkedin } from 'lucide-react';
import { CONTACT_INFO } from '../../constants';
import { PROFILE_CONFIG } from '../../config';
import SectionWrapper from '../layout/SectionWrapper';

const Contact: React.FC = () => {
  return (
    <SectionWrapper id="contact" variant="gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 serif">Let's Connect</h2>
            <p className="text-slate-400 mb-8 text-lg">
              Whether you're interested in my work at {PROFILE_CONFIG.personal.company}, my journey, or just want to say hi.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-primary">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <a 
                    href={`mailto:${CONTACT_INFO.email}`} 
                    className="font-medium hover:text-primary transition-colors"
                    onClick={() => {
                      localStorage.setItem('social_email_clicked', 'true');
                      window.dispatchEvent(new Event('socialLinkClicked'));
                    }}
                  >
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-primary">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Location</p>
                  <p className="font-medium">{CONTACT_INFO.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-300">
                 <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-primary">
                   <Linkedin size={20} />
                 </div>
                 <div>
                   <p className="text-sm text-slate-500">LinkedIn</p>
                   <a 
                     href={CONTACT_INFO.linkedin} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="font-medium hover:text-primary transition-colors"
                     onClick={() => {
                       localStorage.setItem('social_linkedin_clicked', 'true');
                       window.dispatchEvent(new Event('socialLinkClicked'));
                     }}
                   >
                     {CONTACT_INFO.linkedinHandle}
                   </a>
                 </div>
               </div>
            </div>
          </div>

          <form className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Name</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                <input type="email" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors" placeholder="you@example.com" />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-400 mb-2">Message</label>
              <textarea rows={4} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors" placeholder={`Hi ${PROFILE_CONFIG.personal.firstName}...`}></textarea>
            </div>
            <button type="button" className="w-full bg-primary hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02]">
              Send Message
            </button>
          </form>
        </div>

        <div className="border-t border-slate-800 mt-20 pt-8 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} {PROFILE_CONFIG.personal.fullName}. All rights reserved.</p>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Contact;