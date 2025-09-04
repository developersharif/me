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
      
      <!-- Book Pages Container -->
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
          </div>
          
          <!-- Mobile page flip overlay -->
      <div 
            v-if="isFlipping" 
            ref="mobileFlipRef"
            class="mobile-flip-overlay page-flip-container"
            :class="[
              flipDirection === 'forward' ? 'origin-right dir-forward' : 'origin-left dir-backward'
            ]"
          >
            <div class="flipping-page">
        <div class="page-holes" aria-hidden="true" />
              <div class="mobile-page">
                <component :is="flipContent?.component" v-bind="flipContent?.props" v-if="flipContent" />
              </div>
              <div class="flip-shadow" aria-hidden="true" />
              <div class="flip-gloss" aria-hidden="true" />
              <div class="page-edge" aria-hidden="true" />
              <div class="page-spine" aria-hidden="true" />
              <div class="page-corner" aria-hidden="true" />
              <div class="page-fold" aria-hidden="true" />
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
            </div>
          </div>
          
          <!-- Desktop Page Turn Animation Overlay -->
      <div 
            v-if="isFlipping" 
            ref="desktopFlipRef"
            class="desktop-flip-overlay page-flip-container"
            :class="[
              flipDirection === 'forward' ? 'origin-right dir-forward' : 'origin-left dir-backward'
            ]"
          >
            <div class="flipping-page">
        <div class="page-holes" aria-hidden="true" />
              <div class="page-content">
                <component :is="flipContent?.component" v-bind="flipContent?.props" v-if="flipContent" />
              </div>
              <div class="flip-shadow" aria-hidden="true" />
              <div class="flip-gloss" aria-hidden="true" />
              <div class="page-edge" aria-hidden="true" />
              <div class="page-spine" aria-hidden="true" />
              <div class="page-corner" aria-hidden="true" />
              <div class="page-fold" aria-hidden="true" />
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
// Spiral binding visual width in pixels (used for flip origin)
const SPIRAL_BINDING_WIDTH = 28;
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

// Show current page for both mobile and desktop (single page layout)
const currentMobilePage = computed(() => {
  return props.pages[currentPageIndex.value];
});

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
};

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

