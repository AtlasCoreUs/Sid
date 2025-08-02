import React from 'react';
import NoteSidebar from '../components/NoteSidebar';

export default function Home() {
  return (
    <>
      <main style={{ padding: '2rem' }}>
        <h1>SID HUD</h1>
        <p>Bienvenue sur votre tableau de bord vivant.</p>
      </main>
      <NoteSidebar />
    </>
  );
}
