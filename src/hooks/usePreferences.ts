import { useState, useEffect } from 'react';
import { UserPreferences } from '../types/document';
import { getPreferences, savePreferences } from '../lib/ipc';
import { applyTheme } from '../lib/themes';

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'system',
    fontSize: 15,
    fontFamily: 'sans-serif',
    readingWidth: 'adaptive',
    isOutlinePinned: false,
    recentFiles: []
  });

  useEffect(() => {
    getPreferences().then((loaded) => {
      setPreferences(loaded);
      applyTheme(loaded.theme);
    });
  }, []);

  const updatePreferences = async (updater: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...updater };
    setPreferences(updated);
    if (updater.theme) {
      applyTheme(updater.theme);
    }
    await savePreferences(updated);
  };

  return { preferences, updatePreferences };
}
