
module.exports = {
  allowedDevOrigins: ['jemigraph.co.tz',"jemigraph.co.tz"],

   images: {
    remotePatterns: [
      {
        protocol: 'https', // Badilisha kuwa https kwa sababu sasa unatumia SSL (Certbot)
        hostname: 'api.jemigraph.co.tz', // Badilisha IP kuwa subdomain ya API
        port: '', // Ikiwa ni https, haihitaji port (inatumia 443 default)
        pathname: '/uploads/**', // Ondoa '/api/v0.1' kama nginx yako ina-handle path hii
      },
    ],
  },
}


