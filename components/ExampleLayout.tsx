import { useEffect, useRef, useState } from 'react'
import HelloTriangle from 'examples/webgpu/hellotriangle/main'
interface Props {
  example: string
}

export const examples = {
  HelloTriangle: import('../examples/webgpu/hellotriangle/main'),
}

export default function ExampleLayout({ example }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [error, setError] = useState<unknown | null>(null)

  useEffect(() => {
    examples[example].then((example) => {
      example.default(canvasRef).catch((err) => {
        setError(err)
      })
    })
    return () => {
      console.log('cleaning up --> unmount ')
    }
  }, [])

  return (
    <div className="w-full">
      {error ? (
        <div>
          <p>WebGPU Error:</p>
          <p>{`${error}`}</p>
        </div>
      ) : null}
      <canvas id="examplecanvas" ref={canvasRef} className="w-full" />
    </div>
  )
}
