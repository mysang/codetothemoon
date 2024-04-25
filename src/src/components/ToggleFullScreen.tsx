import { useState, useEffect } from 'react';
import Button from './Button';
import PointingOut from './icons/PointingOut';
import PointingIn from './icons/PointingIn';

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
    document.addEventListener('fullscreenchange', (e) => {
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
