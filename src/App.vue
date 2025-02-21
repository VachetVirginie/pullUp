<script setup lang="ts">
import AudioPlayer from './components/AudioPlayer.vue'
import ThemeSwitch from './components/ThemeSwitch.vue'
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>PullUp</h1>
      <p>Efface le stress, amplifie les vibes</p>
    </header>
    
    <main>
      <AudioPlayer />
    </main>
    <ThemeSwitch />
  </div>
</template>

<style>
@import url('https://fonts.cdnfonts.com/css/clash-display');
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

:root {
  --transition-timing: 0.3s ease;
  --font-heading: 'Clash Display', sans-serif;
  --font-body: 'Space Grotesk', sans-serif;
}

/* Thème clair par défaut */
:root {
  /* Background and surfaces */
  --bg-primary: #FFFCF5; /* Ivoire très clair */
  --bg-gradient: linear-gradient(135deg, #FFFCF5 0%, #F7F2E3 100%);
  --card-bg: #EBE5D3; /* Ivoire plus sombre */
  --card-elevated: #E5DECA; /* Encore plus sombre */
  --card-higher: #DFD7C0; /* Plus profond */
  --card-highest: #D8CFB6; /* Le plus sombre */
  --card-shadow: rgba(157, 143, 110, 0.15);
  
  /* Text */
  --text-primary: rgba(66, 58, 44, 0.87); /* Brun chaud */
  --text-secondary: rgba(66, 58, 44, 0.60);
  --text-disabled: rgba(66, 58, 44, 0.38);
  
  /* Interactive */
  --hover-bg: var(--card-highest);
  --button-primary: #7D8A71;
  --button-secondary: #9D8F6E; /* Ton plus chaud */
  --button-hover: #94A187;
  --button-secondary-hover: #B5A686; /* Version plus claire */
  --button-disabled: rgba(66, 58, 44, 0.12);
  
  /* States */
  --overlay-hover: rgba(157, 143, 110, 0.04);
  --overlay-focus: rgba(157, 143, 110, 0.08);
  --overlay-pressed: rgba(157, 143, 110, 0.12);
  --overlay-selected: rgba(157, 143, 110, 0.12);
  
  /* Error states */
  --error-bg: rgba(125, 138, 113, 0.12);
  --error-text: #7D8A71;
}

/* Thème sombre */
.dark-theme {
  /* Background and surfaces */
  --bg-primary: #121212;
  --bg-gradient: linear-gradient(135deg, #121212 0%, #171717 100%);
  --card-bg: #1E1E1E;
  --card-elevated: #242424;
  --card-higher: #282828;
  --card-highest: #2C2C2C;
  --card-shadow: rgba(0, 0, 0, 0.25);
  
  /* Text */
  --text-primary: rgba(255, 255, 255, 0.87);
  --text-secondary: rgba(255, 255, 255, 0.60);
  --text-disabled: rgba(255, 255, 255, 0.38);
  
  /* Interactive */
  --hover-bg: var(--card-highest);
  --button-primary: #94A187;
  --button-secondary: #D4C9B0;
  --button-hover: #7D8A71;
  --button-secondary-hover: #BFB59B;
  --button-disabled: rgba(255, 255, 255, 0.12);
  
  /* States */
  --overlay-hover: rgba(255, 255, 255, 0.06);
  --overlay-focus: rgba(255, 255, 255, 0.08);
  --overlay-pressed: rgba(255, 255, 255, 0.12);
  --overlay-selected: rgba(255, 255, 255, 0.12);
  
  /* Error states */
  --error-bg: rgba(148, 161, 135, 0.12);
  --error-text: #94A187;
}

body {
  margin: 0;
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--bg-gradient);
  color: var(--text-primary);
  min-height: 100vh;
  transition: background-color var(--transition-timing),
    color var(--transition-timing);
}

/* Styles communs */
.sound-button {
  background: var(--card-bg);
  transition: all 0.3s ease;
  border: 1px solid var(--card-shadow);
}

.sound-button:hover:not(:disabled) {
  background: var(--card-elevated);
  transform: translateX(8px);
}

.sound-button:active {
  background: var(--card-higher);
}

.sound-button.active {
  background: var(--button-secondary);
  color: #FFFFFF;
  border: none;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.play-button {
  background: var(--button-secondary);
  color: #FFFFFF;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.play-button:hover:not(:disabled) {
  background: var(--button-secondary-hover);
  transform: scale(1.05);
}

.progress {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--card-elevated);
  border-radius: 3px;
  outline: none;
  margin: 1rem 0;
  cursor: pointer;
  position: relative;
  display: block;
}

.progress::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--button-primary);
  border-radius: 50%;
  border: 2px solid var(--bg-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: -6px; /* Ajustement vertical plus précis */
  position: relative;
  z-index: 2;
}

