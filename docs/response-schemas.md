export interface PartnerUserRequest {
  wallet: string; // Wallet address to mint the name for. Format is chain-specific, and depends on a chosen TLD.
  email?: string; // User's email address for renewal notifications and support.
}

export interface PartnerMintRequest {
  sld: string; // Second-level domain (SLD) of the name to mint.
  tld: string; // Top-level domain (TLD) of the name to mint.
  user: PartnerUserRequest; // User information required to mint the name.
}

export interface PartnerMintResponse {
  tokenId: string; // Token ID that will be minted.
  contractAddress: string; // NFT Smart Contract address used to mint the token.
  chainId: string; // Chain ID of the blockchain network where the token will be minted.
}

export interface TokenStatusResponse {
  status: "pending" | "waiting_for_finalization" | "registered"; // Status of the name token.
  sld?: string; // Second-level domain (SLD) of a name token.
  tld?: string; // Top-level domain (TLD) of a name token.
  expirationDate?: string; // Expiration date of a registered name token.
  owner?: string; // Owner wallet address.
  tokenId?: string; // Minted Token ID.
  contractAddress?: string; // NFT Smart Contract address.
  chainId?: string; // Chain ID of the blockchain network.
  txHash?: string; // Mint transaction hash.
  imageURL?: string; // Token image URL.
}

export interface BulkTokenStatusRequest {
  tokenIds: string[]; // List of token IDs to lookup for.
}

export interface TokenInfoResponse {
  sld: string; // Second-level domain (SLD) of a name token.
  tld: string; // Top-level domain (TLD) of a name token.
  expirationDate?: string; // Expiration date of a name token.
  tokenId: string; // Token ID.
  contractAddress: string; // NFT Smart Contract address.
  chainId?: string; // Chain ID of the blockchain network.
}

export interface PaginatedTokensResponse {
  total: number; // Total number of name tokens.
  pageItems: TokenInfoResponse[]; // List of name tokens.
}

export interface SearchItemResponse {
  sld: string; // Second-level domain (SLD) of a name token.
  tld: string; // Top-level domain (TLD) of a name token.
  status: "available" | "registered" | "reserved"; // Name availability status.
  isListed: boolean; // Indicates if there's an active listing for a registered name.
  registrationExpiresAt?: string; // Registration expiration date.
  reservationExpiresAt?: string; // Reservation expiration date.
  usdPrice?: string; // Price in USD.
  nativeAmount?: string; // Price in native token.
  nativeCurrency?: string; // Native blockchain currency.
  clickUrl: string; // Click URL for more information.
  lockExpiresAt?: string; // Lock expiration date.
}

export interface SearchPaginatedResponse {
  total: number; // Total number of items.
  pageItems: SearchItemResponse[]; // List of search items.
}

export interface PaymentOptionResponse {
  chainId: string; // Chain ID of the blockchain network.
  chainName: string; // Name of the blockchain network.
  addressType: "EVM" | "SUI" | "NEAR" | "CASPER" | "TOKENPROOF" | "SOLANA"; // Wallet address type for the current chain.
  contractAddress: string; // The contract address of the payment method.
  tokenAddress?: string; // The token address used in the payment method.
  symbol?: string; // The token symbol used in the payment method currency.
  icon?: string; // The token icon used in the payment method currency.
  price: number; // The token price used in the payment method.
}

export interface PaymentOptionsResponse {
  options: PaymentOptionResponse[]; // Array of payment options.
}

export interface OrderPaymentOptionsRequest {
  contractAddress: string; // The contract address of the payment method.
  tokenAddress: string; // The token address used in the payment method.
  buyerAddress: string; // The address of the buyer.
}

export interface NameRequest {
  sld: string; // Second-level domain (SLD) of the name to mint.
  tld: string; // Top-level domain (TLD) of the name to mint.
  autoRenew?: boolean; // Whether to auto-renew the domain after it expires.
  domainLength?: number; // The length of the domain registration in years.
}

export interface PartnerOrderRequest {
  paymentOptions: {
    contractAddress: string; // The contract address of the payment method.
    tokenAddress: string; // The token address used in the payment method.
    buyerAddress: string; // The address of the buyer.
  };
  names: NameRequest[]; // Array of names to mint.
}

export interface PartnerOrderResponse {
  voucher: {
    buyer: string;
    token: string;
    amount: string;
    voucherExpiration: string;
    paymentId: string;
    orderId: string;
    names: NameRequest[];
  };
  signature: string; // The signature of the voucher for submission.
}

export interface DomainVerificationSubmitResponse {
  message: string; // Message indicating the number of domains submitted successfully.
  skipped: {
    domain: string;
    reason: string;
  }[]; // List of domains that were skipped during submission.
}

export interface DomainVerificationStatusResponse {
  message: string; // Message indicating the status of the domain verification.
  status: "NOT_VERIFIED" | "VERIFIED" | "FAILED"; // Status of the domain verification.
}
