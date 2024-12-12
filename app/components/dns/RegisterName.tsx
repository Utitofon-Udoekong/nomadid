import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNameToken } from '../../lib/hooks/useNameToken';
import { SearchResultItem } from '../../lib/api/d3Api';
import { useCartStore } from '../../lib/store/useCartStore';
import Cart from './Cart';

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
  const { addItem, isInCart } = useCartStore();
  const [searchResult, setSearchResult] = useState<SearchResultItem | null>(null);
  const [checkingPrice, setCheckingPrice] = useState(false);
  const [recommendations, setRecommendations] = useState<SearchResultItem[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const {
    register,
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
    setCheckingPrice(true);
    setRecommendations([]);
    try {
      const result = await checkPrice(watchSld, watchTld);
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

  return (
    <>
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

            {searchResult?.status === 'available' && (
              <button
                type="button"
                onClick={() => addItem(searchResult)}
                disabled={isInCart(searchResult.sld, searchResult.tld)}
                className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isInCart(searchResult.sld, searchResult.tld) ? 'In Cart' : 'Add to Cart'}
              </button>
            )}
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
                    <div className="flex items-center space-x-3">
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
                      {rec.status === 'available' && (
                        <button
                          onClick={() => addItem(rec)}
                          disabled={isInCart(rec.sld, rec.tld)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm disabled:opacity-50"
                        >
                          {isInCart(rec.sld, rec.tld) ? 'In Cart' : 'Add'}
                        </button>
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
      <Cart />
    </>
  );
}