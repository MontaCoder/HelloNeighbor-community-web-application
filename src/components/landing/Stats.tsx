export const Stats = () => {
  return (
    <div className="bg-primary py-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-4 gap-8 text-center">
        <div className="text-white">
          <div className="text-4xl font-bold mb-2">99%</div>
          <div className="text-sm opacity-80">Community Satisfaction</div>
        </div>
        <div className="text-white">
          <div className="text-4xl font-bold mb-2">1.2k</div>
          <div className="text-sm opacity-80">Active Members</div>
        </div>
        <div className="text-white">
          <div className="text-4xl font-bold mb-2">125+</div>
          <div className="text-sm opacity-80">Monthly Events</div>
        </div>
        <div className="text-white">
          <div className="text-4xl font-bold mb-2">10%</div>
          <div className="text-sm opacity-80">Growth Rate</div>
        </div>
      </div>
    </div>
  );
};