D3 API
D3 API Overview
D3 API allow for a fully custom integration of D3 features directly into your application. The API exposes an interface for interacting with Web3 Name Tokens on the D3 registry and allows searching, purchasing and minting, and more.

Getting Started
Demo App

Sample Source Code (See our github repository for an example app built using our APIs)

Detailed Steps 👇

Sign up at D3 Developer Dashboard to get your own API keys today.

Swagger for these APIs can also be viewed at https://api-public.d3.app/swagger#/ 

Search name tokens returning availability and pricing
Provides search, combining availability information and pricing, both in native token and USD.

GET/v1/partner/search
Authorization

Api-Key

API Key

Query parameters

Response

200
Body

application/json
totalnumber
Total number of items.

Example: 100
pageItemsarray of SearchItemResponse (object)
List of search items.


Request

JavaScript
Copy
const response = await fetch('/v1/partner/search?sld=text', {
    method: 'GET',
    headers: {},
});
const data = await response.json();
Test it
Response

200
Copy
{
  "total": 100,
  "pageItems": [
    {
      "sld": "example",
      "tld": "com",
      "status": "available",
      "isListed": true,
      "registrationExpiresAt": "2025-05-15T00:00:00.000Z",
      "reservationExpiresAt": "2025-05-15T00:00:00.000Z",
      "usdPrice": "9.99",
      "nativeAmount": "1.23456",
      "nativeCurrency": "ETH",
      "clickUrl": "https://d3.app/search?sld=example&product=example.com&partner=com&utm_source=developer&utm_medium=api",
      "lockExpiresAt": "2025-05-15T00:00:00.000Z"
    }
  ]
}
Get name recommendations
Returns name recommendations based on the provided SLDs and TLDs

GET/v1/partner/recommendations
Authorization

Api-Key

Query parameters

Response

200
Successful name recommendations

Body

application/json
sldstring
Second-level domain (SLD) of a name token.

Example: "example"
tldstring
Top-level domain (TLD) of a name token.

Example: "com"
statusenum
Name availability status.

Example: "available"
available
registered
reserved
isListedboolean
When status is registered, indicates if there's an active listing for it.

Example: true
registrationExpiresAtnullable string (date-time)
When name is registered, indicates registration expiration date. Past expiration date means that the name has expired, but in a grace period now. It could be renewed by the current owner, or be back on the market after a grace period has passed.

Example: "2025-05-15T00:00:00.000Z"
reservationExpiresAtnullable string (date-time)
When name is reserved, indicates reservation expiration date. When name is available, indicates reservation expiration date for the reserved user.

Example: "2025-05-15T00:00:00.000Z"
usdPricenullable string
Price in USD

Example: "9.99"
nativeAmountnullable string
Price in native token

Example: "1.23456"
nativeCurrencyobject
Native blockchain currency. Will be null if tokenization is unsupported for given TLD

Example: "ETH"
clickUrlstring
Click URL for more information

Example: "https://d3.app/search?sld=example&product=example.com&partner=com&utm_source=developer&utm_medium=api"
lockExpiresAtnullable string (date-time)
When name is locked, indicates lock expiration date. This is the date until which the domain remains locked, after which it may become available.

Example: "2025-05-15T00:00:00.000Z"
Request

JavaScript
Copy
const response = await fetch('/v1/partner/recommendations?sld=text', {
    method: 'GET',
    headers: {},
});
const data = await response.json();
Test it
Response

200
Copy
[
  {
    "sld": "example",
    "tld": "com",
    "status": "available",
    "isListed": true,
    "registrationExpiresAt": "2025-05-15T00:00:00.000Z",
    "reservationExpiresAt": "2025-05-15T00:00:00.000Z",
    "usdPrice": "9.99",
    "nativeAmount": "1.23456",
    "nativeCurrency": "ETH",
    "clickUrl": "https://d3.app/search?sld=example&product=example.com&partner=com&utm_source=developer&utm_medium=api",
    "lockExpiresAt": "2025-05-15T00:00:00.000Z"
  }
]
Mint a name token
Accepts mint name request. Only allows minting of non-premium name tokens (requires NON_PREMIUM_MINT permission).Token is not minted immediately but is scheduled for minting. Mint status could be checked using token status endpoint.

POST/v1/partner/mint
Authorization

Api-Key

Body

application/json
sldstring
Second-level domain (SLD) of the name to mint.

Example: "example"
tldstring
Top-level domain (TLD) of the name to mint.

Example: "com"
userall of
User information required to mint the name.


Response

202
Body

application/json
tokenIdstring
Token ID that will be minted.

