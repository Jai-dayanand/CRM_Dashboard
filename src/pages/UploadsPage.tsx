import { useState } from "react";
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function UploadsPage() {
  const [uploaded, setUploaded] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setUploaded((prev) => [...prev, ...newFiles]);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Uploads</h2>

      <label className="block mb-4">
        <input 
          type="file" 
          onChange={handleFileChange} 
          className="hidden"
          multiple
          id="uploadInput"
        />
        <Button onClick={() => document.getElementById("uploadInput")?.click()}>
          Select Files
        </Button>
      </label>

      <div className="mt-4 space-y-2">
        {uploaded.map((file, i) => (
          <Card key={i}>
            <div className="p-4">{file.name}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
