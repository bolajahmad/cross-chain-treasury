export async function fetchIpfsJson<T = unknown>(uri: string): Promise<T> {
  const res = await fetch(`https://ipfs.io/ipfs/${uri}`, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`IPFS fetch failed: ${res.status}`)
  }

  return res.json() as Promise<T>
}