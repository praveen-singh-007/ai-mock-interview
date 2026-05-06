'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { vapi } from '@/lib/vapi.sdk';

const CallStatus = Object.freeze({
  INACTIVE: "INACTIVE",
  CONNECTING: "CONNECTING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED"
});


const Agent = ({ userName, userId, type }) => {
  const router = useRouter()
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE)

  const [messages, setMessages] = useState([])

  useEffect(()=>{

    const onCallStart = () => setCallStatus(CallStatus.ACTIVE)
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED)

    const onMessage = (message) =>{
      if(message.type === 'transcript' && message.transcriptType === 'final'){

        const newMessage = {role : message.role, content : message.transcript}

        setMessages((prev)=> [...prev, newMessage])
    }
  }

    const onSpeechStart = ()=> setIsSpeaking(true)
    const onSpeechEnd = ()=> setIsSpeaking(false)

    const onError = (error)=> console.log(error)

    vapi.on('call-start', onCallStart)
    vapi.on('call-end', onCallEnd )
    vapi.on('message', onMessage)
    vapi.on('speech-start', onSpeechStart)
    vapi.on('speech-end', onSpeechEnd)
    vapi.on('error', onError)

    return()=>{
    vapi.off('call-start', onCallStart)
    vapi.off('call-end', onCallEnd )
    vapi.off('message', onMessage)
    vapi.off('speech-start', onSpeechStart)
    vapi.off('speech-end', onSpeechEnd)
    vapi.off('error', onError)
    }

},[])

  useEffect(()=>{
    if(callStatus === CallStatus.FINISHED){
      router.push("/")
    }
  },[callStatus])

  const handleCall = async () => {

  try {

    setCallStatus(
      CallStatus.CONNECTING
    );

    const response = await fetch(

      "/api/vapi/webcall",

      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({

          username: userName,

          userid: userId,

        }),

      }
    );

    const call =
      await response.json();

    console.log(
      "WEBCALL RESPONSE:",
      call
    );

    if (!response.ok) {

      setCallStatus(
        CallStatus.INACTIVE
      );

      return;
    }

    await vapi.start(call);

  } catch (error) {

    console.log(
      "VAPI START ERROR:",
      error
    );

    setCallStatus(
      CallStatus.INACTIVE
    );
  }
};
  
  const handleDisconnect = async() =>{
    setCallStatus(CallStatus.FINISHED)
    vapi.stop()
  }

  const lastMessage = messages[messages.length - 1]?.content;

  const isCallInActiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED
  


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
          <button className="relative btn-call" onClick={handleCall}>
            <span 
              className={cn(
                'absolute animate-ping rounded-full opacity-75', 
                callStatus !== CallStatus.CONNECTING && 'hidden'
              )} 
            />
            <span>
              {isCallInActiveOrFinished
                ? 'Call' 
                : '. . .'}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </div>
  );
};

export default Agent;