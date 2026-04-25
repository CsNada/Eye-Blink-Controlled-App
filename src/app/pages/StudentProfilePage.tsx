import React from 'react';
import {
  GraduationCap,
  BookOpen,
  TrendingUp,
  User,
} from 'lucide-react';

interface Course {
  name: string;
  code: string;
  progress: number;
  color: string;
}

export function StudentProfilePage() {
  const studentInfo = {
    name: 'محمد أحمد الأحمدي',
    id: '202401234',
    major: 'علوم الحاسب',
    level: 'المستوى السادس',
    avatar: 'م',
  };

  const courses: Course[] = [
    {
      name: 'هندسة البرمجيات',
      code: 'CS401',
      progress: 85,
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'قواعد البيانات',
      code: 'CS302',
      progress: 72,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      name: 'شبكات الحاسب',
      code: 'CS303',
      progress: 90,
      color: 'from-purple-500 to-purple-600',
    },
    {
      name: 'الذكاء الاصطناعي',
      code: 'CS405',
      progress: 68,
      color: 'from-amber-500 to-amber-600',
    },
    {
      name: 'أمن المعلومات',
      code: 'CS404',
      progress: 95,
      color: 'from-cyan-500 to-cyan-600',
    },
  ];

  const averageProgress = Math.round(
    courses.reduce((sum, course) => sum + course.progress, 0) / courses.length
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 pb-32">
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="mb-6">
          <h2 className="mb-2 flex items-center gap-3 text-4xl font-bold">
            <GraduationCap className="h-9 w-9 text-primary" />
            ملف الطالب
          </h2>
          <p className="text-lg text-muted-foreground">
            معلومات الطالب والتقدم الأكاديمي
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-blue-50 to-white shadow-lg">
          <div className="p-8">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 opacity-30 blur-xl" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-400 to-blue-600 text-3xl font-bold text-white shadow-xl">
                  {studentInfo.avatar}
                </div>
              </div>

              <div className="flex-1 space-y-3 text-center md:text-right">
                <h3 className="text-3xl font-bold text-foreground">
                  {studentInfo.name}
                </h3>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">الرقم الجامعي</p>
                      <p className="text-sm font-semibold">{studentInfo.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="rounded-lg bg-emerald-100 p-2">
                      <BookOpen className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">التخصص</p>
                      <p className="text-sm font-semibold">{studentInfo.major}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="rounded-lg bg-purple-100 p-2">
                      <GraduationCap className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">المستوى الدراسي</p>
                      <p className="text-sm font-semibold">{studentInfo.level}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="rounded-lg bg-amber-100 p-2">
                      <TrendingUp className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">المعدل التراكمي</p>
                      <p className="text-sm font-semibold">{averageProgress}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background shadow-lg">
          <div className="border-b border-border p-6">
            <h3 className="flex items-center gap-2 text-2xl font-semibold">
              <BookOpen className="h-6 w-6 text-primary" />
              المقررات الدراسية
            </h3>
          </div>

          <div className="space-y-4 p-6">
            {courses.map((course, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-gradient-to-br from-white to-blue-50/30 p-5 transition-all duration-300 hover:shadow-md"
              >
                <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-foreground">
                      {course.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">{course.code}</p>
                  </div>

                  <div
                    className={`rounded-full bg-gradient-to-r ${course.color} px-4 py-2 text-sm font-bold text-white shadow-md`}
                  >
                    {course.progress}%
                  </div>
                </div>

                <div className="relative h-3 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${course.color}`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-blue-50 to-white shadow-lg">
          <div className="p-6 text-center">
            <p className="mb-2 text-sm text-muted-foreground">
              التقدم الأكاديمي الإجمالي
            </p>
            <div className="flex items-center justify-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <span className="bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-5xl font-bold text-transparent">
                {averageProgress}%
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              متوسط التقدم في جميع المقررات
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}