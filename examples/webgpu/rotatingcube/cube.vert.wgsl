struct Uniforms {
    viewProjectionMatrix: mat4x4<f32>,
}

struct ModelUniforms {
    modelMatrix: mat4x4<f32>,
    color: vec4<f32>,
}

@binding(0) @group(0) var<uniform> uniforms: Uniforms;
@binding(0) @group(1) var<uniform> modelUniforms: ModelUniforms;

struct VertexOutput {
    @builtin(position) Position: vec4<f32>,
    @location(0) color: vec4<f32>,
}

@vertex
fn main(@location(0) position: vec3<f32>) -> VertexOutput {
    var output: VertexOutput;
    output.Position = uniforms.viewProjectionMatrix * modelUniforms.modelMatrix * vec4(position.xyz,1.0);
    output.color = modelUniforms.color;
    return output;
}