// import { useRef, useCallback } from "react";

// export const useDebouncedCallback = <T extends unknown[]>(
//   callback: (...args: T) => void,
//   delay: number
// ) => {
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);

//   return useCallback(
//     (...args: T) => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }

//       timeoutRef.current = setTimeout(() => {
//         callback(...args);
//       }, delay);
//     },
//     [callback, delay]
//   );
// };

import { useRef, useCallback, useEffect } from "react";

export const useDebouncedCallback = <T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};
