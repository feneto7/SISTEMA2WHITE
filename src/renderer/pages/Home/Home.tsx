import React from 'react';
import { TopMenu } from './components/TopMenu';
import { DockMenu } from './components/DockMenu';

export function Home(): JSX.Element {
  return (
    <div style={layoutRoot}>
      <TopMenu />
      
      <div style={contentArea}>
        <h1 style={{ margin: 0, fontWeight: 600 }}>Bem-vindo</h1>
        <p style={{ opacity: 0.8 }}>Página inicial do sistema</p>
      </div>

      <DockMenu />
    </div>
  );
}

const layoutRoot: React.CSSProperties = {
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'var(--bg-blur)'
};

const contentArea: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  backdropFilter: 'blur(20px) saturate(140%)',
  color: 'var(--text-primary)',
  padding: '20px'
};



