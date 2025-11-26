import React, { useState } from 'react';
import { PROJECTS } from '../../constants';
import { Github } from 'lucide-react';
import { useErrors } from '../../contexts/ErrorContext';
import { use3DCard } from '../hooks/use3DCard';
import SectionWrapper from '../layout/SectionWrapper';
import { animated } from '@react-spring/web';

const ProjectCard: React.FC<{ project: any, onClick: () => void, loading: boolean }> = ({ project, onClick, loading }) => {
    const card3D = use3DCard({ intensity: 18, enableGlow: true });

    return (
        <div 
            ref={card3D.ref}
            style={card3D.style}
            onMouseMove={card3D.onMouseMove}
            onMouseLeave={card3D.onMouseLeave}
            onMouseEnter={card3D.onMouseEnter}
            onClick={onClick}
            className="group relative bg-slate-950/80 border border-slate-800/50 rounded-xl overflow-hidden backdrop-blur-sm transition-all hover:border-slate-600 flex flex-col h-full cursor-pointer touch-manipulation"
        >
            {/* Glow effect */}
            <animated.div 
                className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-xl blur-xl transition-opacity duration-500 -z-10"
                style={card3D.glowStyle}
            />
            <div className="relative h-48 overflow-hidden bg-slate-800">
                <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                {loading && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <div className="text-white text-sm">Loading details...</div>
                    </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                        className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            // GitHub link would go here
                        }}
                    >
                        <Github size={20} />
                    </button>
                </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-slate-400 text-sm mb-4 flex-1">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags.map((tag: string) => (
                        <span key={tag} className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded-md border border-slate-700">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Projects: React.FC = () => {
  const { addError } = useErrors();
  const [loadingProject, setLoadingProject] = useState<string | null>(null);
  const errorTriggeredRef = React.useRef(false);

  const handleProjectClick = async (projectId: string, projectTitle: string) => {
    // Only trigger error once per session
    if (errorTriggeredRef.current || localStorage.getItem('error_caught') === 'true') {
      return;
    }

    setLoadingProject(projectId);
    
    // Simulate fetching project details from API
    try {
      // Simulate API call that fails
      await new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Failed to fetch project details: Connection timeout`));
        }, 800 + Math.random() * 400); // 800-1200ms delay to feel realistic
      });
    } catch (error: any) {
      // Only trigger error on first project click
      if (!errorTriggeredRef.current) {
        errorTriggeredRef.current = true;
        addError(
          'Project Details Service Unavailable',
          `Unable to fetch additional details for "${projectTitle}".\n\nError: ${error.message}\n\nThis might be due to:\n  - Network connectivity issues\n  - API service temporarily unavailable\n  - Rate limiting\n\nPlease try again later.\n\nStack trace:\n  at ProjectService.fetchDetails (api/projects.js:127:23)\n  at Projects.handleProjectClick (Projects.tsx:${Math.floor(Math.random() * 50) + 20}:15)\n\n---\n\n😄 Just kidding! This is a prank. There's no API - I just wanted to see your reaction! Check out my GitHub for the actual project details.`,
          'error'
        );
      }
    } finally {
      setLoadingProject(null);
    }
  };

  return (
    <SectionWrapper id="projects" variant="dark">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Key Projects</h2>
                <p className="text-slate-400 max-w-xl">
                    Highlighting my work in Fintech, Social Media, and Utility Platforms.
                </p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.map((project) => (
                <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onClick={() => handleProjectClick(project.id, project.title)}
                    loading={loadingProject === project.id}
                />
            ))}
        </div>
       </div>
    </SectionWrapper>
  );
};

export default Projects;