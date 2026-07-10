
module.exports = {
  allowedDevOrigins: ['http://192.168.100.161:3000',"127.0.0.1"],

   images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.100.161',
        port: '8080',
        pathname: '/api/v0.1/uploads/**',
      },
      // Ikiwa utatumia IP address ya server yako baadaye, ongeza hii pia:
      {
        protocol: 'http',
        hostname: '192.168.100.161',
        port: '8080',
        pathname: '/api/v0.1/uploads/**',
      },
    ],
  },
}


