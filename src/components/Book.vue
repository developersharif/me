<template>
  <div
    class="w-full h-full book-container select-none"
    role="region"
    aria-label="Interactive Portfolio Book"
    ref="bookContainerRef"
    tabindex="0"
  >
    <!-- Mobile-first book layout -->
    <div class="book-wrapper">
      <div class="book-background" />
      
      <!-- Book Pages Container with 3D perspective -->
      <div class="book-pages">
        <!-- Mobile: Single page layout -->
        <div class="mobile-page-container md:hidden">
          <!-- Spiral binding & holes -->
          <div class="notebook-spiral" aria-hidden="true" />
          <div class="page-holes" aria-hidden="true" />
          <div 
            class="mobile-page with-spiral"
            @scroll="handleScroll"
            ref="mobilePageRef"
            @pointerdown="handlePointerDown"
          >
            <component :is="currentMobilePage?.component" v-bind="currentMobilePage?.props" v-if="currentMobilePage" />
            
            <!-- Scroll-to-next indicator -->
            <div 
              v-if="showScrollNextIndicator"
              class="scroll-next-indicator"
              @click="nextPage"
            >
              <div class="scroll-next-icon">→</div>
              <div class="scroll-next-text">Next Page</div>
            </div>
            <!-- Corner curl hint -->
            <div v-if="canFlipForward" class="corner-curl forward" aria-hidden="true"></div>
            <div v-if="canFlipBackward" class="corner-curl backward" aria-hidden="true"></div>
          </div>
          
          <!-- Mobile page flip overlay - constrained within book -->
          <div 
            v-if="isFlipping" 
            ref="mobileFlipRef"
            class="flip-overlay mobile-flip-overlay"
          >
            <div class="flip-page">
              <div class="page-holes" aria-hidden="true" />
              <div class="mobile-page">
                <component :is="flipContent?.component" v-bind="flipContent?.props" v-if="flipContent" />
              </div>
              <div class="flip-shadow" aria-hidden="true" />
              <div class="flip-gloss" aria-hidden="true" />
              <div class="page-edge" aria-hidden="true" />
            </div>
          </div>
        </div>
        
        <!-- Desktop: Single page layout (same as mobile but larger) -->
        <div class="desktop-pages-container hidden md:flex">
          <!-- Single Page -->
          <div class="desktop-page single-page">
            <!-- Spiral binding & holes -->
            <div class="notebook-spiral" aria-hidden="true" />
            <div class="page-holes" aria-hidden="true" />
            <div 
              class="page-content with-spiral"
              @scroll="handleScroll"
              ref="desktopPageRef"
              @pointerdown="handlePointerDown"
            >
              <component :is="currentMobilePage?.component" v-bind="currentMobilePage?.props" v-if="currentMobilePage" />
              
              <!-- Scroll-to-next indicator for desktop -->
              <div 
                v-if="showScrollNextIndicator"
                class="scroll-next-indicator desktop"
                @click="nextPage"
              >
                <div class="scroll-next-icon">→</div>
                <div class="scroll-next-text">Next Page</div>
              </div>
              <!-- Corner curl hint -->
              <div v-if="canFlipForward" class="corner-curl forward" aria-hidden="true"></div>
              <div v-if="canFlipBackward" class="corner-curl backward" aria-hidden="true"></div>
            </div>
          </div>
          
          <!-- Desktop Page Turn Animation Overlay - constrained within book -->
          <div 
            v-if="isFlipping" 
            ref="desktopFlipRef"
            class="flip-overlay desktop-flip-overlay"
          >
            <div class="flip-page">
              <div class="page-holes" aria-hidden="true" />
              <div class="page-content">
                <component :is="flipContent?.component" v-bind="flipContent?.props" v-if="flipContent" />
              </div>
              <div class="flip-shadow" aria-hidden="true" />
              <div class="flip-gloss" aria-hidden="true" />
              <div class="page-edge" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <!-- Fixed side next/prev indicators -->
      <div class="side-nav" aria-hidden="false" role="navigation">
        <!-- Hide when not applicable instead of showing disabled -->
        <button 
          v-show="currentPageIndex > 0"
          class="side-btn prev" 
          @click="prevPage" 
          aria-label="Previous page"
        >
          ←
        </button>
        <button 
          v-show="currentPageIndex < pages.length - 1"
          class="side-btn next" 
          @click="nextPage" 
          aria-label="Next page"
        >
          →
        </button>
      </div>

      
    </div>
    
    <!-- Page Change Indicator -->
    <div 
      v-if="pageChangeIndicator.isVisible"
      class="page-change-indicator"
      :class="{ 'animate-fade-in': pageChangeIndicator.isVisible }"
    >
      <div class="indicator-content">
        <div class="indicator-direction">{{ pageChangeIndicator.direction }}</div>
        <div class="indicator-title">{{ pageChangeIndicator.title }}</div>
        <div class="indicator-progress">
          <div 
            class="progress-bar"
            :style="{ width: `${pageChangeIndicator.progress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
// Default/fallback spiral binding width (will be overridden by measurement)
const SPIRAL_BINDING_WIDTH = 28;
// Measured right-edge (px) of the `.notebook-spiral` relative to its page container
const spiralRightPx = ref<number>(SPIRAL_BINDING_WIDTH);
import gsap from 'gsap';

interface Page {
  id: string;
  component: any;
  label?: string;
  props?: Record<string, any>;
}

interface Props {
  pages: Page[];
}

const props = defineProps<Props>();

// Basic state
const currentPageIndex = ref(0);
const isFlipping = ref(false);
const flipDirection = ref<'forward' | 'backward'>('forward');
const flipContent = ref<Page | null>(null);
const mobileFlipRef = ref<HTMLDivElement | null>(null);
const desktopFlipRef = ref<HTMLDivElement | null>(null);
// Drag-to-flip state
const drag = ref({
  active: false,
  direction: null as null | 'forward' | 'backward',
  startX: 0,
  currentX: 0,
  progress: 0,
  width: 1,
  lastTs: 0,
  velocity: 0,
});

// Screen adaptation state
const screenSize = ref({
  width: window.innerWidth,
  height: window.innerHeight,
  orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
  isMobile: window.innerWidth < 768,
  isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
  isDesktop: window.innerWidth >= 1024
});

// Enhanced swipe gesture state
const touchState = ref({
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
  deltaX: 0,
  deltaY: 0,
  isDragging: false,
  startTime: 0,
  velocity: 0
});

// Page change indicator state
const pageChangeIndicator = ref({
  isVisible: false,
  direction: '',
  progress: 0,
  title: ''
});

// Scroll-to-next indicator state
const showScrollNextIndicator = ref(false);
const mobilePageRef = ref<HTMLDivElement | null>(null);
const desktopPageRef = ref<HTMLDivElement | null>(null);
const bookContainerRef = ref<HTMLDivElement | null>(null);

// Swipe configuration - More restrictive to prevent accidental navigation
const swipeConfig = {
  threshold: 80, // Increased minimum distance for swipe
  velocityThreshold: 0.5, // Increased minimum velocity for swipe
  maxVerticalDeviation: 80, // Reduced vertical movement allowed
  debounceTime: 500 // Increased debounce time between swipes
};

let lastSwipeTime = 0;

// Ignore swipe/flip when the user interacts with links, buttons, form fields, or elements marked as no-flip
const ignoreTouchGesture = ref(false);
function isInteractiveElement(el: HTMLElement | null): boolean {
  if (!el) return false;
  return !!el.closest(
    'a, button, input, textarea, select, label, summary, details, [role="button"], [role="link"], [contenteditable="true"], .no-flip, [data-no-flip], [data-interactive]'
  );
}
function eventTargetsInteractive(e: Event): boolean {
  // If the user is selecting text, don't hijack
  try {
    const sel = window.getSelection?.();
    if (sel && sel.toString().length > 0) return true;
  } catch {}

  const path = (e.composedPath?.() || []) as EventTarget[];
  for (const t of path) {
    if (t instanceof HTMLElement && isInteractiveElement(t)) return true;
  }
  const tgt = e.target as HTMLElement | null;
  return isInteractiveElement(tgt);
}

