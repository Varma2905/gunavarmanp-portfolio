export function AnimatedGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#e624290f_1px,transparent_1px),linear-gradient(to_bottom,#e624290f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-cyber-cyan/15 via-cyber-purple/10 to-transparent blur-3xl pointer-events-none" />
    </div>
  );
}
