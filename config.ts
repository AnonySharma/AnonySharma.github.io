// ============================================
// PORTFOLIO CONFIGURATION
// ============================================
// Update this file with your personal information
// to customize the entire portfolio

export interface ProfileConfig {
  // Personal Information
  personal: {
    firstName: string;
    lastName: string;
    fullName: string;
    title: string; // Current job title
    company: string; // Current company
    tagline: string; // Short tagline for hero section
    bio: string; // Longer bio for about section
    avatarUrl: string; // Profile picture URL
    location: string; // Current location
  };

  // Education
  education: {
    degree: string; // e.g., "B.Tech in Computer Science & Engineering"
    institution: string; // e.g., "IIT (BHU) Varanasi"
    period: string; // e.g., "2019-2023" or "Class of 2023"
    achievements?: string[]; // e.g., ["ICPC Regionalist (Rank 61)", "Design Head (Codefest)"]
  };

  // Experience (will be merged with EXPERIENCE from constants.ts)
  currentRole: {
    role: string;
    company: string;
    period: string;
    location: string;
  };

  // Social Links
  social: {
    github: {
      username: string;
      url: string;
    };
    linkedin: {
      username: string;
      url: string;
    };
    email: string;
    twitter?: {
      username: string;
      url: string;
    };
    website?: string;
  };

  // Terminal/OS Branding
  terminal: {
    osName: string; // e.g., "AnkitOS"
    osVersion: string; // e.g., "v2.4.0 LTS"
    username: string; // Terminal username
    hostname: string; // Terminal hostname
    kernel: string; // Kernel version
    shell: string; // Shell name and version
  };

  // Resume
  resume: {
    fileName: string; // e.g., "Ankit_Kumar_Resume.pdf"
    easterEggFileName?: string; // e.g., "Resume_Final_Final_v2_ACTUAL_FINAL_REALLY_FINAL.pdf"
  };

  // Achievement Badges (for hero section)
  badges?: string[]; // e.g., ["ICPC'21 Regionalist | Rank 61"]
}

// ============================================
// YOUR CONFIGURATION
// ============================================

export const PROFILE_CONFIG: ProfileConfig = {
  personal: {
    firstName: "Ankit",
    lastName: "Kumar",
    fullName: "Ankit Kumar",
    title: "Member of Technical Staff",
    company: "Salesforce",
    tagline: "IIT (BHU) CSE '23 Graduate. I build scalable systems and intuitive interfaces, combining competitive programming logic with creative design.",
    bio: `I'm a Member of Technical Staff at Salesforce, where I architect scalable cloud solutions. Before that, I built financial tech at Scapia and graduated from IIT (BHU) Varanasi in 2023.

My coding philosophy is simple: "Make it work, make it right, make it fast."

When I'm not debugging race conditions or optimizing database queries, you can find me competing in coding contests (ICPC Regionalist 🏆), exploring open source, or customizing my terminal configuration for the 100th time.`,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800&q=80",
    location: "Chas, Bokaro Steel City / Hyderabad",
  },

  education: {
    degree: "B.Tech in Computer Science & Engineering",
    institution: "IIT (BHU) Varanasi",
    period: "2019-2023",
    achievements: ["ICPC Regionalist (Rank 61)", "Design Head (Codefest)"],
  },

  currentRole: {
    role: "Member of Technical Staff",
    company: "Salesforce",
    period: "Aug 2025 - Present",
    location: "Hyderabad, Telangana, India",
  },

  social: {
    github: {
      username: "AnonySharma",
      url: "https://github.com/AnonySharma",
    },
    linkedin: {
      username: "cgankitsharma",
      url: "https://www.linkedin.com/in/cgankitsharma",
    },
    email: "cgankitsharma@gmail.com",
  },

  terminal: {
    osName: "AnkitOS",
    osVersion: "v2.4.0 LTS",
    username: "ankit",
    hostname: "portfolio",
    kernel: "5.15.0-76-generic",
    shell: "zsh 5.8.1",
  },

  resume: {
    fileName: "Ankit_Kumar_Resume.pdf",
    easterEggFileName: "Resume_Final_Final_v2_ACTUAL_FINAL_REALLY_FINAL.pdf",
  },

  badges: ["ICPC'21 Regionalist | Rank 61"],
};

// Helper function to get display name variations
export const getDisplayName = () => ({
  full: PROFILE_CONFIG.personal.fullName,
  first: PROFILE_CONFIG.personal.firstName,
  last: PROFILE_CONFIG.personal.lastName,
  initials: `${PROFILE_CONFIG.personal.firstName[0]}${PROFILE_CONFIG.personal.lastName[0]}`,
});

// Helper function to get title with company
export const getTitleWithCompany = () => 
  `${PROFILE_CONFIG.personal.title} @ ${PROFILE_CONFIG.personal.company}`;

