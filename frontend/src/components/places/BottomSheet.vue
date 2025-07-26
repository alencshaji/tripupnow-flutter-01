<template>
  <teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex flex-col justify-end"
      @touchmove.prevent
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-transparent bg-opacity-40 transition-opacity duration-200"
        @click="closeSheet"
      />

      <!-- Sheet -->
      <div
        ref="sheet"
        class="bg-white rounded-t-2xl shadow-xl transition-transform duration-200 ease-in-out overflow-hidden"
        :style="sheetStyle"
        @touchstart="startDrag"
        @touchmove.prevent="onDrag"
        @touchend="endDrag"
        @mousedown="startDrag"
        @mousemove="onDrag"
        @mouseup="endDrag"
        @mouseleave="endDrag"
      >
        <!-- Drag handle -->
        <div class="w-full flex justify-center py-2 cursor-grab touch-none">
          <div class="h-1.5 w-12 bg-gray-300 rounded-full"></div>
        </div>

        <!-- Content area -->
        <div class="overflow-y-auto max-h-[80vh] px-4 pb-6 pt-2">
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  visible: boolean
  snapHeights?: number[] // optional dynamic snap points (0 to 1)
}>()

const emit = defineEmits(['close'])

const translateY = ref(0)
const startY = ref(0)
const currentSnapIndex = ref(1)

const defaultSnaps = [0.1, 0.4, 0.8]
const snapPoints = computed(() => {
  return (props.snapHeights ?? defaultSnaps).map(p => window.innerHeight * p)
})

const sheetStyle = computed(() => ({
  transform: `translateY(${translateY.value}px)`,
  transition: startY.value === 0 ? 'transform 0.2s ease-in-out' : 'none',
}))

function updateTranslateY(index: number) {
  currentSnapIndex.value = index
  translateY.value = snapPoints.value[index]
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      lockBodyScroll()
      updateTranslateY(currentSnapIndex.value)
    } else {
      unlockBodyScroll()
    }
  }
)

function closeSheet() {
  emit('close')
  unlockBodyScroll()
}

function startDrag(e: TouchEvent | MouseEvent) {
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  startY.value = clientY
  if (!('touches' in e)) {
    window.addEventListener('mousemove', onDrag)
    window.addEventListener('mouseup', endDrag)
  }
}

function onDrag(e: TouchEvent | MouseEvent) {
  if (!startY.value) return
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  const delta = clientY - startY.value
  translateY.value = Math.max(0, translateY.value + delta)
  startY.value = clientY
}

function endDrag() {
  const closest = snapPoints.value.reduce((prev, curr, idx) => {
    return Math.abs(curr - translateY.value) < Math.abs(snapPoints.value[prev] - translateY.value)
      ? idx
      : prev
  }, currentSnapIndex.value)

  // Close if pulled beyond screen
  if (translateY.value > window.innerHeight * 0.85) {
    closeSheet()
  } else {
    updateTranslateY(closest)
  }

  startY.value = 0
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', endDrag)
}

// Lock/unlock body scroll
function lockBodyScroll() {
  document.body.style.overflow = 'hidden'
}

function unlockBodyScroll() {
  document.body.style.overflow = ''
}

onMounted(() => {
  if (props.visible) lockBodyScroll()
})
onBeforeUnmount(() => {
  unlockBodyScroll()
})
</script>
