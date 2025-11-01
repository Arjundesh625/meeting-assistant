// Application data
const data = {
  components: [
    { name: "manifest.json", type: "Configuration", purpose: "Defines extension structure, permissions, and components", color: "#6366f1" },
    { name: "popup.html/js", type: "UI", purpose: "User interface for starting/stopping and showing transcriptions", color: "#8b5cf6" },
    { name: "content_script.js", type: "Display", purpose: "Displays real-time answers on the meeting page", color: "#a855f7" },
    { name: "background.js", type: "Service Worker", purpose: "Handles audio capture and API orchestration", color: "#ec4899" },
    { name: "offscreen.html/js", type: "Processing", purpose: "Manages audio processing and API connections", color: "#f43f5e" }
  ],
  speechApis: [
    { name: "Web Speech API", latency: "~100ms", accuracy: "85-90%", cost: "Free", pros: "Free, built-in, no setup", cons: "Chrome only, requires internet, basic accuracy" },
    { name: "AssemblyAI Universal-Streaming", latency: "~300ms", accuracy: "98-99%", cost: "$0.15/hour", pros: "Industry-leading accuracy, low latency, immutable transcripts", cons: "Paid service, requires API key" },
    { name: "Deepgram", latency: "~200-400ms", accuracy: "90-95%", cost: "$0.12/hour", pros: "Good balance of speed and accuracy, affordable", cons: "Paid service, requires API key" },
    { name: "OpenAI Whisper API", latency: "2-5 seconds", accuracy: "95-97%", cost: "$0.006/minute", pros: "High accuracy, good language support", cons: "Not true real-time, higher latency" },
    { name: "OpenAI Realtime API", latency: "~300ms", accuracy: "95-97%", cost: "Variable", pros: "Native speech support, versatile", cons: "More complex setup, newer API" }
  ],
  aiApis: [
    { name: "OpenAI GPT-4", speed: "2-5 seconds", quality: "Excellent", cost: "$0.03/1K tokens", bestFor: "General purpose, balanced" },
    { name: "OpenAI GPT-5", speed: "2-4 seconds", quality: "Superior reasoning", cost: "Higher tier pricing", bestFor: "Complex reasoning tasks" },
    { name: "Anthropic Claude", speed: "2-4 seconds", quality: "Excellent", cost: "$0.015/1K tokens", bestFor: "Longer context, nuanced responses" }
  ],
  workarounds: [
    { title: "Manual Toggle Button", description: "Add a button in the extension popup to show/hide the answer overlay", difficulty: "Easy", effectiveness: "Medium" },
    { title: "Keyboard Shortcut", description: "Use Ctrl+Shift+H to instantly hide/show answers (fastest method)", difficulty: "Easy", effectiveness: "High" },
    { title: "Separate Popup Window", description: "Display answers in a separate browser window outside screen share", difficulty: "Medium", effectiveness: "High" },
    { title: "Second Monitor", description: "Show answers on a second monitor that's not being shared", difficulty: "Easy", effectiveness: "Very High" },
    { title: "Browser Notifications", description: "Send answers as browser notifications instead of on-page display", difficulty: "Easy", effectiveness: "Low" }
  ],
  setupSteps: [
    { number: 1, title: "Get API Keys", content: "Sign up for your chosen speech recognition service (AssemblyAI, Deepgram, or use Web Speech API for free) and AI service (OpenAI or Anthropic). AssemblyAI: https://www.assemblyai.com | Deepgram: https://www.deepgram.com | OpenAI: https://platform.openai.com | Anthropic: https://www.anthropic.com" },
    { number: 2, title: "Download Code", content: "Generate and download the extension code from the Code Generator section. Extract the ZIP file to a folder on your computer." },
    { number: 3, title: "Configure API Keys", content: "Open the background.js file in a text editor. Find the configuration section at the top and replace 'YOUR_API_KEY_HERE' with your actual API keys for the speech and AI services you selected." },
    { number: 4, title: "Load Extension", content: "Open Chrome and navigate to chrome://extensions. Enable 'Developer mode' using the toggle in the top right. Click 'Load unpacked' and select the folder containing your extension files." },
    { number: 5, title: "Grant Permissions", content: "Click the extension icon in your browser toolbar. When prompted, grant microphone and tab capture permissions. These are required for the extension to capture meeting audio." },
    { number: 6, title: "Test It", content: "Join a test meeting (or play a YouTube video with speech) and click 'Start Assistant' in the extension popup. Verify that transcription appears and AI answers are generated. Test the Ctrl+Shift+H shortcut to hide/show the overlay." }
  ],
  usageTips: [
    "Start the assistant BEFORE joining the meeting for best results",
    "Use Ctrl+Shift+H to quickly hide answers when screen sharing",
    "Keep the extension popup open to monitor transcription status",
    "Test your setup with recorded videos before using in real meetings",
    "Always inform meeting participants if you're recording (legal requirement in many jurisdictions)",
    "Use a second monitor for the safest setup",
    "Configure 'be concise' in AI prompts for faster responses"
  ]
};

