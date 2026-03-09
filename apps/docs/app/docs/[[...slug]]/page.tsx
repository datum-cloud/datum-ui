import { DocsBody, DocsPage } from 'fumadocs-ui/page'
import { notFound } from 'next/navigation'

import { source } from '@/lib/source'
import { getMDXComponents } from '@/mdx-components'

interface PageProps {
  params: Promise<{ slug?: string[] }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const page = source.getPage(slug)

  if (!page) {
    notFound()
  }

  const MDX = page.data.body

  return (
    <DocsPage toc={page.data.toc}>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  )
}

export function generateStaticParams(): { slug: string[] }[] {
  return source.generateParams()
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) {
    notFound()
  }

  return {
    title: page.data.title,
    description: page.data.description,
  }
}
