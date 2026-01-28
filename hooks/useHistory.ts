import { useState, useCallback, useRef } from "react";

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UseHistoryReturn<T> {
  state: T;
  setState: (newState: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  reset: (newState: T) => void;
  clearHistory: () => void;
}

/**
 * Custom hook for managing undo/redo state
 * @param initialState - Initial state value
 * @param maxHistorySize - Maximum number of history items to keep (default: 50)
 */
export function useHistory<T>(
  initialState: T,
  maxHistorySize: number = 50
): UseHistoryReturn<T> {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  // Keep track of initial state to prevent undo past it
  const initialStateRef = useRef<T>(initialState);

  const setState = useCallback(
    (newState: T | ((prev: T) => T)) => {
      setHistory((current) => {
        const newPresent =
          typeof newState === "function"
            ? (newState as (prev: T) => T)(current.present)
            : newState;

        // Don't add to history if state hasn't changed
        if (newPresent === current.present) {
          return current;
        }

        // Add current state to past and update present
        const newPast = [...current.past, current.present];
        
        // Limit history size
        if (newPast.length > maxHistorySize) {
          newPast.shift();
        }

        return {
          past: newPast,
          present: newPresent,
          future: [], // Clear future when new state is set
        };
      });
    },
    [maxHistorySize]
  );

  const undo = useCallback(() => {
    setHistory((current) => {
      // Can't undo if no history OR if we're already at initial state
      if (current.past.length === 0 || current.present === initialStateRef.current) {
        return current;
      }

      const previous = current.past[current.past.length - 1];
      const newPast = current.past.slice(0, current.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [current.present, ...current.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((current) => {
      if (current.future.length === 0) {
        return current;
      }

      const next = current.future[0];
      const newFuture = current.future.slice(1);

      return {
        past: [...current.past, current.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const reset = useCallback((newState: T) => {
    // Update the initial state ref to the new state
    initialStateRef.current = newState;
    setHistory({
      past: [],
      present: newState,
      future: [],
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory((current) => ({
      past: [],
      present: current.present,
      future: [],
    }));
  }, []);

  return {
    state: history.present,
    setState,
    undo,
    redo,
    canUndo: history.past.length > 0 && history.present !== initialStateRef.current,
    canRedo: history.future.length > 0,
    reset,
    clearHistory,
  };
}
