	import './style.css'
    import * as THREE from 'three'
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
	import { Sky } from 'three/examples/jsm/objects/Sky.js';
    import * as dat from 'dat.gui'
    import waterVertexShader from './shaders/vertex.glsl'
    import waterFragmentShader from './shaders/fragment.glsl'
    
    const gui = new dat.GUI({ width: 340 })
    const debugObject = {}
    debugObject.depthColor = '#186691'
    debugObject.surfaceColor = '#9bd8ff'

    const canvas = document.querySelector('canvas.webgl')

    const scene = new THREE.Scene()
    

    const waterGeometry = new THREE.PlaneGeometry(8, 8, 512, 512)
    
    const waterMaterial = new THREE.ShaderMaterial({
        vertexShader: waterVertexShader,
        fragmentShader: waterFragmentShader,
        side: THREE.DoubleSide,
        uniforms: 
        {
            uTime: {value:0},
            uBigWavesSpeed: {value: 0.15},
            uBigWavesElevation: {value: 0.2},
            uBigWavesFrequency: {value: new THREE.Vector2(3, 1.5)},
            uSmallWavesElevation: {value: 0.15},
            uSmallWavesFrequency: {value: 3},
            uSmallWavesSpeed: {value: 0.2},
            uSmallWavesIterations: {value: 4},
            uDepthColor: {value: new THREE.Color(debugObject.depthColor)},
            uSurfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},
            uColorOffset: {value: 0.08},
            uColorMultiplier: {value: 5},
        }
    })

    gui.closed = true
    
    gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value')
    .min(0).max(0.2).step(0.01).name('Big waves - elevation')
    gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x')
    .min(0).max(10).step(1).name('Big waves - frequency x')
    gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y')
    .min(0).max(10).step(1).name('Big waves - frequency y')
    gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value')
    .min(0).max(3).step(0.05).name('Big waves - speed')
    
    gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value')
    .min(0).max(1).step(0.05).name('Small waves - elvation')
    gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value')
    .min(0).max(30).step(0.5).name('Small waves - frequency')
    gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value')
    .min(0).max(4).step(0.05).name('Small waves - speed')
    gui.add(waterMaterial.uniforms.uSmallWavesIterations, 'value')
    .min(0).max(7).step(1).name('Small waves - interations')
    gui.addColor(debugObject, 'depthColor').name('Deep colour')
    .onChange(() => { waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor) })
    gui.addColor(debugObject, 'surfaceColor').name('Surface colour')
    .onChange(() => { waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) })
    gui.add(waterMaterial.uniforms.uColorOffset, 'value')
    .min(0).max(1).step(0.1).name('Brightness')
    gui.add(waterMaterial.uniforms.uColorMultiplier, 'value')
    .min(0).max(10).step(0.1).name('Contrast')
    
    const water = new THREE.Mesh(waterGeometry, waterMaterial)
    water.rotation.x = - Math.PI * 0.5
    scene.add(water)

  const sky = new Sky();
  sky.scale.setScalar( 10000 );
  scene.add( sky );

  const skyUniforms = sky.material.uniforms;

  skyUniforms[ 'turbidity' ].value = 10;
  skyUniforms[ 'rayleigh' ].value = 2;
  skyUniforms[ 'mieCoefficient' ].value = 0.005;
  skyUniforms[ 'mieDirectionalG' ].value = 0.8;

  const parameters = {
    elevation: 10,
    azimuth: 100
  };
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    
    window.addEventListener('resize', () =>
    {

        sizes.width = window.innerWidth
        sizes.height = window.innerHeight
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
    
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(1, 1, 1)
    scene.add(camera)
    
    const controls = new OrbitControls(camera, canvas)
	controls.maxPolarAngle = Math.PI * 0.4;
    controls.enableDamping = true
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    const clock = new THREE.Clock()
    
    const tick = () =>
    {
        const elapsedTime = clock.getElapsedTime()
        waterMaterial.uniforms.uTime.value = elapsedTime
        controls.update()
        renderer.render(scene, camera)
        window.requestAnimationFrame(tick)
    }
    
    tick()