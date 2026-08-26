
module.exports = {
  // allowedDevOrigins: ['jemigraph.co.tz',"jemigraph.co.tz"],

  //  images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https', // Badilisha kuwa https kwa sababu sasa unatumia SSL (Certbot)
  //       hostname: 'api.jemigraph.co.tz', // Badilisha IP kuwa subdomain ya API
  //       port: '', // Ikiwa ni https, haihitaji port (inatumia 443 default)
  //       pathname: '/uploads/**', // Ondoa '/api/v0.1' kama nginx yako ina-handle path hii
  //     },
  //   ],
  // },

  allowedDevOrigins: ['localhost:3000', '127.0.0.1:3000'],

images: {
  remotePatterns: [
    {
      protocol: 'http', // Local mara nyingi inatumia http
      hostname: 'localhost', // Badilisha kuwa localhost au 127.0.0.1
      port: '8080', // Weka port ya backend yako (mfano 8080) au iache wazi kama ni Next.js public
      pathname: '/uploads/**', 
    },
  ],
},
  // allowedDevOrigins: ['jemigraph.co.tz',"jemigraph.co.tz"],

  //  images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https', // Badilisha kuwa https kwa sababu sasa unatumia SSL (Certbot)
  //       hostname: 'api.jemigraph.co.tz', // Badilisha IP kuwa subdomain ya API
  //       port: '', // Ikiwa ni https, haihitaji port (inatumia 443 default)
  //       pathname: '/uploads/**', // Ondoa '/api/v0.1' kama nginx yako ina-handle path hii
  //     },
  //   ],
  // },
}


