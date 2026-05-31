/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  async redirects() {
    return [
      // Ékezetes slugok → ASCII (301, hogy a korábbi linkek/indexelés ne törjön)
      { source: '/tudastar/kabelmeretez%C3%A9s-alapok', destination: '/tudastar/kabelmeretezes-alapok', permanent: true },
      { source: '/tudastar/kabelmeretezés-alapok', destination: '/tudastar/kabelmeretezes-alapok', permanent: true },
      { source: '/tudastar/kulteri-vilagitas-ip-vedetts%C3%A9g', destination: '/tudastar/kulteri-vilagitas-ip-vedettseg', permanent: true },
      { source: '/tudastar/kulteri-vilagitas-ip-vedettség', destination: '/tudastar/kulteri-vilagitas-ip-vedettseg', permanent: true },
      { source: '/helyi/kapolnasny%C3%A9k', destination: '/helyi/kapolnasnyek', permanent: true },
      { source: '/helyi/kapolnasnyék', destination: '/helyi/kapolnasnyek', permanent: true },
    ];
  },
};

export default nextConfig;
