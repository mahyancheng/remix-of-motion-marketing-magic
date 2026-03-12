'use client';
import type React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type FallingPatternProps = React.ComponentProps<'div'> & {
  color?: string;
  duration?: number;
  density?: number;
};

/**
 * Matrix-style falling digital pattern.
 * Renders short dashes and dots (like binary/code rain) instead of long rain streaks.
 * Use with transparent background as a fixed overlay.
 */
export function FallingPattern({
  color = 'hsl(var(--accent))',
  duration = 180,
  density = 1,
  className,
}: FallingPatternProps) {
  // Short dashes (matrix-like) + tiny dots
  const generateBackgroundImage = () => {
    const patterns = [
      // Short vertical dashes (2px wide, 20-40px tall) — matrix streaks
      `radial-gradient(2px 24px at 0px 80px, ${color}, transparent)`,
      `radial-gradient(2px 24px at 300px 80px, ${color}, transparent)`,
      `radial-gradient(1px 1px at 150px 40px, ${color} 100%, transparent 150%)`,

      `radial-gradient(2px 18px at 0px 160px, ${color}, transparent)`,
      `radial-gradient(2px 18px at 300px 160px, ${color}, transparent)`,
      `radial-gradient(1px 1px at 150px 80px, ${color} 100%, transparent 150%)`,

      `radial-gradient(2px 30px at 0px 60px, ${color}, transparent)`,
      `radial-gradient(2px 30px at 300px 60px, ${color}, transparent)`,
      `radial-gradient(1px 1px at 150px 30px, ${color} 100%, transparent 150%)`,

      `radial-gradient(1.5px 16px at 0px 120px, ${color}, transparent)`,
      `radial-gradient(1.5px 16px at 300px 120px, ${color}, transparent)`,
      `radial-gradient(1px 1px at 150px 60px, ${color} 100%, transparent 150%)`,

      `radial-gradient(2px 22px at 0px 200px, ${color}, transparent)`,
      `radial-gradient(2px 22px at 300px 200px, ${color}, transparent)`,
      `radial-gradient(1px 1px at 150px 100px, ${color} 100%, transparent 150%)`,

      `radial-gradient(1.5px 28px at 0px 140px, ${color}, transparent)`,
      `radial-gradient(1.5px 28px at 300px 140px, ${color}, transparent)`,
      `radial-gradient(1px 1px at 150px 70px, ${color} 100%, transparent 150%)`,

      `radial-gradient(2px 20px at 0px 100px, ${color}, transparent)`,
      `radial-gradient(2px 20px at 300px 100px, ${color}, transparent)`,
      `radial-gradient(1px 1px at 150px 50px, ${color} 100%, transparent 150%)`,

      `radial-gradient(1.5px 14px at 0px 180px, ${color}, transparent)`,
      `radial-gradient(1.5px 14px at 300px 180px, ${color}, transparent)`,
      `radial-gradient(1px 1px at 150px 90px, ${color} 100%, transparent 150%)`,

      `radial-gradient(2px 26px at 0px 70px, ${color}, transparent)`,
      `radial-gradient(2px 26px at 300px 70px, ${color}, transparent)`,
      `radial-gradient(1px 1px at 150px 35px, ${color} 100%, transparent 150%)`,

      `radial-gradient(1.5px 18px at 0px 150px, ${color}, transparent)`,
      `radial-gradient(1.5px 18px at 300px 150px, ${color}, transparent)`,
      `radial-gradient(1px 1px at 150px 75px, ${color} 100%, transparent 150%)`,

      `radial-gradient(2px 22px at 0px 110px, ${color}, transparent)`,
      `radial-gradient(2px 22px at 300px 110px, ${color}, transparent)`,
      `radial-gradient(1px 1px at 150px 55px, ${color} 100%, transparent 150%)`,

      `radial-gradient(1.5px 20px at 0px 190px, ${color}, transparent)`,
      `radial-gradient(1.5px 20px at 300px 190px, ${color}, transparent)`,
      `radial-gradient(1px 1px at 150px 95px, ${color} 100%, transparent 150%)`,
    ];
    return patterns.join(', ');
  };

  const backgroundSizes = [
    '300px 80px', '300px 80px', '300px 80px',
    '300px 160px', '300px 160px', '300px 160px',
    '300px 60px', '300px 60px', '300px 60px',
    '300px 120px', '300px 120px', '300px 120px',
    '300px 200px', '300px 200px', '300px 200px',
    '300px 140px', '300px 140px', '300px 140px',
    '300px 100px', '300px 100px', '300px 100px',
    '300px 180px', '300px 180px', '300px 180px',
    '300px 70px', '300px 70px', '300px 70px',
    '300px 150px', '300px 150px', '300px 150px',
    '300px 110px', '300px 110px', '300px 110px',
    '300px 190px', '300px 190px', '300px 190px',
  ].join(', ');

  // Staggered start positions for organic feel
  const startPositions = [
    '0px 20px', '3px 20px', '151.5px 60px',
    '25px 10px', '28px 10px', '176.5px 50px',
    '50px 5px', '53px 5px', '201.5px 35px',
    '75px 30px', '78px 30px', '226.5px 60px',
    '100px 8px', '103px 8px', '251.5px 50px',
    '125px 25px', '128px 25px', '276.5px 55px',
    '150px 12px', '153px 12px', '301.5px 40px',
    '175px 35px', '178px 35px', '326.5px 70px',
    '200px 15px', '203px 15px', '351.5px 45px',
    '225px 28px', '228px 28px', '376.5px 60px',
    '250px 10px', '253px 10px', '401.5px 35px',
    '275px 18px', '278px 18px', '426.5px 50px',
  ].join(', ');

  // Varied end positions (different speeds per column)
  const endPositions = [
    '0px 4800px', '3px 4800px', '151.5px 4840px',
    '25px 8400px', '28px 8400px', '176.5px 8450px',
    '50px 3600px', '53px 3600px', '201.5px 3635px',
    '75px 9600px', '78px 9600px', '226.5px 9660px',
    '100px 3200px', '103px 3200px', '251.5px 3250px',
    '125px 5600px', '128px 5600px', '276.5px 5655px',
    '150px 6400px', '153px 6400px', '301.5px 6440px',
    '175px 8800px', '178px 8800px', '326.5px 8870px',
    '200px 9200px', '203px 9200px', '351.5px 9245px',
    '225px 11200px', '228px 11200px', '376.5px 11260px',
    '250px 3400px', '253px 3400px', '401.5px 3435px',
    '275px 4200px', '278px 4200px', '426.5px 4250px',
  ].join(', ');

  return (
    <div className={cn('relative h-full w-full', className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="size-full"
      >
        <motion.div
          className="relative size-full z-0"
          style={{
            backgroundImage: generateBackgroundImage(),
            backgroundSize: backgroundSizes,
          }}
          variants={{
            initial: { backgroundPosition: startPositions },
            animate: {
              backgroundPosition: [startPositions, endPositions],
              transition: {
                duration,
                ease: 'linear',
                repeat: Number.POSITIVE_INFINITY,
              },
            },
          }}
          initial="initial"
          animate="animate"
        />
      </motion.div>
      {/* Subtle dot-grid overlay for texture */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          backdropFilter: 'blur(0.4em)',
          backgroundImage: `radial-gradient(circle at 50% 50%, transparent 0, transparent 1.5px, transparent 1.5px)`,
          backgroundSize: `${6 * density}px ${6 * density}px`,
        }}
      />
    </div>
  );
}