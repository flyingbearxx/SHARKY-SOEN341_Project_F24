import 'jest-canvas-mock';

// Mock document.visibilityState for Supabase
Object.defineProperty(document, "visibilityState", {
  value: "visible",
  writable: true,
});