Example: "20719405654568256184282804044567699961418926341258048728655171573148113774124"
contractAddressstring
NFT Smart Contract address, which will be used to mint the token.

Example: "0x4F3775dfd49db0BBcd47eB6f45CEb6E6E9e15CD8"
chainIdstring
Chain ID of the blockchain network where the token will be minted. For EVM chains, Chain ID is returned.

Example: "1"
Request

JavaScript
Copy
const response = await fetch('/v1/partner/mint', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "sld": "example",
      "tld": "com",
      "user": {
        "wallet": "0x2E7cC63800e77BB8c662c45Ef33D1cCc23861532"
      }
    }),
});
const data = await response.json();
Test it
Response

202
Copy
{
  "tokenId": "20719405654568256184282804044567699961418926341258048728655171573148113774124",
  "contractAddress": "0x4F3775dfd49db0BBcd47eB6f45CEb6E6E9e15CD8",
  "chainId": "1"
}
Get supported payment methods for name tokens
Returns the supported payment options (contract and token addresses) for the provided TLDs.

GET/v1/partner/payment/options
Authorization

Api-Key

Query parameters

Response

200
Returns payment options for name tokens.

Body

application/json
optionsarray of PaymentOptionResponse (object)
Array of payment options, each containing contract and token addresses


Request

JavaScript
Copy
const response = await fetch('/v1/partner/payment/options', {
    method: 'GET',
    headers: {},
});
const data = await response.json();
Test it
Response

200
Copy
{
  "options": [
    {
      "chainId": "1",
      "chainName": "Ethereum",
      "addressType": "EVM",
      "contractAddress": "0x46A7bEA3dBb87522834c8b24FA14D051893deE8a",
      "tokenAddress": "0x0000000000000000000000000000000000000000",
      "symbol": "BTC",
      "icon": "https://cdn.d3.app/assets/tokens/token_image_BTC.png",
      "price": "0.3983550997142373"
    }
  ]
}
Create a partner order for name token purchase
Creates a new order for name token purchase. The response includes a payment voucher and details necessary to complete the purchase.

POST/v1/partner/order
Authorization

Api-Key

Body

application/json
Details required to create an order for name token purchase

paymentOptionsall of
The payment options for the transaction


namesarray of NameRequest (object)
Array of names to mint, each including an SLD and TLD


Response

201
The order has been successfully created.

Body

application/json
voucherone of
The voucher details including names, amount, and expiration


object

signaturestring
The signature of the voucher for submission

Example: "0x57235cf3bc5d305cc1dc4b040ae3b1dd34ade899ecc97d33e2167346c05f217348f80012d8081bdfaeed3f02a81e12483fdf12afd6715f5c5c1f322c390defc61c"
Request

JavaScript
Copy
const response = await fetch('/v1/partner/order', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "paymentOptions": {
        "contractAddress": "0x46A7bEA3dBb87522834c8b24FA14D051893deE8a",
        "tokenAddress": "0x0000000000000000000000000000000000000000",
        "buyerAddress": "0x65d90DBa570408f8D512c91556d8E405acd99EE2"
      },
      "names": [
        {
          "sld": "example1",
          "tld": "shib"
        }
      ]
    }),
});
const data = await response.json();
Test it
Response

201
Copy
{
  "voucher": {
    "buyer": "0x0FB3F00e792F17B7D45611932ac72FcD4cdFfE6E",
    "token": "0x0000000000000000000000000000000000000000",
    "amount": "23295578965024017037",
    "voucherExpiration": 1727104758,
    "paymentId": "47cbbdaa-0a3c-4e80-94e9-139415e86fdd",
    "orderId": "3434-3675-5844-7264",
    "names": [
      {
        "registry": "0x4F3775dfd49db0BBcd47eB6f45CEb6E6E9e15CD8",
        "label": "example",
        "tld": "tst",
        "expirationTime": 1758585600,
        "owner": "0x0FB3F00e792F17B7D45611932ac72FcD4cdFfE6E",
        "renewal": false
      }
    ]
  },
  "signature": "0x57235cf3bc5d305cc1dc4b040ae3b1dd34ade899ecc97d33e2167346c05f217348f80012d8081bdfaeed3f02a81e12483fdf12afd6715f5c5c1f322c390defc61c"
}
Get name token metadata
Returns metadata and registration status of a name token.

GET/v1/partner/token/{sld}/{tld}
Authorization

Api-Key

Path parameters

tldany
Top-level domain (TLD) of the name token.

Example: "com"
sldany
Second-level domain (SLD) of the name token.

Example: "example"
Response

200
Body

application/json
statusenum
Status of the name token.

