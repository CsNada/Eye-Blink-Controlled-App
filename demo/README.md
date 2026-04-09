# Accessible Eye-Blink Control Hub

A fully accessible web application designed for students with disabilities, controlled entirely through eye-blink durations. Built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui components.

## 🎯 Core Concept

The entire application is navigated and controlled via eye-blink durations:

- **2 seconds**: Select/press the currently focused item
- **3 seconds**: Navigate to the next item (move focus)
- **4 seconds**: Go back / exit current view

## 🏗️ Architecture

### Contexts

1. **BlinkContext**: Manages global blink state and navigation
   - Tracks `focusedIndex` and `totalItems` for sequential navigation
   - Processes blink events (2s, 3s, 4s)
   - Listens for `window.postMessage` and custom DOM events
   - Exposes `window.blinkControl` API for external systems

2. **LanguageContext**: Bilingual support (English/Arabic)
   - Full translation dictionary
   - RTL/LTR layout switching
   - Translation function `t(key)`

3. **ThemeContext**: Dark/light mode
   - Theme toggle with localStorage persistence
   - Applies `.dark` class to document

### Components

- **FocusableButton**: Visual highlight with ring/scale animation when focused
- **ScanningKeyboard**: Auto-scanning virtual keyboard (3s per character)
- **BlinkControls**: Fixed bottom control bar with 2s/3s/4s buttons
- **Header**: App title, language toggle, theme toggle, back button
- **Layout**: Wraps pages with header and blink controls

### Pages

1. **Home** (`/`): Welcome, reminders, navigation grid
2. **Educational Platforms** (`/educational-platforms`): Quick links to learning platforms
3. **Notes** (`/notes`): Text editor with scanning keyboard
4. **Reminders** (`/reminders`): Quick templates and reminder list
5. **Messages** (`/messages`): Teacher selection and quick message templates
6. **Browser** (`/browser`): URL bar, bookmarks, embedded iframe
7. **Tasks** (`/tasks`): Add tasks, toggle completion status
8. **Files** (`/files`): Subject folders with file listings and PDF viewer

## 🔌 External API

### Window API

The app exposes `window.blinkControl` with the following methods:

```javascript
window.blinkControl.select();    // Trigger 2s blink
window.blinkControl.navigate();  // Trigger 3s blink
window.blinkControl.back();      // Trigger 4s blink
```

### PostMessage API

Send blink events via `window.postMessage`:

```javascript
window.postMessage({ event: 'picked', seconds: 2 }, '*');
window.postMessage({ event: 'exit', seconds: 4 }, '*');
```

### Custom DOM Events

Dispatch custom events:

```javascript
const event = new CustomEvent('blinkEvent', {
  detail: { seconds: 2 }
});
window.dispatchEvent(event);
```

## 🎨 Design System

- **Large touch targets**: Minimum 48px, preferably 64px+
- **High contrast colors**: Enhanced visibility
- **Large text**: 18px+ body, 24px+ headings
- **Rounded corners**: 2xl radius (10px)
- **Gradient backgrounds**: Color-coded feature icons
- **Smooth transitions**: All interactive elements
- **Card-based layouts**: Subtle shadows and borders
- **Fixed bottom bar**: 120px padding on all pages

## 🌐 Bilingual Support

Full English and Arabic translations with automatic RTL layout switching for Arabic.

### Supported Languages
- English (LTR)
- Arabic (RTL)

## ♿ Accessibility Features

- Eye-blink control system for hands-free operation
- Large touch targets (minimum 48px)
- High contrast color schemes
- Focus indicators with ring animations
- Screen reader friendly
- Keyboard navigation support
- RTL language support
- Dark mode for reduced eye strain

## 📱 Pages Overview

### Home Page
- User avatar and welcome message
- Today's reminders (3 sample items)
- Navigation grid with 7 feature cards

### Educational Platforms
- Grid of 6 educational platform cards
- Direct links to: Blackboard, Moodle, Google Classroom, Microsoft Teams, Zoom, YouTube Education

### Notes
- Text editor with textarea
- Scanning keyboard (English/Arabic)
- Save/delete/clear functionality
- List of saved notes with timestamps

### Reminders
- 6 quick template buttons
- Dynamic reminder list
- Time and date display

### Messages
- Teacher selection (4 teachers)
- 5 quick message templates
- Message history with avatars

### Browser
- URL/search input bar
- 6 quick bookmark buttons
- Embedded iframe for web browsing

### Tasks
- Add new tasks
- Toggle completion status
- Separate pending/completed sections

### Files
- 4 subject folders (Anatomy, Physiology, Biochemistry, Pharmacology)
- File listings within subjects
- PDF viewer with page navigation

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🛠️ Technology Stack

- **React 18.3.1**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS 4**: Styling
- **shadcn/ui**: Component library
- **React Router 7**: Navigation
- **Lucide React**: Icons

## 📦 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── BlinkControls.tsx
│   │   ├── FocusableButton.tsx
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   └── ScanningKeyboard.tsx
│   ├── contexts/
│   │   ├── BlinkContext.tsx
│   │   ├── LanguageContext.tsx
│   │   └── ThemeContext.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── EducationalPlatformsPage.tsx
│   │   ├── NotesPage.tsx
│   │   ├── RemindersPage.tsx
│   │   ├── MessagesPage.tsx
│   │   ├── BrowserPage.tsx
│   │   ├── TasksPage.tsx
│   │   └── FilesPage.tsx
│   ├── App.tsx
│   └── routes.tsx
└── styles/
    ├── fonts.css
    ├── index.css
    ├── tailwind.css
    └── theme.css
```

## 🎯 Key Features

- ✅ Eye-blink control system (2s/3s/4s)
- ✅ Bilingual support (English/Arabic with RTL)
- ✅ Dark/light theme toggle
- ✅ Scanning virtual keyboard
- ✅ Navigation with visual focus indicators
- ✅ Educational platform quick access
- ✅ Note-taking with save functionality
- ✅ Reminder templates
- ✅ Quick messaging system
- ✅ Web browser with bookmarks
- ✅ Task management
- ✅ File organization by subject
- ✅ Fully responsive design
- ✅ High contrast accessibility

## 📝 License

This project is private and intended for educational accessibility purposes.

## 🤝 Contributing

This is a specialized accessibility tool. For feature requests or bug reports, please contact the development team.
