export default "uniform vec3 uDepthColor;\r\nuniform vec3 uSurfaceColor;\r\nuniform float uColorOffset;\r\nuniform float uColorMultiplier;\r\n\r\nvarying float vElevation;\r\n\r\nvoid main()\r\n{\r\n    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;\r\n    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);\r\n    gl_FragColor = vec4(color, 1.0);\r\n}";