Example: "registered"
pending
waiting_for_finalization
registered
sldstring
Second-level domain (SLD) of a name token. Only present when name token is registered.

Example: "example"
tldstring
Top-level domain (TLD) of a name token. Only present when name token is registered.

Example: "com"
expirationDatestring (date-time)
Expiration date of a registered name token. May return a past date if the token has expired. Only present when name token is registered.

Example: "2025-05-15T00:00:00.000Z"
ownerstring
Owner wallet address. Format is chain-specific. Only present when name token is registered.

Example: "0x2E7cC63800e77BB8c662c45Ef33D1cCc23861532"
tokenIdstring
Minted Token ID. Only present when name token is registered.

Example: "20719405654568256184282804044567699961418926341258048728655171573148113774124"
contractAddressstring
NFT Smart Contract address. Only present when name token is registered.

Example: "0x4F3775dfd49db0BBcd47eB6f45CEb6E6E9e15CD8"
chainIdstring
Chain ID of the blockchain network. Only present when name token is registered or waiting for finalization.

Example: "1"
txHashstring
Mint transaction hash. Only present when name token is waiting for finalization.

Example: "2sXoUFPpgFXRKiAXYUWkwtAEQd46azUEFwoebcYQbN6s"
imageURLstring
Token image URL, only present if token is minted.

Example: "https://cdn.d3.app/tokens/1234567890abcdf123467890.png"
Request

JavaScript
Copy
const response = await fetch('/v1/partner/token/{sld}/{tld}', {
    method: 'GET',
    headers: {},
});
const data = await response.json();
Test it
Response

200
Copy
{
  "status": "registered",
  "sld": "example",
  "tld": "com",
  "expirationDate": "2025-05-15T00:00:00.000Z",
  "owner": "0x2E7cC63800e77BB8c662c45Ef33D1cCc23861532",
  "tokenId": "20719405654568256184282804044567699961418926341258048728655171573148113774124",
  "contractAddress": "0x4F3775dfd49db0BBcd47eB6f45CEb6E6E9e15CD8",
  "chainId": "1",
  "txHash": "2sXoUFPpgFXRKiAXYUWkwtAEQd46azUEFwoebcYQbN6s",
  "imageURL": "https://cdn.d3.app/tokens/1234567890abcdf123467890.png"
}
Get name token metadata by token ID
Returns metadata of a name token by token ID.

GET/v1/partner/token/{chainId}/{contractAddress}/{tokenId}
Authorization

Api-Key

Path parameters

chainIdstring
Chain ID of the blockchain network.

Example: "1"
contractAddressstring
NFT Smart Contract address.

Example: "0x4F3775dfd49db0BBcd47eB6f45CEb6E6E9e15CD8"
tokenIdstring
Minted Token ID.

Example: "20719405654568256184282804044567699961418926341258048728655171573148113774124"
Response

200
Body

application/json
statusenum
Status of the name token.

Example: "registered"
pending
waiting_for_finalization
registered
sldstring
Second-level domain (SLD) of a name token. Only present when name token is registered.

Example: "example"
tldstring
Top-level domain (TLD) of a name token. Only present when name token is registered.

Example: "com"
expirationDatestring (date-time)
Expiration date of a registered name token. May return a past date if the token has expired. Only present when name token is registered.

Example: "2025-05-15T00:00:00.000Z"
ownerstring
Owner wallet address. Format is chain-specific. Only present when name token is registered.

Example: "0x2E7cC63800e77BB8c662c45Ef33D1cCc23861532"
tokenIdstring
Minted Token ID. Only present when name token is registered.

Example: "20719405654568256184282804044567699961418926341258048728655171573148113774124"
contractAddressstring
NFT Smart Contract address. Only present when name token is registered.

Example: "0x4F3775dfd49db0BBcd47eB6f45CEb6E6E9e15CD8"
chainIdstring
Chain ID of the blockchain network. Only present when name token is registered or waiting for finalization.

Example: "1"
txHashstring
Mint transaction hash. Only present when name token is waiting for finalization.

Example: "2sXoUFPpgFXRKiAXYUWkwtAEQd46azUEFwoebcYQbN6s"
imageURLstring
Token image URL, only present if token is minted.

Example: "https://cdn.d3.app/tokens/1234567890abcdf123467890.png"
Request

JavaScript
Copy
const response = await fetch('/v1/partner/token/{chainId}/{contractAddress}/{tokenId}', {
    method: 'GET',
    headers: {},
});
const data = await response.json();
Test it
Response