// Quick jump page turn: do a single, shortened flip and set index to target directly
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

      const flippingPage = container.querySelector('.flipping-page') as HTMLElement | null;
      if (!flippingPage) {
        currentPageIndex.value = targetIndex;
        isFlipping.value = false;
        resolve();
        return;
      }

  const G = (gsap as any);
  // Pivot around the spiral binding for both directions
  const origin = `${SPIRAL_BINDING_WIDTH}px 50%`;
      G.set(flippingPage, { rotateY: 0, transformOrigin: origin, transformStyle: 'preserve-3d', transformPerspective: 1200, backfaceVisibility: 'hidden' });

      const tl = G.timeline({
        onComplete: () => {
          currentPageIndex.value = targetIndex;
          isFlipping.value = false;
          nextTick(() => {
            mobilePageRef.value?.scrollTo({ top: 0, behavior: 'auto' });
            desktopPageRef.value?.scrollTo({ top: 0, behavior: 'auto' });
          });
          resolve();
        }
      });

      // Shortened flip sequence (~350ms total)
      tl.to(flippingPage, {
        rotateY: direction === 'forward' ? -40 : 40,
        z: 30,
        duration: 0.12,
        ease: 'power2.inOut'
      })
      .to(flippingPage, {
        rotateY: direction === 'forward' ? -160 : 160,
        z: 20,
        duration: 0.16,
        ease: 'power2.inOut'
      })
      .to(flippingPage, {
        rotateY: direction === 'forward' ? -180 : 180,
        z: 0,
        duration: 0.08,
        ease: 'power2.out'
      });
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

    // Set the correct content for the flip overlay
    // Always flip the current page to ensure correct visual direction
    flipContent.value = props.pages[currentPageIndex.value] as Page;

    nextTick(() => {
      const container = desktopFlipRef.value || mobileFlipRef.value;
      if (!container) return;
      
      const flippingPage = container.querySelector('.flipping-page') as HTMLElement | null;
      if (!flippingPage) return;

  const shadow = flippingPage.querySelector('.flip-shadow') as HTMLElement | null;
      const gloss = flippingPage.querySelector('.flip-gloss') as HTMLElement | null;
      const edge = flippingPage.querySelector('.page-edge') as HTMLElement | null;
      const spine = flippingPage.querySelector('.page-spine') as HTMLElement | null;
  const corner = flippingPage.querySelector('.page-corner') as HTMLElement | null;
  const fold = flippingPage.querySelector('.page-fold') as HTMLElement | null;

      // Reset transform/shadow with proper 3D setup
  const G = (gsap as any);
  // Pivot around the spiral binding for both directions
  const origin = `${SPIRAL_BINDING_WIDTH}px 50%`;
      
      G.set(flippingPage, { 
        rotateY: 0, 
        rotateX: 0,
        skewY: 0,
        scaleX: 1,
        scaleY: 1,
        z: 0,
        transformOrigin: origin,
        transformStyle: 'preserve-3d',
        transformPerspective: 1200,
        backfaceVisibility: 'hidden',
        boxShadow: '0 0 0 rgba(0,0,0,0)',
        filter: 'brightness(1) contrast(1)'
      });
      
      if (shadow) G.set(shadow, { opacity: 0 });
  if (gloss) G.set(gloss, { opacity: 0 });
      if (edge) G.set(edge, { opacity: 0 });
      if (spine) G.set(spine, { opacity: 0 });
  if (corner) G.set(corner, { opacity: 0 });
  if (fold) G.set(fold, { opacity: 0, borderBottomWidth: 12, borderLeftWidth: 12 });

      // Create realistic page turn timeline with multiple phases
      const tl = G.timeline({
        onComplete: () => {
          currentPageIndex.value = targetIndex;
          isFlipping.value = false;
          nextTick(() => {
            mobilePageRef.value?.scrollTo({ top: 0, behavior: 'auto' });
            desktopPageRef.value?.scrollTo({ top: 0, behavior: 'auto' });
          });
          resolve();
        }
      });

      // Enhanced realistic page turn with better physics and constraints
      // Phase 1: Initial lift - page starts to separate from book
      tl.to(flippingPage, { 
        rotateY: direction === 'forward' ? -3 : 3,
        rotateX: -0.5,
        scaleY: 0.9995,
        z: 8,
        boxShadow: '0 3px 8px rgba(0,0,0,0.08)',
        filter: 'brightness(1.01)',
        duration: 0.08,
        ease: 'power2.out'
      })
      
      // Phase 2: Gentle acceleration with curl beginning
      .to(flippingPage, { 
        rotateY: direction === 'forward' ? -20 : 20,
        rotateX: -2,
        scaleY: 0.999,
        z: 20,
        boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
        filter: 'brightness(1.03)',
        duration: 0.15,
        ease: 'power2.inOut'
      })
      
      // Phase 3: Mid-flip - maximum curl and depth (more constrained)
      .to(flippingPage, { 
        rotateY: direction === 'forward' ? -90 : 90,
        rotateX: -4,
        scaleY: 0.997,
        z: 35,
        boxShadow: '0 15px 35px rgba(0,0,0,0.25)',
        filter: 'brightness(1.08) contrast(1.03)',
        duration: 0.2,
        ease: 'power1.inOut'
      })
      
      // Phase 4: Deceleration with page settling
      .to(flippingPage, { 
        rotateY: direction === 'forward' ? -160 : 160,
        rotateX: -2,
        scaleY: 0.999,
        z: 20,
        boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
        filter: 'brightness(1.03)',
        duration: 0.15,
        ease: 'power2.out'
      })
      
      // Phase 5: Final approach with subtle overshoot
      .to(flippingPage, { 
        rotateY: direction === 'forward' ? -183 : 183,
        rotateX: -0.5,
        scaleY: 0.9995,
        z: 5,
        boxShadow: '0 3px 8px rgba(0,0,0,0.06)',
        filter: 'brightness(1.01)',
        duration: 0.1,
        ease: 'back.out(1.2)'
      })
      
      // Phase 6: Complete rest - page settles flat
      .to(flippingPage, { 
        rotateY: direction === 'forward' ? -180 : 180,
        rotateX: 0,
        scaleY: 1,
        z: 0,
        boxShadow: '0 0 0 rgba(0,0,0,0)',
        filter: 'brightness(1) contrast(1)',
        duration: 0.06,
        ease: 'power2.out'
      });

      // Enhanced shadow animation with realistic lighting
      if (shadow) {
        tl.to(shadow, { 
          opacity: 0.08, 
          duration: 0.08, 
          ease: 'power2.out' 
        }, 0)
        .to(shadow, { 
          opacity: 0.18, 
          duration: 0.15, 
          ease: 'power2.inOut' 
        }, 0.08)
        .to(shadow, { 
          opacity: 0.35, 
          duration: 0.2, 
          ease: 'power1.inOut' 
        }, 0.23)
        .to(shadow, { 
          opacity: 0.2, 
          duration: 0.15, 
          ease: 'power2.out' 
        }, 0.43)
        .to(shadow, { 
          opacity: 0.06, 
          duration: 0.1, 
          ease: 'back.out(1.2)' 
        }, 0.58)
        .to(shadow, { 
          opacity: 0, 
          duration: 0.06, 
          ease: 'power2.out' 
        }, 0.68);
      }

      // Gloss highlight animation - simulates light reflection
      if (gloss) {
        tl.to(gloss, { opacity: 0.03, duration: 0.08, ease: 'power2.out' }, 0)
          .to(gloss, { opacity: 0.08, duration: 0.15, ease: 'power2.inOut' }, 0.08)
          .to(gloss, { opacity: 0.15, duration: 0.2, ease: 'power1.inOut' }, 0.23)
          .to(gloss, { opacity: 0.06, duration: 0.15, ease: 'power2.out' }, 0.43)
          .to(gloss, { opacity: 0.02, duration: 0.1, ease: 'back.out(1.2)' }, 0.58)
          .to(gloss, { opacity: 0, duration: 0.06, ease: 'power2.out' }, 0.68);
      }

      // Corner and fold visibility peaks at mid-flip
      if (corner && fold) {
        tl.to(corner, { opacity: 0.0, duration: 0.1, ease: 'power2.out' }, 0)
          .to(corner, { opacity: 0.25, duration: 0.2, ease: 'power2.inOut' }, 0.23)
          .to(corner, { opacity: 0.05, duration: 0.2, ease: 'power2.out' }, 0.55)
          .to(corner, { opacity: 0, duration: 0.06, ease: 'power2.out' }, 0.68);
        tl.to(fold, { opacity: 0.0, borderBottomWidth: 8, borderLeftWidth: 8, duration: 0.1, ease: 'power2.out' }, 0)
          .to(fold, { opacity: 0.35, borderBottomWidth: 26, borderLeftWidth: 26, duration: 0.2, ease: 'power2.inOut' }, 0.23)
          .to(fold, { opacity: 0.12, borderBottomWidth: 12, borderLeftWidth: 12, duration: 0.2, ease: 'power2.out' }, 0.55)
          .to(fold, { opacity: 0, duration: 0.06, ease: 'power2.out' }, 0.68);
      }

      // Page edge (thickness) animation for 3D depth
      if (edge) {
        tl.to(edge, { opacity: 0.2, duration: 0.12, ease: 'power2.out' }, 0.04)
          .to(edge, { opacity: 0.4, duration: 0.2, ease: 'power2.inOut' }, 0.19)
          .to(edge, { opacity: 0.25, duration: 0.2, ease: 'power2.out' }, 0.43)
          .to(edge, { opacity: 0, duration: 0.1, ease: 'power2.out' }, 0.68);
      }

      // Page spine effect for enhanced realism
      if (spine) {
        tl.to(spine, { opacity: 0.12, duration: 0.15, ease: 'power2.out' }, 0.08)
          .to(spine, { opacity: 0.25, duration: 0.2, ease: 'power2.inOut' }, 0.23)
          .to(spine, { opacity: 0.15, duration: 0.15, ease: 'power2.out' }, 0.43)
          .to(spine, { opacity: 0, duration: 0.1, ease: 'power2.out' }, 0.68);
      }

      // Add subtle page curl effect to the stationary page behind (reduced intensity)
      const currentPageEl = screenSize.value.isMobile ? mobilePageRef.value : desktopPageRef.value;
      if (currentPageEl) {
        tl.to(currentPageEl, {
          rotateY: direction === 'forward' ? 1 : -1,
          z: -3,
          scale: 0.9995,
          duration: 0.25,
          ease: 'power2.out'
        }, 0)
        .to(currentPageEl, {
          rotateY: 0,
          z: 0,
          scale: 1,
          duration: 0.45,
          ease: 'elastic.out(1, 0.2)'
        }, 0.25);
      }

      // Add subtle ambient lighting effect (reduced intensity)
      const bookWrapper = container.closest('.book-wrapper');
      if (bookWrapper) {
        tl.to(bookWrapper, {
          filter: 'brightness(1.015) saturate(1.02)',
          duration: 0.25,
          ease: 'power2.out'
        }, 0)
        .to(bookWrapper, {
          filter: 'brightness(1) saturate(1)',
          duration: 0.45,
          ease: 'power2.out'
        }, 0.25);
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

    // Optionally focus the container so Arrow keys work immediately
    container.focus();
  }
  
  // Initial screen size update
  updateScreenSize();
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
  --spiral-width: 28px;
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
  backdrop-filter: blur(var(--blur-glass));
  border: 1px solid var(--color-glass-border);
  flex: 1;
  transform-style: preserve-3d;
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
  transform-style: preserve-3d;
  will-change: transform;
  
  /* Custom scrollbar for mobile */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  
  /* Smooth scrolling */
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
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
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-container);
  z-index: 10;
  overflow: hidden;
  will-change: transform;
}

