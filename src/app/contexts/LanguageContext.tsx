import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    appTitle: 'Accessible Control Hub',
    search: 'Search...',
    back: 'Back',
    
    // Home
    welcome: 'Welcome',
    welcomeMessage: 'You are doing great, keep going 👍',
    dashboard: 'Dashboard',
    quickActions: 'Quick Actions',
    quickActionsSubtitle: 'Keep going, every step matters ✨',
    todaysReminders: "Today's Reminders",
    sundayLecture: 'Sunday Lecture',
    studyTime: 'Study Time',
    prayerTime: 'Prayer Time',
    educationalNotesSubtitle: 'Write and save your educational notes easily',
    notesEncouragement: 'Every idea is important ✨',
    messagesSubtitle: 'Messages and Communication',
    stayConnected: 'Stay connected 💬',
    studentProfile: 'Student Profile',
    studentProfileSubtitle: 'Student information and progress',
    progressInspiring: 'Your progress inspires us 🌟',
    browsers: 'Web Browsers',
    browsersSubtitle: 'Access your favorite browsers',
    files: 'Subject Files',
    filesSubtitle: 'Access your educational files',
    educationalPlatforms: 'Educational Platforms',
    platformsSubtitle: 'Access learning platforms',
    
    // Navigation
    notes: 'Notes',
    educationalNotes: 'Educational Notes',
    reminders: 'Reminders',
    messages: 'Messages',
    browser: 'Browser',
    tasks: 'Tasks',
    
    // Blink Controls
    blinkControlsTitle: 'Eye Control',
    select: 'Select',
    navigate: 'Navigate',
    goBack: 'Back',
    instruction: 'Eye Control: 2s=Select, 3s=Navigate, 4s=Back',
    lastEvent: 'Last Event',
    
    // Notes
    notesTitle: 'My Educational Notes',
    typeYourNote: 'Type your note here...',
    save: 'Save',
    delete: 'Delete',
    clear: 'Clear',
    savedNotes: 'Saved Notes',
    noNotes: 'No notes yet',
    
    // Keyboard
    english: 'English',
    arabic: 'Arabic',
    deleteChar: 'Delete',
    space: 'Space',
    
    // Reminders
    remindersTitle: 'Reminders',
    addReminder: 'Add Reminder',
    quickTemplates: 'Quick Templates',
    thursdayLecture: 'Thursday Lecture',
    researchProject: 'Research Project',
    anatomyHomework: 'Anatomy Homework',
    noReminders: 'No reminders yet',
    
    // Messages
    messagesTitle: 'Messages',
    selectTeacher: 'Select Teacher',
    teacher: 'Teacher',
    quickMessages: 'Quick Messages',
    hello: 'Hello',
    needQuestion: 'I need to ask a question',
    lectureToday: 'Is there a lecture today?',
    thankYou: 'Thank you',
    goodbye: 'Goodbye',
    messageHistory: 'Message History',
    noMessages: 'No messages yet',
    sendMessage: 'Send Message',
    typeMessage: 'Type your message...',
    
    // Browser
    browserTitle: 'Web Browsers',
    urlPlaceholder: 'Enter URL or search...',
    go: 'Go',
    bookmarks: 'Quick Bookmarks',
    chrome: 'Google Chrome',
    firefox: 'Mozilla Firefox',
    safari: 'Safari',
    edge: 'Microsoft Edge',
    brave: 'Brave Browser',
    opera: 'Opera',
    
    // Tasks
    tasksTitle: 'Tasks',
    addTask: 'Add Task',
    newTask: 'New task...',
    completed: 'Completed',
    pending: 'Pending',
    noTasks: 'No tasks yet',
    
    // Files
    filesTitle: 'Subject Files',
    subjects: 'Subjects',
    anatomy: 'Anatomy',
    physiology: 'Physiology',
    biochemistry: 'Biochemistry',
    pharmacology: 'Pharmacology',
    physics: 'Physics',
    chemistry: 'Chemistry',
    computer: 'Computer Science',
    mathematics: 'Mathematics',
    previousPage: 'Previous Page',
    nextPage: 'Next Page',
    noFiles: 'No files available',
    
    // Educational Platforms
    platformsTitle: 'Educational Platforms',
    blackboard: 'Blackboard',
    moodle: 'Moodle',
    googleClassroom: 'Google Classroom',
    microsoftTeams: 'Microsoft Teams',
    zoom: 'Zoom',
    youtube: 'YouTube',
    baims: 'Baims',
    ajdur: 'Ajdur',
    vision: 'Vision',
    bannerPNU: 'Banner PNU',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
  },
  ar: {
    // Header
    appTitle: 'مركز التحكم المتاح',
    search: 'بحث...',
    back: 'رجوع',
    
    // Home
    welcome: 'مرحباً بك',
    welcomeMessage: 'أنت تقوم بعمل رائع، استمر 👍',
    dashboard: 'لوحة التحكم',
    quickActions: 'إجراءات سريعة',
    quickActionsSubtitle: 'استمر، كل خطوة مهمة ✨',
    todaysReminders: 'تذكيرات اليوم',
    sundayLecture: 'محاضرة يوم الأحد',
    studyTime: 'وقت المذاكرة',
    prayerTime: 'وقت الصلاة',
    educationalNotesSubtitle: 'اكتب واحفظ ملاحظاتك التعليمية بسهولة',
    notesEncouragement: 'كل فكرة مهمة ✨',
    messagesSubtitle: 'الرسائل والتواصل',
    stayConnected: 'ابقَ على تواصل 💬',
    studentProfile: 'ملف الطالب',
    studentProfileSubtitle: 'معلومات الطالب والتقدم',
    progressInspiring: 'تقدمك يُلهمنا 🌟',
    browsers: 'متصفحات الويب',
    browsersSubtitle: 'الوصول إلى متصفحاتك المفضلة',
    files: 'ملفات المواد',
    filesSubtitle: 'الوصول إلى ملفاتك التعليمية',
    educationalPlatforms: 'المنصات التعليمية',
    platformsSubtitle: 'الوصول إلى منصات التعلم',
    
    // Navigation
    notes: 'الملاحظات',
    educationalNotes: 'الملاحظات التعليمية',
    reminders: 'التذكيرات',
    messages: 'الرسائل',
    browser: 'المتصفح',
    tasks: 'المهام',
    
    // Blink Controls
    blinkControlsTitle: 'التحكم بالعين',
    select: 'اختيار',
    navigate: 'تنقل',
    goBack: 'رجوع',
    instruction: 'التحكم بالعين: 2ث=اختيار، 3ث=تنقل، 4ث=رجوع',
    lastEvent: 'آخر حدث',
    
    // Notes
    notesTitle: 'ملاحظاتي التعليمية',
    typeYourNote: 'اكتب ملاحظتك هنا...',
    save: 'حفظ',
    delete: 'حذف',
    clear: 'مسح',
    savedNotes: 'الملاحظات المحفوظة',
    noNotes: 'لا توجد ملاحظات بعد',
    
    // Keyboard
    english: 'إنجليزي',
    arabic: 'عربي',
    deleteChar: 'حذف',
    space: 'مسافة',
    
    // Reminders
    remindersTitle: 'التذكيرات',
    addReminder: 'إضافة تذكير',
    quickTemplates: 'قوالب سريعة',
    thursdayLecture: 'محاضرة الخميس',
    researchProject: 'مشروع البحث',
    anatomyHomework: 'واجب التشريح',
    noReminders: 'لا توجد تذكيرات بعد',
    
    // Messages
    messagesTitle: 'الرسائل',
    selectTeacher: 'اختر المدرس',
    teacher: 'مدرس',
    quickMessages: 'رسائل سريعة',
    hello: 'مرحباً',
    needQuestion: 'أحتاج لطرح سؤال',
    lectureToday: 'هل هناك محاضرة اليوم؟',
    thankYou: 'شكراً لك',
    goodbye: 'وداعاً',
    messageHistory: 'سجل الرسائل',
    noMessages: 'لا توجد رسائل بعد',
    sendMessage: 'إرسال رسالة',
    typeMessage: 'اكتب رسالتك...',
    
    // Browser
    browserTitle: 'متصفحات الويب',
    urlPlaceholder: 'أدخل الرابط أو ابحث...',
    go: 'انتقل',
    bookmarks: 'إشارات مرجعية سريعة',
    chrome: 'جوجل كروم',
    firefox: 'موزيلا فايرفوكس',
    safari: 'سفاري',
    edge: 'مايكروسوفت إيدج',
    brave: 'متصفح برايف',
    opera: 'أوبرا',
    
    // Tasks
    tasksTitle: 'المهام',
    addTask: 'إضافة مهمة',
    newTask: 'مهمة جديدة...',
    completed: 'مكتملة',
    pending: 'قيد الانتظار',
    noTasks: 'لا توجد مهام بعد',
    
    // Files
    filesTitle: 'ملفات المواد',
    subjects: 'المواد',
    anatomy: 'التشريح',
    physiology: 'علم وظائف الأعضاء',
    biochemistry: 'الكيمياء الحيوية',
    pharmacology: 'علم الأدوية',
    physics: 'الفيزياء',
    chemistry: 'الكيمياء',
    computer: 'علوم الحاسب',
    mathematics: 'الرياضيات',
    previousPage: 'الصفحة السابقة',
    nextPage: 'الصفحة التالية',
    noFiles: 'لا توجد ملفات متاحة',
    
    // Educational Platforms
    platformsTitle: 'المنصات التعليمية',
    blackboard: 'بلاك بورد',
    moodle: 'مودل',
    googleClassroom: 'جوجل كلاسروم',
    microsoftTeams: 'مايكروسوفت تيمز',
    zoom: 'زوم',
    youtube: 'يوتيوب',
    baims: 'بيمز',
    ajdur: 'أجدر',
    vision: 'فيجن',
    bannerPNU: 'بانر جامعة الأميرة نورة',
    
    // Common
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
  },
};

// Create context directly - no singleton pattern needed
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Update document direction based on language
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}