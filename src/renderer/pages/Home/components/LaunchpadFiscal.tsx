//--------------------------------------------------------------------
// LAUNCHPAD FISCAL - Vista de grade de ícones estilo macOS
// Componente que exibe os módulos de documentos fiscais
// Como um Launchpad do macOS com fundo translúcido e animações
//--------------------------------------------------------------------

import React, { useState } from 'react';
import { systemColors, systemStyles } from '../../../styles/systemStyle';
import { useClickSound } from '../../../hooks/useClickSound';
import { AppIcons } from '../../../components/Icons/AppIcons';

interface LaunchpadFiscalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDocument: (documentId: string) => void;
}

export function LaunchpadFiscal({ isOpen, onClose, onSelectDocument }: LaunchpadFiscalProps): JSX.Element | null {
  const playClickSound = useClickSound();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Injetar animações CSS quando o componente montar
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInScale {
        0% {
          opacity: 0;
          transform: scale(0.8);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
    `;
    if (!document.head.querySelector('style[data-launchpad-fiscal]')) {
      style.setAttribute('data-launchpad-fiscal', 'true');
      document.head.appendChild(style);
    }
    return () => {
      const existingStyle = document.head.querySelector('style[data-launchpad-fiscal]');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const documents = [
    {
      id: 'nfe',
      title: 'NF-e',
      icon: AppIcons.Invoice,
      color: systemColors.selection.blue
    },
    {
      id: 'nfce',
      title: 'NFC-e',
      icon: AppIcons.Users,
      color: systemColors.selection.blue
    },
    {
      id: 'mdfe',
      title: 'MDF-e',
      icon: AppIcons.Truck,
      color: systemColors.selection.blue
    },
    {
      id: 'nfse',
      title: 'NFS-e',
      icon: AppIcons.File,
      color: systemColors.selection.blue
    },
    {
      id: 'settings',
      title: 'Configurações',
      icon: AppIcons.Settings,
      color: systemColors.selection.blue
    }
  ];

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      playClickSound();
      onClose();
    }
  };

  const handleDocumentClick = (documentId: string) => {
    playClickSound();
    onSelectDocument(documentId);
    onClose();
  };

  return (
    <div style={{
      ...systemStyles.launchpad.overlay,
      ...(isAnimating ? systemStyles.launchpad.overlayAnimated : {})
    }} onClick={handleOverlayClick}>
      <div style={{
        ...systemStyles.launchpad.container,
        ...(isAnimating ? systemStyles.launchpad.containerAnimated : systemStyles.launchpad.containerInitial)
      }}>
        <div style={systemStyles.launchpad.grid}>
          {documents.map((document, index) => {
            const Icon = document.icon;
            const isHovered = hoveredIndex === index;
            
            return (
              <div
                key={document.id}
                style={{
                  ...systemStyles.launchpad.iconContainer,
                  ...(isHovered ? systemStyles.launchpad.iconContainerHover : {}),
                  ...(activeIndex === index ? systemStyles.launchpad.iconContainerActive : {})
                }}
                onClick={() => handleDocumentClick(document.id)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  setActiveIndex(null);
                }}
                onMouseDown={() => setActiveIndex(index)}
                onMouseUp={() => setActiveIndex(null)}
              >
                <div style={systemStyles.launchpad.iconWrapper}>
                  <Icon size={64} color={'#FFFFFF'} />
                </div>
                <div style={systemStyles.launchpad.iconLabel}>{document.title}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
