import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'
import gsap from 'gsap'

/**
 * Base
 */
// Debug
const gui = new GUI({
    width: 300,
    title: 'Debug UI',
    closeFolders: true,
})
gui.hide()

// window.addEventListener('keydown', (event) =>
// {
//     if(event.key == 'h')
//         gui.show(gui._hidden)
// })

const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// Floor
const floorAlpha = textureLoader.load('./floor/alpha.webp')

const floorColor = textureLoader.load('./floor/lichen_rock_2k/lichen_rock_diff_2k.webp')
const floorARM = textureLoader.load('./floor/lichen_rock_2k/lichen_rock_arm_2k.webp')
const floorNormal = textureLoader.load('./floor/lichen_rock_2k/lichen_rock_nor_gl_2k.webp')
const floorDisplacement = textureLoader.load('./floor/lichen_rock_2k/lichen_rock_disp_2k.webp')


floorColor.colorSpace = THREE.SRGBColorSpace

floorColor.repeat.set(4, 4)
floorARM.repeat.set(4, 4)
floorNormal.repeat.set(4, 4)
floorDisplacement.repeat.set(4, 4)

floorColor.wrapS = THREE.RepeatWrapping
floorARM.wrapS = THREE.RepeatWrapping
floorNormal.wrapS = THREE.RepeatWrapping
floorDisplacement.wrapS = THREE.RepeatWrapping

floorColor.wrapT = THREE.RepeatWrapping
floorARM.wrapT = THREE.RepeatWrapping
floorNormal.wrapT = THREE.RepeatWrapping
floorDisplacement.wrapT = THREE.RepeatWrapping

// Stairs
const stairsColor = textureLoader.load('./stairs/stone_tiles_02_2k/textures/stone_tiles_02_diff_2k.webp')
const stairsARM = textureLoader.load('./stairs/stone_tiles_02_2k/textures/stone_tiles_02_arm_2k.webp')
const stairsNormal = textureLoader.load('./stairs/stone_tiles_02_2k/textures/stone_tiles_02_nor_gl_2k.webp')

stairsColor.colorSpace = THREE.SRGBColorSpace

stairsColor.repeat.set(2, 2)
stairsARM.repeat.set(2, 2)
stairsNormal.repeat.set(2, 2)

stairsColor.wrapS = THREE.RepeatWrapping
stairsARM.wrapS = THREE.RepeatWrapping
stairsNormal.wrapS = THREE.RepeatWrapping

stairsColor.wrapT = THREE.RepeatWrapping
stairsARM.wrapT = THREE.RepeatWrapping
stairsNormal.wrapT = THREE.RepeatWrapping

// Pillars and Pyramid
const pillarsColor = textureLoader.load('./pillars_pyramid/brick_wall_10_2k/brick_wall_10_diff_2k.webp')
const pillarsARM = textureLoader.load('./pillars_pyramid/brick_wall_10_2k/brick_wall_10_arm_2k.webp')
const pillarsNormal = textureLoader.load('./pillars_pyramid/brick_wall_10_2k/brick_wall_10_nor_gl_2k.webp')

pillarsColor.colorSpace = THREE.SRGBColorSpace

pillarsColor.repeat.set(1, 1)
pillarsARM.repeat.set(1, 1)
pillarsNormal.repeat.set(1, 1)

pillarsColor.wrapS = THREE.RepeatWrapping
pillarsARM.wrapS = THREE.RepeatWrapping
pillarsNormal.wrapS = THREE.RepeatWrapping

pillarsColor.wrapT = THREE.RepeatWrapping
pillarsARM.wrapT = THREE.RepeatWrapping
pillarsNormal.wrapT = THREE.RepeatWrapping

/**
 * Objects
 */

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry (20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        alphaMap: floorAlpha,
        transparent: true,
        map: floorColor,
        aoMap: floorARM,
        roughnessMap: floorARM,
        metalnessMap: floorARM,
        normalMap: floorNormal,
        displacementMap: floorDisplacement,
        displacementScale: 0.25,
        displacementBias: -0.03
    })
)
floor.rotation.x = - Math.PI / 2
scene.add(floor)

// Stairs
const stairsGeometry = new THREE.CylinderGeometry(1, 1, 0.0625, 16)
const stairsMaterial = new THREE.MeshStandardMaterial({
    map: stairsColor,
    aoMap: stairsARM,
    roughnessMap: stairsARM,
    metalnessMap: stairsARM,
    normalMap: stairsNormal
})

const stairs = new THREE.Group()
scene.add(stairs)

const stairsStepHeight = 0.0625
const stairsInitialScale = 2.5
const stairsScaleFactor = 0.125

for(let i = 0; i < 4; i++)
{
    // Mesh
    const stair = new THREE.Mesh(stairsGeometry, stairsMaterial)
    stair.position.y = i * stairsStepHeight + 0.0625

    let newScale = Math.max(stairsInitialScale - i * stairsScaleFactor, 0.1)

    stair.scale.x = newScale
    stair.scale.z = newScale

    stairs.add(stair)
}

