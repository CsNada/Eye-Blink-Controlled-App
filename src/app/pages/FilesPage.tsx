import React from 'react';
import { Folder, FileText, GraduationCap, BookOpen, Download } from 'lucide-react';

interface SubjectFile {
  title: string;
  subject: string;
  type: string;
  size: string;
  color: string;
}

export function FilesPage() {
  const files: SubjectFile[] = [
    {
      title: 'Chapter 1: Mechanics.pdf',
      subject: 'Physics',
      type: 'PDF',
      size: '2.1 MB',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Chapter 2: Thermodynamics.pdf',
      subject: 'Physics',
      type: 'PDF',
      size: '1.8 MB',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Introduction to Anatomy.pdf',
      subject: 'Anatomy',
      type: 'PDF',
      size: '3.4 MB',
      color: 'from-rose-500 to-rose-600',
    },
    {
      title: 'Data Structures.pdf',
      subject: 'Computer Science',
      type: 'PDF',
      size: '4.2 MB',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Calculus Notes.pdf',
      subject: 'Mathematics',
      type: 'PDF',
      size: '2.9 MB',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'Drug Basics.pdf',
      subject: 'Pharmacology',
      type: 'PDF',
      size: '1.6 MB',
      color: 'from-violet-500 to-violet-600',
    },
  ];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 pb-32">
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="mb-2 flex items-center gap-3 text-4xl font-bold">
            <GraduationCap className="h-9 w-9 text-primary" />
            ملفات المواد
          </h2>
          <p className="text-muted-foreground">
            واجهة عرض ملفات المواد الدراسية
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-gradient-to-br from-blue-50 to-white shadow-lg">
          <div className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-blue-100 p-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-foreground">
                  المواد والملفات
                </h3>
                {/* <p className="text-sm text-muted-foreground">
                  عرض شكلي فقط بدون أي تفاعل
                </p> */}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-background p-5 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`rounded-xl bg-gradient-to-br ${file.color} p-3 text-white shadow-md`}
                      >
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground">
                          {file.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {file.subject}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                      {file.type}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground">
                      الحجم: <span className="font-medium text-foreground">{file.size}</span>
                    </p>
                    <div className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      معاينة
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* <div className="mt-6 rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
              هذه الصفحة واجهة فقط ولا تحتوي على فتح ملفات أو أزرار تشغيل.
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}