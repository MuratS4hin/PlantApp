import { useEffect } from 'react';

export const UseGoogleFonts = () => {
  useEffect(() => {
    const fontFamilies = [
      'Lexend:wght@400;500;700;900',
      'Noto+Sans:wght@400;500;700;900',
    ];
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamilies.join('&family=')}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const materialIconsLink = document.createElement('link');
    materialIconsLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined';
    materialIconsLink.rel = 'stylesheet';
    document.head.appendChild(materialIconsLink);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(materialIconsLink);
    };
  }, []);
};
