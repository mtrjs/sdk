interface XMLHttpRequest {
  reporterCollect: Record<string, any>;
}

interface MemoryInfo {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

interface Performance {
  memory: MemoryInfo;
}

interface Document {
  prerendering: boolean;
}
