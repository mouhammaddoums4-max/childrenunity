"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  defaultCurrency,
  detectCurrency,
  isCurrencyCode,
  type CurrencyCode,
} from "@/lib/currency";

const STORAGE_KEY = "cuf.currency";

/**
 * Devise courante, partagée par tout le site (module de don, montants de
 * parrainage). Un simple module plutôt qu'un contexte React : n'importe
 * quel composant peut la lire sans que la mise en page ait à l'envelopper.
 *
 * `useSyncExternalStore` sert ici à distinguer le rendu serveur — toujours
 * en francs guinéens, la devise par défaut — du rendu navigateur, où la
 * devise retenue du visiteur ou celle de son pays prend le relais, sans
 * décalage d'hydratation.
 */
let current: CurrencyCode | null = null;
const listeners = new Set<() => void>();

function read(): CurrencyCode {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && isCurrencyCode(stored)) return stored;
  } catch {
    /* Stockage indisponible (navigation privée) : on déduit à chaque fois. */
  }
  return detectCurrency();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): CurrencyCode {
  if (current === null) current = read();
  return current;
}

function getServerSnapshot(): CurrencyCode {
  return defaultCurrency;
}

function write(code: CurrencyCode): void {
  current = code;
  try {
    window.localStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* Le choix vaut alors pour la session en cours seulement. */
  }
  for (const listener of listeners) listener();
}

export function useCurrency(): [CurrencyCode, (code: CurrencyCode) => void] {
  const currency = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const setCurrency = useCallback((code: CurrencyCode) => write(code), []);
  return [currency, setCurrency];
}
