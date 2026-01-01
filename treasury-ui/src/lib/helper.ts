import { sha256 } from "js-sha256";

export const shortenAddress = (address?: string): string => {
  if (!address) {
    return '';
  }
  const length = address.length;

  return `${address.substring(0, 4)}...${address.substring(length - 4, length)}`;
};

export const hash256Message = async (message: string) => {
  const hasher = sha256.create();
  hasher.update(message);
  return hasher.hex();
}