.desktop-flip-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-container);
  z-index: 10;
  overflow: hidden;
  will-change: transform;
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

/* Enhanced page flip container for more realistic animation */
.page-flip-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 15;
  transform-style: preserve-3d;
  perspective: 1200px;
  /* Constrain the flip to just the page area */
  overflow: hidden;
  border-radius: var(--radius-container);
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
  will-change: transform, box-shadow, filter;
  /* Constrain to parent boundaries */
  overflow: hidden;
  transform-origin: var(--spiral-width) 50% !important;
  
  /* Enhanced page texture with subtle paper grain */
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.015) 20%, transparent 21%),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.015) 20%, transparent 21%),
    linear-gradient(90deg, rgba(255,255,255,0.008) 50%, transparent 50%),
    linear-gradient(rgba(255,255,255,0.003) 50%, transparent 50%);
  background-size: 30px 30px, 25px 25px, 12px 12px, 6px 6px;
  
  /* Subtle paper-like texture and depth */
  box-shadow: 
    inset 0 0 15px rgba(255,255,255,0.03),
    inset 0 0 30px rgba(255,255,255,0.015),
    0 0 0 rgba(0,0,0,0);
}

/* Slight emboss around holes to sell the punch-through look */
.page-holes {
  box-shadow: inset -1px 0 0 rgba(255,255,255,0.08);
}

