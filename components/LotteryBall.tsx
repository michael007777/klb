import React from 'react';

interface LotteryBallProps {
  number: number;
  isHit?: boolean; // If the number matched the winning number
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LotteryBall: React.FC<LotteryBallProps> = ({ number, isHit = false, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base font-bold',
  };

  const baseClasses = "rounded-full flex items-center justify-center shadow-sm border border-opacity-20";
  
  // Colors: Happy 8 balls are usually reddish/pinkish.
  // If hit, we make it very bright/gold or deep red. If not hit but selected, standard red.
  const colorClasses = isHit
    ? 'bg-yellow-400 text-red-900 border-yellow-600 font-bold ring-2 ring-yellow-200'
    : 'bg-gradient-to-br from-red-500 to-pink-600 text-white border-red-700';

  return (
    <div className={`${baseClasses} ${sizeClasses[size]} ${colorClasses} ${className}`}>
      {number}
    </div>
  );
};