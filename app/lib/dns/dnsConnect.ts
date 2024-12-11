import { DNSConnect } from '@webinterop/dns-connect';

export const dnsConnect = new DNSConnect({
  dns: {
    dnssecVerification: true,
  },
  logLevel: 'info',
});

export const resolveName = async (name: string, chain: string) => {
  try {
    const walletAddress = await dnsConnect.resolve(name, chain);
    return walletAddress;
  } catch (error) {
    console.error('Error resolving name:', error);
    throw error;
  }
};

export const reverseResolve = async (address: string, chain: string) => {
  try {
    const domainName = await dnsConnect.reverseResolve(address, chain);
    return domainName;
  } catch (error) {
    console.error('Error reverse resolving address:', error);
    throw error;
  }
}; 