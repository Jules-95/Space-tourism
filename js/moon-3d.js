class Moon3DViewer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.moonModel = null;
		this.modal = null;
        this.container = null;
        this.animationId = null;
        this.init();
    }

    init() {
        this.createModal();
        this.setupEventListeners();
    }

    createModal() {
        // Créer le modal
        this.modal = document.createElement('div');
        this.modal.id = 'moon-3d-modal';
        this.modal.innerHTML = `
            <div class="modal-3d-content">
                <div class="modal-3d-header">
                    <h3>Lune 3D</h3>
                    <button class="modal-3d-close">&times;</button>
                </div>
                <div id="moon-3d-container" class="moon-3d-container"></div>
                <div class="controls-info">
                    <p>🖱️ Clic gauche + glisser: Rotation | 🖱️ Molette: Zoom</p>
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);
    }

    setupEventListeners() {
        const moon3DBtn = document.getElementById('moon-3d-btn');
        const closeBtn = this.modal.querySelector('.modal-3d-close');
        
        moon3DBtn.addEventListener('click', () => this.showModal());
        closeBtn.addEventListener('click', () => this.hideModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.hideModal();
        });
    }

    showModal() {
        this.modal.style.display = 'flex';
        setTimeout(() => {
            this.modal.classList.add('active');
            this.init3D();
        }, 10);
    }

    hideModal() {
        this.modal.classList.remove('active');
        setTimeout(() => {
            this.modal.style.display = 'none';
            this.cleanup();
        }, 300);
    }

    init3D() {
        this.container = document.getElementById('moon-3d-container');
        if (!this.container) return;

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000814);

        // Camera
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.z = 5;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 3, 5);
        this.scene.add(directionalLight);

        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 10;

        // Load Moon Model
        this.loadMoonModel();

        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    loadMoonModel() {
        const loader = new THREE.GLTFLoader();
        
        loader.load(
            'assets/scene.gltf',
            (gltf) => {
                this.moonModel = gltf.scene;
                
                // Center and scale the model
                const box = new THREE.Box3().setFromObject(this.moonModel);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 2 / maxDim;
                
                this.moonModel.scale.multiplyScalar(scale);
                this.moonModel.position.sub(center.multiplyScalar(scale));
                
                this.scene.add(this.moonModel);
                
                // Start animation
                this.animate();
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('Error loading moon model:', error);
                // Fallback: create a simple sphere
                this.createFallbackMoon();
            }
        );
    }

    createFallbackMoon() {
        const geometry = new THREE.SphereGeometry(2, 32, 32);
        const textureLoader = new THREE.TextureLoader();
        const material = new THREE.MeshPhongMaterial({
            map: textureLoader.load('img/moon.png'),
            bumpScale: 0.05
        });
        
        this.moonModel = new THREE.Mesh(geometry, material);
        this.scene.add(this.moonModel);
        this.animate();
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        if (this.controls) {
            this.controls.update();
        }
        
        // Auto-rotate the moon slowly
        if (this.moonModel) {
            this.moonModel.rotation.y += 0.002;
        }
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    onWindowResize() {
        if (!this.container || !this.camera || !this.renderer) return;
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    cleanup() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
            if (this.container && this.renderer.domElement) {
                this.container.removeChild(this.renderer.domElement);
            }
        }
        
        window.removeEventListener('resize', this.onWindowResize);
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.moonModel = null;
        this.container = null;
    }
}

// Initialiser quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new Moon3DViewer();
});