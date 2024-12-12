import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDnsResolver } from '../../lib/hooks/useDnsResolver';

const reverseResolveSchema = z.object({
  addresses: z.string()
    .min(1, 'At least one address is required')
    .refine(
      (val) => val.split(',').length <= 10,
      'Maximum 10 addresses allowed'
    )
    .refine(
      (val) => val.split(',').every(addr => {
        const trimmed = addr.trim();
        return trimmed.length > 0 && /^0x[a-fA-F0-9]{40}$/.test(trimmed);
      }),
      'One or more addresses are invalid. Addresses must be in the format: 0x...'
    ),
  network: z.string().min(1, 'Network is required'),
});

type ReverseResolveFormData = z.infer<typeof reverseResolveSchema>;

interface ResolutionResult {
  address: string;
  name: string | null;
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

export default function AddressFinder() {
  const { resolveAddressToName, loading, error: resolverError } = useDnsResolver();
  const [results, setResults] = useState<ResolutionResult[]>([]);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ReverseResolveFormData>({
    resolver: zodResolver(reverseResolveSchema),
    defaultValues: {
      addresses: '',
      network: 'CORE',
    }
  });

  const onSubmit = async (data: ReverseResolveFormData) => {
    console.log('📝 Address finder form submitted:', data);
    setResults([]);
    
    const addresses = data.addresses.split(',').map(addr => addr.trim());
    console.log('🔍 Processing addresses:', addresses);
    
    const resolutionResults = await Promise.all(
      addresses.map(async (address) => {
        try {
          const name = await resolveAddressToName(address, data.network);
          console.log('🔍 Address resolution result:', { address, name });
          return {
            address,
            name,
            ...(name ? {} : { error: 'Resolution failed' })
          };
        } catch (err) {
          console.error('❌ Resolution error for address:', address, err);
          return {
            address,
            name: null,
            error: err instanceof Error ? err.message : 'Resolution failed'
          };
        }
      })
    );

    setResults(resolutionResults);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Address Finder
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Find DNS names associated with wallet addresses (up to 10, comma-separated)
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Wallet Addresses
          </label>
          <div className="mt-1">
            <input
              type="text"
              {...register('addresses')}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0x123..., 0x456..., 0x789..."
            />
            {errors.addresses && (
              <p className="mt-1 text-sm text-red-600">{errors.addresses.message}</p>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Separate multiple addresses with commas
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
          {loading ? 'Finding...' : 'Find DNS Names'}
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
                  {result.address}
                </p>
                {result.error ? (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {result.error}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {result.name}
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