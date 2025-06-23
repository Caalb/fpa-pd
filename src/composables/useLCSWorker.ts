/**
 * Composable para gerenciar Web Worker de LCS
 * Permite processamento em background sem travar a interface
 */

import { ref, onUnmounted } from "vue";

export interface DPResults {
  table: number[][];
  maxLength: number;
  oneLCS: string;
  complexity: string;
}

export interface BacktrackingResults {
  allLCS: string[];
  count: number;
  complexity: string;
  steps: any[];
  isValid: boolean;
}

export function useLCSWorker() {
  const isProcessing = ref(false);
  const processingMessage = ref("");
  const error = ref<string | null>(null);

  let worker: Worker | null = null;

  const initWorker = () => {
    if (worker) {
      worker.terminate();
    }

    worker = new Worker("/lcs-worker.js");

    worker.onmessage = (e) => {
      const { type, result, message, error: workerError } = e.data;

      if (type === "dpResult") {
        dpResultCallback?.(result);
      } else if (type === "backtrackingResult") {
        backtrackingResultCallback?.(result);
        isProcessing.value = false;
        processingMessage.value = "";
      } else if (type === "backtrackingProgress") {
        processingMessage.value = message;
      } else if (type === "error") {
        error.value = workerError;
        isProcessing.value = false;
        processingMessage.value = "";
      }
    };

    worker.onerror = (e) => {
      error.value = "Erro no Web Worker: " + e.message;
      isProcessing.value = false;
      processingMessage.value = "";
    };
  };

  let dpResultCallback: ((result: DPResults) => void) | null = null;
  let backtrackingResultCallback:
    | ((result: BacktrackingResults) => void)
    | null = null;

  const calculateDP = (
    string1: string,
    string2: string,
    callback: (result: DPResults) => void
  ) => {
    if (!worker) {
      initWorker();
    }

    error.value = null;
    dpResultCallback = callback;

    worker?.postMessage({
      type: "calculateDP",
      string1,
      string2,
    });
  };

  const calculateBacktracking = (
    string1: string,
    string2: string,
    callback: (result: BacktrackingResults) => void
  ) => {
    if (!worker) {
      initWorker();
    }

    error.value = null;
    isProcessing.value = true;
    processingMessage.value = "Preparando cálculo...";
    backtrackingResultCallback = callback;

    worker?.postMessage({
      type: "calculateBacktracking",
      string1,
      string2,
    });
  };

  const cancelProcessing = () => {
    if (worker) {
      worker.terminate();
      worker = null;
    }
    isProcessing.value = false;
    processingMessage.value = "";
    error.value = null;
  };

  onUnmounted(() => {
    if (worker) {
      worker.terminate();
    }
  });

  return {
    isProcessing: readonly(isProcessing),
    processingMessage: readonly(processingMessage),
    error: readonly(error),
    calculateDP,
    calculateBacktracking,
    cancelProcessing,
  };
}

function readonly<T>(ref: import("vue").Ref<T>) {
  return ref;
}
