class DeviceResource {
  gpuAdapter: GPUAdapter
  gpuDevice: GPUDevice
  canvasRef: React.RefObject<HTMLCanvasElement>
  context: GPUCanvasContext
  presentationFormat: GPUTextureFormat
  presentationSize: number[]
  renderPipeline: GPURenderPipeline

  constructor(canvas) {
    this.canvasRef = canvas
  }

  async initializeDevice() {
    if (!('gpu' in navigator)) {
      console.error("User angent doesn't support WebGPU")
      throw new Error("User angent doesn't support WebGPU")
    }

    this.gpuAdapter = await navigator.gpu.requestAdapter({
      powerPreference: 'high-performance',
    })

    if (!this.gpuAdapter) {
      console.error('No WebGPU adapter found')
      throw new Error('No WebGPU adapters found')
    }

    this.gpuDevice = await this.gpuAdapter.requestDevice()

    this.gpuDevice.lost.then((info) => {
      console.error(`WebGPU device was lost: ${info.message}`)
      this.gpuDevice = null

      if (info.reason != 'destroyed') {
        this.initializeDevice()
      }
    })
  }

  createContxt() {
    this.context = this.canvasRef.current.getContext('webgpu') as GPUCanvasContext

    this.presentationFormat = navigator.gpu.getPreferredCanvasFormat()

    this.resize()

    this.context.configure({
      device: this.gpuDevice,
      format: this.presentationFormat,
      alphaMode: 'opaque', //'opaque is default'
    })
  }

  resize() {
    const devicePixelRatio = window.devicePixelRatio || 1
    this.presentationSize = [
      this.canvasRef.current.clientWidth * devicePixelRatio,
      this.canvasRef.current.clientHeight * devicePixelRatio,
    ]
    this.canvasRef.current.width = this.presentationSize[0]
    this.canvasRef.current.height = this.presentationSize[1]
  }

  createRenderPipeline({ vertexShader, fragmentShader, topology, layout }) {
    this.renderPipeline = this.gpuDevice.createRenderPipeline({
      vertex: {
        module: this.gpuDevice.createShaderModule({
          code: vertexShader,
        }),
        entryPoint: 'main',
      },
      fragment: {
        module: this.gpuDevice.createShaderModule({
          code: fragmentShader,
        }),
        entryPoint: 'main',
        targets: [{ format: this.presentationFormat }],
      },
      primitive: {
        topology: topology,
        cullMode: 'none',
      },
      layout: layout,
    })
  }
}

export default DeviceResource
