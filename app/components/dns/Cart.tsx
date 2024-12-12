import { useCartStore } from '../../lib/store/useCartStore';

export default function Cart() {
  const { items, removeItem } = useCartStore();

  const handleRedirect = (url: string) => {
    window.open(url, '_blank');
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-0 m-4 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg w-96">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Cart ({items.length})
      </h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={`${item.sld}.${item.tld}`}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {item.sld}.{item.tld}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {item.usdPrice} USD
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => item.clickUrl && handleRedirect(item.clickUrl)}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Register
              </button>
              <button
                onClick={() => removeItem(item.sld, item.tld)}
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 