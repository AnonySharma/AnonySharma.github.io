
import React, { useMemo } from 'react';
import { FSNode, FileNode } from './TerminalTypes';
import { EXPERIENCE, PROJECTS, CONTACT_INFO } from '../../constants';
import { PROFILE_CONFIG, getTitleWithCompany } from '../../config';

export const useFileSystem = () => {
  return useMemo<Record<string, FSNode>>(() => {
    // Format Experience as a log file
    const expContent = EXPERIENCE.map(e => 
`[${e.period}] ${e.role} @ ${e.company}
Location: ${e.location}
${e.description.map(d => `  - ${d}`).join('\n')}
----------------------------------------`).join('\n\n');

    // Format Projects as individual files
    const projectFiles: Record<string, FileNode> = {};
    PROJECTS.forEach(p => {
        const fileName = p.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.md';
        projectFiles[fileName] = {
            type: 'file',
            content: (
                <div className="space-y-2 font-mono">
                    <div className="text-green-400 font-bold text-lg border-b border-slate-700 pb-1 inline-block">{p.title}</div>
                    <div className="opacity-90 italic">{p.description}</div>
                    <div className="flex gap-2 mt-2">
                        {p.tags.map(t => <span key={t} className="px-1.5 py-0.5 bg-slate-800 text-blue-300 text-xs border border-slate-700">{t}</span>)}
                    </div>
                    <div className="mt-2 text-slate-500 text-sm">
                        [LINK]: <span className="text-blue-500 underline cursor-pointer">{p.imageUrl}</span> (Use 'open' command to view)
                    </div>
                </div>
            ),
            url: p.imageUrl
        };
    });
    projectFiles['README.txt'] = {
        type: 'file',
        content: "These are my key projects. Use 'cat <filename>' to read details or 'open <filename>' to view the live link/image."
    };

    const aboutContent = `# ${PROFILE_CONFIG.personal.fullName} - Developer Portfolio

## Identity
**Role:** ${getTitleWithCompany()}
**Location:** ${PROFILE_CONFIG.personal.location}
**Education:** ${PROFILE_CONFIG.education.institution} (${PROFILE_CONFIG.education.period})
**Status:** Building cool things 🚀

## Professional Summary
I am a backend-heavy Full Stack Developer with a deep passion for **System Design** and **Competitive Programming**.
I thrive in high-pressure environments (Rank 61 @ ICPC Regionals) and love optimizing data pipelines (reduced latency from 2.5s to 300ms).

## Tech Stack
- **Languages:** C++, JavaScript, TypeScript, Python, Dart
- **Frontend:** React, Flutter, Tailwind CSS
- **Backend:** Spring Boot, Node.js, Express
- **Cloud:** AWS (EC2, S3, Lambda), Google Cloud
- **Databases:** PostgreSQL, MongoDB, BigTable

## Fun Facts
- I am a **Singer** 🎤 (Try the \`sing\` command!)
- I love **UI/UX Design** and creating immersive experiences (like this terminal).
- I enjoy mentoring juniors in CP and Dev.

## Contact
- **Email:** ${CONTACT_INFO.email}
- **LinkedIn:** ${CONTACT_INFO.linkedin}

Type \`cat skills.json\` to see my skills in JSON format!
`;

    const skillsContent = `{
  "languages": [
    "C++", 
    "JavaScript", 
    "TypeScript",
    "HTML/CSS"
  ],
  "frameworks": [
    "Spring Boot", 
    "Flutter", 
    "React",
    "Next.js"
  ],
  "cloud_infrastructure": {
    "provider": "AWS",
    "services": ["EC2", "S3", "Lambda"]
  },
  "core_competencies": [
    "Data Structures & Algorithms", 
    "System Design",
    "Low Latency Systems"
  ],
  "soft_skills": [
    "Problem Solving",
    "Leadership",
    "Design Thinking"
  ]
}`;

    return {
        '~': {
            type: 'dir',
            children: {
                'portfolio': {
                    type: 'dir',
                    children: {
                        'about.md': { 
                            type: 'file', 
                            content: aboutContent 
                        },
                        'skills.json': { 
                            type: 'file', 
                            content: skillsContent 
                        },
                        'experience.log': { 
                            type: 'file', 
                            content: expContent 
                        },
                        'projects': {
                            type: 'dir',
                            children: projectFiles
                        },
                        'contact.txt': {
                            type: 'file',
                            content: `EMAIL: ${CONTACT_INFO.email}
LINKEDIN: ${CONTACT_INFO.linkedinHandle}
LOCATION: ${CONTACT_INFO.location}

Use 'open contact' to visit LinkedIn.`
                        },
                        '.env': {
                            type: 'file',
                            content: `API_KEY=hunter2
SECRET_SAUCE=love
MEANING_OF_LIFE=42
KONAMI_CODE=UP,UP,DOWN,DOWN,LEFT,RIGHT,LEFT,RIGHT,B,A
`
                        },
                        'todo.md': {
                            type: 'file',
                            content: `- [x] Build the coolest portfolio ever
- [x] Add easter eggs
- [ ] Take over the world (pending)
- [ ] Drink more coffee
- [ ] Fix that one bug in line 42
`
                        },
                        'resume.pdf': {
                            type: 'file',
                            isBinary: true,
                            content: "",
                            url: PROFILE_CONFIG.social.linkedin.url
                        }
                    }
                }
            }
        }
    };
  }, []);
};
