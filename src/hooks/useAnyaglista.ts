'use client';
import { useSyncExternalStore } from 'react';
import { subscribe, getItems, getServerSnapshot, totalCount, type AnyaglistaTetel } from '@/lib/anyaglistaStore';

export function useAnyaglista(): AnyaglistaTetel[] {
  return useSyncExternalStore(subscribe, getItems, getServerSnapshot);
}

export function useAnyaglistaCount(): number {
  const items = useAnyaglista();
  return items.reduce((sum, i) => sum + i.mennyiseg, 0);
}

export { totalCount };
