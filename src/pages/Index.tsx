import CounselorLayout from "@/components/dashboard/CounselorLayout";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import FeatureCards from "@/components/dashboard/FeatureCards";
import RecentActivity from "@/components/dashboard/RecentActivity";

const Index = () => {
  return (
    <CounselorLayout>
      <WelcomeBanner />
      <FeatureCards />
      <RecentActivity />
    </CounselorLayout>
  );
};

export default Index;
