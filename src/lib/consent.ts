"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Consentement du visiteur.
 *
 * `essential` couvre ce que le site ne peut pas faire sans : la langue et
 * la devise choisies. Ces préférences relèvent du fonctionnement demandé
 * par le visiteur lui-même et ne nécessitent pas d'accord préalable.
 *
 * `all` ajoute la mesure d'audience et le chargement de contenus tiers.
 * Tant que ce niveau n'est pas accordé, aucune ressource extérieure au
 * domaine n'est chargée — les vidéos YouTube restent derrière une vignette.
 *
 * `unknown` signifie que le visiteur n'a pas encore répondu : on se
 * comporte alors comme en `essential`, jamais comme en `all`.
 */
export type ConsentLevel = "unknown" | "essential" | "all";

const STORAGE_KEY = "cuf.consent";

let current: ConsentLevel | null = null;
const listeners = new Set<() => void>();

function read(): ConsentLevel {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "essential" || stored === "all") return stored;
  } catch {
    /* Stockage indisponible : on redemandera à la prochaine visite. */
  }
  return "unknown";
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ConsentLevel {
  if (current === null) current = read();
  return current;
}

/* Au rendu serveur, on ignore tout du visiteur : le bandeau n'apparaît
   qu'après hydratation, ce qui évite de l'afficher à quelqu'un qui a
   déjà répondu. */
function getServerSnapshot(): ConsentLevel {
  return "essential";
}

export function useConsent(): [ConsentLevel, (level: ConsentLevel) => void] {
  const level = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLevel = useCallback((next: ConsentLevel) => {
    current = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Le choix vaut alors pour la session en cours seulement. */
    }
    for (const listener of listeners) listener();
  }, []);

  return [level, setLevel];
}
