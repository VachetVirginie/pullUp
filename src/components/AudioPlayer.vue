<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAudioPlayer } from '../composables/useAudioPlayer'

const audioElement = ref<HTMLAudioElement | null>(null)
const errorMessage = ref('')
const isLoading = ref(false)

const { 
  isPlaying,
  currentTime,
  duration,
  volume,
  togglePlay,
  setVolume,
  seek
} = useAudioPlayer(audioElement)

// Liste des sons (à remplacer par votre propre liste)
const sounds = ref([
  { 
    id: 1, 
    title: 'Vagues apaisantes', 
    url: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg'
  },
  {
    id: 2,
    title: 'Ruisseau tranquille',
    url: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg'
  },
])

const currentSound = ref(sounds.value[0])

const playSound = async (sound: typeof sounds.value[0]) => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    // Si un son est en cours de lecture, on l'arrête d'abord
    if (audioElement.value) {
      audioElement.value.pause()
      audioElement.value.currentTime = 0
    }

    currentSound.value = sound

    if (audioElement.value) {
      // Réinitialiser les gestionnaires d'événements
      audioElement.value.oncanplaythrough = null
      audioElement.value.onerror = null

      audioElement.value.src = sound.url
      
      // Attendre que le son soit chargé
      await new Promise((resolve, reject) => {
        if (!audioElement.value) return reject('No audio element')

        audioElement.value.oncanplaythrough = () => {
          console.log('Can play through')
          resolve(null)
        }

        audioElement.value.onerror = (e) => {
          const error = audioElement.value?.error
          let errorMsg = 'Erreur lors du chargement du son.'
          
          if (error) {
            switch (error.code) {
              case MediaError.MEDIA_ERR_ABORTED:
                errorMsg += ' La lecture a été annulée.'
                break
              case MediaError.MEDIA_ERR_NETWORK:
                errorMsg += ' Problème de réseau.'
                break
              case MediaError.MEDIA_ERR_DECODE:
                errorMsg += ' Le format du fichier n\'est pas supporté.'
                break
              case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMsg += ' La source audio n\'est pas accessible.'
                break
            }
            console.error('Media Error:', error.code, error.message)
          }
          
          errorMessage.value = errorMsg
          reject(new Error(errorMsg))
        }
      })

      const playPromise = audioElement.value.play()
      if (playPromise !== undefined) {
        await playPromise
        console.log('Audio started playing:', sound.title)
      }
    }
  } catch (error) {
    console.error('Error playing sound:', error)
    if (!errorMessage.value) {
      errorMessage.value = 'Erreur lors de la lecture du son. Veuillez réessayer.'
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (audioElement.value) {
    audioElement.value.addEventListener('error', (e) => {
      const error = audioElement.value?.error
      console.error('Audio error:', e, error)
      if (!errorMessage.value) {
        errorMessage.value = 'Erreur lors du chargement du son'
      }
      isLoading.value = false
    })
    
    audioElement.value.addEventListener('loadeddata', () => {
      console.log('Audio loaded successfully')
    })
  }
})
</script>

