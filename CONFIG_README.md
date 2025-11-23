# 📝 Configuration Guide

This portfolio is fully customizable! Update the `config.ts` file with your personal information, and the entire portfolio will adapt to your details.

## Quick Start

1. Open `config.ts` in the root directory
2. Update the `PROFILE_CONFIG` object with your information
3. Build and deploy!

## Configuration Sections

### Personal Information
```typescript
personal: {
  firstName: "Your",
  lastName: "Name",
  fullName: "Your Full Name",
  title: "Your Job Title",
  company: "Your Company",
  tagline: "Your tagline for the hero section",
  bio: "Your longer bio for the about section",
  avatarUrl: "URL to your profile picture",
  location: "Your location",
}
```

### Education
```typescript
education: {
  degree: "Your Degree",
  institution: "Your University",
  period: "2019-2023", // or "Class of 2023"
  achievements: ["Achievement 1", "Achievement 2"], // Optional
}
```

### Social Links
```typescript
social: {
  github: {
    username: "your-github-username",
    url: "https://github.com/your-username",
  },
  linkedin: {
    username: "your-linkedin-handle",
    url: "https://www.linkedin.com/in/your-handle",
  },
  email: "your.email@example.com",
}
```

### Terminal/OS Branding
```typescript
terminal: {
  osName: "YourOS", // e.g., "JohnOS", "SarahOS"
  osVersion: "v1.0.0 LTS",
  username: "yourname", // Terminal username
  hostname: "portfolio", // Terminal hostname
  kernel: "5.15.0-76-generic",
  shell: "zsh 5.8.1",
}
```

### Resume
```typescript
resume: {
  fileName: "Your_Name_Resume.pdf",
  easterEggFileName: "Resume_Final_Final_v2_ACTUAL_FINAL_REALLY_FINAL.pdf", // Optional
}
```

### Badges (Optional)
```typescript
badges: ["Your Achievement | Rank X", "Another Achievement"],
```

## What Gets Updated Automatically

When you update `config.ts`, the following will automatically change:

✅ **Hero Section**
- Name, title, tagline
- Social media links
- Resume download filename
- Achievement badges

✅ **About Section**
- Bio text
- Profile picture
- Education details

✅ **Terminal Commands**
- `sysinfo` - Shows your GitHub stats
- `neofetch` - Displays your OS branding
- `whoami` - Shows your name
- `resume` - Displays your resume info
- All terminal prompts and system info

✅ **Contact Section**
- Email, LinkedIn, GitHub links

✅ **File System**
- User info in virtual file system

## Additional Customization

### Projects & Experience
Update `constants.ts`:
- `PROJECTS` array - Your project portfolio
- `EXPERIENCE` array - Your work history
- `SKILLS` array - Your technical skills

### Styling
- Colors: Update `tailwind.config.js` for primary/secondary colors
- Fonts: Update `index.html` for custom fonts

## Notes

- The GitHub API will automatically fetch stats for the username you provide
- All terminal commands respect your configuration
- The portfolio maintains all easter eggs and achievements - they work with any configuration!

## Example Configuration

See `config.ts` for a complete example with all fields filled in.

---

**Happy Customizing! 🎨**

