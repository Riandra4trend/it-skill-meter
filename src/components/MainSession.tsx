import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPencilAlt, FaSave } from "react-icons/fa";

export default function MainSession({
  onContinue,
  currentPertanyaan,
  currentMainSessionCount,
  userSelectionLanguage,
  currentAnswer,
  setCurrentAnswer,
}: {
  onContinue: (text: string) => void;
  currentPertanyaan: string;
  currentMainSessionCount: number;
  userSelectionLanguage: string;
  currentAnswer: string;
  setCurrentAnswer: React.Dispatch<React.SetStateAction<string>>;
}) {

  const [liveText, setLiveText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const router = useRouter();
  const hasMounted = useRef(false);

  const handleBack = () => {
    router.back();
  };

  const handleStartRecording = () => {
    if (recognitionRef.current && !isRecording) {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = () => {
    onContinue(currentAnswer);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentAnswer(event.target.value);
    setHasChanges(true);
  };

  const handleToggleEditable = () => {
    setIsEditable(!isEditable);
  };

  const handleSaveChanges = () => {
    setIsEditable(false);
    setHasChanges(false);
  };

  const handleRepeatQuestion = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(currentPertanyaan);
      if (userSelectionLanguage === "Bahasa Indonesia") utterance.lang = "id-ID"; // Set language to Indonesian
      else if (userSelectionLanguage === "Bahasa Inggris") utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("SpeechSynthesis is not supported in this browser.");
    }
  };

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("Error accessing the webcam", err));
    }

    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "id-ID";
      recognition.interimResults = true;
      recognition.continuous = true;

      let interimTranscript = "";

      recognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript = event.results[i][0].transcript;
          }
        }
        setCurrentAnswer((prevText) => prevText + finalTranscript);
      };

      recognition.onerror = (event) => {
        console.error("SpeechRecognition error", event.error);
      };

      recognitionRef.current = recognition;
    } else {
      console.error("SpeechRecognition is not supported in this browser.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (hasMounted.current) {
      if (currentPertanyaan) {
        handleRepeatQuestion();
      }
    } else {
      hasMounted.current = true;
    }
  }, [currentPertanyaan]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      {/* Back Button and Question Header */}
      <div className="flex justify-between items-center mb-4 text-black">
        <p>Pertanyaan {String(currentMainSessionCount)}</p>
        <button
          onClick={handleBack}
          className="border border-gray-400 text-gray-600 px-2 py-1 rounded hover:bg-gray-200"
        >
          Keluar
        </button>
      </div>

      <div className="border-t-2 border-gray-400 mt-2 px-2 pb-4"></div>

      {/* Interviewer and User Headers */}
      <div className="flex flex-row gap-x-16 justify-between">
        <div className="w-1/2">
          <h3 className="flex justify-center mb-2 font-semibold text-black">
            Virtual Interviewer
          </h3>
        </div>
        <div className="w-1/2">
          <h3 className="flex justify-center mb-2 font-semibold text-black">
            User
          </h3>
        </div>
      </div>

      {/* Interview Session */}
      <div className="grid grid-cols-2 gap-16 mb-4">
        <div className="flex flex-col justify-center items-center">
          <div className="h-32 flex items-center justify-center mb-2">
            <Image
              src="/icons/virtual-interviewer.svg"
              alt="virtual interviewer"
              width={80}
              height={80}
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleRepeatQuestion}
              className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
            >
              Ulangi Pertanyaan
            </button>
          </div>
        </div>
        <div>
          <video
            ref={videoRef}
            autoPlay
            className="w-full h-48 bg-gray-200 mb-2 rounded-xl"
          />
          <div className="flex justify-center mt-4">
            <button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className="bg-primary-red hover:bg-red-600 rounded-md h-8 px-4 flex justify-center items-center text-sm hover:secondary-red"
            >
              {isRecording ? "Stop" : "Mulai Rekam Jawaban"}
            </button>
          </div>
        </div>
      </div>

      {/* Live Text Display with Edit and Save Buttons */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <h3>Live Text</h3>
          <button
            onClick={isEditable ? handleSaveChanges : handleToggleEditable}
            className="text-gray-600 hover:text-gray-800"
          >
            {isEditable ? <FaSave /> : <FaPencilAlt />}
          </button>
        </div>
        <textarea
          value={currentAnswer}
          onChange={handleTextChange}
          className="border p-2 h-32 text-sm overflow-y-auto text-gray-600 w-full"
          disabled={!isEditable} // Disable editing unless 'isEditable' is true
        />
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className={`px-6 py-2 text-white rounded ${
            isEditable || isRecording
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          }`}
          disabled={isEditable || isRecording} // Disable button if there are unsaved changes
        >
          Lanjut
        </button>
      </div>
    </div>
  );
}
