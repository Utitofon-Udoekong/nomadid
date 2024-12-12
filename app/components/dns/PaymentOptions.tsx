import { useState, useEffect } from 'react';
import d3ApiService, { PaymentOption } from '../../lib/api/d3Api';
import { useNameToken } from '../../lib/hooks/useNameToken';

interface PaymentOptionsProps {
  tld?: string;
  onSelect?: (option: PaymentOption) => void;
}

export default function PaymentOptions({ tld, onSelect }: PaymentOptionsProps) {
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentOptions = async () => {
      setLoading(true);
      try {
        const response = await d3ApiService.getPaymentOptions(tld);
        setPaymentOptions(response.options);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load payment options');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentOptions();
  }, [tld]);

  if (loading) {
    return <div className="animate-pulse">Loading payment options...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        Payment Options
      </h3>
      {paymentOptions.map((option) => (
        <button
          key={`${option.chainId}-${option.contractAddress}`}
          onClick={() => onSelect?.(option)}
          className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <div className="flex items-center space-x-3">
            <img 
              src={option.icon} 
              alt={option.symbol} 
              className="w-6 h-6 rounded-full"
            />
            <div>
              <div className="font-medium">{option.symbol}</div>
              <div className="text-sm text-gray-500">{option.chainName}</div>
            </div>
          </div>
          <div className="text-sm font-medium">
            {option.price} {option.symbol}
          </div>
        </button>
      ))}
    </div>
  );
} 