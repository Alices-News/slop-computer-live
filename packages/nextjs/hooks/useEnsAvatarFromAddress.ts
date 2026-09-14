"use client";

import { normalize } from "viem/ens";
import { useEnsAvatar, useEnsName } from "wagmi";
import { mainnet } from "~~/scaffold.config";

// Gateway used to turn an on-chain `ipfs://<cid>` avatar record into an
// https URL. viem's default (ipfs.io) sits behind a Cloudflare browser
// challenge since 2026-09, so an <img> pointed at it gets a 403 page and
// draws the broken-image icon. BuidlGuidl's gateway serves plain files
// (path form 301s to `<cid>.ipfs.community.bgipfs.com`, CORS open).
export const ENS_ASSET_GATEWAYS = { ipfs: "https://community.bgipfs.com" } as const;

// name → avatar https URL. ipfs://, ar://, eip155: NFT lookups, etc. are
// all unwrapped by useEnsAvatar; we only pin the ipfs gateway. Every
// avatar lookup in the app must go through here (or pass the same
// `assetGatewayUrls`) — the scaffold-ui <Address> can't, which is why
// SlopAddress renders its own row.
export function useEnsAvatarByName(name: string | null | undefined): string | null {
  const { data: avatar } = useEnsAvatar({
    name: name ? normalize(name) : undefined,
    chainId: mainnet.id,
    assetGatewayUrls: ENS_ASSET_GATEWAYS,
    query: { enabled: !!name },
  });
  return avatar ?? null;
}

// Two-step ENS resolve: address → primary name → avatar. Each step is
// individually cached by wagmi so multiple components asking about the
// same peer share one network round-trip.
export function useEnsAvatarFromAddress(address: string | null | undefined): string | null {
  const { data: name } = useEnsName({
    address: (address ?? undefined) as `0x${string}` | undefined,
    chainId: mainnet.id,
    query: { enabled: !!address },
  });
  return useEnsAvatarByName(name);
}
