import { useEffect, useRef, useState } from 'react'

export type ExampleInit = (params: {
  canvasRef: React.RefObject<HTMLCanvasElement>
}) => void | Promise<void>

const ExampleLayout: React.FunctionComponent<
  React.PropsWithChildren<{
    init: ExampleInit
  }>
> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [error, setError] = useState<unknown | null>(null)

  useEffect(() => {
    try {
      const p = props.init({
        canvasRef,
      })

      if (p instanceof Promise) {
        p.catch((err: Error) => {
          console.error(err)
          setError(err)
        })
      }
    } catch (err) {
      console.error(err)
      setError(err)
    }
  }, [])

  return (
    <div className="h-full w-full">
      {error ? (
        <div>
          <p>WebGPU Error:</p>
          <p>{`${error}`}</p>
        </div>
      ) : null}
      <canvas id="examplecanvas" ref={canvasRef} className="h-full w-full" />
    </div>
  )
}

export default ExampleLayout

export const makeExample: (...props: Parameters<typeof ExampleLayout>) => JSX.Element = (props) => {
  return <ExampleLayout {...props} />
}
