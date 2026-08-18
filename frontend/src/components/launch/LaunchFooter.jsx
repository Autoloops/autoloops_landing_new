import React from 'react';

const LaunchFooter = () => {
  return (
    <footer className="bg-[#fbfaf7]">
      <div className="flex items-center justify-between px-6 py-4 font-jetbrains text-[10.5px] text-[#888] md:px-8">
        <span>© 2026 autoloops</span>
        <a
          href="https://discord.gg/eNXJwHwYk8"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#888] hover:text-[#0d7a3f]"
        >
          discord
        </a>
      </div>
    </footer>
  );
};

export default LaunchFooter;
