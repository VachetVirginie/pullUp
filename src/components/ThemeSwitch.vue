<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark-theme', isDark.value);
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

// Initialiser le thème depuis localStorage
onMounted(() => {
  // Récupérer la préférence utilisateur ou utiliser le thème clair par défaut
  const savedTheme = localStorage.getItem('theme');
  isDark.value = savedTheme === 'dark';
  document.documentElement.classList.toggle('dark-theme', isDark.value);
  
  // Vérifier les préférences système
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  if (!savedTheme && prefersDark.matches) {
    isDark.value = true;
    document.documentElement.classList.add('dark-theme');
  }
  
  // Écouter les changements de préférences système
  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      isDark.value = e.matches;
      document.documentElement.classList.toggle('dark-theme', isDark.value);
    }
  });
})

// Observer les changements de thème
// watch(isDark, (newValue) => {
//   toggleTheme()
// })
</script>

<template>
  <button class="theme-switch" @click="toggleTheme" :title="isDark ? 'Passer au thème clair' : 'Passer au thème sombre'">
    <Transition name="icon" mode="out-in">
      <svg v-if="isDark" key="sun" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <svg v-else key="moon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </Transition>
  </button>
</template>

<style scoped>
.theme-switch {
  position: fixed;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  padding: 0;
  line-height: 1;
}

.theme-switch svg {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.theme-switch:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.2);
}
</style>
