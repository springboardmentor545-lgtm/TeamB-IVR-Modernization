// IVR System Frontend JavaScript

let currentSessionId = generateSessionId();
const API_BASE = 'http://localhost:3000';

// Session Management
function generateSessionId() {
    return 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function updateSessionDisplay() {
    document.getElementById('sessionId').textContent = `Session: ${currentSessionId.split('-')[1]}`;
}

// Status Management
function setStatus(status, message) {
    const statusElement = document.getElementById('status');
    statusElement.className = `status ${status}`;
    switch(status) {
        case 'ready':
            statusElement.textContent = 'Ready';
            break;
        case 'processing':
            statusElement.textContent = 'Processing...';
            break;
        case 'error':
            statusElement.textContent = 'Error';
            break;
    }
}

function updateResponse(message, isError = false) {
    const responseElement = document.getElementById('response');
    responseElement.textContent = message;
    responseElement.className = isError ? 'response error' : 'response';
}

// IVR Dialpad Functionality
async function callIVR(digit) {
    const button = document.querySelector(`[data-digit="${digit}"]`);
    
    // Visual feedback
    if (button) {
        button.classList.add('pressed');
        setTimeout(() => button.classList.remove('pressed'), 200);
    }

    setStatus('processing');
    updateResponse('Processing your request...', false);

    try {
        const response = await fetch(`${API_BASE}/ivr/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionId: currentSessionId,
                digit: digit
            })
        });

        const data = await response.json();

        if (response.ok) {
            setStatus('ready');
            updateResponse(data.response, false);
        } else {
            setStatus('error');
            updateResponse(data.error || 'An error occurred', true);
        }
    } catch (error) {
        setStatus('error');
        updateResponse(`Connection error: ${error.message}. Make sure the server is running on localhost:3000`, true);
    }
}

// Voice Recognition Variables
let isRecording = false;
let recognition = null;
let recordingTimeout = null;

// Initialize Speech Recognition
function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            console.log('Voice recognition started');
            updateVoiceStatus('🎤 Listening... Speak now!', 'recording');
        };

        recognition.onresult = function(event) {
            const transcript = event.results[event.results.length - 1][0].transcript.trim();
            console.log('Speech recognized:', transcript);
            
            // Stop recording and process the speech
            stopRecording();
            processSpeechCommand(transcript);
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            stopRecording();
            updateVoiceStatus('❌ Speech recognition error. Try again.', 'error');
            setTimeout(() => updateVoiceStatus('', ''), 3000);
        };

        recognition.onend = function() {
            console.log('Voice recognition ended');
            if (isRecording) {
                // If we're still supposed to be recording, restart
                recognition.start();
            }
        };
    }
}

// Voice Recognition Controls
function toggleVoiceRecording() {
    if (!recognition) {
        alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
        return;
    }

    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

function startRecording() {
    isRecording = true;
    updateVoiceButton('recording');
    updateVoiceStatus('🎤 Listening... Speak now!', 'recording');
    
    try {
        recognition.start();
        
        // Auto-stop after 10 seconds (with 4 second wait)
        recordingTimeout = setTimeout(() => {
            if (isRecording) {
                recognition.stop();
                updateVoiceStatus('⏳ Processing... (4 seconds wait)', 'processing');
                
                // Wait 4 seconds before showing timeout
                setTimeout(() => {
                    stopRecording();
                    updateVoiceStatus('⏰ No speech detected. Try again.', 'error');
                    setTimeout(() => updateVoiceStatus('', ''), 3000);
                }, 4000);
            }
        }, 10000);
        
    } catch (error) {
        console.error('Error starting recognition:', error);
        stopRecording();
        updateVoiceStatus('❌ Could not start recording. Try again.', 'error');
        setTimeout(() => updateVoiceStatus('', ''), 3000);
    }
}

function stopRecording() {
    isRecording = false;
    updateVoiceButton('idle');
    
    if (recognition) {
        recognition.stop();
    }
    
    if (recordingTimeout) {
        clearTimeout(recordingTimeout);
        recordingTimeout = null;
    }
}

// Voice UI Updates
function updateVoiceButton(state) {
    const voiceButton = document.getElementById('voiceButton');
    const voiceIcon = document.getElementById('voiceIcon');
    const voiceLabel = document.getElementById('voiceLabel');
    
    voiceButton.className = 'voice-button';
    
    switch(state) {
        case 'recording':
            voiceButton.classList.add('recording');
            voiceIcon.textContent = '🔴';
            voiceLabel.textContent = 'Recording...';
            break;
        case 'processing':
            voiceButton.classList.add('processing');
            voiceIcon.textContent = '⏳';
            voiceLabel.textContent = 'Processing...';
            break;
        default:
            voiceIcon.textContent = '🎤';
            voiceLabel.textContent = 'Voice Command';
    }
}

function updateVoiceStatus(message, className = '') {
    const voiceStatus = document.getElementById('voiceStatus');
    voiceStatus.textContent = message;
    voiceStatus.className = `voice-status ${className}`;
}

// Speech Processing
async function processSpeechCommand(transcript) {
    updateVoiceButton('processing');
    updateVoiceStatus('⏳ Processing... (4 seconds wait)', 'processing');
    
    // Wait 4 seconds as requested
    setTimeout(async () => {
        try {
            updateVoiceStatus('📡 Sending to conversation API...', 'processing');
            
            const response = await fetch(`${API_BASE}/conversation/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId: currentSessionId,
                    query: transcript
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Update display with the response
            setStatus('ready');
            updateResponse(`🎤 You said: "${transcript}"\n\n📋 Response: ${data.message || data.response || 'No response received'}`, false);
            updateVoiceStatus('✅ Voice command processed successfully!', 'success');
            
            setTimeout(() => updateVoiceStatus('', ''), 3000);
            
        } catch (error) {
            console.error('Voice command error:', error);
            setStatus('error');
            updateResponse(`🎤 You said: "${transcript}"\n\n❌ Error: ${error.message}`, true);
            updateVoiceStatus('❌ Failed to process voice command', 'error');
            setTimeout(() => updateVoiceStatus('', ''), 3000);
        } finally {
            updateVoiceButton('idle');
        }
    }, 4000);
}

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    updateSessionDisplay();
    initializeSpeechRecognition();
    
    // Add click event listeners to all dial buttons
    const dialButtons = document.querySelectorAll('.dial-button');
    dialButtons.forEach(button => {
        const digit = button.getAttribute('data-digit');
        button.addEventListener('click', () => callIVR(digit));
    });

    // Add keyboard support
    document.addEventListener('keydown', function(event) {
        const digit = event.key;
        if (digit >= '1' && digit <= '9') {
            callIVR(digit);
        }
    });
});

// Auto-refresh session every 5 minutes
setInterval(() => {
    currentSessionId = generateSessionId();
    updateSessionDisplay();
}, 5 * 60 * 1000);