/* Enhanced page animation states */
.flipping-forward {
  animation: realistic-page-turn-forward 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.flipping-backward {
  animation: realistic-page-turn-backward 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* Realistic page turn keyframes (fallback for older browsers) */
@keyframes realistic-page-turn-forward {
  0% {
    transform: rotateY(0deg) rotateX(0deg) translateZ(0px);
    filter: brightness(1) contrast(1);
    box-shadow: 0 0 0 rgba(0,0,0,0);
  }
  15% {
    transform: rotateY(-8deg) rotateX(-2deg) translateZ(20px);
    filter: brightness(1.05) contrast(1);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
  40% {
    transform: rotateY(-45deg) rotateX(-8deg) translateZ(40px);
    filter: brightness(1.1) contrast(1.05);
    box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  }
  60% {
    transform: rotateY(-90deg) rotateX(-12deg) translateZ(60px);
    filter: brightness(1.15) contrast(1.1);
    box-shadow: 0 35px 80px rgba(0,0,0,0.4);
  }
  80% {
    transform: rotateY(-135deg) rotateX(-8deg) translateZ(40px);
    filter: brightness(1.1) contrast(1.05);
    box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  }
  95% {
    transform: rotateY(-185deg) rotateX(-2deg) translateZ(10px);
    filter: brightness(1.02) contrast(1);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  }
  100% {
    transform: rotateY(-180deg) rotateX(0deg) translateZ(0px);
    filter: brightness(1) contrast(1);
    box-shadow: 0 0 0 rgba(0,0,0,0);
  }
}

@keyframes realistic-page-turn-backward {
  0% {
    transform: rotateY(0deg) rotateX(0deg) translateZ(0px);
    filter: brightness(1) contrast(1);
    box-shadow: 0 0 0 rgba(0,0,0,0);
  }
  15% {
    transform: rotateY(8deg) rotateX(-2deg) translateZ(20px);
    filter: brightness(1.05) contrast(1);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
  40% {
    transform: rotateY(45deg) rotateX(-8deg) translateZ(40px);
    filter: brightness(1.1) contrast(1.05);
    box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  }
  60% {
    transform: rotateY(90deg) rotateX(-12deg) translateZ(60px);
    filter: brightness(1.15) contrast(1.1);
    box-shadow: 0 35px 80px rgba(0,0,0,0.4);
  }
  80% {
    transform: rotateY(135deg) rotateX(-8deg) translateZ(40px);
    filter: brightness(1.1) contrast(1.05);
    box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  }
  95% {
    transform: rotateY(185deg) rotateX(-2deg) translateZ(10px);
    filter: brightness(1.02) contrast(1);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  }
  100% {
    transform: rotateY(180deg) rotateX(0deg) translateZ(0px);
    filter: brightness(1) contrast(1);
    box-shadow: 0 0 0 rgba(0,0,0,0);
  }
}

/* Enhanced flip shadow elements for more realistic page turning */
/* Dynamic flip shadow to enhance realism */
.flip-shadow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  mix-blend-mode: multiply;
  border-radius: inherit;
  z-index: 1;
}

/* Subtle moving gloss highlight across the page */
.flip-gloss {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  border-radius: inherit;
  z-index: 2;
  background: linear-gradient(
    110deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.08) 25%,
    rgba(255,255,255,0.12) 45%,
    rgba(255,255,255,0.06) 65%,
    rgba(255,255,255,0) 85%
  );
  mix-blend-mode: screen;
}

/* Page thickness edge to sell 3D depth */
.page-edge {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 8px;
  opacity: 0;
  pointer-events: none;
  z-index: 3;
  border-radius: inherit;
}

/* Page spine effect for enhanced book realism */
.page-spine {
  position: absolute;
  top: 5%;
  bottom: 5%;
  width: 3px;
  opacity: 0;
  pointer-events: none;
  z-index: 4;
  border-radius: 2px;
  background: linear-gradient(to bottom,
    rgba(0,0,0,0.2),
    rgba(0,0,0,0.4) 50%,
    rgba(0,0,0,0.2)
  );
}

.dir-forward .page-edge {
  right: 0;
  background: linear-gradient(to left,
    rgba(0,0,0,0.4),
    rgba(0,0,0,0.2),
    rgba(255,255,255,0.03)
  );
}

.dir-backward .page-edge {
  left: 0;
  background: linear-gradient(to right,
    rgba(0,0,0,0.4),
    rgba(0,0,0,0.2),
    rgba(255,255,255,0.03)
  );
}

.dir-forward .page-spine {
  right: 2px;
}

.dir-backward .page-spine {
  left: 2px;
}

.dir-forward .flip-shadow {
  background: linear-gradient(
    to left, 
    rgba(0,0,0,0.35) 0%,
    rgba(0,0,0,0.2) 20%,
    rgba(0,0,0,0.08) 40%,
    transparent 65%
  );
}

.dir-backward .flip-shadow {
  background: linear-gradient(
    to right, 
    rgba(0,0,0,0.35) 0%,
    rgba(0,0,0,0.2) 20%,
    rgba(0,0,0,0.08) 40%,
    transparent 65%
  );
}

/* Corner highlight and fold for realism */
.page-corner {
  position: absolute;
  width: 28px;
  height: 28px;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 100% 100%, rgba(255,255,255,0.65), rgba(255,255,255,0) 70%);
  opacity: 0.0;
  pointer-events: none;
  z-index: 5;
}

.page-fold {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 0;
  height: 0;
  border-bottom: 26px solid rgba(255,255,255,0.5);
  border-left: 26px solid transparent;
  opacity: 0.0;
  pointer-events: none;
  z-index: 6;
  filter: drop-shadow(-2px -1px 2px rgba(0,0,0,0.15));
}


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
  .realistic-page-turn-forward,
  .realistic-page-turn-backward,
  .flipping-forward,
  .flipping-backward,
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

/* Additional realistic page effects for enhanced visual appeal */
.flipping-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    rgba(255,255,255,0.03) 0%,
    transparent 20%,
    transparent 80%,
    rgba(0,0,0,0.02) 100%
  );
  border-radius: inherit;
  pointer-events: none;
  z-index: 1;
}

.flipping-page::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    rgba(255,255,255,0.02) 0%,
    transparent 70%
  );
  border-radius: inherit;
  pointer-events: none;
  z-index: 2;
}
</style>

