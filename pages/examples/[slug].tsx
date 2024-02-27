import ExampleLayout from '@/components/ExampleLayout'
import dynamic from 'next/dynamic'
import { GetStaticPaths, GetStaticProps } from 'next'

type PathParams = {
  slug: string
}

type Props = {
  slug: string
}

export const examples = {
  HelloTriangle: dynamic(() => import('../../examples/webgpu/hellotriangle/main')),
  RotatingCube: dynamic(() => import('../../examples/webgpu/rotatingcube/main')),
  SnakeGame: dynamic(() => import('../../examples/games/snakegame/main')),
}

function ExampleDemo({ slug }: Props): JSX.Element {
  const ExampleDemo = examples[slug]
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {slug}
          </h1>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap justify-center">
            <ExampleDemo />
          </div>
        </div>
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths<PathParams> = async ({ locales }) => {
  const path1 = Object.keys(examples).map((exp) => {
    return { params: { slug: exp }, locale: 'en' }
  })
  const path2 = Object.keys(examples).map((exp) => {
    return { params: { slug: exp }, locale: 'zh' }
  })
  return {
    paths: path1.concat(path2),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props, PathParams> = async ({ params }) => {
  return {
    props: {
      ...params,
    },
    revalidate: 3000,
  }
}

export default ExampleDemo
