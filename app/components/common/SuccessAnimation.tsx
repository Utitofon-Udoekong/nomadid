import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface SuccessAnimationProps {
  message: string;
}

export default function SuccessAnimation({ message }: SuccessAnimationProps) {
  return (
    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 animate-fade-in">
      <CheckCircleIcon className="h-5 w-5 animate-scale-in" />
      <span className="text-sm">{message}</span>
    </div>
  );
} 