import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNameToken } from '../../lib/hooks/useNameToken';
import { SearchResultItem, PaymentOption } from '../../lib/api/d3Api';
import PaymentOptions from './PaymentOptions';

const registerSchema = z.object({
  sld: z.string()
    .min(1, 'Name must be at least 1 character')
    .max(63, 'Name must be less than 63 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Only lowercase letters, numbers, and non-recurring hyphens are allowed. Hyphens cannot be at the start or end.'),
  tld: z.string(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterName() {
  const { checkPrice, getRecommendations, loading: mintLoading, error } = useNameToken();
  const [searchResult, setSearchResult] = useState<SearchResultItem | null>(null);
  const [checkingPrice, setCheckingPrice] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption | null>(null);
  const [recommendations, setRecommendations] = useState<SearchResultItem[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      tld: 'core',
    },
  });

  const watchSld = watch('sld');
  const watchTld = watch('tld');

  const handleCheckPrice = async () => {
    setSearchResult(null);
    setShowPaymentOptions(false);
    setSelectedPayment(null);
    setCheckingPrice(true);
    setRecommendations([])
    try {
      const result = await checkPrice(watchSld, watchTld);
      console.log(result)
      if (result) {
        setSearchResult(result);
        await fetchRecommendations();
      }
    } finally {
      setCheckingPrice(false);
    }
  };

  const fetchRecommendations = async () => {
    if (watchSld && watchSld.length >= 3) {
      setLoadingRecommendations(true);
      try {
        const results = await getRecommendations(watchSld, watchTld);
        if (results) {
          setRecommendations(results);
        }
      } finally {
        setLoadingRecommendations(false);
      }
    }
  };

  const handlePaymentSelect = (option: PaymentOption) => {
    setSelectedPayment(option);
  };

  const handleRegister = () => {
    if (searchResult?.clickUrl) {
      window.open(searchResult.clickUrl, '_blank');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Register DNS Name
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              {...register('sld')}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="yourname"
            />
            <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-300">
              .{watchTld}
            </span>
          </div>
          {errors.sld && (
            <p className="mt-1 text-sm text-red-600">{errors.sld.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            TLD
          </label>
          <select
            {...register('tld')}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
          >
            <option value="core">core</option>
            <option value="shib">shib</option>
          </select>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handleCheckPrice}
            disabled={checkingPrice}
            className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {checkingPrice ? 'Checking...' : 'Check Price'}
          </button>

          <button
            type="button"
            onClick={() => setShowPaymentOptions(true)}
            disabled={!searchResult?.status || searchResult.status !== 'available'}
            className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            View Payment Options
          </button>
        </div>

        {searchResult && (
          <div className="text-sm">
            {searchResult.status === 'available' ? (
              <div className="text-green-600 dark:text-green-400">
                Available - Price: {searchResult.usdPrice} USD ({searchResult.nativeAmount} {searchResult.nativeCurrency})
              </div>
            ) : (
              <div className="text-red-600 dark:text-red-400">
                Name is not available
              </div>
            )}
          </div>
        )}

        {showPaymentOptions && searchResult?.status === 'available' && (
          <div className="mt-6 space-y-6">
            <PaymentOptions
              tld={watchTld}
              onSelect={handlePaymentSelect}
            />
            
            <button
              type="button"
              onClick={handleRegister}
              disabled={!selectedPayment}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              Continue to Registration
            </button>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Similar Names
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {recommendations.map((rec) => (
                <div
                  key={`${rec.sld}.${rec.tld}`}
                  className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <span className="text-gray-700 dark:text-gray-300">
                    {rec.sld}.{rec.tld}
                  </span>
                  <div className="text-sm">
                    {rec.status === 'available' ? (
                      <span className="text-green-600 dark:text-green-400">
                        {rec.usdPrice} USD
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">
                        Taken
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
        )}
      </div>
    </div>
  );
}