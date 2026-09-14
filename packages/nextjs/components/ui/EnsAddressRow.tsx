"use client";

import { useState } from "react";
import { blo } from "blo";
import { getAddress, isAddress } from "viem";
import { useEnsName } from "wagmi";
import { useEnsAvatarByName } from "~~/hooks/useEnsAvatarFromAddress";
import { mainnet } from "~~/scaffold.config";

// The "ENS-or-short-address + avatar + copy" row, drawn to match
// scaffold-ui's <Address size="xs" onlyEnsOrAddress disableAddressLink />
// (24px blockie, text-xs, 14px copy icon). We own it so the avatar lookup
// can name an IPFS gateway — the library hook hard-codes viem's default
// (ipfs.io), which 403s browsers. See useEnsAvatarFromAddress.ts.

const copyIconPath =
  "M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75";
const checkIconPath = "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z";

export const EnsAddressRow = ({ address }: { address: string }) => {
  const checksum = (isAddress(address) ? getAddress(address) : undefined) as `0x${string}` | undefined;
  const { data: ens } = useEnsName({
    address: checksum,
    chainId: mainnet.id,
    query: { enabled: !!checksum },
  });
  const avatar = useEnsAvatarByName(ens);
  const [copied, setCopied] = useState(false);

  if (!checksum) return <span className="text-xs">{address}</span>;

  const short = `${checksum.slice(0, 6)}...${checksum.slice(-4)}`;
  const copy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(checksum);
      setCopied(true);
      setTimeout(() => setCopied(false), 800);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <span className="flex items-center shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="rounded-full shrink-0"
        src={avatar || blo(checksum)}
        width={18}
        height={18}
        alt={`${checksum} avatar`}
      />
      <span className="ml-1.5 text-xs font-normal">{ens || short}</span>
      <button type="button" onClick={copy} className="ml-1 h-3.5 w-3.5 cursor-pointer" aria-label="copy address">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d={copied ? checkIconPath : copyIconPath} />
        </svg>
      </button>
    </span>
  );
};

export default EnsAddressRow;
