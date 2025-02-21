import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export function useAudioPlayer(audioElement: Ref<HTMLAudioElement | null>) {
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(1)

  const togglePlay = () => {
    if (!audioElement.value) return

    if (isPlaying.value) {
      audioElement.value.pause()
    } else {
      audioElement.value.play()
    }
  }

  const setVolume = (value: number) => {
    if (!audioElement.value) return
    volume.value = value
    audioElement.value.volume = value
  }

  const seek = (value: number) => {
    if (!audioElement.value) return
    audioElement.value.currentTime = value
  }

  const updateTime = () => {
    if (!audioElement.value) return
    currentTime.value = audioElement.value.currentTime
  }

  const updateDuration = () => {
    if (!audioElement.value) return
    duration.value = audioElement.value.duration
  }

  const handlePlay = () => {
    isPlaying.value = true
  }

  const handlePause = () => {
    isPlaying.value = false
  }

  onMounted(() => {
    if (!audioElement.value) return

    audioElement.value.addEventListener('timeupdate', updateTime)
    audioElement.value.addEventListener('loadedmetadata', updateDuration)
    audioElement.value.addEventListener('play', handlePlay)
    audioElement.value.addEventListener('pause', handlePause)
  })

  onUnmounted(() => {
    if (!audioElement.value) return

    audioElement.value.removeEventListener('timeupdate', updateTime)
    audioElement.value.removeEventListener('loadedmetadata', updateDuration)
    audioElement.value.removeEventListener('play', handlePlay)
    audioElement.value.removeEventListener('pause', handlePause)
  })

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    setVolume,
    seek
  }
}
