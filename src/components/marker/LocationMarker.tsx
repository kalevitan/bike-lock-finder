export const LocationMarker = () => {
    const circle = document.createElement('div');
    circle.style.width = '20px';
    circle.style.height = '20px';
    circle.style.backgroundColor = '#FF6C64';
    circle.style.border = '2px solid white';
    circle.style.transition = 'all 0.3s ease';
    circle.style.borderRadius = '50%';
    circle.style.boxShadow = '0 0 4px rgba(0,0,0,0.3)';
    circle.style.animation = 'pulse 2s infinite';

    // Add the keyframes for the pulse animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.2);
        }
        100% {
          transform: scale(1);
        }
      }
    `;
    document.head.appendChild(style);

    return circle;
  };