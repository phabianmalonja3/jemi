
module.exports = {
  allowedDevOrigins: ['127.0.0.1'],

   images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8080',
        pathname: '/api/v0.1/uploads/**',
      },
    ],
  },
}


