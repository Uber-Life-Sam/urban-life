import { useState } from 'react';
import { jobs } from '@/data/buildings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface JobUIProps {
  onStartJob: (jobId: string, payRate: number) => void;
  currentJob: string | null;
  onEndJob: () => void;
}

const JobUI = ({ onStartJob, currentJob, onEndJob }: JobUIProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen && !currentJob) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-4 z-10"
        variant="secondary"
      >
        Find Jobs
      </Button>
    );
  }

  if (currentJob) {
    const job = jobs.find(j => j.id === currentJob);
    return (
      <Card className="fixed bottom-24 left-4 z-10 w-64">
        <CardHeader>
          <CardTitle className="text-lg">Working: {job?.name}</CardTitle>
          <CardDescription>${job?.payRate}/hour</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onEndJob} variant="destructive" className="w-full">
            End Shift
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-24 left-4 z-10 w-80 max-h-96 overflow-y-auto">
      <CardHeader>
        <CardTitle>Available Jobs</CardTitle>
        <CardDescription>Select a job to start earning money</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <CardTitle className="text-base">{job.name}</CardTitle>
              <CardDescription>{job.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">
                  ${job.payRate}/hour
                </span>
                <Button
                  onClick={() => {
                    onStartJob(job.id, job.payRate);
                    setIsOpen(false);
                  }}
                  size="sm"
                >
                  Start Job
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button onClick={() => setIsOpen(false)} variant="outline" className="w-full">
          Close
        </Button>
      </CardContent>
    </Card>
  );
};

export default JobUI;