// Show current page for both mobile and desktop (single page layout)
const currentMobilePage = computed(() => {
  return props.pages[currentPageIndex.value];
});
const canFlipForward = computed(() => currentPageIndex.value < props.pages.length - 1 && !isFlipping.value);
const canFlipBackward = computed(() => currentPageIndex.value > 0 && !isFlipping.value);

// Screen size adaptation
const updateScreenSize = () => {
  screenSize.value = {
    width: window.innerWidth,
    height: window.innerHeight,
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024
  };
  // After each resize/orientation change, recompute the spiral metrics
  nextTick(() => measureAndApplySpiralMetrics());
};

// Measure the `.notebook-spiral` and store CSS variables on each page container
function measureAndApplySpiralMetrics() {
  const container = bookContainerRef.value as HTMLElement | null;
  if (!container) return;

  // For each visible page container, find its local spiral and compute its right edge
  const pageContainers = container.querySelectorAll<HTMLElement>(
    '.mobile-page-container, .desktop-pages-container'
  );

  pageContainers.forEach((pageEl) => {
    const spiral = pageEl.querySelector('.notebook-spiral') as HTMLElement | null;
    if (!spiral) return;
    const pageRect = pageEl.getBoundingClientRect();
    const spiralRect = spiral.getBoundingClientRect();
    const rightEdge = Math.max(0, Math.round(spiralRect.right - pageRect.left));
    // Update CSS vars on the specific page container
    pageEl.style.setProperty('--coil-right', `${rightEdge}px`);
    pageEl.style.setProperty('--spiral-width', `${Math.max(1, Math.round(spiralRect.width))}px`);
    // Update reactive ref for JS animation hinge (we hinge at overlay's left = 0px)
    spiralRightPx.value = rightEdge;
  });
}

// Enhanced page change indicator
const showPageChangeIndicator = (direction: 'forward' | 'backward', targetIndex: number) => {
  const targetPage = props.pages[targetIndex];
  pageChangeIndicator.value = {
    isVisible: true,
    direction: direction === 'forward' ? 'Next' : 'Previous',
    progress: 0,
    title: targetPage?.label || targetPage?.id || `Page ${targetIndex + 1}`
  };

  // Animate progress - faster and smoother
  const progressInterval = setInterval(() => {
    pageChangeIndicator.value.progress += 15;
    if (pageChangeIndicator.value.progress >= 100) {
      clearInterval(progressInterval);
      setTimeout(() => {
        pageChangeIndicator.value.isVisible = false;
      }, 150);
    }
  }, 45);
};

// Scroll handling for scroll indicator (removed auto-pagination)
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  const scrollTop = target.scrollTop;
  const scrollHeight = target.scrollHeight;
  const clientHeight = target.clientHeight;
  
  // Calculate scroll percentage
  const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
  
  // Show next page indicator when user is near the bottom (95% scrolled)
  // and there's a next page available, but don't auto-advance
  const isNearBottom = scrollPercentage >= 0.95;
  const hasNextPage = currentPageIndex.value < props.pages.length - 1;
  
  showScrollNextIndicator.value = isNearBottom && hasNextPage && !isFlipping.value;
  
  // Removed auto-advance functionality - users must manually navigate
};

// Enhanced swipe gesture handling
const handleTouchStart = (e: TouchEvent) => {
  // If touching an interactive element, skip swipe handling entirely
  ignoreTouchGesture.value = eventTargetsInteractive(e);
  if (ignoreTouchGesture.value) return;
  const touch = e.touches[0];
  touchState.value = {
    startX: touch.clientX,
    startY: touch.clientY,
    currentX: touch.clientX,
    currentY: touch.clientY,
    deltaX: 0,
    deltaY: 0,
    isDragging: false,
    startTime: Date.now(),
    velocity: 0
  };
};

const handleTouchMove = (e: TouchEvent) => {
  if (ignoreTouchGesture.value) return;
  if (!touchState.value.startX) return;
  
  const touch = e.touches[0];
  touchState.value.currentX = touch.clientX;
  touchState.value.currentY = touch.clientY;
  touchState.value.deltaX = touch.clientX - touchState.value.startX;
  touchState.value.deltaY = touch.clientY - touchState.value.startY;
  
  // Mark as dragging if movement exceeds threshold
  if (Math.abs(touchState.value.deltaX) > 15 || Math.abs(touchState.value.deltaY) > 15) {
    touchState.value.isDragging = true;
  }
  
  // Only prevent default scrolling if horizontal swipe is MUCH more dominant than vertical
  // This allows natural scrolling while still enabling page swipes
  const horizontalDominance = Math.abs(touchState.value.deltaX) / Math.max(Math.abs(touchState.value.deltaY), 1);
  if (horizontalDominance > 2.5 && Math.abs(touchState.value.deltaX) > 30) {
    e.preventDefault();
  }
};

const handleTouchEnd = (e: TouchEvent) => {
  if (ignoreTouchGesture.value) {
    ignoreTouchGesture.value = false;
    return;
  }
  if (!touchState.value.isDragging) return;
  
  const deltaTime = Date.now() - touchState.value.startTime;
  const velocity = Math.abs(touchState.value.deltaX) / deltaTime;
  
  // Much more strict swipe validation
  const horizontalDistance = Math.abs(touchState.value.deltaX);
  const verticalDistance = Math.abs(touchState.value.deltaY);
  const horizontalDominance = horizontalDistance / Math.max(verticalDistance, 1);
  
  const isValidSwipe = 
    horizontalDistance > swipeConfig.threshold &&
    verticalDistance < swipeConfig.maxVerticalDeviation &&
    horizontalDominance > 2 && // Horizontal movement must be at least 2x more than vertical
    (velocity > swipeConfig.velocityThreshold || horizontalDistance > swipeConfig.threshold * 1.5) &&
    deltaTime < 800; // Swipe must be completed within 800ms
  
  // Debounce swipes
  const now = Date.now();
  if (now - lastSwipeTime < swipeConfig.debounceTime) return;
  
  if (isValidSwipe) {
    lastSwipeTime = now;
    
    if (touchState.value.deltaX > 0) {
      // Swipe right - previous page
      prevPage();
    } else {
      // Swipe left - next page
      nextPage();
    }
  }
  
  // Reset touch state
  touchState.value = {
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
    isDragging: false,
    startTime: 0,
    velocity: 0
  };
};

// Pointer-based drag-to-flip
const handlePointerDown = (e: PointerEvent) => {
  if (isFlipping.value) return;
  // Don't start flip when interacting with actionable elements
  if (eventTargetsInteractive(e)) return;
  const targetEl = e.currentTarget as HTMLElement | null;
  if (!targetEl) return;
  if (e.pointerType === 'mouse' && e.button !== 0) return;

  const rect = targetEl.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const width = rect.width;

  let direction: 'forward' | 'backward' | null = null;
  if (x > width * 0.65 && canFlipForward.value) direction = 'forward';
  if (x < width * 0.35 && canFlipBackward.value) direction = direction ?? 'backward';
  if (!direction) return;

  e.preventDefault();
  targetEl.setPointerCapture?.(e.pointerId);

  isFlipping.value = true;
  flipDirection.value = direction;
  flipContent.value = props.pages[currentPageIndex.value] as Page;

  drag.value = {
    active: true,
    direction,
    startX: x,
    currentX: x,
    progress: 0,
    width: Math.max(1, width - spiralRightPx.value),
    lastTs: performance.now(),
    velocity: 0,
  };

  const container = bookContainerRef.value;
  container?.addEventListener('pointermove', handlePointerMove as any, { passive: false });
  container?.addEventListener('pointerup', handlePointerUp as any, { passive: false });
  container?.addEventListener('pointercancel', handlePointerUp as any, { passive: false });

  nextTick(() => setFlipPageForDrag(0));
};

