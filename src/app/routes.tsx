import { createHashRouter } from 'react-router';
import { Root } from './components/Root';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { EducationalPlatformsPage } from './pages/EducationalPlatformsPage';
import { NotesPage } from './pages/NotesPage';
import { RemindersPage } from './pages/RemindersPage';
import { MessagesPage } from './pages/MessagesPage';
import { BrowserPage } from './pages/BrowserPage';
import { BrowsersPage } from './pages/BrowsersPage';
import { TasksPage } from './pages/TasksPage';
import { FilesPage } from './pages/FilesPage';
import { StudentProfilePage } from './pages/StudentProfilePage';

export const router = createHashRouter([
  {
    path: '/',
    Component: Root,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          { index: true, Component: HomePage },
          { path: 'educational-platforms', Component: EducationalPlatformsPage },
          { path: 'notes', Component: NotesPage },
          { path: 'reminders', Component: RemindersPage },
          { path: 'messages', Component: MessagesPage },
          { path: 'browser', Component: BrowserPage },
          { path: 'browsers', Component: BrowsersPage },
          { path: 'tasks', Component: TasksPage },
          { path: 'files', Component: FilesPage },
          { path: 'student-profile', Component: StudentProfilePage },
          { path: '*', Component: HomePage },
        ],
      },
    ],
  },
]);