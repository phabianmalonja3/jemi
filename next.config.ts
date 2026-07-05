
module.exports = {
  allowedDevOrigins: [' http://127.0.0.1:3000', 'http://localhost:3000', 'http://127.0.0.1:3000'],

   images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/api/v0.1/uploads/**',
      },
      // Ikiwa utatumia IP address ya server yako baadaye, ongeza hii pia:
      {
        protocol: 'http',
        hostname: '168.144.135.14',
        port: '8080',
        pathname: '/api/v0.1/uploads/**',
      },
    ],
  },
}