const handlePointerMove = (e: PointerEvent) => {
  if (!drag.value.active) return;
  const pageEl = (screenSize.value.isDesktop ? desktopPageRef.value : mobilePageRef.value) as HTMLElement | null;
  if (!pageEl) return;

  const rect = pageEl.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const d = drag.value;
  const now = performance.now();
  const dt = Math.max(1, now - d.lastTs);
  d.velocity = (x - d.currentX) / dt;
  d.currentX = x;
  d.lastTs = now;

  if (d.direction === 'forward') {
    d.progress = Math.min(1, Math.max(0, (d.startX - x) / d.width));
  } else {
    d.progress = Math.min(1, Math.max(0, (x - d.startX) / d.width));
  }

  e.preventDefault();
  setFlipPageForDrag(d.progress);
};

const handlePointerUp = (e: PointerEvent) => {
  if (!drag.value.active) return;
  e.preventDefault();
  const d = drag.value;
  const progress = d.progress;
  const fast = Math.abs(d.velocity) > 0.05; // ~0.05 px/ms (~50px in 1s)
  const shouldComplete = progress > 0.5 || (fast && progress > 0.25);

  const container = bookContainerRef.value;
  container?.removeEventListener('pointermove', handlePointerMove as any);
  container?.removeEventListener('pointerup', handlePointerUp as any);
  container?.removeEventListener('pointercancel', handlePointerUp as any);

  const remaining = shouldComplete ? (1 - progress) : progress;
  const duration = Math.min(0.28, Math.max(0.12, remaining * 0.35));
  animateDragCompletion(shouldComplete, duration);
};

function setFlipPageForDrag(progress: number) {
  const container = desktopFlipRef.value || mobileFlipRef.value;
  const flipPage = container?.querySelector('.flip-page') as HTMLElement | null;
  const shadow = flipPage?.querySelector('.flip-shadow') as HTMLElement | null;
  const gloss = flipPage?.querySelector('.flip-gloss') as HTMLElement | null;
  const edge = flipPage?.querySelector('.page-edge') as HTMLElement | null;
  if (!flipPage) return;

  const G = (gsap as any);
  const dir = drag.value.direction || 'forward';
  const rotateY = dir === 'forward' ? -180 * progress : 180 * (1 - progress);
  const curve = Math.sin(Math.PI * Math.min(1, Math.max(0, progress))) * 1.2;
  const twist = (dir === 'forward' ? 0.5 : -0.5) * Math.sin(progress * Math.PI) * 0.6;

  // Use simpler transforms on mobile devices to prevent blinking
  if (screenSize.value.isMobile) {
    G.set(flipPage, {
      rotateY,
      transformOrigin: '0px center',
      transformStyle: 'flat',
      backfaceVisibility: 'hidden',
      zIndex: 30,
    });
  } else {
    G.set(flipPage, {
      rotateY,
      rotateX: dir === 'forward' ? -curve : curve,
      rotateZ: twist,
      transformOrigin: '0px center',
      transformStyle: 'preserve-3d',
      perspective: 1200,
      backfaceVisibility: 'hidden',
      zIndex: 30,
    });
  }

  if (shadow) (gsap as any).set(shadow, { opacity: 0.12 + 0.22 * Math.sin(progress * Math.PI) });
  if (gloss) (gsap as any).set(gloss, { opacity: 0.08 + 0.1 * Math.sin(progress * Math.PI), x: (dir === 'forward' ? -80 + 160 * progress : 80 - 160 * progress) });
  if (edge) (gsap as any).set(edge, { opacity: 0.15 + 0.25 * progress });
}

function animateDragCompletion(complete: boolean, duration: number) {
  const container = desktopFlipRef.value || mobileFlipRef.value;
  const flipPage = container?.querySelector('.flip-page') as HTMLElement | null;
  const shadow = flipPage?.querySelector('.flip-shadow') as HTMLElement | null;
  const gloss = flipPage?.querySelector('.flip-gloss') as HTMLElement | null;
  const edge = flipPage?.querySelector('.page-edge') as HTMLElement | null;
  if (!flipPage) {
    drag.value.active = false;
    isFlipping.value = false;
    return;
  }

  const G = (gsap as any);
  const dir = drag.value.direction || 'forward';
  const currentProgress = drag.value.progress;
  const startY = dir === 'forward' ? -180 * currentProgress : 180 * (1 - currentProgress);
  const endY = complete ? (dir === 'forward' ? -180 : 0) : (dir === 'forward' ? 0 : 180);

  // Use simplified animation on mobile
  if (screenSize.value.isMobile) {
    const tl = G.timeline({
      defaults: { duration, ease: 'power2.out' },
      onComplete: () => {
        const targetIndex = dir === 'forward' ? currentPageIndex.value + 1 : currentPageIndex.value - 1;
        if (complete) {
          currentPageIndex.value = Math.max(0, Math.min(props.pages.length - 1, targetIndex));
        }
        drag.value.active = false;
        isFlipping.value = false;
        nextTick(() => {
          mobilePageRef.value?.scrollTo({ top: 0, behavior: 'auto' });
          desktopPageRef.value?.scrollTo({ top: 0, behavior: 'auto' });
          measureAndApplySpiralMetrics();
        });
      }
    });
    
    tl.fromTo(flipPage, { rotateY: startY }, { rotateY: endY });
    if (shadow) tl.to(shadow, { opacity: 0, duration: duration * 0.8 }, 0);
    if (gloss) tl.to(gloss, { opacity: 0, duration: duration * 0.8 }, 0);
    if (edge) tl.to(edge, { opacity: 0, duration: duration * 0.8 }, 0);
  } else {
    // Complex animation for desktop
    const tl = G.timeline({
      defaults: { duration, ease: 'power2.out' },
      onComplete: () => {
        const targetIndex = dir === 'forward' ? currentPageIndex.value + 1 : currentPageIndex.value - 1;
        if (complete) {
          currentPageIndex.value = Math.max(0, Math.min(props.pages.length - 1, targetIndex));
        }
        drag.value.active = false;
        isFlipping.value = false;
        nextTick(() => {
          mobilePageRef.value?.scrollTo({ top: 0, behavior: 'auto' });
          desktopPageRef.value?.scrollTo({ top: 0, behavior: 'auto' });
          measureAndApplySpiralMetrics();
        });
      }
    });

    tl.fromTo(flipPage, { rotateY: startY }, { rotateY: endY });
    if (shadow) tl.to(shadow, { opacity: 0, duration: duration * 0.8 }, 0);
    if (gloss) tl.to(gloss, { opacity: 0, duration: duration * 0.8 }, 0);
    if (edge) tl.to(edge, { opacity: 0, duration: duration * 0.8 }, 0);
  }
}

const nextPage = async () => {
  if (currentPageIndex.value >= props.pages.length - 1 || isFlipping.value) return;
  
  const targetIndex = currentPageIndex.value + 1;
  
  showPageChangeIndicator('forward', targetIndex);
  await animatePageTurn('forward');
};

const prevPage = async () => {
  if (currentPageIndex.value <= 0 || isFlipping.value) return;
  
  const targetIndex = currentPageIndex.value - 1;
  
  showPageChangeIndicator('backward', targetIndex);
  await animatePageTurn('backward');
};

