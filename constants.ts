import { Project, Experience } from './types';

export const SKILLS = [
  "C++", "JavaScript", "HTML", "Spring Boot", "Flutter", "AWS", "Material UI", "Data Structures", "Algorithms", "Competitive Programming"
];

export const EXPERIENCE: Experience[] = [
  {
    id: "1",
    role: "Member of Technical Staff",
    company: "Salesforce",
    period: "Aug 2025 - Present",
    location: "Hyderabad, Telangana, India",
    description: [
      "Working with cutting-edge enterprise cloud solutions.",
      "Promoted from Associate MTS after 2 years of consistent performance."
    ]
  },
  {
    id: "2",
    role: "Associate Member of Technical Staff",
    company: "Salesforce",
    period: "June 2023 - Aug 2025",
    location: "Hyderabad, Telangana, India",
    description: [
      "Contributed to core platform development.",
      "Collaborated with cross-functional teams to deliver scalable features."
    ]
  },
  {
    id: "3",
    role: "Full Stack Developer",
    company: "Scapia",
    period: "Dec 2022 - April 2023",
    location: "Bengaluru, Karnataka, India",
    description: [
      "Contributed to the travel-now-pay-later (TNPL) vertical using Spring Boot (Backend) and Flutter (Frontend).",
      "Gained hands-on experience with AWS and its major tools.",
      "Developed a deep understanding of credit and finance domains."
    ]
  },
  {
    id: "4",
    role: "Full-stack Developer",
    company: "Sogage Software",
    period: "Nov 2021 - Oct 2022",
    location: "Remote",
    description: [
      "Integrated Facebook and Instagram APIs for feed retrieval and data transformation in BigTable.",
      "Upgraded UI to Material UI, improving aesthetics and responsiveness.",
      "Optimized page-load time from 2.5s to 300ms by modifying schemas and migrating data using DataFlow."
    ]
  },
  {
    id: "5",
    role: "Design Head",
    company: "Codefest",
    period: "Aug 2021 - March 2023",
    location: "IIT (BHU)",
    description: [
      "Designed posters, swags, and official brochures.",
      "Guided juniors in design principles and web contributions for the official fest website."
    ]
  }
];

export const PROJECTS: Project[] = [
  {
    id: "p1",
    title: "Discom Energy Platform",
    description: "Built a platform for Discoms to connect with users for scheme enrollment. Features included CO2 emission calculation, cost savings analysis, and energy usage optimization.",
    tags: ["Data Modelling", "APIs", "Frontend", "Energy Cloud"],
    imageUrl: "https://picsum.photos/600/400?random=10",
  },
  {
    id: "p2",
    title: "TNPL Vertical Integration",
    description: "Developed the Travel-Now-Pay-Later vertical for Scapia. Implemented secure financial transactions and user credit workflows.",
    tags: ["Spring Boot", "Flutter", "AWS", "Finance"],
    imageUrl: "https://picsum.photos/600/400?random=11",
  },
  {
    id: "p3",
    title: "Social Media Data Pipeline",
    description: "High-performance data pipeline fetching social feeds. Optimized schemas to reduce load times by 88% (2.5s to 300ms).",
    tags: ["BigTable", "DataFlow", "API Integration", "Optimization"],
    imageUrl: "https://picsum.photos/600/400?random=12",
  }
];

export const ABOUT_TEXT = `I am Ankit Kumar, a Computer Science graduate from IIT (BHU) Varanasi (Class of '23) and currently a Member of Technical Staff at Salesforce. 

I have a strong foundation in Competitive Programming, ranking 61st in ICPC Regionals, which fuels my problem-solving approach to software engineering. My expertise spans full-stack development—from optimizing backend schemas in BigTable to crafting intuitive UIs with Flutter and Material UI.

Beyond code, I have a creative side as a former Design Head for Codefest, where I blended technical skills with visual design. I am passionate about building scalable, efficient, and user-centric solutions.`;

export const CONTACT_INFO = {
  email: "cgankitsharma@gmail.com",
  location: "Chas, Bokaro Steel City / Hyderabad",
  linkedin: "https://www.linkedin.com/in/cgankitsharma",
  linkedinHandle: "cgankitsharma"
};