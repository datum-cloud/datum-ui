import localFont from 'next/font/local'

export const karelia = localFont({
  src: [
    {
      path: './KareliaWeb-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '/KareliaWeb-Medium.woff2',
      weight: '500',
      style: 'medium',
    },
  ],
  variable: '--font-karelia',
})

export const ftRegola = localFont({
  src: [
    {
      path: './FTRegolaNeueTrial-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './FTRegolaNeueTrial-Medium.woff2',
      weight: '500',
      style: 'medium',
    },
    {
      path: './FTRegolaNeueTrial-Semibold.woff2',
      weight: '600',
      style: 'semibold',
    },
  ],
  variable: '--font-ftRegola',
})

export const aime = localFont({
  src: [
    {
      path: './FAMAimeTRIAL-ExtraBold.woff2',
      weight: '800',
      style: 'extrabold',
    },
  ],
  variable: '--font-FAMAime',
})
