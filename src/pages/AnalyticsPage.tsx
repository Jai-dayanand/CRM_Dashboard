import Card from '../components/ui/Card';
const stats = [
  { label: "Applications", value: 132 },
  { label: "Active Students", value: 89 },
  { label: "Uploaded Docs", value: 420 },
];

export default function AnalyticsPage() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Analytics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold">{stat.label}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
