import localFont from 'next/font/local'

const karelia = localFont({
  src: [
    {
      path: '../app/fonts/KareliaWeb-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../app/fonts/KareliaWeb-Medium.ttf',
      weight: '500',
      style: 'medium',
    },
  ],
})

const ftRegola = localFont({
  src: [
    {
      path: '../app/fonts/FTRegolaNeueTrial-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../app/fonts/FTRegolaNeueTrial-Medium.woff',
      weight: '500',
      style: 'medium',
    },
    {
      path: '../app/fonts/FTRegolaNeueTrial-Semibold.woff',
      weight: '600',
      style: 'semibold',
    },
  ],
})

const PageTitle = ({ title, description }: any) => {
  return (
    <h1
      className={`text-4xl leading-10 mb-4 text-left w-full font-bold ${karelia.className}`}
    >
      {title}
      {description && (
        <p
          className={`text-2xl mt-4 leading-5 text-left font-thin ${ftRegola.className}`}
        >
          {description}
        </p>
      )}
    </h1>
  )
}

export default PageTitle
