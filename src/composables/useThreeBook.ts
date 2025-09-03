import { onMounted, onUnmounted, ref, Ref } from 'vue';
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { gsap } from 'gsap';

export function useThreeBook(
  containerRef: Ref<HTMLDivElement | null>,
  pages: any[],
) {
  const pageIndex = ref(0);
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: CSS3DRenderer;
  let book: THREE.Group;
  let cleanup: (() => void) | null = null;

  onMounted(() => {
    const container = containerRef.value;
    if (!container) return;

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    renderer = new CSS3DRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    container.appendChild(renderer.domElement);

    camera.position.set(0, 0, 800);

    // Book setup
    book = new THREE.Group();
    scene.add(book);

    // Create pages as CSS3D objects
    pages.forEach((page, index) => {
      const element = document.createElement('div');
      element.style.width = '400px';
      element.style.height = '600px';
      element.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      element.style.border = '1px solid rgba(255, 255, 255, 0.2)';
      element.style.borderRadius = '8px';
      element.style.padding = '20px';
      element.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
      element.innerHTML = `<h2>Page ${index + 1}</h2><p>Content for ${page.id}</p>`;

      const object = new CSS3DObject(element);
      object.position.set(index * 20, 0, index * 5);
      object.rotation.y = index > 0 ? 0 : 0;
      book.add(object);
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    cleanup = () => {
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  });

  onUnmounted(() => {
    cleanup?.();
  });

  const turnPage = (forward: boolean) => {
    if (!book) return;
    const newIndex = pageIndex.value + (forward ? 1 : -1);
    if (newIndex < 0 || newIndex >= pages.length) return;

    const currentPage = book.children[pageIndex.value] as CSS3DObject;
    const targetRotation = forward ? -Math.PI : 0;

    gsap.to(currentPage.rotation, {
      y: targetRotation,
      duration: 1.2,
      ease: 'power2.inOut',
      onComplete: () => {
        pageIndex.value = newIndex;
      },
    });

    // Animate camera for better view
    gsap.to(camera.position, {
      x: newIndex * 50,
      duration: 1.2,
      ease: 'power2.inOut',
    });
  };

  return {
    pageIndex,
    turnPage,
  };
}
