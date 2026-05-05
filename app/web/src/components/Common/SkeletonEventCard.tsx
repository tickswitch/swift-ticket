const shimmerStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.6s infinite',
};

const SkeletonEventCard: React.FC = () => (
  <>
    <style>{`
      @keyframes shimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
    <div className="rounded-2xl overflow-hidden w-full" style={{ height: 380 }}>
      {/* Image area — ~60% height */}
      <div style={{ ...shimmerStyle, height: '60%' }} />
      {/* Content area */}
      <div className="p-4 flex flex-col gap-3" style={{ height: '40%' }}>
        {/* Title line */}
        <div className="rounded" style={{ ...shimmerStyle, height: 20, width: '80%' }} />
        {/* Price line */}
        <div className="rounded" style={{ ...shimmerStyle, height: 16, width: '50%' }} />
        {/* Date / venue line */}
        <div className="rounded" style={{ ...shimmerStyle, height: 14, width: '65%' }} />
      </div>
    </div>
  </>
);

export const SkeletonEventCardRow: React.FC = () => (
  <div className="flex gap-6 pt-3 overflow-hidden">
    {[0, 1, 2, 3].map((i) => (
      <div key={i} className="flex-1 min-w-0">
        <SkeletonEventCard />
      </div>
    ))}
  </div>
);

export default SkeletonEventCard;
