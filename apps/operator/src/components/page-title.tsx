interface PageTitleProps {
  title: string | React.ReactNode
  description?: string | React.ReactNode
  centered?: boolean
}

const PageTitle = ({
  title,
  description,
  centered = false,
}: PageTitleProps) => {
  return (
    <div className={centered ? 'text-center' : undefined}>
      <h1 className="text-4xl leading-10 mb-10 w-full font-bold font-mono">
        {title}
        {description ? (
          <p className="text-2xl mt-4 leading-5 font-thin font-sans">
            {description}
          </p>
        ) : null}
      </h1>
    </div>
  )
}

export default PageTitle