.progress::-webkit-slider-thumb:hover {
  background: var(--button-hover);
  transform: scale(1.1);
}

.progress::-webkit-slider-runnable-track {
  width: 100%;
  height: 6px;
  background: var(--card-elevated);
  border-radius: 3px;
  border: none;
  outline: none;
  cursor: pointer;
}

/* Pour Firefox */
.progress::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: var(--button-primary);
  border-radius: 50%;
  border: 2px solid var(--bg-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px var(--card-shadow);
}

.progress::-moz-range-thumb:hover {
  background: var(--button-hover);
  transform: scale(1.1);
}

.progress::-moz-range-track {
  height: 6px;
  background: var(--card-elevated);
  border-radius: 3px;
  border: none;
  outline: none;
  cursor: pointer;
}

.volume {
  width: 100px;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--card-elevated);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  position: relative;
  display: block;
}

.volume::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: var(--button-primary);
  border-radius: 50%;
  border: 2px solid var(--bg-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: -4px;
  position: relative;
  z-index: 2;
}

.volume::-webkit-slider-thumb:hover {
  background: var(--button-hover);
  transform: scale(1.1);
}

.volume::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  background: var(--card-elevated);
  border-radius: 2px;
  border: none;
  outline: none;
  cursor: pointer;
}

/* Pour Firefox */
.volume::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: var(--button-primary);
  border-radius: 50%;
  border: 2px solid var(--bg-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.volume::-moz-range-thumb:hover {
  background: var(--button-hover);
  transform: scale(1.1);
}

.volume::-moz-range-track {
  height: 4px;
  background: var(--card-elevated);
  border-radius: 2px;
  border: none;
  outline: none;
  cursor: pointer;
}

.loading-message {
  color: var(--button-primary);
}

/* Effets subtils */
.sound-button.active,
.play-button {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.sound-button.active:hover,
.play-button:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.app {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 4rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.header p {
  margin: 0;
  font-family: var(--font-body);
  font-size: 1.25rem;
  font-weight: 400;
  letter-spacing: 0.01em;
  color: var(--text-secondary);
  line-height: 1.4;
}

main {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 24px var(--card-shadow);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  transform: translateY(0);
}

main:hover {
  transform: translateY(-5px);
  background: var(--card-elevated);
}

.theme-switch {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--card-bg);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px var(--card-shadow);
  border: 1px solid rgba(157, 143, 110, 0.1);
  outline: none;
}

.theme-switch:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--bg-primary), 0 0 0 4px var(--button-secondary);
}

.theme-switch:hover {
  transform: translateY(-2px) scale(1.05);
  background: var(--card-elevated);
  box-shadow: 0 4px 12px var(--card-shadow);
}

.theme-switch:active {
  transform: translateY(0) scale(0.98);
}

.theme-switch svg {
  width: 24px;
  height: 24px;
  transition: all 0.3s ease;
}

.theme-switch:hover svg {
  transform: rotate(15deg);
}

/* Animation pour le changement d'icône */
.theme-switch .icon-enter-active,
.theme-switch .icon-leave-active {
  transition: all 0.3s ease;
  position: absolute;
}

.theme-switch .icon-enter-from {
  opacity: 0;
  transform: rotate(-30deg) scale(0.7);
}

.theme-switch .icon-leave-to {
  opacity: 0;
  transform: rotate(30deg) scale(0.7);
}

/* Styles spécifiques pour le thème sombre */
.dark-theme .theme-switch {
  border-color: rgba(255, 255, 255, 0.1);
}
</style>
