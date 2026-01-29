// Lightweight three.js hero — desktop-only, tiny animation (rotating torus)
(function(){
  if(typeof THREE === 'undefined') return; // three.js not loaded
  if(window.innerWidth <= 760) return; // avoid on small screens

  const canvas = document.getElementById('three-hero');
  if(!canvas) return;

  const renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true, antialias: true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 6);

  const light = new THREE.DirectionalLight(0xffffff, 0.9);
  light.position.set(5,5,5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));

  const geometry = new THREE.TorusKnotGeometry(1.2, 0.35, 128, 32);
  const material = new THREE.MeshStandardMaterial({color: 0x2b7cff, metalness:0.3, roughness:0.35});
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  let running = true;
  function resize(){
    const rect = canvas.getBoundingClientRect();
    if(rect.width === 0 || rect.height === 0) return;
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }

  let prevTime = performance.now();
  function animate(t){
    if(!running) return;
    const dt = (t - prevTime) * 0.001; prevTime = t;
    mesh.rotation.x += dt * 0.35;
    mesh.rotation.y += dt * 0.55;
    mesh.rotation.z += dt * 0.2;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', ()=>{ running = document.visibilityState === 'visible'; if(running){ prevTime = performance.now(); requestAnimationFrame(animate) }});

  // Ensure size first and start
  resize(); prevTime = performance.now(); requestAnimationFrame(animate);

})();