// Navigation functionality
function navigateToView(viewName) {
  // Hide all sections
  document.querySelectorAll('.view-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show selected section
  const targetSection = document.getElementById(viewName);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  // Update nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  const activeNavItem = document.querySelector(`[data-view="${viewName}"]`);
  if (activeNavItem) {
    activeNavItem.classList.add('active');
  }
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize navigation
document.addEventListener('DOMContentLoaded', () => {
  // Set up navigation click handlers
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const view = item.getAttribute('data-view');
      navigateToView(view);
    });
  });
  
  // Populate technology tables
  populateSpeechApiTable();
  populateAiApiTable();
  
  // Populate workarounds
  populateWorkarounds();
  
  // Populate setup steps
  populateSetupSteps();
  
  // Populate usage tips
  populateUsageTips();
  
  // Set up form handler
  setupCodeGenerator();
  
  // Set up accordion
  setupAccordion();
});

// Populate speech API table
function populateSpeechApiTable() {
  const tbody = document.getElementById('speech-api-table');
  if (!tbody) return;
  
  tbody.innerHTML = data.speechApis.map(api => `
    <tr>
      <td><strong>${api.name}</strong></td>
      <td>${api.latency}</td>
      <td>${api.accuracy}</td>
      <td>${api.cost}</td>
      <td>${api.pros}</td>
      <td>${api.cons}</td>
    </tr>
  `).join('');
}

// Populate AI API table
function populateAiApiTable() {
  const tbody = document.getElementById('ai-api-table');
  if (!tbody) return;
  
  tbody.innerHTML = data.aiApis.map(api => `
    <tr>
      <td><strong>${api.name}</strong></td>
      <td>${api.speed}</td>
      <td>${api.quality}</td>
      <td>${api.cost}</td>
      <td>${api.bestFor}</td>
    </tr>
  `).join('');
}

// Populate workarounds
function populateWorkarounds() {
  const grid = document.getElementById('workarounds-grid');
  if (!grid) return;
  
  grid.innerHTML = data.workarounds.map(workaround => `
    <div class="workaround-card">
      <div class="workaround-header">
        <h3>${workaround.title}</h3>
      </div>
      <p class="workaround-description">${workaround.description}</p>
      <div style="margin-top: 12px; display: flex; gap: 8px;">
        <span class="difficulty-badge difficulty-${workaround.difficulty}">Difficulty: ${workaround.difficulty}</span>
        <span class="effectiveness-badge effectiveness-${workaround.effectiveness.replace(' ', '.')}">Effect: ${workaround.effectiveness}</span>
      </div>
    </div>
  `).join('');
}

// Populate setup steps
function populateSetupSteps() {
  const container = document.getElementById('setup-steps');
  if (!container) return;
  
  container.innerHTML = data.setupSteps.map(step => `
    <div class="step-card">
      <div class="step-header" onclick="toggleStep(this)">
        <div class="step-number-badge">${step.number}</div>
        <div class="step-title">${step.title}</div>
        <div class="step-expand-icon">▼</div>
      </div>
      <div class="step-content">
        <div class="step-content-inner">
          ${step.content}
        </div>
      </div>
    </div>
  `).join('');
}

