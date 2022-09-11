import DeviceResource from '../enginecore/DeviceResource'

import triangleVertWGSL from './triangle.vert.wgsl'
import triangleFragWGSL from './triangle.frag.wgsl'
import { makeExample, ExampleInit } from '../../../components/ExampleLayout'

const init: ExampleInit = async ({ canvasRef }) => {
  if (canvasRef.current === null) return

  const ds = new DeviceResource(canvasRef)
  await ds.initializeDevice()
  ds.createContxt()
  const renderPipeline = ds.createRenderPipeline(
    triangleVertWGSL,
    triangleFragWGSL,
    'triangle-list',
    'auto'
  )

  function frame() {
    if (!canvasRef.current) return

    const commandEncoder = ds.gpuDevice.createCommandEncoder()
    const textureView = ds.context.getCurrentTexture().createView()

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: textureView,
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    }

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)
    passEncoder.setPipeline(renderPipeline)
    passEncoder.draw(3, 1, 0, 0)

    passEncoder.end()
    ds.gpuDevice.queue.submit([commandEncoder.finish()])

    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

const HelloTriangle: () => JSX.Element = () =>
  makeExample({
    init,
  })

export default HelloTriangle
