import React, { useState } from 'react';
import LaunchNav from '../components/launch/LaunchNav';
import LaunchFooter from '../components/launch/LaunchFooter';
import SpeakTestPanel from '../components/launch/SpeakTestPanel';
import InlineWaitlist from '../components/launch/InlineWaitlist';

const CAL_URL = 'https://calendly.com/anirudh-autoloops/30min';

const LandingPage = () => {
  const [emailOpen, setEmailOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="launch-page flex min-h-screen flex-col">
      <LaunchNav />

      <div className="grid flex-1 grid-cols-1 border-b border-[#141414] lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col justify-center border-b border-[#141414] px-6 py-16 md:px-8 md:py-[72px] md:pb-16 lg:border-b-0 lg:border-r">
          <div className="mb-5 flex items-center gap-2.5 font-jetbrains text-[14px] text-[#0d7a3f]">
            <span className="launch-new-badge bg-[#0d7a3f] px-2 py-1 font-extrabold text-[13px] leading-none tracking-wide text-white">
              NEW!
            </span>
            <span>[ Qwen3-ASR-1.7B available in private beta ]</span>
          </div>
          <h1 className="m-0 font-archivo text-[clamp(36px,4.2vw,54px)] font-extrabold leading-[1.02] tracking-[-0.035em] text-[#141414]">
            The world's best{' '}
            <span className="whitespace-nowrap border-b-4 border-[#0d7a3f]">open-source voice models.</span>
          </h1>
          <div className="mt-9 inline-flex self-start border border-[#141414]">
            <button
              type="button"
              onClick={() => setEmailOpen((open) => !open)}
              className={`cursor-pointer rounded-none border-0 px-[26px] py-3.5 font-archivo text-sm font-semibold text-[#fbfaf7] hover:bg-[#0d7a3f] ${
                emailOpen ? "bg-[#0d7a3f]" : "bg-[#141414]"
              }`}
            >
              Apply for beta
            </button>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border-l border-[#141414] px-[26px] py-3.5 font-archivo text-sm font-semibold text-[#141414] hover:bg-[rgba(13,122,63,.08)] hover:text-[#141414]"
            >
              Speak with Founder
            </a>
          </div>
          {emailOpen && (
            <InlineWaitlist
              email={email}
              setEmail={setEmail}
              sent={sent}
              setSent={setSent}
            />
          )}
        </div>

        <SpeakTestPanel />
      </div>

      <LaunchFooter />
    </div>
  );
};

export default LandingPage;
