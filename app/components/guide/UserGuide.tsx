import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const GUIDE_STEPS = [
  {
    title: 'Welcome to NomadID',
    content: 'Your gateway to decentralized identity management across multiple blockchains.',
    target: 'header'
  },
  {
    title: 'Connect Your Wallet',
    content: 'Start by connecting your wallet to access all features.',
    target: 'wallet-button'
  },
  {
    title: 'Register Names',
    content: 'Register your unique DNS names that work across multiple blockchains.',
    target: 'register-tab'
  },
  {
    title: 'Look Up Names',
    content: 'Resolve DNS names to wallet addresses with our batch lookup feature.',
    target: 'lookup-tab'
  },
  {
    title: 'Find Names by Address',
    content: 'Reverse lookup to find DNS names associated with wallet addresses.',
    target: 'finder-tab'
  }
];

interface UserGuideProps {
  onDismiss: () => void;
}

export default function UserGuide({ onDismiss }: UserGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const step = GUIDE_STEPS[currentStep];

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 animate-slide-up">
      <button 
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {step.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {step.content}
          </p>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="text-sm text-indigo-600 dark:text-indigo-400 disabled:opacity-50"
          >
            Previous
          </button>
          <div className="space-x-1">
            {GUIDE_STEPS.map((_, index) => (
              <span
                key={index}
                className={`inline-block w-2 h-2 rounded-full ${
                  index === currentStep 
                    ? 'bg-indigo-600 dark:bg-indigo-400' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrentStep(prev => 
              prev === GUIDE_STEPS.length - 1 
                ? prev 
                : prev + 1
            )}
            className="text-sm text-indigo-600 dark:text-indigo-400"
          >
            {currentStep === GUIDE_STEPS.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
} 