// Pillars
const pillarsGeometry = new THREE.CylinderGeometry(0.125, 0.125, 1.5, 8)
const pillarsMaterial = new THREE.MeshStandardMaterial({
    map: pillarsColor,
    aoMap: pillarsARM,
    roughnessMap: pillarsARM,
    metalnessMap: pillarsARM,
    normalMap: pillarsNormal
})

const pillarBasesGeometry = new THREE.CylinderGeometry(0.1875, 0.1875, 0.0625, 8)
const pillarBasesMaterial = new THREE.MeshStandardMaterial({
    map: pillarsColor,
    aoMap: pillarsARM,
    roughnessMap: pillarsARM,
    metalnessMap: pillarsARM,
    normalMap: pillarsNormal
})

const pillarRoofsGeometry = new THREE.ConeGeometry(0.125, 0.25, 8)
const pillarRoofsMaterial = new THREE.MeshStandardMaterial({
    map: pillarsColor,
    aoMap: pillarsARM,
    roughnessMap: pillarsARM,
    metalnessMap: pillarsARM,
    normalMap: pillarsNormal
})

const pillars = new THREE.Group()
scene.add(pillars)

const pillarsNumber = 8
const pillarsRadius = 1.75

for(let i = 0; i < pillarsNumber; i++)
{
    // Coordinates
    const pillarsAngle = (i / pillarsNumber) * Math.PI * 2
    const x = Math.sin(pillarsAngle) * pillarsRadius
    const z = Math.cos(pillarsAngle) * pillarsRadius

    // Mesh
    const pillarBase1 = new THREE.Mesh(pillarBasesGeometry, pillarBasesMaterial)
    pillarBase1.position.x = x
    pillarBase1.position.y = 0.375 - 0.0625 + 0.001
    pillarBase1.position.z = z

    const pillar = new THREE.Mesh(pillarsGeometry, pillarsMaterial)
    pillar.position.x = x
    pillar.position.y = 1.125 - (0.0625/2) + 0.001
    pillar.position.z = z

    const pillarBase2 = new THREE.Mesh(pillarBasesGeometry, pillarBasesMaterial)
    pillarBase2.position.x = x
    pillarBase2.position.y = 1.875 + 0.001
    pillarBase2.position.z = z

    const pillarRoof = new THREE.Mesh(pillarRoofsGeometry, pillarRoofsMaterial)
    pillarRoof.position.x = x
    pillarRoof.position.y = 2 + 0.001
    pillarRoof.position.z = z

    // Add to Group
    pillars.add(pillar, pillarBase1, pillarBase2, pillarRoof)
}

// Pyramid
const pyramidBase = new THREE.Mesh(
    new THREE.CylinderGeometry(1.25, 1.25, 0.0625, 16),
    new THREE.MeshStandardMaterial({
        map: pillarsColor,
        aoMap: pillarsARM,
        roughnessMap: pillarsARM,
        metalnessMap: pillarsARM,
        normalMap: pillarsNormal
    })
)
pyramidBase.position.y = 0.375 - 0.0625 + 0.001
scene.add(pyramidBase)

const pyramid = new THREE.Mesh(
    new THREE.ConeGeometry(1, 1, 16),
    new THREE.MeshStandardMaterial({
        map: pillarsColor,
        aoMap: pillarsARM,
        roughnessMap: pillarsARM,
        metalnessMap: pillarsARM,
        normalMap: pillarsNormal
    })
)
pyramid.position.y = 0.875 - (0.0625 / 2) + 0.001
scene.add(pyramid)

// Magic Orb
const magicOrb = new THREE.Mesh(
    new THREE.OctahedronGeometry(1, 2),
    new THREE.MeshStandardMaterial({
        color: '#FF0000',
        emissive: '#FF0000',
        emissiveIntensity: 10,
        transparent: true,
        wireframe: true
    })
)
magicOrb.position.y = 3
scene.add(magicOrb)

/**
 * Particles
 */
// Snow

// Geometry
const snowParticlesGeometry = new THREE.BufferGeometry()
const snowParticlesCount = 7500

const snowParticlesPositions = new Float32Array(snowParticlesCount * 3)

for(let i = 0; i < snowParticlesCount * 2.5; i++)
{
    snowParticlesPositions[i] = (Math.random() - 0.5) * 24
}

snowParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(snowParticlesPositions, 3))

// Material
const snowParticlesMaterial = new THREE.PointsMaterial({
    size: 0.04,
    color: '#F59C27',
    sizeAttenuation: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
})

// Points
const snowParticles = new THREE.Points(snowParticlesGeometry, snowParticlesMaterial)
scene.add(snowParticles)


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#FF4000', 3)
scene.add(ambientLight)

// Magic Orb Light
const magicOrbLight = new THREE.PointLight('#FF4000', 120)
magicOrbLight.position.set(0, 3, 0)
scene.add(magicOrbLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 5000)
camera.position.y = 8
camera.position.z = 8
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.025
controls.enablePan = false
controls.minDistance = 4
controls.maxDistance = 8
controls.maxPolarAngle = Math.PI * 0.375
controls.autoRotate = true
controls.autoRotateSpeed = 0.75

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Shadows
 */
