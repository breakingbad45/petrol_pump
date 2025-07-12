import React, { useState } from 'react';

function FullscreenToggle() {
  const [isFullscreen, setIsFullscreen] = useState(
    document.fullscreenElement || document.webkitFullscreenElement
  );

  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(document.fullscreenElement || document.webkitFullscreenElement);
  };

  React.useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <button
      className={`btn btn-sm bg-info bg-opacity-75 js-toggle-fullscreen-btn ${isFullscreen ? 'on' : ''}`}
      onClick={() => (isFullscreen ? exitFullscreen() : enterFullscreen())}
    >
      {isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
    </button>
  );
}

export default FullscreenToggle;