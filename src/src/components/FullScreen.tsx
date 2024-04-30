import React, { useEffect, useState } from 'react';
import Button from './Button';
import PointingIn from './icons/PointingIn';
import PointingOut from './icons/PointingOut';

const ToggleFullScreen = () => {
  const [isFullScreen, setIsFullScreen] = useState(!!document.fullscreenElement);

  const handleClick = () => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement) {
        setIsFullScreen(true);
      } else {
        setIsFullScreen(false);
      }
    });
  }, []);

  return <Button onClick={handleClick}>{isFullScreen ? <PointingIn /> : <PointingOut />}</Button>;
};

export default ToggleFullScreen;
