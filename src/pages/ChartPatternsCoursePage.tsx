import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CourseViewer from "@/components/CourseViewer";
import { chartPatternsCourse } from "@/data/chartPatternsCourse";

const ChartPatternsCoursePage = () => {
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
          <h1 className="text-3xl font-bold mt-4">Advanced Chart Patterns</h1>
          <p className="text-muted-foreground mt-2">
            Learn to identify and trade the most profitable chart patterns in crypto markets
          </p>
        </div>

        <CourseViewer modules={chartPatternsCourse} />
      </div>
    </div>
  );
};

export default ChartPatternsCoursePage;
