import { useParams, useNavigate } from "react-router-dom";
import CounselorLayout from "@/components/dashboard/CounselorLayout";
import StudentProfileCard from "@/components/progress/StudentProfileCard";
import OverallProgressCard from "@/components/progress/OverallProgressCard";
import DocumentsModule from "@/components/progress/DocumentsModule";
import UniversitiesModule from "@/components/progress/UniversitiesModule";
import SOPModule from "@/components/progress/SOPModule";
import ActivityTimeline from "@/components/progress/ActivityTimeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  FileText,
  GraduationCap,
  PenLine,
  Activity,
} from "lucide-react";
import { useCounselorStudent } from "@/hooks/useCounselorStudent";
import { useCounselorStudentActivities } from "@/hooks/useCounselorStudentActivities";
import {
  mapCounselorStudentToProgressView,
  mapStudentActivitiesToTimeline,
} from "@/lib/studentProgressMappers";

const StudentProgressPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const {
    data: studentData,
    isLoading,
    isError,
    error,
  } = useCounselorStudent(studentId);
  const { data: studentActivities } = useCounselorStudentActivities(studentId);
  const data = studentData
    ? mapCounselorStudentToProgressView(studentData)
    : undefined;
  const timelineActivities = studentActivities?.length
    ? mapStudentActivitiesToTimeline(studentActivities)
    : data?.activities || [];

  if (isLoading) {
    return (
      <CounselorLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Loading Student
          </h2>
          <p className="text-muted-foreground mb-4">
            Fetching latest student details...
          </p>
        </div>
      </CounselorLayout>
    );
  }

  if (!data || isError) {
    return (
      <CounselorLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Student Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error
              ? error.message
              : "The student you're looking for doesn't exist."}
          </p>
          <Button variant="outline" onClick={() => navigate("/my-students")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Students
          </Button>
        </div>
      </CounselorLayout>
    );
  }

  return (
    <CounselorLayout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-2 rounded-2xl gradient-surface border border-white/70 p-4 md:p-5">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Student Progress
          </h1>
          <p className="text-sm text-muted-foreground">
            Track and manage {data.student.name}'s application journey
          </p>
        </div>
      </div>

      {/* Overview Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <StudentProfileCard student={data.student} />
        <OverallProgressCard
          progress={data.student.progress}
          stages={data.stages}
        />
      </div>

      {/* Tabbed Modules */}
      <Card className="glass-card">
        <CardContent className="p-0">
          <Tabs defaultValue="documents" className="w-full">
            <div className="border-b border-border px-6 pt-4 bg-white/65">
              <TabsList className="bg-transparent gap-1 h-auto p-0">
                <TabsTrigger
                  value="documents"
                  className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg"
                >
                  <FileText className="h-4 w-4" /> Documents
                </TabsTrigger>
                <TabsTrigger
                  value="universities"
                  className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg"
                >
                  <GraduationCap className="h-4 w-4" /> Universities
                </TabsTrigger>
                <TabsTrigger
                  value="sop"
                  className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg"
                >
                  <PenLine className="h-4 w-4" /> SOP Review
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg"
                >
                  <Activity className="h-4 w-4" /> Activity
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="documents" className="mt-0">
                <DocumentsModule
                  studentId={data.student.id}
                  documents={data.documents}
                />
              </TabsContent>
              <TabsContent value="universities" className="mt-0">
                <UniversitiesModule
                  studentId={data.student.id}
                  universities={data.universities}
                />
              </TabsContent>
              <TabsContent value="sop" className="mt-0">
                <SOPModule
                  studentId={data.student.id}
                  sopContent={data.sopContent}
                />
              </TabsContent>
              <TabsContent value="activity" className="mt-0">
                <ActivityTimeline activities={timelineActivities} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </CounselorLayout>
  );
};

export default StudentProgressPage;
