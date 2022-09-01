import DeviceResource from '../enginecore/DeviceResource'

import triangleVertWGSL from './triangle.vert.wgsl'
import triangleFragWGSL from './triangle.frag.wgsl'

const HelloTriangle = async (canvasRef) => {
  if (canvasRef.current === null) return

  const ds = new DeviceResource(canvasRef)
  await ds.initializeDevice()
  ds.createContxt()
  ds.createRenderPipeline({
    vertexShader: triangleVertWGSL,
    fragmentShader: triangleFragWGSL,
    topology: 'triangle-list',
    layout: 'auto',
  })

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
    passEncoder.setPipeline(ds.renderPipeline)
    passEncoder.draw(3, 1, 0, 0)

    passEncoder.end()
    ds.gpuDevice.queue.submit([commandEncoder.finish()])

    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

export default HelloTriangle