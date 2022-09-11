import * as THREE from 'three'

export const getcubeVertexArray = function () {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const vertexCount = geometry.attributes.position.count
  const vertexData = new Float32Array(vertexCount * 3 * 2 + vertexCount * 2)
  for (let i = 0; i < vertexCount; i++) {
    const index = i * 8
    const sub_idx = i * 3
    vertexData[index] = geometry.attributes.position.array[sub_idx]
    vertexData[index + 1] = geometry.attributes.position.array[sub_idx + 1]
    vertexData[index + 2] = geometry.attributes.position.array[sub_idx + 2]
    vertexData[index + 3] = geometry.attributes.normal.array[sub_idx]
    vertexData[index + 4] = geometry.attributes.normal.array[sub_idx + 1]
    vertexData[index + 5] = geometry.attributes.normal.array[sub_idx + 2]
    vertexData[index + 6] = geometry.attributes.uv.array[sub_idx]
    vertexData[index + 7] = geometry.attributes.uv.array[sub_idx + 1]
  }
  return vertexData
}
