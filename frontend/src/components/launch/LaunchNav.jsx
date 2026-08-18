import React from 'react';

const DISCORD_URL = 'https://discord.gg/eNXJwHwYk8';
const CALENDLY_URL = 'https://calendly.com/anirudh-autoloops/30min';

const LaunchNav = () => {
  return (
    <nav className="flex items-center justify-between border-b border-[#141414] bg-[#fbfaf7] px-6 py-4 md:px-8">
      <a href="/" className="text-[22px] font-extrabold leading-none tracking-[-0.03em] text-[#141414]" aria-label="Autoloops home">
        autoloops
      </a>
      <div className="flex items-baseline gap-6">
        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="border-b-2 border-transparent pb-0.5 font-jetbrains text-[14px] font-bold leading-none text-[#141414] hover:text-[#0d7a3f]"
        >
          Discord
        </a>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="border-b-2 border-[#0d7a3f] pb-0.5 font-jetbrains text-[14px] font-bold leading-none text-[#141414]"
        >
          Speak with Founder
        </a>
      </div>
    </nav>
  );
};

export default LaunchNav;
