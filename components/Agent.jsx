'use client';

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import Image from 'next/image';

import { cn } from '@/lib/utils';

import { useRouter } from 'next/navigation';

const CallStatus = Object.freeze({
  INACTIVE: 'INACTIVE',
  ACTIVE: 'ACTIVE',
  FINISHED: 'FINISHED',
});

const Agent = ({
  userName,
  userId,
  type,
  questions = [],
  interviewId,
}) => {
  const router = useRouter();

  const recognitionRef =
    useRef(null);

  const isProcessingRef =
    useRef(false);

  const isListeningRef =
    useRef(false);

  const followUpCountRef =
  useRef(0);

  const isAISpeakingRef =
    useRef(false);

  const callStatusRef =
    useRef(CallStatus.INACTIVE);

  const silenceTimerRef =
    useRef(null);

  const noSpeechTimerRef =
    useRef(null);

  const transcriptBufferRef =
    useRef('');

  const lastQuestionRef =
    useRef('');

  const [callStatus, setCallStatus] =
    useState(CallStatus.INACTIVE);

  const [isUserSpeaking,
    setIsUserSpeaking] =
    useState(false);

  const [messages, setMessages] =
    useState([]);

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const [
    currentQuestionIndex,
    setCurrentQuestionIndex,
  ] = useState(0);

  const [answers, setAnswers] =
    useState([]);

  const [transcript, setTranscript] =
  useState([]);

  const lastMessage =
    messages[messages.length - 1];

  const currentQuestion =
    questions?.[
      currentQuestionIndex
    ];

  useEffect(() => {
    callStatusRef.current =
      callStatus;
  }, [callStatus]);

  useEffect(() => {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {

    alert(
      'Speech Recognition not supported'
    );

    return;
  }

  const recognition =
    new SpeechRecognition();

  recognition.continuous = true;

  recognition.interimResults = true;

  recognition.lang = 'en-US';

  // START LISTENING
  recognition.onstart = () => {

    isListeningRef.current =
      true;

    setIsUserSpeaking(true);

    clearTimeout(
      noSpeechTimerRef.current
    );

    noSpeechTimerRef.current =
      setTimeout(async () => {

        if (
          !transcriptBufferRef.current.trim() &&
          !isAISpeakingRef.current &&
          !isProcessingRef.current
        ) {

          recognition.stop();

          await speak(
            `I didn't catch that. ${lastQuestionRef.current}`
          );
        }

      }, 4000);
  };

  // STOP LISTENING
  recognition.onend = () => {

    isListeningRef.current =
      false;

    setIsUserSpeaking(false);
  };

  // ERROR
  recognition.onerror = (
    event
  ) => {

    isListeningRef.current =
      false;

    setIsUserSpeaking(false);

    console.log(
      'Speech error:',
      event
    );
  };

  // RESULTS
  recognition.onresult =
    async (event) => {

      // NEVER process while AI speaking
      if (
        isAISpeakingRef.current ||
        isProcessingRef.current
      ) {
        return;
      }

      clearTimeout(
        noSpeechTimerRef.current
      );

      let finalTranscript =
        '';

      for (
        let i =
          event.resultIndex;

        i <
        event.results.length;

        i++
      ) {

        finalTranscript +=
          event.results[i][0]
            .transcript + ' ';
      }

      transcriptBufferRef.current =
        finalTranscript.trim();

      clearTimeout(
        silenceTimerRef.current
      );

      // USER SILENCE DETECTION
      silenceTimerRef.current =
        setTimeout(async () => {

          const transcript =
            transcriptBufferRef.current.trim();

          // NO VALID SPEECH
          if (!transcript) {

            recognition.stop();

            return;
          }

          transcriptBufferRef.current =
            '';

          recognition.stop();

          const updatedMessages = [
            ...messages,

            {
              role: 'user',

              content:
                transcript,
            },
          ];

          setMessages(
            updatedMessages
          );

          if (
            type ===
            'interview'
          ) {

            await processInterviewAnswer(
              transcript
            );

          } else {

            await processConversation(
              updatedMessages
            );
          }

        }, 1500);
    };

  recognitionRef.current =
    recognition;

  return () => {

    recognition.stop();

    clearTimeout(
      silenceTimerRef.current
    );

    clearTimeout(
      noSpeechTimerRef.current
    );
  };

}, [
  messages,
  currentQuestionIndex,
]);

  const startListening = () => {
    if (
      isListeningRef.current ||
      isAISpeakingRef.current ||
      isProcessingRef.current ||
      callStatusRef.current !==
        CallStatus.ACTIVE
    ) {
      return;
    }

    transcriptBufferRef.current =
      '';

    clearTimeout(
      silenceTimerRef.current
    );

    clearTimeout(
      noSpeechTimerRef.current
    );

    try {
      recognitionRef.current?.start();
    } catch (error) {
      console.log(
        'Mic start error:',
        error
      );
    }
  };

  const speak = async (
    text,
    onComplete
  ) => {
    try {
      clearTimeout(
        silenceTimerRef.current
      );

      clearTimeout(
        noSpeechTimerRef.current
      );

      transcriptBufferRef.current =
        '';

      isAISpeakingRef.current =
        true;

      setIsSpeaking(true);

      if (
        isListeningRef.current
      ) {
        recognitionRef.current?.stop();
      }

      const response = await fetch(
        '/api/tts',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            text,

            model:
              type ===
              'interview'
                ? 'aura-luna-en'
                : 'aura-asteria-en',
          }),
        }
      );

      const blob =
        await response.blob();

      const audioUrl =
        URL.createObjectURL(blob);

      const audio =
        new Audio(audioUrl);

      audio.onplay = () => {
        setMessages((prev) => [
          ...prev,

          {
            role: 'assistant',
            content: text,
          },
        ]);
      };

      audio.onended = async () => {
        URL.revokeObjectURL(
          audioUrl
        );

        isAISpeakingRef.current =
          false;

        setIsSpeaking(false);

        if (onComplete) {
          await onComplete();
        }

        if (
          callStatusRef.current ===
          CallStatus.ACTIVE
        ) {
          setTimeout(() => {
            startListening();
          }, 400);
        }
      };

      await audio.play();
    } catch (error) {
      console.log(
        'Speak error:',
        error
      );

      isAISpeakingRef.current =
        false;

      setIsSpeaking(false);
    }
  };

 const processInterviewAnswer =
  async (answer) => {

    if (
      isProcessingRef.current
    ) {
      return;
    }

    try {

      isProcessingRef.current =
        true;

      const updatedAnswers = [
        ...answers,

        {
          question:
            currentQuestion,

          answer,
        },
      ];

      setAnswers(
        updatedAnswers
      );

      // SAVE FULL TRANSCRIPT
      const updatedTranscript = [
        ...transcript,

        {
          role: 'assistant',
          content:
            currentQuestion,
        },

        {
          role: 'user',
          content: answer,
        },
      ];

      setTranscript(
        updatedTranscript
      );

      let reaction =
        'Good answer.';

      let moveNext = true;

      try {

        const reactionResponse =
          await fetch(
            '/api/interview/reaction',
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body: JSON.stringify({
                question:
                  currentQuestion,

                answer,
              }),
            }
          );

        const reactionData =
          await reactionResponse.json();

        reaction =
          reactionData?.reaction ||
          reaction;

        moveNext =
          reactionData?.moveNext ??
          true;

      } catch (error) {

        console.log(
          'Reaction error:',
          error
        );
      }

      // FOLLOW-UP FLOW
      if (!moveNext) {

        // allow only 1 follow-up
        if (
          followUpCountRef.current < 1
        ) {

          followUpCountRef.current += 1;

          lastQuestionRef.current =
            currentQuestion;

          await speak(
            reaction
          );

          return;
        }

        // move on gracefully
        moveNext = true;

        reaction =
          "Alright, let's move to the next one.";
      }

      // LAST QUESTION
      const isLastQuestion =
        currentQuestionIndex ===
        questions.length - 1;

      if (isLastQuestion) {

        await finishInterview(
          updatedTranscript
        );

        return;
      }

      // NEXT QUESTION
      const nextIndex =
        currentQuestionIndex + 1;

      setCurrentQuestionIndex(
        nextIndex
      );

      // reset follow-up count
      followUpCountRef.current =
        0;

      const nextQuestion =
        questions[nextIndex];

      lastQuestionRef.current =
        nextQuestion;

      await speak(
        `${reaction} ${nextQuestion}`
      );

    } catch (error) {

      console.log(
        'Interview answer error:',
        error
      );

    } finally {

      isProcessingRef.current =
        false;
    }
  };

  const finishInterview =
  async (
    finalTranscript
  ) => {

    try {

      setCallStatus(
        CallStatus.FINISHED
      );

      // generate feedback silently
      const response =
        await fetch(
          '/api/interview/feedback',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              interviewId,

              userId,

              transcript:
                finalTranscript,
            }),
          }
        );

      const data =
        await response.json();

      if (data.success) {

        // ONE final voice line only
        await speak(
          `Great work ${userName}. Your interview feedback is ready. Redirecting you now.`,

          async () => {

            router.push(
              `/interview/${interviewId}/feedback`
            );
          }
        );

      } else {

        await speak(
          'There was an issue generating feedback.'
        );
      }

    } catch (error) {

      console.log(
        'Feedback generation error:',
        error
      );
    }
  };

  const processConversation =
    async (
      conversationMessages
    ) => {

      if (
        isProcessingRef.current
      ) {
        return;
      }

      try {

        isProcessingRef.current =
          true;

        const response = await fetch(
          '/api/chat',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              messages:
                conversationMessages,
            }),
          }
        );

        const data =
          await response.json();

        lastQuestionRef.current =
          data.reply;

        await speak(
          data.reply,

          async () => {

            if (
              data.completed
            ) {
              await generateInterview(
                data.state
              );
            }
          }
        );

      } catch (error) {

        console.log(
          'Conversation error:',
          error
        );

      } finally {

        isProcessingRef.current =
          false;
      }
    };

  const generateInterview =
    async (state) => {

      try {

        setCallStatus(
          CallStatus.FINISHED
        );

        const response = await fetch(
          '/api/interview/generate',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              ...state,
              userid: userId,
            }),
          }
        );

        const data =
          await response.json();

        if (data.success) {

          await speak(
            'Your interview has been generated successfully. Redirecting to dashboard.',

            async () => {

              router.push('/');
            }
          );
        }

      } catch (error) {

        console.log(
          'Interview generation error:',
          error
        );
      }
    };

  const startConversation =
    async () => {

      setCallStatus(
        CallStatus.ACTIVE
      );

      if (
        type === 'interview'
      ) {

        const intro =
          `Hi ${userName}. Welcome to your mock interview session. I'll ask you a series of questions one by one. Let's begin.`;

        const firstQuestion =
          questions?.[0];

        lastQuestionRef.current =
          firstQuestion;

        await speak(
          `${intro} ${firstQuestion}`
        );

        return;
      }

      await processConversation([
        {
          role: 'user',

          content:
            `Start the interview setup conversation. Greet the user by name: ${userName}`,
        },
      ]);
    };

  const endConversation =
    async () => {

      recognitionRef.current?.stop();

      clearTimeout(
        silenceTimerRef.current
      );

      clearTimeout(
        noSpeechTimerRef.current
      );

      transcriptBufferRef.current =
        '';

      setCallStatus(
        CallStatus.FINISHED
      );

      if (
        type ===
        'interview'
      ) {

        router.push(
          `/interview/${interviewId}/feedback`
        );
      }
    };

  const isInactive =
    callStatus ===
      CallStatus.INACTIVE ||
    callStatus ===
      CallStatus.FINISHED;

  return (
    <div className="flex flex-col gap-8 w-full items-center">

      <div className="call-view">

        <div className="card-interviewer">

          <div className="avatar">

            <Image
              src="/ai-avatar.png"
              alt="AI"
              width={65}
              height={54}
              className="object-cover"
              priority
            />

            {isSpeaking && (
              <span className="animate-speak" />
            )}
          </div>

          <h3>
            {type ===
            'interview'
              ? 'AI Interviewer'
              : 'AI Assistant'}
          </h3>
        </div>

        <div className="card-border">

          <div className="card-content">

            <div className="avatar">

              <Image
                src="/profile.svg"
                alt="user"
                width={120}
                height={120}
                className="rounded-full object-cover size-[120px]"
              />

              {isUserSpeaking && (
                <span className="animate-speak" />
              )}
            </div>

            <h3>
              {userName}
            </h3>
          </div>
        </div>
      </div>

      {type ===
        'interview' &&
        callStatus ===
          CallStatus.ACTIVE && (

          <div className="text-sm text-primary-200">

            Question{' '}

            {Math.min(
              currentQuestionIndex +
                1,

              questions.length
            )}

            {' / '}

            {questions.length}
          </div>
        )}

      {lastMessage && (

        <div className="transcript-border">

          <div className="transcript">

            <p
              className={cn(
                'transition-opacity duration-300',
                'animate-fadeIn'
              )}
            >
              {lastMessage.content}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">

        {callStatus !==
        CallStatus.ACTIVE ? (

          <button
            className="btn-call"
            onClick={
              startConversation
            }
          >
            <span>
              {isInactive
                ? 'Start'
                : '...'}
            </span>
          </button>

        ) : (

          <button
            className="btn-disconnect"
            onClick={
              endConversation
            }
          >
            End
          </button>
        )}
      </div>
    </div>
  );
};

export default Agent;