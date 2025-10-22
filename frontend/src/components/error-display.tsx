import { Alert } from 'flowbite-react';
import { AlertTriangle, Clock } from 'lucide-react';

type ErrorAlertProps = {
  message: string;
};

export const ErrorAlert = ({ message }: ErrorAlertProps) => {
  // Check if this is a rate limit error
  const isRateLimitError =
    message.toLowerCase().includes('rate limit') ||
    message.toLowerCase().includes('too many requests');

  return (
    <Alert
      color={isRateLimitError ? 'warning' : 'failure'}
      icon={isRateLimitError ? Clock : AlertTriangle}
      className={isRateLimitError ? 'text-yellow-500' : 'text-red-500'}
    >
      <span className="font-medium">{isRateLimitError ? 'Rate Limit:' : 'Error:'}</span> {message}
    </Alert>
  );
};
