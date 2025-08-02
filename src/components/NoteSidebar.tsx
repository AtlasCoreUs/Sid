import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'sid_notes';

/**
 * A floating sidebar placed on the right side of the viewport.
 * The sidebar expands when the user hovers over it, allowing them to write notes.
 * Notes are saved to localStorage so they persist between sessions.
 */
export default function NoteSidebar() {
  const [note, setNote] = useState('');

  // Load saved note on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setNote(saved);
  }, []);

  // Persist note whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, note);
  }, [note]);

  return (
    <aside className="sid-note-sidebar">
      <h3 className="sid-note-sidebar__title">Notes</h3>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Écrivez vos notes ici..."
      />
    </aside>
  );
}