// Quick jump page turn: fast spiral-bound notebook flip
const animateQuickJump = (direction: 'forward' | 'backward', targetIndex: number): Promise<void> => {
  return new Promise((resolve) => {
    isFlipping.value = true;
    flipDirection.value = direction;

    // Show the flip of the current page
    flipContent.value = props.pages[currentPageIndex.value] as Page;

    nextTick(() => {
      const container = desktopFlipRef.value || mobileFlipRef.value;
      if (!container) {
        currentPageIndex.value = targetIndex;
        isFlipping.value = false;
        resolve();
        return;
      }

      const flipPage = container.querySelector('.flip-page') as HTMLElement | null;
      if (!flipPage) {
        currentPageIndex.value = targetIndex;
        isFlipping.value = false;
        resolve();
        return;
      }

  const G = (gsap as any);
  // Hinge at the overlay's left edge, which is aligned to the spiral's right edge
  const spiralBindingOrigin = `0px center`;
      
      // Use simpler transforms on mobile to prevent blinking
      if (screenSize.value.isMobile) {
        G.set(flipPage, { 
          rotateY: 0, 
          transformOrigin: spiralBindingOrigin, 
          transformStyle: 'flat', 
          backfaceVisibility: 'hidden',
          boxShadow: 'none',
          filter: 'brightness(1)',
          zIndex: 30
        });
      } else {
        G.set(flipPage, { 
          rotateY: 0, 
          rotateX: 0,
          transformOrigin: spiralBindingOrigin, 
          transformStyle: 'preserve-3d', 
          perspective: 1000, 
          backfaceVisibility: 'hidden',
          boxShadow: 'none',
          filter: 'brightness(1)',
          zIndex: 30
        });
      }

  const tl = G.timeline({
        onComplete: () => {
          currentPageIndex.value = targetIndex;
          isFlipping.value = false;
          nextTick(() => {
            mobilePageRef.value?.scrollTo({ top: 0, behavior: 'auto' });
            desktopPageRef.value?.scrollTo({ top: 0, behavior: 'auto' });
            // Recompute spiral metrics after page content/layout changes
            measureAndApplySpiralMetrics();
          });
          resolve();
        }
      });
  // Make the quick jump snappier but still smooth
  tl.timeScale(1.25);

      // Use simpler animation on mobile to prevent blinking
      if (screenSize.value.isMobile) {
        // Simple 2D flip for mobile
        if (direction === 'forward') {
          tl.to(flipPage, {
            rotateY: -180,
            duration: 0.25,
            ease: 'power2.inOut'
          });
        } else {
          tl.fromTo(flipPage, {
            rotateY: 180
          }, {
            rotateY: 0,
            duration: 0.25,
            ease: 'power2.inOut'
          });
        }
      } else {
        // Complex 3D animation for desktop
        // Quick flip - STRICTLY anchored to coil binding, NO horizontal movement
        if (direction === 'forward') {
          tl.to(flipPage, {
            rotateY: -45, // Quick lift
            rotateX: -1.2,
            rotateZ: 0.4,
            // NO x translation - stay at spiral binding
            duration: 0.06,
            ease: 'power3.out',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
          })
          .to(flipPage, {
            rotateY: -135, // Fast sweep
            rotateX: -0.8,
            rotateZ: 0.2,
            // NO horizontal drift
            duration: 0.08,
            ease: 'sine.inOut',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            filter: 'brightness(1.01) contrast(1.015)'
          })
          .to(flipPage, {
            rotateY: -180, // Quick settle
            rotateX: 0,
            rotateZ: 0,
            // Perfect binding anchor
            duration: 0.06,
            ease: 'power3.out',
            boxShadow: 'none',
            filter: 'brightness(1) contrast(1)'
          });
        } else {
          // Backward quick flip: PURE reverse motion, NO drift
          tl.fromTo(flipPage, {
            rotateY: 180, // Start from behind
            rotateX: 0,
            rotateZ: 0
            // NO positioning - binding-anchored only
          }, {
            rotateY: 135, // Quick reverse sweep
            rotateX: 0.8,
            rotateZ: -0.2,
            // Stay at spiral binding
            duration: 0.08,
            ease: 'sine.inOut',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            filter: 'brightness(1.01) contrast(1.015)'
          })
          .to(flipPage, {
            rotateY: 45, // Quick lift (reverse)
            rotateX: 1.2,
            rotateZ: -0.4,
            // NO horizontal movement
            duration: 0.06,
            ease: 'power3.out',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
          })
          .to(flipPage, {
            rotateY: 0, // Final forward position
            rotateX: 0,
            rotateZ: 0,
            // Anchored to binding
            duration: 0.06,
            ease: 'power3.out',
            boxShadow: 'none',
            filter: 'brightness(1) contrast(1)'
          });
        }
      }
    });
  });
};

