import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useBlink } from '../contexts/BlinkContext';
import { useLanguage } from '../contexts/LanguageContext';
import { FocusableButton } from '../components/FocusableButton';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Folder, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  color: string;
  files: string[];
}

export function FilesPage() {
  const navigate = useNavigate();
  const { setTotalItems, setOnSelect, setOnBack, focusedIndex } = useBlink();
  const { t } = useLanguage();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [pdfPage, setPdfPage] = useState(1);

  const subjects: Subject[] = [
    {
      id: 'physics',
      name: t('physics'),
      color: 'from-blue-500 to-blue-600',
      files: ['Chapter 1: Mechanics.pdf', 'Chapter 2: Thermodynamics.pdf', 'Chapter 3: Electromagnetism.pdf'],
    },
    {
      id: 'anatomy',
      name: t('anatomy'),
      color: 'from-rose-500 to-rose-600',
      files: ['Chapter 1: Introduction.pdf', 'Chapter 2: Skeletal System.pdf', 'Chapter 3: Muscular System.pdf'],
    },
    {
      id: 'chemistry',
      name: t('chemistry'),
      color: 'from-green-500 to-green-600',
      files: ['Unit 1: Atomic Structure.pdf', 'Unit 2: Chemical Bonding.pdf', 'Unit 3: Reactions.pdf'],
    },
    {
      id: 'computer',
      name: t('computer'),
      color: 'from-purple-500 to-purple-600',
      files: ['Lecture 1: Programming Basics.pdf', 'Lecture 2: Data Structures.pdf', 'Lecture 3: Algorithms.pdf'],
    },
    {
      id: 'mathematics',
      name: t('mathematics'),
      color: 'from-indigo-500 to-indigo-600',
      files: ['Topic 1: Calculus.pdf', 'Topic 2: Linear Algebra.pdf', 'Topic 3: Statistics.pdf'],
    },
    {
      id: 'biochemistry',
      name: t('biochemistry'),
      color: 'from-teal-500 to-teal-600',
      files: ['Unit 1: Proteins.pdf', 'Unit 2: Carbohydrates.pdf', 'Unit 3: Lipids.pdf'],
    },
    {
      id: 'physiology',
      name: t('physiology'),
      color: 'from-emerald-500 to-emerald-600',
      files: ['Lecture 1: Cell Biology.pdf', 'Lecture 2: Homeostasis.pdf', 'Lecture 3: Nervous System.pdf'],
    },
    {
      id: 'pharmacology',
      name: t('pharmacology'),
      color: 'from-violet-500 to-violet-600',
      files: ['Module 1: Drug Basics.pdf', 'Module 2: Pharmacokinetics.pdf', 'Module 3: Drug Interactions.pdf'],
    },
  ];

  const currentItems = selectedSubject
    ? subjects.find((s) => s.id === selectedSubject)?.files || []
    : subjects;

  useEffect(() => {
    setTotalItems(currentItems.length);
  }, [setTotalItems, currentItems.length]);

  useEffect(() => {
    setOnSelect(() => {
      if (selectedSubject) {
        // File selected - would open PDF viewer
      } else {
        // Subject selected
        if (focusedIndex >= 0 && focusedIndex < subjects.length) {
          setSelectedSubject(subjects[focusedIndex].id);
        }
      }
    });
  }, [setOnSelect, focusedIndex, selectedSubject, subjects]);

  useEffect(() => {
    setOnBack(() => {
      if (selectedSubject) {
        setSelectedSubject(null);
      } else {
        navigate('/', { replace: false });
      }
    });
  }, [setOnBack, selectedSubject, navigate]);

  return (
    <div className="container mx-auto px-4 py-8 pb-32 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold mb-6">{t('filesTitle')}</h2>

      <div className="grid gap-6">
        {!selectedSubject ? (
          /* Subjects Grid */
          <Card>
            <CardHeader>
              <CardTitle>{t('subjects')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {subjects.map((subject, index) => (
                  <FocusableButton
                    key={subject.id}
                    index={index}
                    onClick={() => setSelectedSubject(subject.id)}
                    className="h-auto p-0 overflow-hidden"
                  >
                    <div className="w-full p-6 flex flex-col items-center gap-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${subject.color}`}>
                        <Folder className="h-10 w-10 text-white" />
                      </div>
                      <span className="text-lg text-center font-medium">
                        {subject.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {subject.files.length} files
                      </span>
                    </div>
                  </FocusableButton>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Files List */
          <>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {subjects.find((s) => s.id === selectedSubject)?.name}
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSubject(null)}
                  >
                    <ChevronLeft className="h-5 w-5 mr-2" />
                    {t('back')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {currentItems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    {t('noFiles')}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {(currentItems as string[]).map((file, index) => (
                      <FocusableButton
                        key={index}
                        index={index}
                        onClick={() => {}}
                        variant="outline"
                        className="w-full h-auto py-4 justify-start"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                          <span className="text-lg">{file}</span>
                        </div>
                      </FocusableButton>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* PDF Viewer Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>PDF Viewer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-8 flex items-center justify-center min-h-[400px]">
                  <div className="text-center space-y-4">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Select a file to view
                    </p>
                  </div>
                </div>
                
                {/* PDF Controls */}
                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setPdfPage(Math.max(1, pdfPage - 1))}
                    disabled={pdfPage === 1}
                  >
                    <ChevronLeft className="h-5 w-5 mr-2" />
                    {t('previousPage')}
                  </Button>
                  
                  <span className="text-sm text-muted-foreground">
                    Page {pdfPage}
                  </span>
                  
                  <Button
                    variant="outline"
                    onClick={() => setPdfPage(pdfPage + 1)}
                  >
                    {t('nextPage')}
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}