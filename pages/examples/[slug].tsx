import ExampleLayout from '@/components/ExampleLayout'

export default function ExampleDemo({ example }) {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            ExampleDemo
          </h1>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            <ExampleLayout example={example} />
          </div>
        </div>
      </div>
    </>
  )
}

export async function getStaticPaths({ locales }) {
  return {
    paths: [
      { params: { slug: 'HelloTriangle' }, locale: 'en' },
      { params: { slug: 'HelloTriangle' }, locale: 'zh' },
    ],
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const slug = context.params.slug
  return {
    props: {
      example: slug,
    },
    revalidate: 3000,
  }
}