const animatePageTurn = (direction: 'forward' | 'backward'): Promise<void> => {
  return new Promise((resolve) => {
    isFlipping.value = true;
    flipDirection.value = direction;

    const targetIndex = direction === 'forward'
      ? currentPageIndex.value + 1
      : currentPageIndex.value - 1;

    // Set the correct content for the flip overlay - show current page during flip
    flipContent.value = props.pages[currentPageIndex.value] as Page;

    // Pre-load the target page content to prevent white flash
    const targetPage = props.pages[targetIndex] as Page;

    nextTick(() => {
      const container = desktopFlipRef.value || mobileFlipRef.value;
      if (!container) {
        currentPageIndex.value = targetIndex;
        isFlipping.value = false;
        resolve();
        return;
      }
      
      const flipPage = container.querySelector('.flip-page') as HTMLElement | null;
      if (!flipPage) {
        currentPageIndex.value = targetIndex;
        isFlipping.value = false;
        resolve();
        return;
      }

      const shadow = flipPage.querySelector('.flip-shadow') as HTMLElement | null;
      const gloss = flipPage.querySelector('.flip-gloss') as HTMLElement | null;
      const edge = flipPage.querySelector('.page-edge') as HTMLElement | null;

  const G = (gsap as any);
      
  // Hinge at the overlay's left edge, which is aligned to the spiral's right edge
  const spiralBindingOrigin = `0px center`;
      
      // Prepare the page for realistic flip - no white flash
      G.set(flipPage, { 
        rotateY: 0,
        rotateX: 0,
        rotateZ: 0,
        transformOrigin: spiralBindingOrigin,
        transformStyle: 'preserve-3d',
        perspective: 1200,
        backfaceVisibility: 'hidden',
        boxShadow: 'none',
        filter: 'brightness(1) contrast(1)',
        zIndex: 30,
        opacity: 1, // Ensure visibility
        visibility: 'visible'
      });
      
      // Reset effect elements
      if (shadow) G.set(shadow, { opacity: 0, scaleX: 1, scaleY: 1 });
      if (gloss) G.set(gloss, { opacity: 0, x: -80, scaleX: 0.5, skewX: -15 });
      if (edge) G.set(edge, { opacity: 0 });

      // Create realistic hand-flipped notebook timeline
  const tl = G.timeline({
        onComplete: () => {
          // Update page index smoothly
          currentPageIndex.value = targetIndex;
          isFlipping.value = false;
          nextTick(() => {
            // Smooth scroll reset without jarring
            const pageRefs = [mobilePageRef.value, desktopPageRef.value];
            pageRefs.forEach(ref => {
              if (ref) {
                ref.scrollTo({ top: 0, behavior: 'auto' });
              }
            });
            // Recompute spiral metrics after page content/layout changes
            measureAndApplySpiralMetrics();
          });
          resolve();
        }
      });
  // Increase the overall speed a bit while keeping curves smooth
  tl.timeScale(1.35);

      // Realistic hand-flipped page physics - STRICTLY anchored to coil binding
      if (direction === 'forward') {
        // Forward flip: page lifts and rotates ONLY around spiral binding - NO horizontal drift
        tl.to(flipPage, {
          rotateY: -8, // Gentle initial lift
          rotateX: -0.8, // Slight upward curve
          rotateZ: 0.3, // Tiny twist
          // CRITICAL: NO x, y, z translations - stay anchored to spiral binding
          duration: 0.12,
          ease: 'power3.out',
          boxShadow: '0 3px 12px rgba(0,0,0,0.08)'
        })
        .to(flipPage, {
          rotateY: -45, // Quarter turn
          rotateX: -1.5, // More pronounced curve
          rotateZ: 0.5, // Slight twist continues
          // NO position changes - pure rotation around binding
          duration: 0.18,
          ease: 'sine.inOut',
          boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          filter: 'brightness(1.01) contrast(1.02)'
        })
        .to(flipPage, {
          rotateY: -78, // Near completion
          rotateX: -0.8, // Page straightening
          rotateZ: 0.2, // Twist reducing
          // Stay perfectly anchored
          duration: 0.15,
          ease: 'power3.out',
          boxShadow: '0 8px 25px rgba(0,0,0,0.18)',
          filter: 'brightness(1.015) contrast(1.01)'
        })
        .to(flipPage, {
          rotateY: -90, // Perfect vertical
          rotateX: -0.3,
          rotateZ: 0,
          // NO drift from binding axis
          duration: 0.08,
          ease: 'sine.inOut',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        })
        .to(flipPage, {
          rotateY: -102, // Slight overshoot
          rotateX: 0.3, // Page curves other way
          rotateZ: -0.2, // Slight counter-twist
          // Maintain binding constraint
          duration: 0.12,
          ease: 'power3.out',
          boxShadow: '0 8px 25px rgba(0,0,0,0.18)'
        })
        .to(flipPage, {
          rotateY: -180, // Final flat position
          rotateX: 0,
          rotateZ: 0,
          // Perfect anchor at spiral binding
          duration: 0.15,
          ease: 'power3.out',
          boxShadow: 'none',
          filter: 'brightness(1) contrast(1)'
        });
      } else {
        // Backward flip: PROPER reverse motion - starts from behind, NO horizontal drift
        tl.fromTo(flipPage, {
          // Start from behind position
          rotateY: 180,
          rotateX: 0,
          rotateZ: 0
          // NO x,y,z positioning - pure binding-anchored rotation
        }, {
          rotateY: 172, // Begin reverse motion
          rotateX: -0.3,
          rotateZ: 0.2,
          // Stay anchored to binding
          duration: 0.15,
          ease: 'power3.out',
          boxShadow: '0 8px 25px rgba(0,0,0,0.18)'
        })
        .to(flipPage, {
          rotateY: 102, // Reverse overshoot
          rotateX: -0.3,
          rotateZ: -0.2,
          // NO horizontal movement
          duration: 0.12,
          ease: 'power3.out',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        })
        .to(flipPage, {
          rotateY: 90, // Vertical pause
          rotateX: 0.3,
          rotateZ: 0,
          // Binding-anchored only
          duration: 0.08,
          ease: 'sine.inOut',
          boxShadow: '0 8px 25px rgba(0,0,0,0.18)',
          filter: 'brightness(1.015) contrast(1.01)'
        })
        .to(flipPage, {
          rotateY: 78, // Near completion
          rotateX: 0.8,
          rotateZ: -0.2,
          // NO drift from spiral binding
          duration: 0.15,
          ease: 'power3.out',
          boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          filter: 'brightness(1.01) contrast(1.02)'
        })
        .to(flipPage, {
          rotateY: 45, // Quarter turn
          rotateX: 1.5,
          rotateZ: -0.5,
          // Stay anchored to binding
          duration: 0.18,
          ease: 'sine.inOut',
          boxShadow: '0 3px 12px rgba(0,0,0,0.08)'
        })
        .to(flipPage, {
          rotateY: 8, // Final gentle position
          rotateX: 0.8,
          rotateZ: -0.3,
          // Perfect binding anchor
          duration: 0.12,
          ease: 'power3.out',
          boxShadow: 'none',
          filter: 'brightness(1) contrast(1)'
        });
      }

      // Realistic shadow that follows hand movement - different for forward/backward
      if (shadow) {
        if (direction === 'forward') {
          // Forward shadow: starts light, peaks at middle, fades
          tl.fromTo(shadow, 
            { opacity: 0, scaleX: 1, scaleY: 1 },
            { 
              opacity: 0.08, 
              scaleX: 1.02, 
              scaleY: 0.98,
              duration: 0.12,
              ease: 'power2.out'
            }, 0
          )
          .to(shadow, {
            opacity: 0.18,
            scaleX: 1.05,
            scaleY: 0.95,
            duration: 0.18,
            ease: 'power1.inOut'
          }, 0.12)
          .to(shadow, {
            opacity: 0.25,
            scaleX: 1.08,
            scaleY: 0.92,
            duration: 0.15,
            ease: 'power2.out'
          }, 0.3)
          .to(shadow, {
            opacity: 0.3,
            scaleX: 1.1,
            scaleY: 0.9,
            duration: 0.08,
            ease: 'power1.inOut'
          }, 0.45)
          .to(shadow, {
            opacity: 0.25,
            scaleX: 1.08,
            scaleY: 0.92,
            duration: 0.12,
            ease: 'power2.out'
          }, 0.53)
          .to(shadow, {
            opacity: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 0.15,
            ease: 'elastic.out(1, 0.8)'
          }, 0.65);
        } else {
          // Backward shadow: reverse timeline - starts strong, fades to light
          tl.fromTo(shadow,
            { opacity: 0.3, scaleX: 1.1, scaleY: 0.9 },
            {
              opacity: 0.25,
              scaleX: 1.08,
              scaleY: 0.92,
              duration: 0.15,
              ease: 'elastic.out(1, 0.8)'
            }, 0
          )
          .to(shadow, {
            opacity: 0.3,
            scaleX: 1.1,
            scaleY: 0.9,
            duration: 0.12,
            ease: 'power2.out'
          }, 0.15)
          .to(shadow, {
            opacity: 0.25,
            scaleX: 1.08,
            scaleY: 0.92,
            duration: 0.08,
            ease: 'power1.inOut'
          }, 0.27)
          .to(shadow, {
            opacity: 0.18,
            scaleX: 1.05,
            scaleY: 0.95,
            duration: 0.15,
            ease: 'power2.out'
          }, 0.35)
          .to(shadow, {
            opacity: 0.08,
            scaleX: 1.02,
            scaleY: 0.98,
            duration: 0.18,
            ease: 'power1.inOut'
          }, 0.5)
          .to(shadow, {
            opacity: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 0.12,
            ease: 'power2.out'
          }, 0.68);
        }
      }

      // Natural paper gloss - different direction for forward/backward
      if (gloss) {
        if (direction === 'forward') {
          // Forward gloss: sweeps from left to right following the page flip
          tl.fromTo(gloss, {
            opacity: 0,
            x: -80,
            scaleX: 0.5,
            skewX: -15
          }, {
            opacity: 0.12,
            x: -40,
            scaleX: 0.7,
            skewX: -10,
            duration: 0.3,
            ease: 'power2.out'
          }, 0.1)
          .to(gloss, {
            opacity: 0.18,
            x: 0,
            scaleX: 1,
            skewX: 0,
            duration: 0.25,
            ease: 'power1.inOut'
          }, 0.4)
          .to(gloss, {
            opacity: 0.08,
            x: 40,
            scaleX: 0.7,
            skewX: 10,
            duration: 0.25,
            ease: 'power2.in'
          }, 0.65);
        } else {
          // Backward gloss: sweeps from right to left (reverse motion)
          tl.fromTo(gloss, {
            opacity: 0.08,
            x: 40,
            scaleX: 0.7,
            skewX: 10
          }, {
            opacity: 0.18,
            x: 0,
            scaleX: 1,
            skewX: 0,
            duration: 0.25,
            ease: 'power2.out'
          }, 0.1)
          .to(gloss, {
            opacity: 0.12,
            x: -40,
            scaleX: 0.7,
            skewX: -10,
            duration: 0.25,
            ease: 'power1.inOut'
          }, 0.35)
          .to(gloss, {
            opacity: 0,
            x: -80,
            scaleX: 0.5,
            skewX: -15,
            duration: 0.3,
            ease: 'power2.in'
          }, 0.6);
        }
      }

      // Page edge highlight - simulates page thickness
      if (edge) {
        tl.to(edge, {
          opacity: 0.15,
          duration: 0.12,
          ease: 'power2.out'
        }, 0.3)
        .to(edge, {
          opacity: 0.3,
          duration: 0.15,
          ease: 'power1.inOut'
        }, 0.45)
        .to(edge, {
          opacity: 0.4,
          duration: 0.08,
          ease: 'power1.inOut'
        }, 0.53)
        .to(edge, {
          opacity: 0.2,
          duration: 0.12,
          ease: 'power2.out'
        }, 0.61)
        .to(edge, {
          opacity: 0,
          duration: 0.15,
          ease: 'power2.in'
        }, 0.73);
      }
    });
  });
};

