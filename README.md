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
├── components/          # React components
│   ├── terminal/        # Terminal emulator components
│   │   ├── commands/    # Terminal command implementations
│   │   ├── hooks/       # Custom React hooks
│   │   └── ui/          # Terminal UI components
│   ├── About.tsx        # About section
│   ├── Contact.tsx      # Contact section
│   ├── Hero.tsx         # Hero section
│   ├── Projects.tsx     # Projects showcase
│   └── Skills.tsx       # Skills section
├── constants.ts         # App constants and data
├── types.ts            # TypeScript type definitions
├── index.css           # Global styles and Tailwind imports
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.ts      # Vite configuration
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

### Update Personal Information

Edit `constants.ts` to update:
- Skills
- Work experience
- Projects
- About text
- Contact information

### Styling

- Tailwind configuration: `tailwind.config.js`
- Global styles: `index.css`
- Custom colors are defined in the Tailwind config (primary, secondary, dark)

### Terminal Commands

Add custom terminal commands in `components/terminal/commands/`:
- `SystemCommands.tsx` - System-related commands
- `NetworkCommands.tsx` - Network commands
- `FunCommands.tsx` - Fun/entertainment commands

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
