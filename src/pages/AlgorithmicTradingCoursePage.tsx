import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CourseViewer from "@/components/CourseViewer";
import CourseAIAssistant from "@/components/CourseAIAssistant";
import { algorithmicTradingCourse } from "@/data/algorithmicTradingCourse";
import { useState } from "react";

const AlgorithmicTradingCoursePage = () => {
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState<string>("");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold mt-4">Algorithmic Trading Bootcamp</h1>
          <p className="text-muted-foreground mt-2">
            Learn to build and deploy automated trading systems - AI-assisted learning
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <CourseViewer 
              modules={algorithmicTradingCourse}
              onLessonChange={setCurrentLesson}
            />
          </div>
          <div className="xl:col-span-1">
            <div className="sticky top-6">
              <CourseAIAssistant 
                courseTitle="Algorithmic Trading Bootcamp"
                currentLesson={currentLesson}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmicTradingCoursePage;
