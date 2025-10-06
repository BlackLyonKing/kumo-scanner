import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  PlayCircle, 
  CheckCircle2, 
  Lock, 
  BookOpen, 
  Clock,
  ChevronRight,
  ChevronDown,
  Video,
  FileText,
  Award
} from "lucide-react";
import { CourseModule, CourseLesson } from "@/data/ichimokuCourse";
import ReactMarkdown from 'react-markdown';

interface CourseViewerProps {
  modules: CourseModule[];
  onLessonChange?: (lessonTitle: string) => void;
}

const CourseViewer = ({ modules, onLessonChange }: CourseViewerProps) => {
  const [selectedModule, setSelectedModule] = useState(modules[0]);
  const [selectedLesson, setSelectedLesson] = useState(modules[0].lessons[0]);
  const [expandedModules, setExpandedModules] = useState<string[]>([modules[0].id]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const progress = (completedLessons.length / totalLessons) * 100;

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const selectLesson = (module: CourseModule, lesson: CourseLesson) => {
    setSelectedModule(module);
    setSelectedLesson(lesson);
    onLessonChange?.(lesson.title);
  };

  const markComplete = () => {
    if (!completedLessons.includes(selectedLesson.id)) {
      setCompletedLessons(prev => [...prev, selectedLesson.id]);
    }
    
    // Auto-advance to next lesson
    const currentModuleIndex = modules.findIndex(m => m.id === selectedModule.id);
    const currentLessonIndex = selectedModule.lessons.findIndex(l => l.id === selectedLesson.id);
    
    if (currentLessonIndex < selectedModule.lessons.length - 1) {
      selectLesson(selectedModule, selectedModule.lessons[currentLessonIndex + 1]);
    } else if (currentModuleIndex < modules.length - 1) {
      const nextModule = modules[currentModuleIndex + 1];
      selectLesson(nextModule, nextModule.lessons[0]);
      setExpandedModules(prev => [...prev, nextModule.id]);
    }
  };

  const getLessonIcon = (lesson: CourseLesson) => {
    if (completedLessons.includes(lesson.id)) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
    if (lesson.type === 'video') {
      return <Video className="h-4 w-4 text-primary" />;
    }
    if (lesson.type === 'quiz') {
      return <Award className="h-4 w-4 text-yellow-500" />;
    }
    return <FileText className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
      {/* Sidebar - Course Navigation */}
      <div className="lg:col-span-4 xl:col-span-3">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-base">Course Progress</CardTitle>
            <div className="space-y-2 pt-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {completedLessons.length} of {totalLessons} lessons completed
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="px-4 pb-4 space-y-2">
                {modules.map((module) => (
                  <div key={module.id} className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-medium"
                      onClick={() => toggleModule(module.id)}
                    >
                      {expandedModules.includes(module.id) ? (
                        <ChevronDown className="h-4 w-4 mr-2" />
                      ) : (
                        <ChevronRight className="h-4 w-4 mr-2" />
                      )}
                      {module.title}
                    </Button>
                    
                    {expandedModules.includes(module.id) && (
                      <div className="ml-6 space-y-1">
                        {module.lessons.map((lesson) => (
                          <Button
                            key={lesson.id}
                            variant={selectedLesson.id === lesson.id ? "secondary" : "ghost"}
                            className="w-full justify-start text-sm"
                            onClick={() => selectLesson(module, lesson)}
                          >
                            {getLessonIcon(lesson)}
                            <span className="ml-2 flex-1 text-left">{lesson.title}</span>
                            <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-8 xl:col-span-9">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  {selectedModule.title}
                </div>
                <CardTitle>{selectedLesson.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedLesson.duration}
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {selectedLesson.type}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-24rem)]">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {selectedLesson.type === 'video' && (
                  <div className="mb-6">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <PlayCircle className="h-16 w-16 text-primary mx-auto" />
                        <p className="text-muted-foreground">Video player would load here</p>
                        <p className="text-sm text-muted-foreground">Duration: {selectedLesson.duration}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedLesson.content ? (
                  <ReactMarkdown>{selectedLesson.content}</ReactMarkdown>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Content for this lesson is being prepared.</p>
                    <p className="text-sm mt-2">Please check back soon!</p>
                  </div>
                )}
              </div>
            </ScrollArea>

            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => {
                  const currentModuleIndex = modules.findIndex(m => m.id === selectedModule.id);
                  const currentLessonIndex = selectedModule.lessons.findIndex(l => l.id === selectedLesson.id);
                  
                  if (currentLessonIndex > 0) {
                    selectLesson(selectedModule, selectedModule.lessons[currentLessonIndex - 1]);
                  } else if (currentModuleIndex > 0) {
                    const prevModule = modules[currentModuleIndex - 1];
                    selectLesson(prevModule, prevModule.lessons[prevModule.lessons.length - 1]);
                  }
                }}
                disabled={modules[0].lessons[0].id === selectedLesson.id}
              >
                Previous Lesson
              </Button>

              <Button
                onClick={markComplete}
                className="gap-2"
              >
                {completedLessons.includes(selectedLesson.id) ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Completed
                  </>
                ) : (
                  <>
                    Mark Complete & Continue
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseViewer;
