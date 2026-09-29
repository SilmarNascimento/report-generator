type DashboardTab = "global" | "individual";

type DashboardInternalNavProps = {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
};

export function DashboardInternalNav({ activeTab, onTabChange }: DashboardInternalNavProps) {
  return (
    <div className="flex gap-1 border-b border-border mb-6">
      <button
        onClick={() => onTabChange("global")}
        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
          activeTab === "global"
            ? "border-primary text-primary"
            : "border-transparent text-muted-foreground hover:text-foreground"
        }`}
      >
        Dashboard Global
      </button>
      <button
        onClick={() => onTabChange("individual")}
        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
          activeTab === "individual"
            ? "border-primary text-primary"
            : "border-transparent text-muted-foreground hover:text-foreground"
        }`}
      >
        Dashboard Individual
      </button>
    </div>
  );
}
