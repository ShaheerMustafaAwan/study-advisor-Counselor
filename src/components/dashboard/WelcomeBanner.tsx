import { Users, FileText, Clock, CheckCircle2 } from "lucide-react";

const stats = [
  { label: "Total Students", value: "128", icon: Users },
  { label: "Active Applications", value: "34", icon: FileText },
  { label: "Pending Reviews", value: "12", icon: Clock },
  { label: "Completed Cases", value: "89", icon: CheckCircle2 },
];

const WelcomeBanner = () => {
  return (
    <div className="rounded-2xl gradient-hero p-8 md:p-10 text-primary-foreground shadow-lg">
      <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome, Counselor 👋</h1>
      <p className="text-primary-foreground/80 text-sm md:text-base mb-8">
        Manage your students and track their progress
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white/15 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center text-center gap-1.5"
          >
            <stat.icon className="h-5 w-5 text-primary-foreground/80" />
            <span className="text-2xl md:text-3xl font-bold">{stat.value}</span>
            <span className="text-xs text-primary-foreground/70 font-medium">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeBanner;
