import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'

type Props = { mode: number; paused: boolean; reducedMotion: boolean }

class FlowCurve extends THREE.Curve<THREE.Vector3> {
  constructor(private phase: number, private radius = 0.62) { super() }
  getPoint(t: number, target = new THREE.Vector3()) {
    const u = t * Math.PI * 2
    const v = this.phase + u * 3
    const r = 1.52 + this.radius * Math.cos(v)
    return target.set(r * Math.cos(u), r * Math.sin(u), this.radius * Math.sin(v))
  }
}

export default function Core({ mode, paused, reducedMotion }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const values = useRef({ mode, paused, reducedMotion })
  const [available, setAvailable] = useState(true)
  useEffect(() => { values.current = { mode, paused, reducedMotion } }, [mode, paused, reducedMotion])

  useEffect(() => {
    const el = host.current!
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' })
    } catch { setAvailable(false); return }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    renderer.setClearColor(0x111210, 0)
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60)
    camera.position.set(0, 0, 9.4)
    const pmrem = new THREE.PMREMGenerator(renderer)
    const room = new RoomEnvironment()
    const environment = pmrem.fromScene(room, 0.04)
    scene.environment = environment.texture
    const rig = new THREE.Group()
    scene.add(rig)
    rig.rotation.set(0.5, -0.42, -0.25)

    const metal = new THREE.MeshStandardMaterial({ color: 0xaa9182, metalness: 0.95, roughness: 0.27, envMapIntensity: 1.7 })
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x4d3930, metalness: 1, roughness: 0.35 })
    const litMetal = new THREE.MeshStandardMaterial({ color: 0xffa679, metalness: 0.7, roughness: 0.3, emissive: 0xff5522, emissiveIntensity: 1.15 })
    const filaments: THREE.Mesh[] = []
    for (let i = 0; i < 94; i++) {
      const phase = i / 94 * Math.PI * 2
      const glow = i % 19 === 0 || i === 1 || i === 93
      const geometry = new THREE.TubeGeometry(new FlowCurve(phase), 240, glow ? 0.012 : 0.009, 5, true)
      const filament = new THREE.Mesh(geometry, glow ? litMetal : i % 3 === 0 ? darkMetal : metal)
      rig.add(filament)
      filaments.push(filament)
    }

    const interior = new THREE.Mesh(new THREE.TorusGeometry(1.52, 0.55, 28, 100), new THREE.MeshStandardMaterial({ color: 0x171310, metalness: 0.95, roughness: 0.48 }))
    rig.add(interior)
    // A second offset field adds the changing silhouette of a living instrument.
    const halo = new THREE.Group()
    for (let i = 0; i < 4; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.25 + i * 0.055, 0.003, 4, 160), new THREE.MeshBasicMaterial({ color: i === 0 ? 0xa96b47 : 0x544238, transparent: true, opacity: 0.37 }))
      halo.add(ring)
    }
    halo.rotation.set(0.18, 0.3, 0)
    rig.add(halo)

    const key = new THREE.DirectionalLight(0xffe4c9, 4.7)
    key.position.set(-3, 4, 5)
    scene.add(key)
    const rim = new THREE.PointLight(0xff5627, 32, 16)
    rim.position.set(3, -1, 2)
    scene.add(rim)
    const cool = new THREE.DirectionalLight(0xc9d5e8, 1.5)
    cool.position.set(-4, -2, 1)
    scene.add(cool)

    const dustGeometry = new THREE.BufferGeometry()
    const dust = new Float32Array(210 * 3)
    // Deterministic stars keep the scene stable between mounts.
    for (let i = 0; i < 210; i++) {
      const n = Math.sin(i * 127.1 + 311.7) * 43758.5453
      const a = (n - Math.floor(n)) * Math.PI * 2
      const d = 2.55 + (i % 17) / 17 * 2
      dust[i * 3] = Math.cos(a) * d
      dust[i * 3 + 1] = Math.sin(a) * d
      dust[i * 3 + 2] = (i % 13) / 13 * 3 - 1.5
    }
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dust, 3))
    const particles = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: 0xa68d70, size: 0.012, transparent: true, opacity: 0.4, depthWrite: false }))
    scene.add(particles)

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.48, 0.55, 0.95)
    composer.addPass(bloom)
    composer.addPass(new OutputPass())
    const resize = () => {
      const { width, height } = el.getBoundingClientRect()
      renderer.setSize(width, height)
      composer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(el)
    resize()
    let visible = true
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    intersection.observe(el)
    const mouse = { x: 0, y: 0 }
    let settleFrames = 120
    let down = false
    let rotation = 0
    let lastX = 0
    const move = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      if (down) rotation += (e.clientX - lastX) * 0.007
      lastX = e.clientX
      settleFrames = 120
    }
    const start = (e: PointerEvent) => { down = true; lastX = e.clientX; el.setPointerCapture(e.pointerId) }
    const end = () => { down = false }
    const leave = () => { mouse.x = 0; mouse.y = 0 }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerdown', start)
    el.addEventListener('pointerup', end)
    el.addEventListener('pointercancel', end)
    el.addEventListener('pointerleave', leave)
    let frame = 0
    let elapsed = 0
    let lastRender = 0
    let lastMode = -1
    const rotations = [[0.52, -0.4, -0.25], [0.95, 0.24, 0.65], [0.18, -0.85, -0.48]]
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate)
      if (!visible || document.hidden) return
      const { mode, paused, reducedMotion } = values.current
      const still = paused || reducedMotion
      if (lastMode !== mode) { settleFrames = 120; lastMode = mode }
      // Keep still scenes inexpensive, and cap background artwork at 30 fps.
      if (now - lastRender < 1000 / 30) return
      if (still && settleFrames <= 0) return
      const dt = Math.min((now - lastRender) / 1000, 0.07)
      lastRender = now
      settleFrames--
      if (!still) elapsed += dt
      const target = rotations[mode]
      rig.rotation.x = THREE.MathUtils.lerp(rig.rotation.x, target[0] + (still ? 0 : mouse.y * 0.16), 0.035)
      rig.rotation.y = THREE.MathUtils.lerp(rig.rotation.y, target[1] + rotation + (still ? 0 : mouse.x * 0.22), 0.035)
      rig.rotation.z = THREE.MathUtils.lerp(rig.rotation.z, target[2] + Math.sin(elapsed * 0.15) * 0.12, 0.035)
      filaments.forEach((mesh) => { mesh.rotation.z = elapsed * (mode === 2 ? 0.075 : 0.035) })
      rig.position.y = Math.sin(elapsed * 0.45) * 0.065
      halo.rotation.y = elapsed * 0.06
      particles.rotation.z = elapsed * -0.012
      litMetal.emissiveIntensity = 1.1 + Math.sin(elapsed * 0.7) * 0.2
      composer.render()
    }
    frame = requestAnimationFrame(animate)
    const lost = (event: Event) => { event.preventDefault(); cancelAnimationFrame(frame); setAvailable(false) }
    renderer.domElement.addEventListener('webglcontextlost', lost)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect(); intersection.disconnect()
      el.removeEventListener('pointermove', move); el.removeEventListener('pointerdown', start)
      el.removeEventListener('pointerup', end); el.removeEventListener('pointercancel', end); el.removeEventListener('pointerleave', leave)
      renderer.domElement.removeEventListener('webglcontextlost', lost)
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose()
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach(m => m.dispose())
        }
      })
      room.dispose(); environment.dispose(); pmrem.dispose(); composer.dispose(); renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={host} className={`core-canvas ${available ? '' : 'core-fallback'}`} role="img" aria-label="An interactive copper torus woven from luminous filaments. Drag to rotate.">
    {!available && <div className="fallback-sculpture"><i /><i /><i /><i /><i /></div>}
  </div>
}