type GoToMode = 'step' | 'fast' | 'instant';
const goTo = async (index: number, opts?: { mode?: GoToMode }) => {
  const target = Math.max(0, Math.min(index, props.pages.length - 1));
  if (target === currentPageIndex.value) return;
  
  // Play page transition sound if available and sound is enabled (unless instant mode)
  const mode: GoToMode = opts?.mode ?? 'step';
  
  const direction: 'forward' | 'backward' = target > currentPageIndex.value ? 'forward' : 'backward';
  showPageChangeIndicator(direction, target);

  if (mode === 'instant') {
    currentPageIndex.value = target;
    nextTick(() => {
      mobilePageRef.value?.scrollTo({ top: 0, behavior: 'auto' });
      desktopPageRef.value?.scrollTo({ top: 0, behavior: 'auto' });
    });
    return;
  }

  if (mode === 'fast') {
    await animateQuickJump(direction, target);
    return;
  }

  // Default: step-by-step flipping
  while (currentPageIndex.value !== target) {
    if (isFlipping.value) {
      await new Promise(r => setTimeout(r, 10));
      continue;
    }
    if (direction === 'forward' && currentPageIndex.value >= props.pages.length - 1) break;
    if (direction === 'backward' && currentPageIndex.value <= 0) break;
    await animatePageTurn(direction);
    await new Promise(r => setTimeout(r, 50));
  }
};

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault();
    nextPage();
  }
  if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
    e.preventDefault();
    prevPage();
  }
  if (e.key === 'Home') {
    e.preventDefault();
    goTo(0);
  }
  if (e.key === 'End') {
    e.preventDefault();
    goTo(props.pages.length - 1);
  }
};

// Mouse wheel navigation (disabled auto page change, only for manual navigation)
const handleWheel = (e: WheelEvent) => {
  // Allow normal scrolling within page content
  // Only prevent default wheel behavior when explicitly navigating with Ctrl+wheel
  if (e.ctrlKey && screenSize.value.isDesktop && !isFlipping.value) {
    e.preventDefault();
    
    if (e.deltaY > 0) {
      nextPage();
    } else if (e.deltaY < 0) {
      prevPage();
    }
  }
};

onMounted(() => {
  // Event listeners
  window.addEventListener('resize', updateScreenSize);
  window.addEventListener('orientationchange', updateScreenSize);

  const container = bookContainerRef.value;
  if (container) {
    // Make sure container can capture keyboard events
    container.addEventListener('keydown', handleKeydown);

    // Scope touch and wheel events to the container only
    container.addEventListener('touchstart', handleTouchStart as any, { passive: false });
    container.addEventListener('touchmove', handleTouchMove as any, { passive: false });
    container.addEventListener('touchend', handleTouchEnd as any, { passive: true });
  container.addEventListener('wheel', handleWheel as any, { passive: false });
  // Make drag-to-flip work well with touch + mouse
  container.style.touchAction = 'pan-y';

    // Optionally focus the container so Arrow keys work immediately
    container.focus();
  }
  
  // Initial screen size update
  updateScreenSize();
  // Initial measurement after first render
  nextTick(() => measureAndApplySpiralMetrics());
});

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize);
  window.removeEventListener('orientationchange', updateScreenSize);

  const container = bookContainerRef.value;
  if (container) {
    container.removeEventListener('keydown', handleKeydown);
    container.removeEventListener('touchstart', handleTouchStart as any);
    container.removeEventListener('touchmove', handleTouchMove as any);
    container.removeEventListener('touchend', handleTouchEnd as any);
    container.removeEventListener('wheel', handleWheel as any);
  container.removeEventListener('pointermove', handlePointerMove as any);
  container.removeEventListener('pointerup', handlePointerUp as any);
  container.removeEventListener('pointercancel', handlePointerUp as any);
  }
});

// Expose methods for parent component
defineExpose({
  goTo,
  nextPage,
  prevPage,
  screenSize: screenSize.value,
  currentPageIndex
});
</script>

<style scoped>
/* Mobile-first responsive design */
.book-container {
  position: relative;
  perspective: 1200px;
  perspective-origin: 50% 50%;
  height: 100%;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  /* Spiral binding variables */
  --spiral-width: 28px; /* updated per page */
  --coil-right: 28px;   /* updated per page */
  --spiral-width: 28px; /* will be updated per page container */
  --coil-right: 28px;   /* distance from container's left to spiral's right edge */
  --spiral-left-pad: 44px; /* content padding-left when spiral visible */
  --hole-size: 12px;
  --hole-gap: 46px;
  --spiral-wire: #a3a7ad;
  --spiral-wire-dark: #6b7280;
  --spiral-shadow: rgba(0,0,0,0.35);
}

.book-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform-style: preserve-3d;
}

.book-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--bg-from), var(--bg-via));
  backdrop-filter: blur(var(--blur-bg));
}

.book-pages {
  flex: 1;
  position: relative;
  padding: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transform-style: preserve-3d;
}

/* Mobile layout */
.mobile-page-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-container);
  overflow: hidden;
  background: var(--color-glass-bg);
  /* Disable expensive effects on mobile to prevent blinking */
  backdrop-filter: none;
  border: 1px solid var(--color-glass-border);
  flex: 1;
  /* Simplified transforms for mobile performance */
  transform-style: flat;
}

/* Enable backdrop blur only on larger screens */
@media (min-width: 768px) {
  .mobile-page-container {
    backdrop-filter: blur(var(--blur-glass));
    transform-style: preserve-3d;
  }
}

.mobile-page {
  width: 100%;
  height: 100%;
  max-width: 100%;
  padding: 2rem 1.5rem;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  position: relative;
  /* Simplified transforms for mobile performance */
  transform-style: flat;
  will-change: auto;
  
  /* Custom scrollbar for mobile */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  
  /* Smooth scrolling */
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* Enable 3D transforms only on larger screens */
@media (min-width: 768px) {
  .mobile-page {
    transform-style: preserve-3d;
    will-change: transform;
  }
}

/* Notebook spiral visuals */
.with-spiral {
  padding-left: var(--spiral-left-pad) !important;
}

.notebook-spiral {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--spiral-width);
  z-index: 6;
  pointer-events: none;
  background:
    linear-gradient(90deg, rgba(255,255,255,0.08), rgba(0,0,0,0.18)),
    radial-gradient(ellipse at right center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.0) 70%);
  box-shadow: inset -1px 0 0 rgba(255,255,255,0.08), inset -6px 0 12px rgba(0,0,0,0.25);
}

.notebook-spiral::before {
  content: '';
  position: absolute;
  left: calc(var(--spiral-width) / 2 - 3px);
  top: 10px;
  bottom: 10px;
  width: 6px;
  border-radius: 3px;
  background: repeating-linear-gradient(
    to bottom,
    var(--spiral-wire) 0 18px,
    var(--spiral-wire-dark) 18px 22px
  );
  box-shadow: inset -1px 0 0 rgba(255,255,255,0.25), 0 0 0 1px rgba(0,0,0,0.15), 0 0 8px rgba(0,0,0,0.25);
  filter: drop-shadow(0 2px 3px rgba(0,0,0,0.25));
}