<template>
  <div class="audio-player">
    <audio 
      ref="audioElement" 
      :src="currentSound.url"
      preload="auto"
      @canplay="console.log('Can play audio')"
      @error="console.error('Audio error event')"
    ></audio>
    
    <div class="player-controls">
      <h2>{{ currentSound.title }}</h2>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div v-if="isLoading" class="loading-message">
        Chargement du son...
      </div>
      
      <div class="progress-bar">
        <input
          type="range"
          :value="currentTime"
          :max="duration"
          @input="(e) => seek(Number((e.target as HTMLInputElement).value))"
          class="progress"
          :disabled="isLoading"
        >
        <div class="time">
          {{ Math.floor(currentTime) }}s / {{ Math.floor(duration) }}s
        </div>
      </div>
      
      <div class="controls">
        <button 
          class="play-button" 
          @click="togglePlay"
          :disabled="!currentSound"
          :title="isPlaying ? 'Pause' : 'Play'"
        >
          <Transition name="icon" mode="out-in">
            <svg v-if="isPlaying" key="pause" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M8 5v14a1 1 0 01-2 0V5a1 1 0 112 0zm10 0v14a1 1 0 11-2 0V5a1 1 0 112 0z" />
            </svg>
            <svg v-else key="play" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M6.23 19.967A1.5 1.5 0 014 18.671V5.33a1.5 1.5 0 012.23-1.297l12.032 6.671a1.5 1.5 0 010 2.592L6.23 19.967z" />
            </svg>
          </Transition>
        </button>
        
        <input
          type="range"
          :value="volume"
          min="0"
          max="1"
          step="0.1"
          @input="(e) => setVolume(Number((e.target as HTMLInputElement).value))"
          class="volume"
          :disabled="isLoading"
        >
      </div>
    </div>
    
    <div class="sound-list">
      <button
        v-for="sound in sounds"
        :key="sound.id"
        @click="playSound(sound)"
        :class="{ 
          active: currentSound.id === sound.id,
          'is-loading': isLoading && currentSound.id === sound.id
        }"
        class="sound-button"
        :disabled="isLoading"
      >
        {{ sound.title }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.audio-player {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.error-message {
  color: var(--error-text);
  margin: 10px 0;
  padding: 15px;
  background: var(--error-bg);
  border-radius: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
}

.error-message::before {
  content: '⚠️';
}

.loading-message {
  color: var(--button-primary);
  margin: 10px 0;
  padding: 15px;
  background: var(--card-bg);
  border-radius: 12px;
  text-align: center;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.loading-message::before {
  content: '🎵';
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.player-controls {
  margin-bottom: 30px;
}

.player-controls h2 {
  color: var(--text-primary);
  font-weight: 500;
  text-align: center;
  margin-bottom: 25px;
  font-size: 1.5rem;
}

.progress-bar {
  margin: 25px 0;
}

.progress {
  width: 100%;
  margin-bottom: 10px;
  -webkit-appearance: none;
  height: 8px;
  background: var(--card-bg);
  border-radius: 4px;
  outline: none;
  cursor: pointer;
}

.progress:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}

.progress::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: var(--button-primary);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.progress::-webkit-slider-thumb:hover {
  background: var(--button-hover);
  transform: scale(1.1);
}

.time {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25px;
}

.play-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: var(--card-bg);
  border: 1px solid var(--card-shadow);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--text-primary);
}

.play-button:hover:not(:disabled) {
  background: var(--card-elevated);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--card-shadow);
}

.play-button:active {
  transform: translateY(0);
}

.play-button svg {
  width: 24px;
  height: 24px;
  transition: all 0.3s ease;
}

.play-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--card-bg);
}

.volume {
  width: 120px;
  -webkit-appearance: none;
  height: 6px;
  background: var(--card-bg);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.volume:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}

.volume::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  background: var(--button-primary);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.volume::-webkit-slider-thumb:hover {
  background: var(--button-hover);
  transform: scale(1.1);
}

.sound-list {
  display: grid;
  gap: 12px;
  margin-top: 35px;
}

.sound-button {
  padding: 18px;
  border: none;
  border-radius: 12px;
  background: var(--card-bg);
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 500;
  text-align: left;
  display: flex;
  align-items: center;
}

.sound-button:disabled {
  opacity: 0.38;
  cursor: not-allowed;
  background: var(--button-disabled);
  color: var(--text-disabled);
}

.sound-button::before {
  content: '🎧';
  margin-right: 12px;
  font-size: 1.3rem;
  opacity: 0.87;
}

.sound-button:hover:not(:disabled) {
  background: var(--card-elevated);
  transform: translateX(8px);
}

.sound-button:active {
  background: var(--card-higher);
}

.sound-button.active {
  background: var(--button-primary);
  color: #000000;
  transform: translateX(8px);
}

.sound-button.active::before {
  content: '🎶';
  opacity: 1;
}

.sound-button.is-loading {
  position: relative;
  overflow: hidden;
}

.sound-button.is-loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.16),
    transparent
  );
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
