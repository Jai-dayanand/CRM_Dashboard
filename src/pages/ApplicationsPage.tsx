import Card from '../components/ui/Card';
const applications = [
  { name: "John Doe", status: "Pending", date: "2025-06-01" },
  { name: "Jane Smith", status: "Approved", date: "2025-05-20" },
];

export default function ApplicationsPage() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Applications</h2>
      <div className="grid gap-4">
        {applications.map((app, i) => (
          <Card key={i}>
            <div className="flex justify-between items-center p-4">
              <div>
                <p className="font-semibold">{app.name}</p>
                <p className="text-sm text-gray-500">{app.date}</p>
              </div>
              <p className="text-sm font-medium">{app.status}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
