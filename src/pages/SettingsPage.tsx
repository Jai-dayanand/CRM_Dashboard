import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function SettingsPage() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      <Card>
        <div className="p-4 space-y-4">
          <Input placeholder="Change display name" />
          <Input placeholder="Update email address" />
          <Input type="password" placeholder="New password" />
          <Button>Save Changes</Button>
        </div>
      </Card>
    </div>
  );
}
