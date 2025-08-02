'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ProjectReviewProps {
  project: {
    title: string;
    description: string;
    budget: string;
    clientName: string;
    company: string;
    email: string;
    phone?: string;
    expertiseLevel: string;
    expertType: string;
    targetAudience: string;
    deliverables: string;
    preferredTools: string;
    brandVoice: string;
    briefFile?: string | null;
  };
}

export function ProjectReviewCard({ project }: ProjectReviewProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="text-xl font-semibold text-primary">
        Review Your Project
      </CardHeader>
      <CardContent className="space-y-6 text-sm text-gray-700">
        <div>
          <p className="font-semibold text-base mb-1">🔹 {project.title}</p>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <Separator />
        <div>
          <p className="font-semibold mb-2">👤 Client Information</p>
          <ul className="space-y-1">
            <li><b>Name:</b> {project.clientName}</li>
            <li><b>Company:</b> {project.company}</li>
            <li><b>Email:</b> {project.email}</li>
            <li><b>Phone:</b> {project.phone || 'Not Provided'}</li>
          </ul>
        </div>
        <Separator />
        <div>
          <p className="font-semibold mb-2">💼 Project Details</p>
          <ul className="space-y-1">
            <li><b>Budget:</b> ${project.budget}</li>
            <li><b>Expertise Level:</b> {project.expertiseLevel}</li>
            <li><b>Expert Type:</b> {project.expertType}</li>
            <li><b>Target Audience:</b> {project.targetAudience}</li>
            <li><b>Brand Voice:</b> {project.brandVoice}</li>
          </ul>
        </div>
        <Separator />
        <div>
          <p className="font-semibold mb-2">📦 Deliverables</p>
          <ul className="list-disc list-inside text-gray-800">
            {project.deliverables.split(',').map((item, idx) => (
              <li key={idx}>{item.trim()}</li>
            ))}
          </ul>
        </div>
        <Separator />
        <div>
          <p className="font-semibold mb-2">🛠 Preferred Tools</p>
          <p>{project.preferredTools}</p>
        </div>
        <Separator />
        <div>
          <p className="font-semibold mb-2">📝 Additional Notes</p>
          <ul className="space-y-1">
            <li><b>Brief File:</b> {project.briefFile ? 'Uploaded' : 'None uploaded'}</li>
            <li><b>Password:</b> Hidden for security</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
