import { Icon } from "@/components/ui/Icon";

const features = [
  {
    icon: "group",
    title: "Team Up",
    description: "Create private groups with friends.",
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-500",
  },
  {
    icon: "workspace_premium",
    title: "Earn Badges",
    description: "Unlock 'Fiber King' and other titles.",
    color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500",
    offset: true,
  },
  {
    icon: "insights",
    title: "Track Trends",
    description: "Analyze patterns over months.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: "lock",
    title: "100% Private",
    description: "Your data is encrypted & safe.",
    color: "bg-accent/10 text-accent",
    offset: true,
  },
];

const benefits = [
  "Daily fiber intake reminders",
  "Hydration tracking integrated",
  "Monthly health reports for your doctor",
];

export function Features() {
  return (
    <section className="py-24 px-6 overflow-hidden w-full">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Feature Cards Grid */}
          <div className="order-2 lg:order-1 relative">
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className={`bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-4 ${
                    feature.offset ? "translate-y-8" : ""
                  }`}
                >
                  <div
                    className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center`}
                  >
                    <Icon name={feature.icon} className="text-3xl" />
                  </div>
                  <h4 className="font-bold">{feature.title}</h4>
                  <p className="text-sm text-center text-slate-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-4xl font-bold font-display leading-tight">
              It&apos;s More Than Just Tracking.{" "}
              <br />
              <span className="text-primary">It&apos;s a Healthy Lifestyle.</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Health doesn&apos;t have to be boring. By making gut health social and fun,
              we help you stay consistent and aware of your body&apos;s signals.
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <Icon name="check_circle" className="text-primary" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
