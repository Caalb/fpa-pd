<script setup lang="ts">
import LCSAnalyzer from "./components/LCSAnalyzer.vue";
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50"
  >
    <header
      class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10"
    >
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">
            Análise de Subsequências Comuns
          </h1>

          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Sincronização de dados complexos usando Programação Dinâmica e
            Backtracking
          </p>

          <div
            class="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500"
          >
            <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
              >Programação Dinâmica</span
            >
            <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full"
              >Backtracking</span
            >
            <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full"
              >LCS Algorithm</span
            >
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8">
      <LCSAnalyzer />
    </main>

    <footer class="bg-gray-50 border-t border-gray-200 mt-16">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="text-center text-sm text-gray-600">
          <p class="mb-2">
            <strong>
              Trabalho de Fundamentos de Projeto e Análise de Algoritmos
            </strong>
          </p>

          <p>
            Implementação de algoritmos para encontrar todas as subsequências
            comuns mais longas
          </p>

          <div class="mt-4 space-x-6">
            <span>✨ Vue 3 + TypeScript</span>
            <span>🎯 Algoritmos otimizados e legíveis</span>
            <span>📊 Visualização interativa do processo</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
* {
  transition: all 0.2s ease-in-out;
}
</style>
