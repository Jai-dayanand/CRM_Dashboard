import Card from '../components/ui/Card';
const events = [
  { title: "Meeting with Legal", date: "2025-06-15" },
  { title: "Submission Deadline", date: "2025-06-20" },
];

export default function CalendarPage() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Calendar</h2>
      <div className="space-y-3">
        {events.map((event, i) => (
          <Card key={i}>
            <div className="p-4 flex justify-between items-center">
              <span>{event.title}</span>
              <span className="text-sm text-gray-500">{event.date}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
