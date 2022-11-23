import { useCallback } from 'react';
import Particles from 'react-particles';
import { loadFull } from 'tsparticles';

export default () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fps_limit: 60,
        particles: {
          color: { value: '#ffffff' },
          links: {
            color: '#ffffff',
            distance: 150,
            enable: true,
            opacity: 0.8,
            width: 1,
          },
          move: {
            bounce: false,
            direction: 'none',
            enable: true,
            outMode: 'out',
            random: false,
            speed: 1,
            straight: false,
          },
          number: { density: { enable: true, area: 800 }, value: 80 },
          opacity: { value: 0.8 },
          shape: { type: 'circle' },
          size: { random: true, value: 5 },
        },
        detectRetina: true,
      }}
    />
  );
};
