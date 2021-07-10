uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;
void main()	{
	// vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
	vec2 uv = vUv.xy;
	vec2 stepUV = uv;
	stepUV *= 5.;
    float steppah = step(fract(stepUV.x),0.5);;
    vec3 finalCol = vec3(1.,sin(vUv.y+time), sin(vUv.x-time));
	gl_FragColor = vec4(finalCol*steppah,1.);

	// gl_FragColor = vec4(1.,sin(vUv.y+time), sin(vUv.x-time),1.);
}