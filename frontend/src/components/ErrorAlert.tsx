import { Alert } from 'flowbite-react';
import { AlertTriangle } from 'lucide-react';

type ErrorAlertProps = {
  message: string;
};

export const ErrorAlert = ({ message }: ErrorAlertProps) => {
  return (
    <Alert color="failure" icon={AlertTriangle} className="text-red-500">
      <span className="font-medium">Error:</span> {message}
    </Alert>
  );
};
