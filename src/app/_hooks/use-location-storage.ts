'use client';

import { useSyncExternalStore, useCallback, useEffect } from 'react';

function dispatchStorageEvent(key: string, newValue: string | null) {
  window.dispatchEvent(new StorageEvent('storage', { key, newValue }));
}

const removeLocalStorageItem = (key: string) => {
  window.localStorage.removeItem(key);
  dispatchStorageEvent(key, null);
};

const getLocalStorageItem = (key: string): string | null => {
  return window.localStorage.getItem(key);
};

const setLocalStorageItem = <T>(key: string, value: T) => {
  const stringifiedValue = JSON.stringify(value);
  window.localStorage.setItem(key, stringifiedValue);
  dispatchStorageEvent(key, stringifiedValue);
};

const useLocalStorageSubscribe = (callback: (this: Window, ev: StorageEvent) => unknown) => {
  window.addEventListener('storage', callback);

  return () => window.removeEventListener('storage', callback);
};

export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const getSnapshot = () => getLocalStorageItem(key);

  const store = useSyncExternalStore<string | null>(useLocalStorageSubscribe, getSnapshot, () => JSON.stringify(initialValue));

  const setState = useCallback(
    (v: T | ((val: T) => T)) => {
      try {
        const nextState = typeof v === 'function' && store !== null ? (v as (val: T) => T)(JSON.parse(store)) : v;

        if (store === null || nextState === undefined || nextState === null) {
          removeLocalStorageItem(key);
        } else {
          setLocalStorageItem(key, nextState);
        }
      } catch (e) {
        console.warn(e);
      }
    },
    [key, store]
  );

  useEffect(() => {
    if (getLocalStorageItem(key) === null && typeof initialValue !== 'undefined') {
      setLocalStorageItem(key, initialValue);
    }
  }, [key, initialValue]);

  const value = store ? (JSON.parse(store) as T) : null;

  return [value ?? initialValue, setState];
}
