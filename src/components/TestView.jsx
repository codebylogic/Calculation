import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Flag, Flame, Check, X, AlertCircle } from 'lucide-react';
import { createSpeechRecognizer, isSpeechRecognitionSupported, verifyVerbalResponse, playFeedbackBeep } from '../utils/speechEngine';

export default function TestView({
  testState,
  appSettings,
  onValidateAnswer,
  onForceSubmit
}) {
  const { questions, currentIndex, currentStreak, overlayState } = testState;
  const currentQuestion = questions[currentIndex];

  const [manualInput, setManualInput] = useState('');
  const [spokenTranscript, setSpokenTranscript] = useState('अपनी आवाज़ में साफ जवाब बोलें...');
  const [secondsRemaining, setSecondsRemaining] = useState(15);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const secondsUsedRef = useRef(0);

  const isTimerActive = Boolean(
    currentQuestion &&
    appSettings.globalTimer &&
    appSettings.countdownEnabled[currentQuestion.category]
  );
  const maxDuration = (currentQuestion && appSettings.categoryTimes[currentQuestion.category]) || 15;

  // Initialize and handle Speech Recognition lifecycle
  useEffect(() => {
    if (!isSpeechRecognitionSupported()) {
      setIsSpeechSupported(false);
      return;
    }

    const recognition = createSpeechRecognizer({
      lang: 'hi-IN',
      onStart: () => {
        setIsListening(true);
      },
      onEnd: () => {
        setIsListening(false);
        // Automatically restart if test view is active and not currently in validation overlay
        if (!overlayState?.show && currentIndex < questions.length) {
          try {
            recognition.start();
          } catch (e) {}
        }
      },
      onError: (event) => {
        console.warn("Speech recognition notice:", event?.error);
      },
      onResult: (event) => {
        if (overlayState?.show) return;

        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }

        if (transcript.trim() !== '') {
          const cleanText = transcript.trim();
          setSpokenTranscript(`"${cleanText}"`);

          if (currentQuestion) {
            const isMatch = verifyVerbalResponse(cleanText, currentQuestion.correctAnswer);
            if (isMatch) {
              onValidateAnswer(true, `Verified speech match: "${cleanText}"`, secondsUsedRef.current, maxDuration);
            } else {
              // Check if any number was parsed from the spoken text
              onValidateAnswer(false, `Spoken: "${cleanText}"`, secondsUsedRef.current, maxDuration);
            }
          }
        }
      }
    });

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (e) {}

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [currentIndex, overlayState?.show, currentQuestion]);

  // Setup countdown timer for question
  useEffect(() => {
    if (!currentQuestion) return;

    setManualInput('');
    setSpokenTranscript('अपनी आवाज़ में साफ जवाब बोलें (Speak your answer)...');
    secondsUsedRef.current = 0;

    if (timerRef.current) clearInterval(timerRef.current);

    if (isTimerActive) {
      setSecondsRemaining(maxDuration);

      timerRef.current = setInterval(() => {
        secondsUsedRef.current += 1;
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            onValidateAnswer(false, "समय समाप्त! (Time Out)", maxDuration, maxDuration);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, currentQuestion, isTimerActive, maxDuration]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim() || !currentQuestion || overlayState?.show) return;

    const parsed = parseFloat(manualInput.trim());
    const isCorrect = Math.abs(parsed - currentQuestion.correctAnswer) < 0.01;

    onValidateAnswer(
      isCorrect,
      isCorrect ? "टेक्स्ट इनपुट से वेरिफाई हुआ" : "वेरिफिकेशन पूर्ण",
      secondsUsedRef.current,
      maxDuration
    );
  };

  if (!currentQuestion) return null;

  return (
    <section className="space-y-6 animate-fade-in max-w-3xl mx-auto py-2">
      {/* Top Header Card */}
      <div className="flex items-center justify-between bg-slate-900/60 p-4 border border-slate-800 rounded-2xl">
        <div className="flex items-center space-x-2.5">
          <span className="text-xs bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            {currentQuestion.category}
          </span>
          <span className="text-xs text-slate-400 font-semibold">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        {isTimerActive && (
          <div className="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
            <span className="text-xs font-bold text-rose-400 font-mono">
              {secondsRemaining}s Left
            </span>
          </div>
        )}
      </div>

      {/* Main Question Display Box */}
      <div className="relative bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950 border border-slate-800 rounded-3xl p-8 md:p-12 text-center shadow-2xl space-y-6 overflow-hidden min-h-[340px] flex flex-col justify-between">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-slate-400 text-xs tracking-widest uppercase font-bold">
          Solve the expression & speak answer
        </div>

        <div className="relative py-4">
          <h3 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white select-none font-mono">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Voice Visualizer / Transcript Area */}
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2">
            {isSpeechSupported ? (
              <>
                <div className="flex items-end space-x-0.5 h-4 w-6">
                  <span className="w-1 bg-indigo-400 h-1.5 rounded-full animate-pulse"></span>
                  <span className="w-1 bg-indigo-400 h-3 rounded-full animate-pulse delay-75"></span>
                  <span className="w-1 bg-indigo-400 h-4 rounded-full animate-pulse delay-150"></span>
                  <span className="w-1 bg-indigo-400 h-2 rounded-full animate-pulse"></span>
                </div>
                <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                  <Mic className="w-3.5 h-3.5 inline mr-1" />
                  <span>Voice Engine Active & Listening...</span>
                </span>
              </>
            ) : (
              <span className="text-xs font-bold text-amber-400">
                Speech recognition not supported in this browser; please use keyboard input below.
              </span>
            )}
          </div>

          <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl px-4 py-3 min-h-[48px] flex items-center justify-center text-center">
            <span className="text-xs sm:text-sm text-indigo-300 font-medium italic">
              {spokenTranscript}
            </span>
          </div>
        </div>

        {/* Immediate feedback overlay */}
        {overlayState?.show && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center space-y-3 animate-fade-in z-20">
            {overlayState.isCorrect ? (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-3xl font-black shadow-lg">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-black text-emerald-400">
                  {currentStreak >= 3 ? `🔥 ${currentStreak} की स्ट्रीक! सही जवाब!` : "सही जवाब! (Correct Answer!)"}
                </h4>
                <p className="text-xs text-slate-400 font-medium">
                  {overlayState.message || "Next question in 1s..."}
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center text-3xl font-black shadow-lg">
                  <X className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-black text-rose-400">
                  {overlayState.message?.includes("समय") ? "समय समाप्त! (Time Out)" : "गलत जवाब (Incorrect)"}
                </h4>
                <p className="text-sm text-slate-300 font-semibold">
                  सही जवाब था: <span className="font-mono text-white text-base bg-slate-900 px-2 py-0.5 rounded border border-slate-700">{currentQuestion.correctAnswer}</span>
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Manual Keyboard Input Fallback */}
      <form
        onSubmit={handleManualSubmit}
        className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <div className="text-xs text-slate-400 text-center sm:text-left">
          <span className="font-bold text-slate-200">Tip:</span> If you cannot speak or are in a noisy room, type your answer here:
        </div>
        <div className="flex w-full sm:w-auto space-x-2">
          <input
            type="text"
            placeholder="Type answer..."
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 text-xs rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500 w-full sm:w-32 font-mono"
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-xl transition flex items-center space-x-1"
          >
            <span>Submit</span>
            <Send className="w-3 h-3" />
          </button>
        </div>
      </form>

      {/* Action footer */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[11px] text-slate-400">
          Answer verifies instantly upon speaking!
        </span>
        <button
          onClick={onForceSubmit}
          className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600 border border-rose-500/30 hover:border-rose-600 text-rose-300 hover:text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
        >
          <Flag className="w-3.5 h-3.5" />
          <span>Submit Test Now</span>
        </button>
      </div>
    </section>
  );
}
