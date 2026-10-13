function r2PublicHostname() {
  const url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

const r2Hostname = r2PublicHostname();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: r2Hostname
      ? [{ protocol: "https", hostname: r2Hostname, pathname: "/**" }]
      : [],
  },
};

export default nextConfig;