magicOrbLight.castShadow = true

floor.receiveShadow = true

pyramidBase.receiveShadow = true
pyramidBase.castShadow = true

pyramid.receiveShadow = true
pyramid.castShadow = true

for(const stair of stairs.children)
    {
        stair.castShadow = true
        stair.receiveShadow = true
    }

for(const pillar of pillars.children)
    {
        pillar.castShadow = true
        pillar.receiveShadow = true
    }

/**
 * Fog
 */
scene.fog = new THREE.Fog('#000000', 2, 16)

const fogTweaks = gui.addFolder('Fog')

fogTweaks.add(scene.fog, 'near' ).min(0).max(10).step(0.001).name('Near')
fogTweaks.add(scene.fog, 'far' ).min(0).max(60).step(0.001).name('Far')

/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Update magic orb

        magicOrb.rotation.x = Math.PI * Math.sin(elapsedTime) * 0.25

        magicOrb.rotation.z = Math.PI * Math.cos(elapsedTime) * 0.125

        magicOrb.rotation.y = Math.PI * (elapsedTime) * 0.5
    
        magicOrb.position.y = 3 + Math.cos(elapsedTime) * 0.5
    
        magicOrbLight.position.y = magicOrb.position.y

    // Update snow particles
    for(let i = 0; i < snowParticlesCount; i++)
        {
            const i3 = i * 3

            snowParticlesGeometry.attributes.position.array[i3] -= Math.sin(elapsedTime * 0.5 + i) * 0.005
            snowParticlesGeometry.attributes.position.array[i3 + 1] -= Math.random(elapsedTime * 0.1) * 0.05
            snowParticlesGeometry.attributes.position.array[i3 + 2] += Math.cos(elapsedTime * 0.5 + i) * 0.05
            
            if (snowParticlesPositions[i3 + 1] < -10) {
                snowParticlesPositions [i3] = (Math.random() - 0.5) * 24
                snowParticlesPositions [i3 + 1] = 10
                snowParticlesPositions [i3 + 2] = (Math.random() - 0.5) * 24

            }

        }
    snowParticlesGeometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

/**
 * Modals
 */

// Projects
const projectsModal = document.getElementById("projects-modal")
const projectsButton = document.getElementById("projects-button")
const projectsExit = document.getElementById("projects-exit")

// About
const aboutModal = document.getElementById("about-modal")
const aboutButton = document.getElementById("about-button")
const aboutExit = document.getElementById("about-exit")

// Contact
const contactModal = document.getElementById("contact-modal")
const contactButton = document.getElementById("contact-button")
const contactExit = document.getElementById("contact-exit")

projectsButton.onclick = function() {
  projectsModal.style.display = "block"
  aboutModal.style.display = "none"
  contactModal.style.display = "none"
  projectsButton.style.color = "red"
  projectsButton.style.fontWeight = "bold"
  projectsButton.style.borderColor = "red"
  aboutButton.style.color = ""
  aboutButton.style.fontWeight = ""
  aboutButton.style.borderColor = ""
  contactButton.style.color = ""
  contactButton.style.fontWeight = ""
  contactButton.style.borderColor = ""
}

projectsExit.onclick = function() {
  projectsModal.style.display = "none"
  projectsButton.style.color = "white"
  projectsButton.style.fontWeight = "normal"
  projectsButton.style.borderColor = "white"
}

aboutButton.onclick = function() {
  aboutModal.style.display = "block"
  projectsModal.style.display = "none"
  contactModal.style.display = "none"
  projectsButton.style.color = ""
  projectsButton.style.fontWeight = ""
  projectsButton.style.borderColor = ""
  aboutButton.style.color = "red"
  aboutButton.style.fontWeight = "bold"
  aboutButton.style.borderColor = "red"
  contactButton.style.color = ""
  contactButton.style.fontWeight = ""
  contactButton.style.borderColor = ""
}

aboutExit.onclick = function() {
  aboutModal.style.display = "none"
  aboutButton.style.color = "white"
  aboutButton.style.fontWeight = "normal"
  aboutButton.style.borderColor = "white"
}

contactButton.onclick = function() {
  contactModal.style.display = "block"
  projectsModal.style.display = "none"
  aboutModal.style.display = "none"
  projectsButton.style.color = ""
  projectsButton.style.fontWeight = ""
  projectsButton.style.borderColor = ""
  aboutButton.style.color = ""
  aboutButton.style.fontWeight = ""
  aboutButton.style.borderColor = ""
  contactButton.style.color = "red"
  contactButton.style.fontWeight = "bold"
  contactButton.style.borderColor = "red"
}

contactExit.onclick = function() {
  contactModal.style.display = "none"
  contactButton.style.color = "white"
  contactButton.style.fontWeight = "normal"
  contactButton.style.borderColor = "white"
}