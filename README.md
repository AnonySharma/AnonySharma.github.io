# Ankit Kumar - Developer Portfolio

A modern, interactive portfolio website showcasing my work, skills, and experience as a Software Engineer. Built with React, TypeScript, and Tailwind CSS, featuring an interactive terminal interface.

🌐 **Live Site**: [anonySharma.github.io](https://anonySharma.github.io)
🌐 **Customize**: Update `config.ts` with your personal information to make it your own!

## ✨ Features

- **Interactive Terminal**: A fully functional terminal emulator with commands like `neofetch`, `docker ps`, `top`, and more
- **Responsive Design**: Modern, mobile-first design with smooth animations
- **Code Splitting**: Optimized bundle sizes with lazy loading for better performance
- **Dark Theme**: Beautiful dark theme with custom scrollbars and gradients
- **Project Showcase**: Display of professional projects and work experience
- **Skills Section**: Interactive skills visualization
- **Contact Integration**: Easy ways to connect via LinkedIn and email

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS 4.1.17 (PostCSS)
- **Icons**: Lucide React
- **Deployment**: GitHub Pages with GitHub Actions

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AnonySharma/AnonySharma.github.io.git
   cd AnonySharma.github.io
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Build and deploy to GitHub Pages (using gh-pages)

## 🏗️ Project Structure

```
.
├── components/              # React components
│   ├── sections/           # Page sections (Hero, About, Skills, etc.)
│   ├── layout/             # Layout components (Navbar, SectionWrapper, ErrorBoundary)
│   ├── effects/            # Visual effects (ParticleSystem, GlobalBackground, Screensaver)
│   ├── hooks/              # Shared custom hooks (use3DCard)
│   ├── ui/                 # UI components (Achievements, NotFound)
│   └── terminal/           # Terminal emulator
│       ├── commands/       # Command system
│       │   ├── registry/   # Command definitions (commandRegistry.ts)
│       │   ├── handlers/   # Command handlers (organized by category)
│       │   └── outputs/    # Output components (organized by category)
│       ├── hooks/          # Terminal hooks (useCommandLogic, useBootSequence)
│       └── ui/             # Terminal UI components
├── config.ts               # Profile configuration
├── constants.ts            # App constants and data
├── contexts/               # React contexts (AchievementContext)
├── index.css               # Global styles and Tailwind imports
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.ts          # Vite configuration
```

## 🚢 Deployment

This project uses GitHub Actions for automated deployment. See [.github/DEPLOYMENT.md](.github/DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

1. Ensure GitHub Pages is configured to use **GitHub Actions** (Settings → Pages → Source)
2. Push to the `master` branch:
   ```bash
   git push origin master
   ```
3. The workflow will automatically build and deploy your site

### Manual Deploy

```bash
npm run deploy
```

## 🎨 Customization

See [CONFIG_README.md](CONFIG_README.md) for detailed customization guide, including:
- Updating personal information via `config.ts`
- Customizing terminal branding
- Modifying styling and themes
- Adding projects and experience

## 📚 Documentation

- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Guide for adding new terminal commands and understanding the codebase architecture
- **[CONFIG_README.md](CONFIG_README.md)** - Complete configuration guide for customizing the portfolio
- **[ACHIEVEMENTS.md](ACHIEVEMENTS.md)** - Achievement cheatsheet for unlocking all portfolio features

## 🔧 Development Notes

- The project uses code splitting for optimal performance
- Terminal component is lazy-loaded
- All assets are optimized during build
- 404.html is automatically generated for SPA routing on GitHub Pages

## 📝 License

This project is private and personal.

## 👤 Author

**Ankit Kumar**

- LinkedIn: [cgankitsharma](https://www.linkedin.com/in/cgankitsharma)
- Email: cgankitsharma@gmail.com
- Location: Chas, Bokaro Steel City / Hyderabad

---

⭐ If you find this portfolio interesting, feel free to star the repository!
