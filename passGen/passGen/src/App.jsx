import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [status, setStatus] = useState("Idle")
  const [result, setResult] = useState(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.addEventListener("dataavailable", event => {
        audioChunksRef.current.push(event.data)
      })

      mediaRecorderRef.current.addEventListener("stop", async () => {
        setStatus("Processing on server...")
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        
        const formData = new FormData()
        formData.append("file", audioBlob, "recording.webm")
        formData.append("tts_voice", "amy")
        formData.append("tts_format", "wav")

        try {
          // Send to the FastAPI backend process endpoint
          const response = await fetch("http://localhost:8000/api/v1/process", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
          
          const data = await response.json()
          setResult(data)
          setStatus("Done")

          // Play the synthesized base64 audio response
          if (data.audio_response_base64) {
            const audioSrc = `data:audio/${data.audio_format};base64,${data.audio_response_base64}`
            const audio = new Audio(audioSrc)
            await audio.play()
          }
        } catch (error) {
          console.error("Failed to process audio:", error)
          setStatus("Error: " + error.message)
        }
      })

      mediaRecorderRef.current.start()
      setStatus("Recording (Speak now)...")
    } catch (err) {
      console.error("Microphone access denied or error:", err)
      setStatus("Microphone access denied")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
    }
  }

  return (
    <div className='flex flex-col items-center p-10 min-h-screen bg-white'>
      <h1 className='text-4xl text-blue-500 font-bold text-center mb-8'>Unified Process Tester</h1>
      
      <div className='flex gap-4 mb-6'>
        <button 
          onClick={startRecording}
          className='bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg shadow disabled:opacity-50 transition'
          disabled={status.startsWith("Recording")}
        >
          Start Recording
        </button>
        <button 
          onClick={stopRecording}
          className='bg-gray-800 hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-lg shadow disabled:opacity-50 transition'
          disabled={!status.startsWith("Recording")}
        >
          Stop & Send
        </button>
      </div>

      <p className='text-lg mb-8 text-gray-700'>Status: <strong className='text-blue-600'>{status}</strong></p>

      {result && (
        <div className='bg-gray-50 border border-gray-200 p-6 rounded-lg text-left w-full max-w-2xl overflow-auto shadow-sm'>
          <h2 className='text-2xl mb-4 font-bold text-gray-800'>Server Results:</h2>
          <div className='space-y-2 text-gray-700'>
            <p><strong>You said:</strong> {result.input_text}</p>
            <p><strong>Detected Intent:</strong> {result.nlu_data?.intent}</p>
            <p><strong>Sentiment:</strong> {result.nlu_data?.sentiment?.label} (Score: {result.nlu_data?.sentiment?.score})</p>
            <p><strong>Latency:</strong> {result.latency} seconds</p>
          </div>
          
          <details className='mt-6 cursor-pointer text-sm text-gray-600'>
            <summary className='font-semibold mb-2 outline-none'>View Raw NLU JSON Data</summary>
            <pre className='bg-gray-200 p-4 rounded-md overflow-x-auto text-xs'>
              {JSON.stringify(result.nlu_data, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  )
}

export default App