// Toggle step expansion
function toggleStep(header) {
  const stepCard = header.closest('.step-card');
  stepCard.classList.toggle('expanded');
}

// Populate usage tips
function populateUsageTips() {
  const grid = document.getElementById('tips-grid');
  if (!grid) return;
  
  grid.innerHTML = data.usageTips.map(tip => `
    <div class="tip-item">💡 ${tip}</div>
  `).join('');
}

// Setup accordion
function setupAccordion() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      item.classList.toggle('open');
    });
  });
}

// Code Generator
function setupCodeGenerator() {
  const form = document.getElementById('config-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    generateCode();
  });
  
  // Set up code tabs
  document.querySelectorAll('.code-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const fileName = tab.getAttribute('data-file');
      switchCodeTab(fileName);
    });
  });
}

function generateCode() {
  const extName = document.getElementById('ext-name').value;
  const speechApi = document.getElementById('speech-api').value;
  const aiApi = document.getElementById('ai-api').value;
  const displayMode = document.getElementById('display-mode').value;
  
  // Show code output section
  const codeOutput = document.getElementById('code-output');
  codeOutput.style.display = 'block';
  
  // Generate all code files
  const generatedCode = {
    manifest: generateManifest(extName),
    'popup-html': generatePopupHtml(),
    'popup-js': generatePopupJs(),
    background: generateBackgroundJs(speechApi, aiApi),
    content: generateContentScript(displayMode),
    'offscreen-html': generateOffscreenHtml(),
    'offscreen-js': generateOffscreenJs(speechApi, aiApi)
  };
  
  // Store for download
  window.generatedCode = generatedCode;
  window.generatedConfig = { extName, speechApi, aiApi, displayMode };
  
  // Display first file
  switchCodeTab('manifest');
  
  // Scroll to code output
  codeOutput.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function switchCodeTab(fileName) {
  // Update tab buttons
  document.querySelectorAll('.code-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelector(`[data-file="${fileName}"]`).classList.add('active');
  
  // Get file name mapping
  const fileNameMap = {
    'manifest': 'manifest.json',
    'popup-html': 'popup.html',
    'popup-js': 'popup.js',
    'background': 'background.js',
    'content': 'content_script.js',
    'offscreen-html': 'offscreen.html',
    'offscreen-js': 'offscreen.js'
  };
  
  // Display code
  const code = window.generatedCode[fileName];
  const displayFileName = fileNameMap[fileName];
  
  const codeContent = document.getElementById('code-content');
  codeContent.innerHTML = `
    <div class="code-file active">
      <div class="code-file-header">
        <span class="code-file-name">${displayFileName}</span>
        <button class="btn btn--outline" onclick="copyCode('${fileName}')" style="padding: 6px 12px; font-size: 12px;">📋 Copy</button>
      </div>
      <div class="code-block">
        <pre><code>${escapeHtml(code)}</code></pre>
      </div>
    </div>
  `;
}

function copyCode(fileName) {
  const code = window.generatedCode[fileName];
  navigator.clipboard.writeText(code).then(() => {
    alert('Code copied to clipboard!');
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function downloadAllCode() {
  // Note: In a real implementation, you would use JSZip library
  // For this demo, we'll create individual downloads
  alert('Download functionality: In a production version, this would create a ZIP file with all extension files. For now, please copy each file individually using the Copy buttons.');
}

// Code generation templates
function generateManifest(extName) {
  return `{
  "manifest_version": 3,
  "name": "${extName}",
  "version": "1.0.0",
  "description": "Real-time meeting assistant with AI-powered answers",
  "permissions": [
    "activeTab",
    "tabCapture",
    "offscreen",
    "storage"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icon16.png",
      "48": "icon48.png",
      "128": "icon128.png"
    }
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content_script.js"],
      "run_at": "document_idle"
    }
  ],
  "commands": {
    "toggle-overlay": {
      "suggested_key": {
        "default": "Ctrl+Shift+H"
      },
      "description": "Toggle answer overlay visibility"
    }
  }
}`;
}

function generatePopupHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      width: 350px;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    h1 { font-size: 18px; margin: 0 0 16px 0; }
    button {
      width: 100%;
      padding: 12px;
      margin: 8px 0;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }
    .btn-start { background: #10b981; color: white; }
    .btn-stop { background: #ef4444; color: white; }
    #status {
      padding: 12px;
      background: #f3f4f6;
      border-radius: 6px;
      margin: 8px 0;
      font-size: 13px;
    }
    #transcript {
      max-height: 200px;
      overflow-y: auto;
      padding: 12px;
      background: #f9fafb;
      border-radius: 6px;
      font-size: 12px;
      margin-top: 12px;
    }
  </style>
</head>
<body>
  <h1>🎯 Meeting Assistant</h1>
  <button id="startBtn" class="btn-start">Start Assistant</button>
  <button id="stopBtn" class="btn-stop" style="display:none;">Stop Assistant</button>
  <div id="status">Status: Idle</div>
  <div id="transcript" style="display:none;"></div>
  <script src="popup.js"></script>
</body>
</html>`;
}

function generatePopupJs() {
  return `let isRunning = false;

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const status = document.getElementById('status');
const transcript = document.getElementById('transcript');

startBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.runtime.sendMessage({ action: 'start', tabId: tab.id });
  updateUI(true);
});

stopBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'stop' });
  updateUI(false);
});

