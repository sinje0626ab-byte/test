/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 빌드 결과는 레포 루트의 sleep/ 으로 내보낸다 → GitHub Pages test/sleep/
// base 를 './' 로 두면 어느 하위 경로에 올려도 자원 경로가 깨지지 않는다.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: '../sleep',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1200,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
