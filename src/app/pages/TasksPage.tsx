import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useBlink } from '../contexts/BlinkContext';
import { useLanguage } from '../contexts/LanguageContext';
import { FocusableButton } from '../components/FocusableButton';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { CheckCircle2, Circle, Plus } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export function TasksPage() {
  const navigate = useNavigate();
  const { setTotalItems, setOnSelect, setOnBack, focusedIndex } = useBlink();
  const { t } = useLanguage();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete Anatomy Assignment',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Study for Physiology Exam',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Review Biochemistry Notes',
      completed: true,
      createdAt: new Date().toISOString(),
    },
  ]);

  useEffect(() => {
    setTotalItems(tasks.length);
  }, [setTotalItems, tasks.length]);

  useEffect(() => {
    setOnSelect(() => {
      if (focusedIndex >= 0 && focusedIndex < tasks.length) {
        toggleTask(tasks[focusedIndex].id);
      }
    });
  }, [setOnSelect, focusedIndex, tasks]);

  useEffect(() => {
    setOnBack(() => {
      navigate('/', { replace: false });
    });
  }, [setOnBack, navigate]);

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="container mx-auto px-4 py-8 pb-32 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold mb-6">{t('tasksTitle')}</h2>

      <div className="grid gap-6">
        {/* Add Task */}
        <Card>
          <CardHeader>
            <CardTitle>{t('addTask')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                placeholder={t('newTask')}
                className="text-lg min-h-[56px]"
              />
              <Button onClick={addTask} className="min-h-[56px]">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t('pending')} ({pendingTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingTasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {t('noTasks')}
              </p>
            ) : (
              <div className="space-y-2">
                {pendingTasks.map((task, index) => (
                  <FocusableButton
                    key={task.id}
                    index={tasks.findIndex((t) => t.id === task.id)}
                    onClick={() => toggleTask(task.id)}
                    variant="outline"
                    className="w-full h-auto py-4 justify-start"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Circle className="h-6 w-6 text-muted-foreground" />
                      <span className="text-lg flex-1 text-left">
                        {task.title}
                      </span>
                    </div>
                  </FocusableButton>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                {t('completed')} ({completedTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {completedTasks.map((task, index) => (
                  <FocusableButton
                    key={task.id}
                    index={tasks.findIndex((t) => t.id === task.id)}
                    onClick={() => toggleTask(task.id)}
                    variant="outline"
                    className="w-full h-auto py-4 justify-start opacity-60"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                      <span className="text-lg flex-1 text-left line-through">
                        {task.title}
                      </span>
                    </div>
                  </FocusableButton>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}