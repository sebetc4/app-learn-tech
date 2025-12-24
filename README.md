# LearnTech

A modern learning management desktop application built with Electron, React, and TypeScript. LearnTech helps you organize, track, and manage your technical courses with a beautiful, responsive interface and comprehensive progress tracking.

![LearnTech](src/renderer/src/assets/icon.png)

## ✨ Features

### 📚 Course Management

- **Import Courses**: Support for ZIP and TAR.ZST archives with real-time extraction progress
- **Browse Courses**: Modern grid layout with course icons, descriptions, and progress indicators
- **Course Organization**: Automatic metadata parsing and structured content organization
- **Multi-user Support**: Separate progress tracking for different users

### 📊 Learning Dashboard

- **Statistics Overview**: Track total courses, completed lessons, learning hours, and progress
- **Progress Visualization**: Interactive charts with Recharts integration
- **Recent Courses**: Quick access to recently accessed courses with progress bars
- **Quick Actions**: One-click access to continue learning, browse courses, or import new content

### 🎨 Modern UI/UX

- **Responsive Design**: Optimized for desktop with mobile-first approach
- **Theme Support**: Light and dark mode with system preference detection
- **SCSS Architecture**: Token-based design system with comprehensive mixins

### 📖 Course Content

- **Chapter Organization**: Structured content with chapters and lessons
- **Multiple Content Types**: Support for text, video, and mixed content lessons
- **Progress Tracking**: Automatic status tracking (NOT_STARTED, IN_PROGRESS, COMPLETED)
- **Video Duration**: Track total learning hours based on video content

### 🔄 Data Integrity

- **Startup Verification**: Automatic course folder integrity checks
- **Soft Delete**: Preserve progression data when course folders are missing
- **Reactivation**: Seamlessly restore courses when re-imported
- **Database Migrations**: Version-controlled schema updates

## 🛠️ Technology Stack

### Core

- **Electron**: Cross-platform desktop framework
- **React 18**: Modern UI library with hooks
- **TypeScript**: Type-safe development
- **Electron Vite**: Fast build tooling

### UI/Styling

- **SCSS Modules**: Component-scoped styling
- **Recharts**: Data visualization library
- **Lucide React**: Modern icon library
- **Embla Carousel**: Touch-friendly carousels

### State Management

- **Zustand**: Lightweight state management
- **React Router v7**: Client-side routing

### Database

- **Better SQLite3**: Fast embedded database
- **Drizzle ORM**: Type-safe database access
- **SQL Migrations**: Versioned schema management

### Code Quality

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript Strict Mode**: Enhanced type safety

## 📁 Project Structure

```
learn-tech/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── index.ts         # Application entry point
│   │   ├── ipc/             # IPC handlers
│   │   └── services/        # Business logic
│   │       ├── course/      # Course management
│   │       ├── database/    # Database operations
│   │       ├── folder/      # File system operations
│   │       ├── import-course/ # Archive extraction
│   │       └── integrity/   # Data integrity checks
│   ├── preload/             # Preload scripts
│   │   └── bridges/         # IPC bridges
│   ├── renderer/            # React application
│   │   └── src/
│   │       ├── components/  # Reusable components
│   │       ├── pages/       # Page components
│   │       │   ├── HomePage/           # Dashboard
│   │       │   ├── CoursesListPage/    # Course browser
│   │       │   ├── CoursePage/         # Course detail
│   │       │   ├── LessonPage/         # Lesson viewer
│   │       │   └── CourseManagerPage/  # Import/manage
│   │       ├── router/      # React Router configuration
│   │       ├── store/       # Zustand stores
│   │       ├── styles/      # Global styles & theme
│   │       └── services/    # Frontend utilities
│   ├── database/
│   │   ├── schemas/         # Drizzle schema definitions
│   │   └── migrations/      # SQL migration files
│   └── types/               # TypeScript type definitions
└── resources/               # App icons and assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start development server with hot reload
pnpm dev

# Type checking
pnpm run typecheck

# Lint code
pnpm run lint

# Format code
pnpm run format
```

### Build

```bash
# Build for Windows
pnpm build:win

# Build for macOS
pnpm build:mac

# Build for Linux
pnpm build:linux

# Build for all platforms
pnpm build
```

## 📖 Usage

### Importing Courses

1. Navigate to the **Course Manager** page
2. Set your **Root Folder** where courses will be stored
3. Click **Import Archive** and select a ZIP or TAR.ZST file
4. Monitor real-time extraction progress
5. Course is automatically added to your library

### Browsing Courses

- View all courses on the **All Courses** page
- See course icons, descriptions, and progress
- Click **Start Course** or **Continue** to access content

### Tracking Progress

- View your learning overview on the **Home** dashboard
- See total courses, completed lessons, and learning hours
- Monitor overall progress with the interactive progress ring
- Quick access to recent courses with progress bars

### Managing Users

- Switch between multiple user profiles
- Each user has independent progress tracking
- Add or remove users via the user menu

## 🔧 Configuration

### Database

SQLite database located at: `{userData}/database.db`

### User Data

Application data stored in platform-specific locations:

- **Windows**: `%APPDATA%/learn-tech`
- **macOS**: `~/Library/Application Support/learn-tech`
- **Linux**: `~/.config/learn-tech`

### Course Metadata

Each course must include a `metadata.json` file:

```json
{
  "id": "course-slug",
  "name": "Course Name",
  "description": "Course description",
  "chapters": [...]
}
```

## 📚 Documentation

Additional documentation is available in the `/documentation` directory:

- Build instructions and configuration
- More detailed guides coming soon

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under a public license - feel free to use, modify, and distribute.
