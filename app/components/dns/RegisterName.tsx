import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNameToken } from '../../lib/hooks/useNameToken';
import { TokenSearchResult, PaymentOption } from '../../lib/api/d3Api';

const registerSchema = z.object({
  sld: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(63, 'Name must be less than 63 characters')
    .regex(/^[a-zA-Z0-9-]+$/, 'Only letters, numbers, and hyphens are allowed'),
  tld: z.string(),
  paymentMethod: z.string().optional(),
  currency: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterName() {
  const { mintToken, searchNames, createOrder, getPaymentOptions, loading, error } = useNameToken();
  const [searchResult, setSearchResult] = useState<TokenSearchResult | null>(null);
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);

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

  useEffect(() => {
    const loadPaymentOptions = async () => {
      const options = await getPaymentOptions();
      if (options) {
        setPaymentOptions(options);
      }
    };
    loadPaymentOptions();
  }, [getPaymentOptions]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (watchSld && watchTld) {
        const results = await searchNames({
          query: watchSld,
          tld: watchTld,
          limit: 1,
        });
        if (results && results.length > 0) {
          setSearchResult(results[0]);
        }
      }
    };

    const debounce = setTimeout(checkAvailability, 2000);
    return () => clearTimeout(debounce);
  }, [watchSld, watchTld, searchNames]);

  const onSubmit = async (data: RegisterFormData) => {
    if (!searchResult?.available) {
      return;
    }

    if (data.paymentMethod && data.currency) {
      // Create order first
      const order = await createOrder(data.sld, data.tld, data.paymentMethod, data.currency);
      if (!order) return;
    }

    // Mint the token
    const result = await mintToken(data.sld, data.tld);
    if (result) {
      // Handle success
      console.log('Name registered successfully:', result);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Register DNS Name
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <option value="xyz">xyz</option>
          </select>
        </div>

        {searchResult && (
          <div className="text-sm">
            {searchResult.available ? (
              <div className="text-green-600 dark:text-green-400">
                Available - Price: {searchResult.price} {searchResult.currency}
              </div>
            ) : (
              <div className="text-red-600 dark:text-red-400">
                Name is not available
              </div>
            )}
          </div>
        )}

        {searchResult?.available && paymentOptions.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Payment Method
            </label>
            <select
              {...register('paymentMethod')}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            >
              {paymentOptions.map((option) => (
                <option key={option.method} value={option.method}>
                  {option.method} ({option.currency})
                </option>
              ))}
            </select>
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading || !searchResult?.available}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Register Name'}
          </button>
        </div>
      </form>
    </div>
  );
} 