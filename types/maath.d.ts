declare module 'maath/random/dist/maath-random.esm' {
  export function inSphere(
    array: Float32Array,
    options?: { radius?: number; center?: [number, number, number] }
  ): Float32Array;
  
  export function inBox(
    array: Float32Array,
    options?: { sides?: [number, number, number]; center?: [number, number, number] }
  ): Float32Array;
  
  // Add other exports as needed
}

