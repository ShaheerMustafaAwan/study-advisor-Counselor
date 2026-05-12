import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CounselorLayout from "@/components/dashboard/CounselorLayout";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import FeatureCards from "@/components/dashboard/FeatureCards";
import RecentActivity, {
  type DashboardActivityItem,
} from "@/components/dashboard/RecentActivity";
import { Globe2, MapPin, Rocket, PlaneTakeoff } from "lucide-react";
import { useCounselorStudents } from "@/hooks/useCounselorStudents";
import { useCounselorIdentity } from "@/hooks/useCounselorIdentity";
import { getSopReviews } from "@/api/counselorSop";
import { getCounselorNotifications } from "@/api/counselorNotifications";

const toInitials = (name?: string) => {
  if (!name) return "NA";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const Index = () => {
  const { data: studentsData } = useCounselorStudents({ page: 1, limit: 100 });
  const { identity } = useCounselorIdentity();

  const { data: sopData } = useQuery({
    queryKey: ["dashboard-sop-reviews"],
    queryFn: () => getSopReviews({ status: "all", page: 1, limit: 100 }),
  });

  const { data: notificationsData } = useQuery({
    queryKey: ["dashboard-notifications"],
    queryFn: () =>
      getCounselorNotifications({
        page: 1,
        limit: 10,
        read: "all",
        type: "all",
      }),
  });

  const studentsSummary = studentsData?.summary || {
    total: 0,
    active: 0,
    reviewNeeded: 0,
    completed: 0,
    availablePrograms: [],
  };

  const welcomeStats = {
    totalStudents: studentsSummary.total,
    activeApplications: studentsSummary.active,
    pendingReviews: studentsSummary.reviewNeeded,
    completedCases: studentsSummary.completed,
  };

  const featureCounts = {
    students: studentsSummary.total,
    studentProgress: studentsSummary.active,
    sopReview: sopData?.reviews.length || 0,
    notifications: notificationsData?.unreadCount || 0,
    universitySearch: studentsSummary.availablePrograms.length,
  };

  const activities: DashboardActivityItem[] = useMemo(() => {
    const notifications = notificationsData?.notifications || [];

    return notifications.map((item) => ({
      id: `notification-${item.id}`,
      initials: toInitials(item.student?.fullName),
      name: item.student?.fullName || "Student",
      action: item.title || item.message,
      university: item.type,
      status: item.isRead ? "Completed" : "Pending",
      time: formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }),
    }));
  }, [notificationsData?.notifications]);

  const journeySteps = [
    { title: "Profile Audit", detail: "Evaluate academics and budget fit." },
    { title: "University Match", detail: "Shortlist best-fit destinations." },
    { title: "Documents & SOP", detail: "Improve quality for admissions." },
    { title: "Visa Readiness", detail: "Track final milestones and timelines." },
  ];

  const destinationCards = [
    {
      country: "Canada",
      image: "/canada-campus.jpg",
      caption: "Top choice for post-study work opportunities.",
    },
    {
      country: "United Kingdom",
      image: "/uk-campus.jpg",
      caption: "Historic universities with strong global rankings.",
    },
    {
      country: "Australia",
      image: "/australia-campus.jpg",
      caption: "Excellent student lifestyle and practical pathways.",
    },
  ];

  return (
    <CounselorLayout>
      <WelcomeBanner
        counselorName={identity.displayName}
        stats={welcomeStats}
      />
      <FeatureCards counts={featureCounts} />

      <section className="grid lg:grid-cols-[1.3fr_1fr] gap-5">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              Application Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-3">
            {journeySteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-xl border border-primary/15 bg-white/70 p-4"
              >
                <p className="text-xs text-primary font-semibold mb-1">
                  Step {index + 1}
                </p>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlaneTakeoff className="h-5 w-5 text-primary" />
              Destination Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl overflow-hidden border border-primary/10 h-32">
              <img
                src="/canada-campus.jpg"
                alt="Canada campus"
                width={640}
                height={256}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Unread notifications</span>
              <Badge>{featureCounts.notifications}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Programs tracked</span>
              <Badge variant="secondary">{featureCounts.universitySearch}</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="section-title flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-primary" />
            Popular Destinations
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {destinationCards.map((destination) => (
            <Card key={destination.country} className="glass-card">
              <CardContent className="p-4 space-y-3">
                <div className="h-32 overflow-hidden rounded-xl border border-primary/10">
                  <img
                    src={destination.image}
                    alt={`${destination.country} campus`}
                    width={640}
                    height={256}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{destination.country}</h3>
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {destination.caption}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <RecentActivity activities={activities} />
    </CounselorLayout>
  );
};

export default Index;
