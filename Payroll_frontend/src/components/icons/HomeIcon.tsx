import React from 'react';

export const HomeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#d9480f' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.985 3.118a2.769 2.769 0 013.572 0l8.309 7.01a2.769 2.769 0 01.984 2.117v12.066A2.154 2.154 0 0123.7 26.465H20a2.154 2.154 0 01-2.154-2.154V18.157a.923.923 0 00-.923-.923H12.617a.923.923 0 00-.923.923v6.155A2.154 2.154 0 019.54 26.465H5.847a2.154 2.154 0 01-2.154-2.154V12.245a2.77 2.77 0 01.984-2.117z"
      transform="translate(-2.771 -2.465)"
      fill={color}
    />
  </svg>
);