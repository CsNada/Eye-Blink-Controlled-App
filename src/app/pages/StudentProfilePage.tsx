import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useBlink } from '../contexts/BlinkContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { User, GraduationCap, BookOpen, TrendingUp } from 'lucide-react';

interface Course {
  name: string;
  code: string;
  progress: number;
  color: string;
}

export function StudentProfilePage() {
  const navigate = useNavigate();
  const blinkContext = useBlink();

  const setTotalItems = blinkContext?.setTotalItems ?? (() => {});
  const setOnSelect = blinkContext?.setOnSelect ?? (() => {});
  const setOnBack = blinkContext?.setOnBack ?? (() => {});

  // Student Information
  const studentInfo = {
    name: 'محمد أحمد الأحمدي',
    id: '202401234',
    major: 'علوم الحاسب',
    level: 'المستوى السادس',
    avatar: 'م',
  };

  // Courses with progress
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

  // Calculate average progress
  const averageProgress = Math.round(
    courses.reduce((sum, course) => sum + course.progress, 0) / courses.length
  );

  useEffect(() => {
    setTotalItems(0); // No focusable items on this page
  }, [setTotalItems]);

  useEffect(() => {
    setOnSelect(() => {
      // No selection action
    });
  }, [setOnSelect]);

  useEffect(() => {
    setOnBack(() => {
      navigate('/', { replace: false });
    });
  }, [setOnBack, navigate]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <GraduationCap className="h-9 w-9 text-primary" />
            ملف الطالب
          </h2>
          <p className="text-muted-foreground text-lg">
            معلومات الطالب والتقدم الأكاديمي
          </p>
        </div>

        {/* Student Info Card */}
        <Card className="overflow-hidden border border-border shadow-lg bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full blur-xl opacity-30" />
                <Avatar className="h-24 w-24 relative border-4 border-white shadow-xl">
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-3xl font-bold">
                    {studentInfo.avatar}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Student Details */}
              <div className="flex-1 text-center md:text-right space-y-3">
                <h3 className="text-3xl font-bold text-foreground">
                  {studentInfo.name}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">الرقم الجامعي</p>
                      <p className="text-sm font-semibold">{studentInfo.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="p-2 rounded-lg bg-emerald-100">
                      <BookOpen className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">التخصص</p>
                      <p className="text-sm font-semibold">{studentInfo.major}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <GraduationCap className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">المستوى الدراسي</p>
                      <p className="text-sm font-semibold">{studentInfo.level}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="p-2 rounded-lg bg-amber-100">
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
          </CardContent>
        </Card>

        {/* Courses Section */}
        <Card className="border border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              المقررات الدراسية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {courses.map((course, index) => (
              <div
                key={index}
                className="p-5 rounded-xl border border-border bg-gradient-to-br from-white to-blue-50/30 hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-foreground">
                      {course.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">{course.code}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-4 py-2 rounded-full bg-gradient-to-r ${course.color} text-white font-bold text-sm shadow-md`}
                    >
                      {course.progress}%
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="relative">
                  <Progress
                    value={course.progress}
                    className="h-3 bg-gray-200"
                  />
                  <div
                    className={`absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r ${course.color} transition-all duration-500`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Overall Progress Summary */}
        <Card className="border border-border shadow-lg bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                التقدم الأكاديمي الإجمالي
              </p>
              <div className="flex items-center justify-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                <span className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">
                  {averageProgress}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                متوسط التقدم في جميع المقررات
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