function updateUI(running) {
  isRunning = running;
  startBtn.style.display = running ? 'none' : 'block';
  stopBtn.style.display = running ? 'block' : 'none';
  status.textContent = running ? 'Status: Recording...' : 'Status: Idle';
  transcript.style.display = running ? 'block' : 'none';
}

// Listen for transcript updates
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'transcriptUpdate') {
    transcript.textContent = message.text;
    transcript.scrollTop = transcript.scrollHeight;
  }
});`;
}

function generateBackgroundJs(speechApi, aiApi) {
  return `// Configuration - REPLACE WITH YOUR API KEYS
const CONFIG = {
  speechApi: '${speechApi}',
  aiApi: '${aiApi}',
  speechApiKey: 'YOUR_SPEECH_API_KEY_HERE',
  aiApiKey: 'YOUR_AI_API_KEY_HERE'
};

let isRecording = false;
let currentTabId = null;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'start') {
    startRecording(message.tabId);
  } else if (message.action === 'stop') {
    stopRecording();
  }
});

// Listen for keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-overlay') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleOverlay' });
    });
  }
});

async function startRecording(tabId) {
  if (isRecording) return;
  
  currentTabId = tabId;
  isRecording = true;
  
  try {
    // Create offscreen document for audio processing
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['USER_MEDIA'],
      justification: 'Audio capture for meeting transcription'
    });
    
    // Start tab audio capture
    const streamId = await chrome.tabCapture.getMediaStreamId({
      targetTabId: tabId
    });
    
    // Send to offscreen document
    chrome.runtime.sendMessage({
      action: 'startCapture',
      streamId: streamId,
      config: CONFIG
    });
  } catch (error) {
    console.error('Failed to start recording:', error);
    isRecording = false;
  }
}

function stopRecording() {
  if (!isRecording) return;
  
  chrome.runtime.sendMessage({ action: 'stopCapture' });
  chrome.offscreen.closeDocument();
  
  isRecording = false;
  currentTabId = null;
}