.page-holes {
  position: absolute;
  left: calc(var(--spiral-width) + 2px);
  top: 14px;
  bottom: 14px;
  width: var(--hole-size);
  z-index: 6;
  pointer-events: none;
  /* Faux circular holes using repeated radial gradient */
  background-image: radial-gradient(circle at 50% 8px, rgba(0,0,0,0.3) 0, rgba(0,0,0,0.3) calc(var(--hole-size)/2), transparent calc(var(--hole-size)/2 + 1px));
  background-size: var(--hole-size) var(--hole-gap);
  background-repeat: repeat-y;
  filter: drop-shadow(0 1px 0 rgba(255,255,255,0.2));
}

/* Ensure flipping overlay also shows holes aligned to the binding */
.flipping-page > .page-holes {
  left: calc(var(--spiral-width) + 2px);
}

.mobile-page::-webkit-scrollbar {
  width: 4px;
}

.mobile-page::-webkit-scrollbar-track {
  background: transparent;
}

.mobile-page::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.mobile-page::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.mobile-flip-overlay {
  position: absolute;
  top: 0;
  left: var(--coil-right);
  width: calc(100% - var(--coil-right));
  height: 100%;
  border-radius: var(--radius-container);
  z-index: 10;
  overflow: hidden;
  will-change: transform;
  pointer-events: none;
}

.desktop-flip-overlay {
  position: absolute;
  top: 0;
  left: var(--coil-right);
  width: calc(100% - var(--coil-right));
  height: 100%;
  border-radius: var(--radius-container);
  z-index: 10;
  overflow: hidden;
  will-change: transform;
  pointer-events: none;
}

/* Desktop layout */
.desktop-pages-container {
  width: 100%;
  height: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
  overflow: hidden;
  flex: 1;
  justify-content: center;
  align-items: center;
}

.desktop-page {
  position: relative;
  background: var(--color-glass-bg);
  backdrop-filter: blur(var(--blur-glass));
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-container);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.single-page {
  width: 100%;
  max-width: 900px;
  height: 100%;
  min-height: 500px;
}

.page-content {
  width: 100%;
  height: 100%;
  max-width: 100%;
  padding: 2rem;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  flex: 1;
  
  /* Custom scrollbar for desktop */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  
  /* Smooth scrolling */
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.page-content::-webkit-scrollbar {
  width: 6px;
}

.page-content::-webkit-scrollbar-track {
  background: transparent;
}

.page-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.page-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Controls */
.book-controls {
  padding: 1.5rem 2rem;
  background: var(--color-side-btn-bg);
  backdrop-filter: blur(15px);
  border-top: 1px solid var(--color-glass-border);
  flex-shrink: 0;
}

/* Unified Controls */
.unified-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  max-width: 1000px;
  margin: 0 auto;
}

.nav-btn {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--color-glass-bg);
  border: 1px solid var(--color-glass-border);
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(var(--blur-glass));
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

@media (min-width: 768px) {
  .nav-btn {
    width: auto;
    height: auto;
    border-radius: 12px;
    padding: 1rem 2rem;
    font-size: 0.9rem;
    font-weight: 500;
  }
}

.nav-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
}

@media (min-width: 768px) {
  .nav-btn:hover:not(:disabled) {
    transform: translateY(-2px);
  }
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-indicator {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .page-indicator {
    gap: 1rem;
  }
}

.page-dots {
  display: flex;
  gap: 0.75rem;
}

.page-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.page-dot.active {
  background: linear-gradient(45deg, var(--progress-from), var(--progress-to));
  transform: scale(1.4);
  box-shadow: 0 0 20px var(--indicator-shadow);
}

.page-dot:hover:not(.active) {
  background: rgba(255, 255, 255, 0.5);
  transform: scale(1.2);
}

.page-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-family: monospace;
  font-weight: 500;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

/* Fixed side navigation - visible on all screen sizes */
.side-nav {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 40;
}

.side-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 9999px;
  background: var(--color-side-btn-bg);
  border: 1px solid var(--color-side-btn-border);
  color: white;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.35);
  transition: transform 0.2s ease, background 0.2s ease, opacity 0.2s ease;
  pointer-events: auto;
  /* Ensure visible on mobile */
  opacity: 0.9;
}

/* Do not reserve space or intercept taps when hidden via v-show */
.side-btn[style*="display: none"] {
  pointer-events: none !important;
}

.side-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.18);
  transform: translateY(-50%) scale(1.05);
  opacity: 1;
}

.side-btn:disabled {
  opacity: 0.35;
}

.side-btn.prev { left: 0.75rem; }
.side-btn.next { right: 0.75rem; }

/* Mobile specific adjustments for better accessibility */
@media (max-width: 767px) {
  .side-btn {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
    /* Ensure they're clearly visible on mobile */
  background: rgba(0, 0, 0, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  }
  
  .side-btn.prev { left: 0.5rem; }
  .side-btn.next { right: 0.5rem; }
}

@media (min-width: 768px) {
  .side-btn { 
    width: 52px; 
    height: 52px; 
    font-size: 1.35rem; 
  }
}

@media (min-width: 1024px) {
  .side-btn { 
    width: 56px; 
    height: 56px; 
    font-size: 1.5rem; 
  }
}

/* Enhanced 3D perspective and depth effects */
@media (min-width: 768px) {
  .book-container {
    perspective: 1500px;
    perspective-origin: 50% 45%;
  }
}

@media (min-width: 1024px) {
  .book-container {
    perspective: 1800px;
    perspective-origin: 50% 40%;
  }
}

/* 3D Perspective for the book container */
.book-pages {
  position: relative;
  perspective: 1000px;
  perspective-origin: 15% 50%; /* Origin near spiral binding */
  overflow: hidden; /* Ensure nothing escapes the book bounds */
  transform-style: preserve-3d;
}

/* Mobile page container with 3D context */
.mobile-page-container {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  overflow: hidden; /* Clip content to book bounds */
}

/* Desktop pages container with 3D context */
.desktop-pages-container {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  overflow: hidden; /* Clip content to book bounds */
}

  /* Page flip overlay - constrained within book and near coil binding */
  .flip-overlay {
    position: absolute;
    top: 0;
    left: var(--coil-right);
    width: calc(100% - var(--coil-right));
    height: 100%;
    z-index: 1000;
    pointer-events: none;
    /* Simplified transforms for mobile performance */
    transform-style: flat;
    /* Critical: Clip to keep animation within coil binding area */
    clip-path: inset(0); /* Already positioned to start at the spiral's right edge */
    overflow: hidden; /* Ensure nothing escapes the clipped area */
  }
  
  /* Enable 3D transforms only on larger screens */
  @media (min-width: 768px) {
    .flip-overlay {
      transform-style: preserve-3d;
    }
  }
  
  /* Flip page with proper 3D transforms and realistic styling */
  .flip-page {
    position: relative;
    width: 100%;
    height: 100%;
    /* Match the exact book page styling to prevent white blink */
    background: var(--color-glass-bg);
    /* Disable expensive backdrop blur on mobile */
    backdrop-filter: none;
    border: 1px solid var(--color-glass-border);
    border-radius: var(--radius-container);
    /* Simplified transforms for mobile performance */
    transform-style: flat;
    backface-visibility: hidden;
    /* Set transform origin at spiral binding */
  /* Hinge at the overlay's left edge (aligned to spiral right) */
  transform-origin: 0px center;
    /* Ensure page respects book container bounds */
    clip-path: inset(0 0 0 0);
    /* Realistic paper texture */
    background-image: 
      linear-gradient(90deg, rgba(255,255,255,0.01) 0%, transparent 2%),
      linear-gradient(0deg, rgba(255,255,255,0.005) 0%, transparent 2%);
    background-size: 12px 12px, 8px 8px;
    /* Smooth transitions to prevent blinks */
    transition: none;
    will-change: auto;
    /* Solid background for mobile to prevent transparency flicker */
    background-color: rgba(15, 23, 42, 0.95);
  }
  
  /* Enable 3D transforms and backdrop blur only on larger screens */
  @media (min-width: 768px) {
    .flip-page {
      transform-style: preserve-3d;
      will-change: transform, box-shadow;
      background: var(--color-glass-bg);
      backdrop-filter: blur(var(--blur-glass));
    }
  }
  
  /* Spiral binding visual constraint */
.flip-page::before {
  content: '';
  position: absolute;
  left: calc(-1 * var(--coil-right));
  top: 0;
  width: var(--coil-right);
  height: 100%;
  background: transparent;
  z-index: 1001;
  pointer-events: none;
}

/* Enhanced page flip container for realistic spiral-bound animation */
.page-flip-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 25;
  transform-style: preserve-3d;
  perspective: 1200px;
  overflow: visible;
}

