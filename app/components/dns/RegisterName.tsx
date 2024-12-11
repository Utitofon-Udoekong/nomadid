import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNameToken } from '../../lib/hooks/useNameToken';

const registerSchema = z.object({
  sld: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(63, 'Name must be less than 63 characters')
    .regex(/^[a-zA-Z0-9-]+$/, 'Only letters, numbers, and hyphens are allowed'),
  tld: z.string(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterName() {
  const { mintToken, getTokenPrice, loading, error } = useNameToken();
  const [price, setPrice] = useState<string | null>(null);

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

  const checkPrice = async () => {
    if (watchSld && watchTld) {
      const priceData = await getTokenPrice(watchSld, watchTld);
      if (priceData) {
        setPrice(priceData.price);
      }
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
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

        {price && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Price: {price} CORE
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
        )}

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={checkPrice}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Check Price
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register Name'}
          </button>
        </div>
      </form>
    </div>
  );
} 