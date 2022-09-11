import DeviceResource from '../enginecore/DeviceResource'

import cubeVertWGSL from './cube.vert.wgsl'
import cubeFragWGSL from './cube.frag.wgsl'
import edgeVertWGSL from '../helper/edge.vert.wgsl'
import edgeFragWGSL from '../helper/edge.frag.wgsl'
import { makeExample, ExampleInit } from '../../../components/ExampleLayout'
import * as THREE from 'three'
import { Matrix4 } from 'three'

import dynamic from 'next/dynamic'

const init: ExampleInit = async ({ canvasRef }) => {
  if (canvasRef.current === null) return

  const ds = new DeviceResource(canvasRef)
  await ds.initializeDevice()
  ds.createContxt()
  const cube = new THREE.BoxGeometry(2, 2, 2)
  const edge = new THREE.EdgesGeometry(cube)

  const vertexByteLength = cube.attributes.position.count * 3 * Float32Array.BYTES_PER_ELEMENT
  const vertexBuffer = ds.gpuDevice.createBuffer({
    size: vertexByteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  })
  new Float32Array(vertexBuffer.getMappedRange()).set(cube.attributes.position.array)
  vertexBuffer.unmap()

  const edgeByteLength = edge.attributes.position.count * 3 * Float32Array.BYTES_PER_ELEMENT
  const edgeVertexBuffer = ds.gpuDevice.createBuffer({
    size: edgeByteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  })
  new Float32Array(edgeVertexBuffer.getMappedRange()).set(edge.attributes.position.array)
  edgeVertexBuffer.unmap()

  const indiceByteLength = cube.index.count * Uint16Array.BYTES_PER_ELEMENT
  const indiceBuffer = ds.gpuDevice.createBuffer({
    size: indiceByteLength,
    usage: GPUBufferUsage.INDEX,
    mappedAtCreation: true,
  })
  new Uint16Array(indiceBuffer.getMappedRange()).set(cube.index.array)
  indiceBuffer.unmap()

  const vertexBufferConfig: GPUVertexBufferLayout = {
    arrayStride: 3 * Float32Array.BYTES_PER_ELEMENT,
    attributes: [
      {
        shaderLocation: 0,
        offset: 0,
        format: 'float32x3',
      },
    ],
  }

  const aspect = canvasRef.current.width / canvasRef.current.height
  const camera = new THREE.PerspectiveCamera(72, aspect, 1, 100.0)
  camera.position.z = 4
  camera.lookAt(0, 0, 0)
  camera.updateMatrixWorld()

  const _projectViewMatrix = camera.projectionMatrix.clone().multiply(camera.matrixWorldInverse)

  const uniformBufferSize = Float32Array.BYTES_PER_ELEMENT * 16
  const uniformBuffer = ds.gpuDevice.createBuffer({
    size: uniformBufferSize,
    usage: GPUBufferUsage.UNIFORM,
    mappedAtCreation: true,
  })
  new Float32Array(uniformBuffer.getMappedRange()).set(_projectViewMatrix.toArray())
  uniformBuffer.unmap()

  const uniformModelBufferSize =
    Float32Array.BYTES_PER_ELEMENT * 16 + Float32Array.BYTES_PER_ELEMENT * 4
  const uniformModelBuffer = ds.gpuDevice.createBuffer({
    size: uniformModelBufferSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  })

  const uniformBindGroupLayout = ds.gpuDevice.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: {
          type: 'uniform',
          hasDynamicOffset: false,
        },
      },
    ],
  })

  const pipelineLayout = ds.gpuDevice.createPipelineLayout({
    bindGroupLayouts: [uniformBindGroupLayout, uniformBindGroupLayout],
  })

  const renderPipeline = ds.createRenderPipeline(
    cubeVertWGSL,
    cubeFragWGSL,
    'triangle-list',
    pipelineLayout,
    [vertexBufferConfig],
    ds.createDefaultDepthStencilConfig()
  )

  const edgePipeline = ds.createRenderPipeline(
    edgeVertWGSL,
    edgeFragWGSL,
    'line-list',
    pipelineLayout,
    [vertexBufferConfig],
    ds.createDefaultDepthStencilConfig()
  )

  const uniformBindGroup = ds.gpuDevice.createBindGroup({
    layout: renderPipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: uniformBuffer,
        },
      },
    ],
  })

  const uniformModelBindGroup = ds.gpuDevice.createBindGroup({
    layout: renderPipeline.getBindGroupLayout(1),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: uniformModelBuffer,
        },
      },
    ],
  })

  const depthTexture = ds.gpuDevice.createTexture({
    size: ds.presentationSize,
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  })

  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments: [
      {
        view: undefined,
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
    depthStencilAttachment: {
      view: depthTexture.createView(),
      depthClearValue: 1.0,
      depthLoadOp: 'clear',
      depthStoreOp: 'store',
    },
  }

  //const projectViewArray = new Float32Array(_projectViewMatrix.toArray());
  const uniformArray = new Float32Array(uniformModelBufferSize / 4)

  function getUnifromValue() {
    const now = Date.now() / 1000
    const axis = new THREE.Vector3(Math.sin(now), Math.cos(now), 0).normalize()
    let _mvpMatrix = new Matrix4()
    _mvpMatrix = _mvpMatrix.makeRotationAxis(axis, 1)
    _mvpMatrix.toArray(uniformArray)
    const r = Math.sin(now) < 0 ? 0 : Math.sin(now)
    const b = Math.sin(now) > 0 ? 0 : Math.abs(Math.sin(now))
    uniformArray[16] = r
    uniformArray[17] = Math.abs(Math.cos(now))
    uniformArray[18] = b
    uniformArray[19] = 1.0
  }

  function frame() {
    if (!canvasRef.current) return

    getUnifromValue()

    ds.gpuDevice.queue.writeBuffer(
      uniformModelBuffer,
      0,
      uniformArray.buffer,
      uniformArray.byteOffset,
      uniformArray.byteLength
    )

    renderPassDescriptor.colorAttachments[0].view = ds.context.getCurrentTexture().createView()

    const commandEncoder = ds.gpuDevice.createCommandEncoder()

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)

    passEncoder.setPipeline(renderPipeline)
    passEncoder.setBindGroup(0, uniformBindGroup)
    passEncoder.setBindGroup(1, uniformModelBindGroup)
    passEncoder.setVertexBuffer(0, vertexBuffer)
    passEncoder.setIndexBuffer(indiceBuffer, 'uint16')
    passEncoder.drawIndexed(cube.index.count, 1, 0, 0, 0)

    passEncoder.setPipeline(edgePipeline)
    passEncoder.setVertexBuffer(0, edgeVertexBuffer)
    passEncoder.draw(edge.attributes.position.count, 1, 0, 0)

    passEncoder.end()
    ds.gpuDevice.queue.submit([commandEncoder.finish()])

    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

const RotatingCube: () => JSX.Element = () =>
  makeExample({
    init,
  })

export default RotatingCube
