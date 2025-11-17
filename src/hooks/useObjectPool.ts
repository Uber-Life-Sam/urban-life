import { useState, useCallback, useRef } from 'react';

export interface PooledObject<T> {
  id: string;
  data: T;
  active: boolean;
}

export function useObjectPool<T>(
  initialSize: number,
  createObject: (index: number) => T
) {
  const [pool] = useState<PooledObject<T>[]>(() => 
    Array.from({ length: initialSize }, (_, i) => ({
      id: `pooled-${i}`,
      data: createObject(i),
      active: false
    }))
  );

  const activeCountRef = useRef(0);

  const acquire = useCallback((updateData?: (obj: T) => void): PooledObject<T> | null => {
    const available = pool.find(obj => !obj.active);
    if (available) {
      available.active = true;
      activeCountRef.current++;
      if (updateData) {
        updateData(available.data);
      }
      return available;
    }
    return null;
  }, [pool]);

  const release = useCallback((id: string) => {
    const obj = pool.find(o => o.id === id);
    if (obj && obj.active) {
      obj.active = false;
      activeCountRef.current--;
    }
  }, [pool]);

  const getActive = useCallback(() => {
    return pool.filter(obj => obj.active);
  }, [pool]);

  const releaseAll = useCallback(() => {
    pool.forEach(obj => {
      obj.active = false;
    });
    activeCountRef.current = 0;
  }, [pool]);

  return {
    acquire,
    release,
    getActive,
    releaseAll,
    totalSize: pool.length,
    activeCount: activeCountRef.current
  };
}
