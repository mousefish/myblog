
struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
    @location(0) color: vec4<f32>,
};

@vertex
fn main(@builtin(vertex_index) VertexIndex: u32) -> VertexOutput {
    var pos = array<vec2<f32>, 3>(
        vec2<f32>(0.0, 0.5),
        vec2<f32>(-0.5,-0.5),
        vec2<f32>(0.5, -0.5)
    );

    var color = array<vec4<f32>, 3>(
        vec4<f32>(1.0,0.0,0.0,1.0),
        vec4<f32>(0.0,1.0,0.0,1.0),
        vec4<f32>(0.0,0.0,1.0,1.0)
    );

    var output: VertexOutput;
    output.Position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);
    output.color = color[VertexIndex];

    return output;
}