// Relay messages from offscreen to content script
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'displayAnswer' && currentTabId) {
    chrome.tabs.sendMessage(currentTabId, message);
  }
});`;
}

function generateContentScript(displayMode) {
  const overlayCode = displayMode === 'overlay' ? `
  // Create overlay element
  const overlay = document.createElement('div');
  overlay.id = 'meeting-assistant-overlay';
  overlay.style.cssText = \`
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 350px;
    max-height: 400px;
    background: white;
    border: 2px solid #3b82f6;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    padding: 16px;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    overflow-y: auto;
    transition: opacity 0.3s ease;
  \`;
  
  overlay.innerHTML = '<h3 style="margin: 0 0 12px 0; color: #1f2937;">AI Assistant</h3><div id="answer-content" style="color: #4b5563; font-size: 14px; line-height: 1.6;">Waiting for questions...</div>';
  
  document.body.appendChild(overlay);` : `
  // Notification mode - create notifications for answers
  function showNotification(text) {
    if (Notification.permission === 'granted') {
      new Notification('Meeting Assistant', {
        body: text,
        icon: 'icon48.png'
      });
    }
  }
  
  // Request notification permission
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }`;

  return `// Meeting Assistant Content Script
let overlayVisible = true;

${overlayCode}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'displayAnswer') {
    displayAnswer(message.answer);
  } else if (message.action === 'toggleOverlay') {
    toggleOverlay();
  }
});

function displayAnswer(answer) {
  ${displayMode === 'overlay' ? `
  const answerContent = document.getElementById('answer-content');
  if (answerContent) {
    answerContent.innerHTML = '<strong>Answer:</strong> ' + answer;
  }` : `
  showNotification(answer);`}
}

function toggleOverlay() {
  ${displayMode === 'overlay' ? `
  overlayVisible = !overlayVisible;
  const overlay = document.getElementById('meeting-assistant-overlay');
  if (overlay) {
    overlay.style.opacity = overlayVisible ? '1' : '0';
    overlay.style.pointerEvents = overlayVisible ? 'auto' : 'none';
  }` : `
  // Toggle notifications
  overlayVisible = !overlayVisible;`}
}`;
}

function generateOffscreenHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body>
  <script src="offscreen.js"></script>
</body>
</html>`;
}

function generateOffscreenJs(speechApi, aiApi) {
  const speechCode = speechApi === 'webspeech' ? `
    // Web Speech API implementation
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      
      processTranscript(transcript);
    };
    
    recognition.start();` : `
    // External API implementation (AssemblyAI/Deepgram/etc.)
    // This requires setting up WebSocket connection to the API
    // Example for AssemblyAI:
    const ws = new WebSocket('wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000');
    
    ws.onopen = () => {
      console.log('Connected to speech API');
      // Send audio chunks here
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.text) {
        processTranscript(data.text);
      }
    };`;

  return `let mediaRecorder;
let audioContext;
let config;

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'startCapture') {
    config = message.config;
    await startAudioCapture(message.streamId);
  } else if (message.action === 'stopCapture') {
    stopAudioCapture();
  }
});

async function startAudioCapture(streamId) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: 'tab',
          chromeMediaSourceId: streamId
        }
      }
    });
    
    ${speechCode}
    
  } catch (error) {
    console.error('Audio capture error:', error);
  }
}

function processTranscript(transcript) {
  // Send to popup for display
  chrome.runtime.sendMessage({
    action: 'transcriptUpdate',
    text: transcript
  });
  
  // Process with AI
  getAIAnswer(transcript);
}

async function getAIAnswer(transcript) {
  // Simple example - in production, you'd want more sophisticated logic
  // to detect questions and generate relevant answers
  
  const apiKey = config.aiApiKey;
  const endpoint = config.aiApi === 'gpt4' || config.aiApi === 'gpt5' 
    ? 'https://api.openai.com/v1/chat/completions'
    : 'https://api.anthropic.com/v1/messages';
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${apiKey}\`
      },
      body: JSON.stringify({
        model: config.aiApi === 'claude' ? 'claude-3-opus-20240229' : 'gpt-4',
        messages: [{
          role: 'user',
          content: \`Based on this meeting transcript, provide a brief, helpful answer: \${transcript}\`
        }],
        max_tokens: 150
      })
    });
    
    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || data.content?.[0]?.text || 'No answer available';
    
    // Send answer to content script for display
    chrome.runtime.sendMessage({
      action: 'displayAnswer',
      answer: answer
    });
  } catch (error) {
    console.error('AI API error:', error);
  }
}

function stopAudioCapture() {
  if (mediaRecorder) {
    mediaRecorder.stop();
  }
  if (audioContext) {
    audioContext.close();
  }
}`;
}

// Make navigateToView globally available
window.navigateToView = navigateToView;