200
Copy
{
  "status": "registered",
  "sld": "example",
  "tld": "com",
  "expirationDate": "2025-05-15T00:00:00.000Z",
  "owner": "0x2E7cC63800e77BB8c662c45Ef33D1cCc23861532",
  "tokenId": "20719405654568256184282804044567699961418926341258048728655171573148113774124",
  "contractAddress": "0x4F3775dfd49db0BBcd47eB6f45CEb6E6E9e15CD8",
  "chainId": "1",
  "txHash": "2sXoUFPpgFXRKiAXYUWkwtAEQd46azUEFwoebcYQbN6s",
  "imageURL": "https://cdn.d3.app/tokens/1234567890abcdf123467890.png"
}
Get name token metadata by multiple token IDs at once
Returns metadata of multiple name tokens by their token IDs.

POST/v1/partner/tokens/{chainId}/{contractAddress}
Authorization

Api-Key

Path parameters

chainIdstring
Chain ID of the blockchain network.

Example: "1"
contractAddressstring
NFT Smart Contract address.

Example: "0x4F3775dfd49db0BBcd47eB6f45CEb6E6E9e15CD8"
Body

application/json
tokenIdsarray of string
List of token ids to lookup for


Response

200
Body

application/json
statusenum
Status of the name token.

Example: "registered"
pending
waiting_for_finalization
registered
sldstring
Second-level domain (SLD) of a name token. Only present when name token is registered.

Example: "example"
tldstring
Top-level domain (TLD) of a name token. Only present when name token is registered.

Example: "com"
expirationDatestring (date-time)
Expiration date of a registered name token. May return a past date if the token has expired. Only present when name token is registered.

Example: "2025-05-15T00:00:00.000Z"
ownerstring
Owner wallet address. Format is chain-specific. Only present when name token is registered.

Example: "0x2E7cC63800e77BB8c662c45Ef33D1cCc23861532"
tokenIdstring
Minted Token ID. Only present when name token is registered.

Example: "20719405654568256184282804044567699961418926341258048728655171573148113774124"
contractAddressstring
NFT Smart Contract address. Only present when name token is registered.

Example: "0x4F3775dfd49db0BBcd47eB6f45CEb6E6E9e15CD8"
chainIdstring
Chain ID of the blockchain network. Only present when name token is registered or waiting for finalization.

Example: "1"
txHashstring
Mint transaction hash. Only present when name token is waiting for finalization.

Example: "2sXoUFPpgFXRKiAXYUWkwtAEQd46azUEFwoebcYQbN6s"
imageURLstring
Token image URL, only present if token is minted.

Example: "https://cdn.d3.app/tokens/1234567890abcdf123467890.png"
Request

JavaScript
Copy
const response = await fetch('/v1/partner/tokens/{chainId}/{contractAddress}', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "tokenIds": [
        "text"
      ]
    }),
});
const data = await response.json();
Test it
Response

200
Copy
[
  {
    "status": "registered",
    "sld": "example",
    "tld": "com",
    "expirationDate": "2025-05-15T00:00:00.000Z",
    "owner": "0x2E7cC63800e77BB8c662c45Ef33D1cCc23861532",
    "tokenId": "20719405654568256184282804044567699961418926341258048728655171573148113774124",
    "contractAddress": "0x4F3775dfd49db0BBcd47eB6f45CEb6E6E9e15CD8",
    "chainId": "1",
    "txHash": "2sXoUFPpgFXRKiAXYUWkwtAEQd46azUEFwoebcYQbN6s",
    "imageURL": "https://cdn.d3.app/tokens/1234567890abcdf123467890.png"
  }
]
Get name tokens for a wallet address
Returns registered name tokens for a wallet address

GET/v1/partner/tokens/{addressType}/{address}
Authorization

Api-Key

Path parameters

addressany
Wallet address.

Example: "0x2E7cC63800e77BB8c662c45Ef33D1cCc23861532"
addressTypeenum
Wallet address type.

Example: "EVM"
EVM
SUI
NEAR
CASPER
TOKENPROOF
Query parameters

Response

200
Body

application/json
totalnumber
Total number of name tokens.

Example: 42
pageItemsarray of TokenInfoResponse (object)
List of name tokens.


Request

JavaScript
Copy
const response = await fetch('/v1/partner/tokens/{addressType}/{address}', {
    method: 'GET',
    headers: {},
});
const data = await response.json();
Test it
Response

200
Copy
{
  "total": 42,
  "pageItems": [
    {
      "sld": "example",
      "tld": "com",
      "expirationDate": "2025-05-15T00:00:00.000Z",
      "tokenId": "20719405654568256184282804044567699961418926341258048728655171573148113774124",
      "contractAddress": "0x4F3775dfd49db0BBcd47eB6f45CEb6E6E9e15CD8",
      "chainId": "1"
    }
  ]
}
