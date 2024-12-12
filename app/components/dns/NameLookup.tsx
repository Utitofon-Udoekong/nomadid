import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDnsResolver } from '../../lib/hooks/useDnsResolver';

const resolveSchema = z.object({
  names: z.string()
    .min(1, 'At least one name is required')
    .refine(
      (val) => val.split(',').length <= 10,
      'Maximum 10 names allowed'
    )
    .refine(
      (val) => val.split(',').every(name => name.trim().length > 0),
      'Invalid name format'
    ),
  network: z.string().min(1, 'Network is required'),
});

type ResolveFormData = z.infer<typeof resolveSchema>;

interface ResolutionResult {
  name: string;
  address: string | null;
  error?: string;
}

const SUPPORTED_NETWORKS = [
  { id: 'ETH', name: 'Ethereum' },
  { id: 'BTC', name: 'Bitcoin' },
  { id: 'BONE', name: 'Shibarium' },
  { id: 'CORE', name: 'Core' },
  { id: 'VIC', name: 'Viction' },
  { id: 'MATIC', name: 'Polygon' },
  { id: 'ADA', name: 'Cardano' },
  { id: 'APE', name: 'ApeChain' },
];

export default function NameLookup() {
  const { resolveNameToAddress, loading, error: resolverError } = useDnsResolver();
  const [results, setResults] = useState<ResolutionResult[]>([]);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ResolveFormData>({
    resolver: zodResolver(resolveSchema),
    defaultValues: {
      names: '',
      network: 'CORE',
    }
  });

  const onSubmit = async (data: ResolveFormData) => {
    console.log('📝 Name lookup form submitted:', data);
    setResults([]);
    
    const names = data.names.split(',').map(name => name.trim());
    console.log('🔍 Processing names:', names);
    
    const resolutionResults = await Promise.all(
      names.map(async (name) => {
        try {
          const address = await resolveNameToAddress(name, data.network);
          console.log('🔍 Name resolution result:', { name, address });
          return {
            name,
            address,
            ...(address ? {} : { error: 'Resolution failed' })
          };
        } catch (err) {
          console.error('❌ Resolution error for name:', name, err);
          return {
            name,
            address: null,
            error: err instanceof Error ? err.message : 'Resolution failed'
          };
        }
      })
    );

    setResults(resolutionResults.map(result => ({
      ...result,
      address: result.address ?? null
    })));
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Name Lookup
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Look up wallet addresses using DNS names (up to 10, comma-separated)
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            DNS Names
          </label>
          <div className="mt-1">
            <input
              type="text"
              {...register('names')}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="example.core, another.core, third.core"
            />
            {errors.names && (
              <p className="mt-1 text-sm text-red-600">{errors.names.message}</p>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Separate multiple names with commas
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Network
          </label>
          <select
            {...register('network')}
            className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {SUPPORTED_NETWORKS.map(network => (
              <option key={network.id} value={network.id}>
                {network.name}
              </option>
            ))}
          </select>
          {errors.network && (
            <p className="mt-1 text-sm text-red-600">{errors.network.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Looking up...' : 'Look up Addresses'}
        </button>

        {resolverError && (
          <div className="text-sm text-red-600 dark:text-red-400 space-y-1">
            <p>{resolverError}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-4 space-y-4">
            {results.map((result, index) => (
              <div 
                key={index}
                className={`p-4 rounded-md ${
                  result.error 
                    ? 'bg-red-50 dark:bg-red-900/20' 
                    : 'bg-gray-50 dark:bg-gray-700'
                }`}
              >
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {result.name}
                </p>
                {result.error ? (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {result.error}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {result.address}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
} 