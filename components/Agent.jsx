import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const CallStatus = Object.freeze({
  INACTIVE: "INACTIVE",
  CONNECTING: "CONNECTING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED"
});

// --- Dummy Data ---
const messages = [
  'What is your name',
  'My name is John Doe, nice to meet you'
];
const lastMessage = messages[messages.length - 1];

const Agent = ({ userName }) => {
  const isSpeaking = true;
  const callStatus = CallStatus.FINISHED;

  return (
    <div className="flex flex-col gap-8 w-full items-center">
      {/* 1. Avatars View */}
      <div className="call-view">
        {/* AI Interviewer Section */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="vapi"
              width={65}
              height={54}
              className="object-cover"
              priority
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Section */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="user avatar"
              width={120}
              height={120}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {/* 2. Transcript Section */}
      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                'transition-opacity duration-500 opacity-0',
                'animate-fadeIn opacity-100'
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      {/* 3. Call Controls Section */}
      <div className="w-full flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button className="relative btn-call">
            <span 
              className={cn(
                'absolute animate-ping rounded-full opacity-75', 
                callStatus !== CallStatus.CONNECTING && 'hidden'
              )} 
            />
            <span>
              {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED 
                ? 'Call' 
                : '. . .'}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect">
            End
          </button>
        )}
      </div>
    </div>
  );
};

export default Agent;