.flipping-page {
  width: 100%;
  height: 100%;
  background: var(--color-glass-bg);
  backdrop-filter: blur(var(--blur-glass));
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-container);
  position: relative;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform, box-shadow;
  overflow: hidden;
  /* Critical: Transform origin must be exactly at spiral binding edge */
  transform-origin: var(--spiral-width) center !important;
  
  /* Subtle paper texture that doesn't interfere with content */
  background-image: 
    linear-gradient(90deg, rgba(255,255,255,0.01) 0%, transparent 2%),
    linear-gradient(0deg, rgba(255,255,255,0.005) 0%, transparent 2%);
  background-size: 12px 12px, 8px 8px;
}

/* Enhanced shadow for realistic depth - follows page motion */
.flip-shadow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  border-radius: inherit;
  z-index: 1;
  will-change: opacity, transform;
  transition: none;
  /* Realistic shadow that moves with hand motion */
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(0,0,0,0.05) 20%,
    rgba(0,0,0,0.12) 40%,
    rgba(0,0,0,0.18) 60%,
    rgba(0,0,0,0.08) 80%,
    transparent 100%
  );
}

/* Natural paper gloss - like light reflecting off page surface */
.flip-gloss {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  border-radius: inherit;
  z-index: 2;
  will-change: opacity, transform;
  transition: none;
  /* Realistic paper shine that follows light */
  background: linear-gradient(
    45deg,
    transparent 0%,
    rgba(255,255,255,0.02) 25%,
    rgba(255,255,255,0.08) 45%,
    rgba(255,255,255,0.12) 50%,
    rgba(255,255,255,0.08) 55%,
    rgba(255,255,255,0.02) 75%,
    transparent 100%
  );
}

/* Page thickness edge - visible during flip */
.page-edge {
  position: absolute;
  top: 0;
  bottom: 0;
  right: -1px;
  width: 3px;
  opacity: 0;
  pointer-events: none;
  will-change: opacity;
  transition: none;
  /* Enhanced edge highlighting */
  background: linear-gradient(
    to bottom,
    rgba(200,200,200,0.3) 0%,
    rgba(220,220,220,0.6) 25%,
    rgba(240,240,240,0.8) 50%,
    rgba(220,220,220,0.6) 75%,
    rgba(200,200,200,0.3) 100%
  );
  border-radius: 0 var(--radius-container) var(--radius-container) 0;
  z-index: 3;
  background: linear-gradient(to bottom,
    rgba(0,0,0,0.1) 0%,
    rgba(0,0,0,0.15) 50%,
    rgba(0,0,0,0.1) 100%
  );
  border-radius: 0 1px 1px 0;
}

/* Ensure flip container doesn't interfere with underlying content */
.mobile-flip-overlay,
.desktop-flip-overlay {
  pointer-events: none;
}

/* Corner curl hint to suggest drag directions */
.corner-curl {
  position: absolute;
  width: 44px;
  height: 44px;
  border-radius: 0 0 0 8px;
  background: radial-gradient(120% 120% at 100% 0%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 50%, transparent 60%);
  pointer-events: none;
  opacity: 0.5;
  transition: opacity 0.2s ease;
}
.corner-curl.forward { right: 6px; bottom: 6px; transform: rotate(180deg); }
.corner-curl.backward { left: 6px; bottom: 6px; }
.with-spiral:hover .corner-curl { opacity: 0.8; }



/* Responsive breakpoints */
@media (max-width: 767px) {
  .mobile-page {
    padding: 1.5rem 1rem;
  }
  
  .book-controls {
    padding: 1rem;
  }
}

@media (min-width: 768px) {
  .book-pages {
  padding: 1.25rem;
  }
  .page-content {
  padding: 2.25rem;
  }
  .scroll-next-indicator { bottom: 4rem; }
  
  .page-indicator .page-dots {
    gap: 1rem;
  }
  
  .page-indicator .page-dot {
    width: 12px;
    height: 12px;
  }
  
  .desktop-pages-container {
    height: 100%;
    overflow: hidden;
    max-width: 950px;
  }
  
  .single-page {
    height: 100%;
  }
}

@media (min-width: 1024px) {
  .book-pages {
  padding: 1.5rem;
  }
  
  .desktop-pages-container {
    height: 100%;
    overflow: hidden;
    max-width: 1100px;
  }
  
  .single-page {
    height: 100%;
  }
  
  .page-content {
  padding: 2.75rem;
  }
  .scroll-next-indicator { bottom: 3rem; }
}

@media (min-width: 1280px) {
  .desktop-pages-container {
    max-width: 1200px;
  }
  
  .single-page {
    height: 100%;
  }
}

/* Scroll to next indicator */
.scroll-next-indicator {
  position: absolute;
  bottom: 5rem;
  right: 1rem;
  margin-left: auto;
  margin-top: 2rem;
  background: var(--indicator-from);
  backdrop-filter: blur(10px);
  border: 1px solid var(--indicator-shadow);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: fit-content;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 0 4px 20px var(--indicator-shadow);
  animation: pulse-glow 2s infinite;
  z-index: 5;
}

.scroll-next-indicator:hover {
  background: var(--indicator-to);
  transform: translateY(-2px);
  box-shadow: 0 6px 25px var(--indicator-shadow);
}

.scroll-next-indicator.desktop { position: absolute; }

.scroll-next-icon {
  font-size: 1rem;
  font-weight: bold;
  transform: translateX(0);
  transition: transform 0.3s ease;
}

.scroll-next-indicator:hover .scroll-next-icon {
  transform: translateX(4px);
}

.scroll-next-text {
  font-size: 0.875rem;
  white-space: nowrap;
}

@keyframes pulse-glow {
  0%, 100% {
  box-shadow: 0 4px 20px var(--indicator-shadow);
  }
  50% {
  box-shadow: 0 4px 25px var(--indicator-shadow);
  }
}

/* Page change indicator - more subtle and refined */
.page-change-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  color: white;
  z-index: 50;
  min-width: 180px;
  text-align: center;
  /* Make it less prominent */
  opacity: 0.9;
  font-size: 0.9rem;
}

.indicator-content {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.indicator-direction {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 500;
}

.indicator-title {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
}

.indicator-progress {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.2rem;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--progress-from), var(--progress-to));
  border-radius: 2px;
  transition: width 0.08s ease;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Motion preferences */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in {
    animation-duration: 0.2s;
  }
  
  .nav-btn:hover,
  .page-dot {
    transition-duration: 0.1s;
  }
  
  .scroll-next-indicator {
    animation: none;
  }
  
  /* Disable 3D transforms for reduced motion */
  .mobile-flip-overlay,
  .desktop-flip-overlay {
    transform-style: flat !important;
  }
  
  .book-container {
    perspective: none !important;
  }
}

/* Screen reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Enhanced page curl effects and performance optimizations */
.desktop-page, .mobile-page-container {
  transform-style: preserve-3d;
  will-change: transform;
}

/* Cursor feedback */
.with-spiral { cursor: default; }
.with-spiral:has(.corner-curl.forward),
.with-spiral:has(.corner-curl.backward) {
  cursor: grab;
}
.with-spiral:active { cursor: grabbing; }
</style>

