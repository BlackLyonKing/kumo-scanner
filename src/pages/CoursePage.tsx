import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CourseViewer from "@/components/CourseViewer";
import { ichimokuCourse } from "@/data/ichimokuCourse";
import ichimokuIntroVideo from "@/assets/videos/ichimoku-intro.mp4";

const CoursePage = () => {
  const navigate = useNavigate();

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
          <h1 className="text-3xl font-bold mt-4">Complete Ichimoku Mastery</h1>
          <p className="text-muted-foreground mt-2">
            Master the complete Ichimoku system from basic concepts to advanced trading strategies
          </p>
        </div>

        <CourseViewer modules={ichimokuCourse} introVideo={ichimokuIntroVideo} />
      </div>
    </div>
  );
};

export default CoursePage;