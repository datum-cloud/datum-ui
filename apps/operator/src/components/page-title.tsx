const PageTitle = ({ title, description }: any) => {
  return (
    <h1 className="text-4xl leading-10 mb-4 text-left w-full font-bold font-mono">
      {title}
      {description ? (
        <p className="text-2xl mt-4 leading-5 text-left font-thin font-sans">
          {description}
        </p>
      ) : null}
    </h1>
  )
}

export default PageTitle
