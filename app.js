// ===============================================
// BuddyOS - Student Productivity Application
// ===============================================

// Theme Management
let currentTheme = 'light';
let themeInitialized = false;

// Chatbot State
let chatHistory = [];
let chatOpen = false;

// Authentication Data (In-Memory)
let users = [
  // Demo users (optional)
  {
    id: 1,
    fullName: 'Demo User',
    email: 'demo@buddyos.com',
    password: 'welcome123',
    createdDate: new Date('2024-01-01'),
    focusStats: {
      totalFocusTime: 125,
      sessionsCompleted: 5,
      currentStreak: 3,
      longestStreak: 7,
      notesCount: 2
    },
    notes: [
      { id: 101, content: 'Remember to review chapter 5', timestamp: new Date() },
      { id: 102, content: 'Practice problems for calculus', timestamp: new Date() }
    ],
    sessions: [
      { time: '2:30 PM', type: 'Focus', date: 'Nov 4, 2:30 PM', duration: '25 min', timestamp: new Date() }
    ]
  }
];
let currentUser = null;
let rememberedEmail = null;



// Research Dock Data (In-Memory)
let researchState = {
  sources: [],
  collections: [
    { id: 'all', name: 'All Sources', icon: '📚', isDefault: true },
    { id: 'favorites', name: 'Favorites', icon: '⭐', isDefault: true },
    { id: 'recent', name: 'Recently Added', icon: '🕒', isDefault: true }
  ],
  currentFilter: 'all',
  currentCollection: 'all',
  currentSort: 'recent',
  searchQuery: '',
  editingId: null
};

const researchTypeIcons = {
  book: '📖',
  article: '📄',
  video: '🎥',
  website: '🌐',
  pdf: '📕',
  thesis: '🎓',
  lecture: '🎤',
  other: '📚'
};

// Notifications & Reminders State
let notificationsState = {
  notifications: [],
  unreadCount: 0,
  currentTab: 'all',
  settings: {
    toastEnabled: true,
    browserEnabled: false,
    sessionAlerts: true,
    streakAlerts: true,
    quietHoursEnabled: false,
    quietHoursStart: '21:00',
    quietHoursEnd: '08:00'
  }
};

let remindersState = {
  reminders: [],
  activeReminder: null,
  snoozeCount: 0,
  checkInterval: null
};

// Data Storage (In-Memory)
let appState = {
  user: {
    name: 'User',
    focusTimeToday: 0,
    streak: 0,
    sessionsCompleted: 0
  },
  timer: {
    mode: 'work', // 'work', 'shortBreak', 'longBreak'
    timeRemaining: 25 * 60, // in seconds
    isRunning: false,
    intervalId: null,
    totalTime: 25 * 60, // for progress bar calculation
    isFullscreen: false,
    pausedByBlur: false
  },
  settings: {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    tabDetectionEnabled: true,
    fullscreenEnabled: true
  },
  notes: [],
  sessions: [],
  currentView: 'focus'
};

// Motivational Quotes
const quotes = [
  { text: 'Success is no accident.', author: 'Pelé' },
  { text: 'The expert in anything was once a beginner.', author: 'Helen Hayes' },
  { text: 'Education is the passport to the future.', author: 'Malcolm X' },
  { text: 'The beautiful thing about learning is that no one can take it away from you.', author: 'B.B. King' },
  { text: 'Study while others are sleeping; work while others are loafing.', author: 'William A. Ward' }
];

// Chatbot Responses
const chatbotResponses = {
  // Greetings
  "hello": "Hey there! 👋 I'm Buddy, your study companion. How can I help you today?",
  "hi": "Hi! 👋 Ready to focus and study? What can I help you with?",
  "hey": "Hey! 👋 What's on your mind?",
  "good morning": "Good morning! ☀️ Ready to make today productive?",
  "good afternoon": "Good afternoon! 🌤️ How's your study session going?",
  "good evening": "Good evening! 🌙 Time to wind down or power through?",
  
  // Motivation
  "motivation": "You've got this! 💪 Remember, every session counts. Start with just 25 minutes and watch yourself grow!",
  "motivated": "That's the spirit! 🎯 Keep pushing yourself, you're doing amazing!",
  "motivate": "Here's some motivation: 🌟 Success is the sum of small efforts repeated day in and day out. You're building greatness, one session at a time!",
  "tired": "I get it, studying can be exhausting. 😅 Take a deep breath! How about a short break and then jump back in?",
  "exhausted": "Sounds like you need a break! 😴 Remember, rest is part of productivity. Take 5-15 minutes, then come back stronger!",
  "stuck": "It's normal to feel stuck sometimes. 📚 Try breaking your task into smaller parts, or switch topics for a bit!",
  "lazy": "We all have those days! 🛋️ Try the 2-minute rule: just start for 2 minutes. Often, starting is the hardest part!",
  "procrastinating": "Procrastination happens to everyone! ⏰ Try this: Set a timer for just 5 minutes. Often, you'll keep going once you start!",
  "give up": "Don't give up! 💪 Every expert was once a beginner. Take a break if needed, but come back and try again!",
  
  // Study tips
  "tips": "Here are some study tips:\n1. Use the Pomodoro timer (25 min focus) 🍅\n2. Take notes while studying 📝\n3. Take breaks every 25 minutes ☕\n4. Stay hydrated 💧\n5. Minimize distractions 🔇",
  "focus": "Here's how to stay focused:\n• Use fullscreen mode for immersion 🎯\n• Turn off notifications 🔕\n• Use the Pomodoro technique ⏱️\n• Keep your workspace clean 🧹\n• Set a clear goal before starting 📋",
  "study": "Tips for effective studying:\n1. Active recall - test yourself 🧠\n2. Spaced repetition - review regularly 📅\n3. Pomodoro technique - 25 min sessions 🍅\n4. Note-taking - write while learning ✍️\n5. Teach others - explain concepts aloud 🗣️",
  "concentrate": "To boost concentration:\n• Start with the hardest task 🎯\n• Use the two-minute rule 🕐\n• Remove all distractions 📵\n• Try ambient music or white noise 🎵\n• Stay hydrated and take breaks 💧",
  
  // Timer usage
  "timer": "The Pomodoro timer is your best friend! ⏱️ Try:\n• 25 minutes of focused work\n• 5 minute short break\n• After 4 sessions, take a 15 minute long break\nThis helps maintain peak productivity!",
  "pomodoro": "The Pomodoro Technique is amazing! 🍅\n1. Choose a task\n2. Set timer for 25 minutes\n3. Work until timer rings\n4. Take a 5-minute break\n5. Every 4 pomodoros, take a longer break (15 min)\nIt's scientifically proven to boost focus!",
  "break": "Taking breaks is important! 🌟 After each Pomodoro session:\n• Short break (5 min): Stretch, hydrate, rest eyes\n• Long break (15 min): Go for a walk, meditate, or relax\nBreaks help you maintain focus!",
  "start": "Ready to start? 🚀 Click the 'Start' button on the Focus page to begin your Pomodoro session. You've got this!",
  
  // Tracking progress
  "progress": "You can track your progress in the History view! 📊 Keep an eye on:\n• Total focus time\n• Sessions completed\n• Your current streak\n• Consistency is key!",
  "streak": "Streaks are motivating! 🔥 Try to maintain consecutive days with at least one focus session. Even one 25-minute session counts!",
  "stats": "Check your stats on the dashboard! 📈 You can see:\n• Today's focus time\n• Current streak 🔥\n• Sessions completed\n• Timeline of your work\nTracking progress keeps you motivated!",
  "history": "Your history shows all completed sessions! 📚 Navigate to the History view to see:\n• Total sessions\n• Total time spent\n• Average session length\nGreat for tracking your productivity journey!",
  
  // Notes
  "notes": "The Notes feature helps you:\n• Capture key ideas while studying 💡\n• Organize your thoughts 📝\n• Reference important concepts 📖\n• Pro tip: Review your notes during breaks!",
  "note": "Taking notes is powerful! ✍️ Use the Notes panel on the right to jot down important points, questions, or insights while studying.",
  
  // Features
  "features": "BuddyOS includes:\n🍅 Pomodoro Timer (25/5/15 min)\n📝 Notes - capture your ideas\n📊 History - track your sessions\n⚙️ Settings - customize durations\n🌙 Dark Mode - easy on the eyes\n🔐 Login - personalized experience",
  "fullscreen": "Fullscreen mode helps you focus! 🎯 When you start a timer:\n• App goes fullscreen for immersion\n• Minimal distractions\n• If you switch tabs, timer pauses\n• Resume in fullscreen to keep focus!",
  "settings": "In Settings, you can:\n⚙️ Adjust timer durations\n🌙 Toggle dark mode\n📱 Enable/disable fullscreen\n⏸️ Configure tab detection\n👤 Update your display name\nCustomize BuddyOS to fit your workflow!",
  
  // Productivity advice
  "productive": "To be more productive:\n1. Plan your day the night before 📋\n2. Use the Pomodoro technique 🍅\n3. Take regular breaks ☕\n4. Stay hydrated 💧\n5. Celebrate small wins 🎉\nYou're building great habits!",
  "distracted": "Feeling distracted? Try this:\n• Close unnecessary tabs 🚫\n• Put phone in another room 📵\n• Use fullscreen mode 🎯\n• Try noise-canceling music 🎧\n• Start with just 5 minutes ⏰",
  
  // General
  "help": "I can help with:\n• Study tips and motivation 📚\n• How to use BuddyOS features 🎯\n• Pomodoro technique guidance ⏱️\n• Overcoming procrastination 💪\n• Tracking progress 📊\nJust ask away!",
  "thanks": "You're welcome! 😊 Now go ace those studies! 📚",
  "thank": "Happy to help! 🎉 Keep up the great work!",
  "thank you": "You're very welcome! 🌟 I'm here whenever you need support!",
  "bye": "Goodbye! 👋 Come back anytime you need study support. You've got this!",
  "goodbye": "See you later! 🌟 Keep up the amazing work!",
  
  // Questions about app
  "how": "What would you like to know how to do? I can help with:\n• Starting a focus session\n• Taking notes\n• Viewing your history\n• Changing settings\n• Using the Pomodoro technique\nJust ask!",
  "what": "What would you like to know about? Ask me about:\n• BuddyOS features\n• Study techniques\n• The Pomodoro method\n• Staying motivated\n• Tracking progress",
  
  // Default response
  "default": "That's a great question! 💭 Here's what I think:\n\nI'm here to help you study smarter, not harder. Whether you need motivation, study tips, or help using BuddyOS, just ask!\n\nTry asking me about:\n• Study tips\n• Pomodoro technique\n• Staying focused\n• BuddyOS features\n\nWhat would you like to know?"
};

// ===============================================
// THEME MANAGEMENT
// ===============================================

function initTheme() {
  // Initialize theme (default to light mode)
  if (!themeInitialized) {
    currentTheme = 'light';
    themeInitialized = true;
  }
  
  // Apply the current theme to html element
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon();
  
  console.log('Theme initialized:', currentTheme);
}

function toggleTheme() {
  // Toggle between light and dark mode
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  // Apply theme to html element
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  // Update icon in all toggle buttons
  updateThemeIcon();
  
  // Update dark mode toggle in settings if on settings page
  if (appState.currentView === 'settings') {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
      darkModeToggle.checked = (currentTheme === 'dark');
    }
  }
  
  console.log('Theme toggled to:', currentTheme);
}

function updateThemeIcon() {
  // Set icon based on current theme
  const icon = currentTheme === 'light' ? '🌙' : '☀️';
  const tooltip = currentTheme === 'light' ? 'Toggle dark mode' : 'Toggle light mode';
  
  // Update navbar icon (main app)
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    themeIcon.textContent = icon;
  }
  
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.title = tooltip;
    themeBtn.setAttribute('aria-label', tooltip);
  }
  
  // Update auth page icon
  const authThemeIcon = document.getElementById('authThemeIcon');
  if (authThemeIcon) {
    authThemeIcon.textContent = icon;
  }
  
  const authThemeBtn = document.getElementById('authThemeToggleBtn');
  if (authThemeBtn) {
    authThemeBtn.title = tooltip;
    authThemeBtn.setAttribute('aria-label', tooltip);
  }
}

// ===============================================
// INITIALIZATION
// ===============================================

function init() {
  // Initialize theme FIRST before anything else
  initTheme();
  
  // Initialize notifications and reminders
  initNotifications();
  initReminders();
  
  // Initialize chatbot (available on all pages)
  initChatbot();
  
  // Check if user is logged in
  if (!currentUser) {
    showAuthPage();
    setupAuthEventListeners();
    return;
  }
  
  showAppContainer();
  updateDateDisplay();
  displayRandomQuote();
  updateStatistics();
  updateTimerDisplay();
  renderTimeline();
  renderNotesList();
  renderFullNotesList();
  renderFullHistory();
  setupEventListeners();
  setupKeyboardShortcuts();
  setupTabDetection();
  setupFullscreenHandlers();
  setupResearchDock();
  
  // CRITICAL: Hide all views first, then show only Focus view
  hideAllViews();
  switchView('focus');
  
  // Update notification badge
  updateNotificationBadge();
}

// Hide ALL views immediately
function hideAllViews() {
  const views = document.querySelectorAll('.timer-view, .notes-view, .history-view, .research-view, .settings-view, .view, .focus-view');
  views.forEach(view => {
    view.classList.remove('active');
    view.style.display = 'none';
  });
}

function showAuthPage() {
  document.getElementById('authPage').classList.remove('hidden');
  document.getElementById('appContainer').classList.add('hidden');
}

function showAppContainer() {
  document.getElementById('authPage').classList.add('hidden');
  document.getElementById('appContainer').classList.remove('hidden');
  updateUserUI();
}

function updateUserUI() {
  if (!currentUser) return;
  
  const firstName = currentUser.fullName.split(' ')[0];
  const initials = currentUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  
  document.getElementById('userName').textContent = firstName;
  document.getElementById('profileIcon').textContent = initials;
  document.getElementById('dropdownUserName').textContent = currentUser.fullName;
  document.getElementById('dropdownUserEmail').textContent = currentUser.email;
  
  // Update app state with user data
  appState.user.name = currentUser.fullName;
  appState.user.focusTimeToday = currentUser.focusStats.totalFocusTime;
  appState.user.streak = currentUser.focusStats.currentStreak;
  appState.user.sessionsCompleted = currentUser.focusStats.sessionsCompleted;
  
  // Load user's notes and sessions
  appState.notes = currentUser.notes || [];
  appState.sessions = currentUser.sessions || [];
  
  updateStatistics();
  renderTimeline();
  renderNotesList();
  renderFullNotesList();
  renderFullHistory();
}

// ===============================================
// AUTHENTICATION FUNCTIONALITY
// ===============================================

function setupAuthEventListeners() {
  // Login form
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  
  // Signup form
  document.getElementById('signupForm').addEventListener('submit', handleSignup);
  
  // Password strength indicator
  document.getElementById('signupPassword').addEventListener('input', updatePasswordStrength);
  
  // Real-time validation
  document.getElementById('signupEmail').addEventListener('blur', validateSignupEmail);
  document.getElementById('signupConfirmPassword').addEventListener('input', validatePasswordMatch);
  
  // Pre-fill remembered email if exists
  if (rememberedEmail) {
    document.getElementById('loginEmail').value = rememberedEmail;
    document.getElementById('rememberMe').checked = true;
  }
}

function switchAuthTab(tab) {
  const loginTab = document.getElementById('loginTab');
  const signupTab = document.getElementById('signupTab');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  
  if (tab === 'login') {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    clearAuthErrors();
  } else {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    clearAuthErrors();
  }
}

function clearAuthErrors() {
  document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
  document.querySelectorAll('.auth-input').forEach(el => el.classList.remove('error'));
  document.getElementById('passwordStrength').textContent = '';
}

function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const rememberMe = document.getElementById('rememberMe').checked;
  
  // Clear previous errors
  clearAuthErrors();
  
  // Validate
  let hasError = false;
  
  if (!validateEmail(email)) {
    showFieldError('loginEmail', 'Please enter a valid email address');
    hasError = true;
  }
  
  if (password.length < 6) {
    showFieldError('loginPassword', 'Password must be at least 6 characters');
    hasError = true;
  }
  
  if (hasError) return;
  
  // Find user
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    showFieldError('loginEmail', 'Invalid email or password');
    showFieldError('loginPassword', 'Invalid email or password');
    showToast('Invalid email or password', 'error');
    return;
  }
  
  // Login successful
  currentUser = user;
  
  if (rememberMe) {
    rememberedEmail = email;
  }
  
  showToast('Login successful!', 'success');
  
  setTimeout(() => {
    showAppContainer();
    init();
  }, 1000);
}

function handleSignup(e) {
  e.preventDefault();
  
  const fullName = document.getElementById('signupFullName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;
  const termsAccepted = document.getElementById('termsCheckbox').checked;
  
  // Clear previous errors
  clearAuthErrors();
  
  // Validate
  let hasError = false;
  
  if (fullName.length < 2) {
    showFieldError('signupFullName', 'Please enter your full name');
    hasError = true;
  }
  
  if (!validateEmail(email)) {
    showFieldError('signupEmail', 'Please enter a valid email address');
    hasError = true;
  } else if (users.find(u => u.email === email)) {
    showFieldError('signupEmail', 'This email is already registered');
    hasError = true;
  }
  
  if (password.length < 6) {
    showFieldError('signupPassword', 'Password must be at least 6 characters');
    hasError = true;
  }
  
  if (password !== confirmPassword) {
    showFieldError('signupConfirmPassword', 'Passwords do not match');
    hasError = true;
  }
  
  if (!termsAccepted) {
    showFieldError('termsCheckbox', 'You must agree to the Terms of Service');
    hasError = true;
  }
  
  if (hasError) return;
  
  // Create new user
  const newUser = {
    id: Date.now(),
    fullName: fullName,
    email: email,
    password: password,
    createdDate: new Date(),
    focusStats: {
      totalFocusTime: 0,
      sessionsCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      notesCount: 0
    },
    notes: [],
    sessions: []
  };
  
  users.push(newUser);
  currentUser = newUser;
  
  showToast('Account created successfully!', 'success');
  
  setTimeout(() => {
    showAppContainer();
    init();
  }, 1000);
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorSpan = document.getElementById(fieldId + 'Error');
  
  if (field) {
    field.classList.add('error');
  }
  
  if (errorSpan) {
    errorSpan.textContent = message;
  }
}

function validateSignupEmail() {
  const email = document.getElementById('signupEmail').value.trim();
  const errorSpan = document.getElementById('signupEmailError');
  
  if (email && !validateEmail(email)) {
    showFieldError('signupEmail', 'Please enter a valid email address');
  } else if (email && users.find(u => u.email === email)) {
    showFieldError('signupEmail', 'This email is already registered');
  } else {
    document.getElementById('signupEmail').classList.remove('error');
    errorSpan.textContent = '';
  }
}

function validatePasswordMatch() {
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;
  const errorSpan = document.getElementById('signupConfirmPasswordError');
  const field = document.getElementById('signupConfirmPassword');
  
  if (confirmPassword && password !== confirmPassword) {
    field.classList.add('error');
    errorSpan.textContent = 'Passwords do not match';
  } else {
    field.classList.remove('error');
    errorSpan.textContent = '';
  }
}

function updatePasswordStrength() {
  const password = document.getElementById('signupPassword').value;
  const strengthDiv = document.getElementById('passwordStrength');
  
  if (password.length === 0) {
    strengthDiv.textContent = '';
    strengthDiv.className = 'password-strength';
    return;
  }
  
  if (password.length < 6) {
    strengthDiv.textContent = '✗ Weak (min 6 characters required)';
    strengthDiv.className = 'password-strength weak';
  } else if (password.length <= 10) {
    strengthDiv.textContent = '✓ Fair password';
    strengthDiv.className = 'password-strength fair';
  } else {
    strengthDiv.textContent = '✓ Strong password';
    strengthDiv.className = 'password-strength strong';
  }
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastIcon = document.getElementById('toastIcon');
  const toastMessage = document.getElementById('toastMessage');
  
  // Set icon and styling
  if (type === 'success') {
    toastIcon.textContent = '✓';
    toast.classList.remove('error');
    toast.classList.add('success');
  } else {
    toastIcon.textContent = '✗';
    toast.classList.remove('success');
    toast.classList.add('error');
  }
  
  toastMessage.textContent = message;
  toast.classList.remove('hidden');
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

function toggleProfileMenu() {
  const dropdown = document.getElementById('profileDropdown');
  dropdown.classList.toggle('hidden');
}

function showProfile() {
  toggleProfileMenu();
  
  if (!currentUser) return;
  
  // Update profile modal
  const initials = currentUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  document.getElementById('profileAvatarLarge').textContent = initials;
  document.getElementById('profileModalName').textContent = currentUser.fullName;
  document.getElementById('profileModalEmail').textContent = currentUser.email;
  
  // Format member since date
  const memberSince = new Date(currentUser.createdDate).toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  });
  document.getElementById('profileMemberSince').textContent = memberSince;
  
  // Update stats
  const hours = Math.floor(currentUser.focusStats.totalFocusTime / 60);
  const minutes = currentUser.focusStats.totalFocusTime % 60;
  document.getElementById('profileTotalTime').textContent = `${hours}:${minutes.toString().padStart(2, '0')}`;
  document.getElementById('profileSessions').textContent = currentUser.focusStats.sessionsCompleted;
  document.getElementById('profileStreak').textContent = currentUser.focusStats.currentStreak;
  document.getElementById('profileNotes').textContent = currentUser.notes.length;
  
  // Show modal
  document.getElementById('profileModal').classList.remove('hidden');
}

function closeProfile() {
  document.getElementById('profileModal').classList.add('hidden');
}

function logout() {
  if (!confirm('Are you sure you want to logout?')) {
    return;
  }
  
  toggleProfileMenu();
  
  // Save user data back to users array
  if (currentUser) {
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = currentUser;
    }
  }
  
  // Clear current user
  currentUser = null;
  
  // Reset app state
  appState.user = {
    name: 'User',
    focusTimeToday: 0,
    streak: 0,
    sessionsCompleted: 0
  };
  appState.notes = [];
  appState.sessions = [];
  
  // Clear notifications and reminders
  notificationsState.notifications = [];
  notificationsState.unreadCount = 0;
  updateNotificationBadge();
  
  // Stop reminder checking
  if (remindersState.checkInterval) {
    clearInterval(remindersState.checkInterval);
    remindersState.checkInterval = null;
  }
  remindersState.reminders = [];
  
  // Clear chat history
  chatHistory = [];
  if (chatOpen) {
    closeChat();
  }
  
  // Stop timer if running
  if (appState.timer.isRunning) {
    pauseTimer();
  }
  
  if (appState.timer.isFullscreen) {
    exitFullscreenMode();
  }
  
  showToast('Logged out successfully!', 'success');
  
  setTimeout(() => {
    showAuthPage();
    setupAuthEventListeners();
    
    // Reset forms
    document.getElementById('loginForm').reset();
    document.getElementById('signupForm').reset();
    clearAuthErrors();
  }, 1000);
}

// ===============================================
// NOTIFICATIONS & REMINDERS SYSTEM
// ===============================================

function initNotifications() {
  // Add initial welcome notification
  if (currentUser && notificationsState.notifications.length === 0) {
    addNotification({
      type: 'system',
      icon: '👋',
      title: 'Welcome to BuddyOS!',
      message: 'Your notifications will appear here',
      timestamp: new Date()
    });
  }
  
  // Request browser notification permission if enabled
  if (notificationsState.settings.browserEnabled && 'Notification' in window) {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
}

function initReminders() {
  // Add default reminders
  if (remindersState.reminders.length === 0) {
    remindersState.reminders = [
      {
        id: Date.now() + 1,
        title: 'Daily Study Session',
        type: 'study',
        time: '09:00',
        repeat: 'daily',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        message: 'Time to start your daily study session!',
        enabled: true,
        lastTriggered: null
      },
      {
        id: Date.now() + 2,
        title: 'Afternoon Break',
        type: 'break',
        time: '13:00',
        repeat: 'weekdays',
        daysOfWeek: [1, 2, 3, 4, 5],
        message: 'Take a break and recharge',
        enabled: false,
        lastTriggered: null
      },
      {
        id: Date.now() + 3,
        title: 'Evening Study Time',
        type: 'study',
        time: '18:00',
        repeat: 'daily',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        message: 'Ready for some evening studying?',
        enabled: false,
        lastTriggered: null
      },
      {
        id: Date.now() + 4,
        title: 'Maintain Your Streak',
        type: 'goal',
        time: '23:00',
        repeat: 'daily',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        message: "Don't break the chain! Study today",
        enabled: false,
        lastTriggered: null
      }
    ];
  }
  
  // Start reminder checking interval (check every minute)
  if (!remindersState.checkInterval) {
    remindersState.checkInterval = setInterval(checkReminders, 60000);
    // Also check immediately
    checkReminders();
  }
  
  // Render reminders list
  renderRemindersList();
}

function checkReminders() {
  if (!currentUser) return;
  
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const dayOfWeek = now.getDay();
  
  // Check if in quiet hours
  if (isQuietHours()) {
    return;
  }
  
  remindersState.reminders.forEach(reminder => {
    if (!reminder.enabled) return;
    if (reminder.time !== currentTime) return;
    
    // Check if already triggered today
    if (reminder.lastTriggered) {
      const lastDate = new Date(reminder.lastTriggered);
      if (lastDate.toDateString() === now.toDateString()) {
        return; // Already triggered today
      }
    }
    
    // Check if today matches repeat pattern
    if (!reminder.daysOfWeek.includes(dayOfWeek)) {
      return;
    }
    
    // Trigger reminder
    triggerReminder(reminder);
    reminder.lastTriggered = now;
  });
}

function isQuietHours() {
  if (!notificationsState.settings.quietHoursEnabled) return false;
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const startParts = notificationsState.settings.quietHoursStart.split(':');
  const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
  
  const endParts = notificationsState.settings.quietHoursEnd.split(':');
  const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
  
  if (startMinutes < endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  } else {
    // Crosses midnight
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
}

function triggerReminder(reminder) {
  remindersState.activeReminder = reminder;
  remindersState.snoozeCount = 0;
  
  // Show reminder modal
  showReminderModal(reminder);
  
  // Add to notifications
  addNotification({
    type: 'reminder',
    icon: '📚',
    title: reminder.title,
    message: reminder.message,
    timestamp: new Date()
  });
  
  // Show browser notification if enabled
  if (notificationsState.settings.browserEnabled && 'Notification' in window && Notification.permission === 'granted') {
    new Notification(reminder.title, {
      body: reminder.message,
      icon: 'https://via.placeholder.com/128/4FC3F7/FFFFFF?text=B',
      badge: 'https://via.placeholder.com/96/4FC3F7/FFFFFF?text=B'
    });
  }
}

function showReminderModal(reminder) {
  const modal = document.getElementById('reminderModal');
  document.getElementById('reminderTitle').textContent = reminder.title;
  document.getElementById('reminderMessage').textContent = reminder.message;
  
  // Update action button based on type
  const actionBtn = document.getElementById('reminderActionBtn');
  if (reminder.type === 'study') {
    actionBtn.textContent = 'Start Session';
  } else if (reminder.type === 'break') {
    actionBtn.textContent = 'Take Break';
  } else if (reminder.type === 'goal') {
    actionBtn.textContent = 'View Goals';
  } else {
    actionBtn.textContent = 'OK';
  }
  
  modal.classList.remove('hidden');
}

function handleReminderAction() {
  const reminder = remindersState.activeReminder;
  dismissReminder();
  
  if (reminder && reminder.type === 'study') {
    // Switch to focus view and start timer
    switchView('focus');
    if (!appState.timer.isRunning) {
      startTimer();
    }
  }
}

function snoozeReminder() {
  if (remindersState.snoozeCount >= 3) {
    showToastNotification('Maximum snoozes reached', 'Reminder dismissed', 'warning');
    dismissReminder();
    return;
  }
  
  remindersState.snoozeCount++;
  document.getElementById('reminderModal').classList.add('hidden');
  
  // Show snooze notification
  showToastNotification('Reminder snoozed', 'Will remind again in 5 minutes', 'info');
  
  // Set timeout for 5 minutes
  setTimeout(() => {
    if (remindersState.activeReminder) {
      showReminderModal(remindersState.activeReminder);
    }
  }, 5 * 60 * 1000);
}

function dismissReminder() {
  document.getElementById('reminderModal').classList.add('hidden');
  remindersState.activeReminder = null;
  remindersState.snoozeCount = 0;
}

function addNotification(notification) {
  const newNotification = {
    id: Date.now(),
    ...notification,
    read: false,
    timestamp: notification.timestamp || new Date()
  };
  
  notificationsState.notifications.unshift(newNotification);
  notificationsState.unreadCount++;
  
  updateNotificationBadge();
  renderNotifications();
  
  // Show toast if enabled and not in quiet hours
  if (notificationsState.settings.toastEnabled && !isQuietHours()) {
    showToastNotification(notification.title, notification.message, notification.type || 'info', notification.icon);
  }
}

function showToastNotification(title, message, type = 'info', icon = null) {
  // Remove existing toast if any
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast-notification ${type}`;
  
  // Set icon based on type if not provided
  if (!icon) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      achievement: '🏆',
      session: '⏰',
      reminder: '📚'
    };
    icon = icons[type] || '🔔';
  }
  
  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">
      <div class="toast-title">${escapeHtml(title)}</div>
      <div class="toast-message">${escapeHtml(message)}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;
  
  document.body.appendChild(toast);
  
  // Auto dismiss based on type
  const durations = {
    success: 4000,
    error: 6000,
    warning: 5000,
    info: 4000,
    achievement: 5000
  };
  
  const duration = durations[type] || 4000;
  
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }
  }, duration);
}

function toggleNotifications() {
  const dropdown = document.getElementById('notificationDropdown');
  dropdown.classList.toggle('hidden');
  
  if (!dropdown.classList.contains('hidden')) {
    // Mark all as read
    notificationsState.notifications.forEach(n => n.read = true);
    notificationsState.unreadCount = 0;
    updateNotificationBadge();
    renderNotifications();
  }
}

function switchNotificationTab(tab) {
  notificationsState.currentTab = tab;
  
  // Update active tab
  document.querySelectorAll('.notification-tab').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  
  renderNotifications();
}

function renderNotifications() {
  const container = document.getElementById('notificationList');
  
  // Filter based on current tab
  let filtered = notificationsState.notifications;
  if (notificationsState.currentTab === 'reminders') {
    filtered = filtered.filter(n => n.type === 'reminder' || n.type === 'study' || n.type === 'break');
  } else if (notificationsState.currentTab === 'achievements') {
    filtered = filtered.filter(n => n.type === 'achievement' || n.type === 'streak');
  }
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="notification-empty">
        <div class="empty-icon">🔔</div>
        <p>No notifications yet</p>
        <small>You'll see notifications here</small>
      </div>
    `;
    return;
  }
  
  container.innerHTML = filtered.map(notification => `
    <div class="notification-item ${notification.read ? '' : 'unread'}" onclick="markAsRead(${notification.id})">
      <div class="notification-icon">${notification.icon}</div>
      <div class="notification-content">
        <div class="notification-text"><strong>${escapeHtml(notification.title)}</strong> ${escapeHtml(notification.message)}</div>
        <div class="notification-time">${formatTimestamp(notification.timestamp)}</div>
      </div>
    </div>
  `).join('');
}

function markAsRead(id) {
  const notification = notificationsState.notifications.find(n => n.id === id);
  if (notification && !notification.read) {
    notification.read = true;
    notificationsState.unreadCount = Math.max(0, notificationsState.unreadCount - 1);
    updateNotificationBadge();
    renderNotifications();
  }
}

function clearAllNotifications() {
  if (notificationsState.notifications.length === 0) return;
  
  if (confirm('Clear all notifications?')) {
    notificationsState.notifications = [];
    notificationsState.unreadCount = 0;
    updateNotificationBadge();
    renderNotifications();
    showToastNotification('Notifications cleared', 'All notifications have been removed', 'success');
  }
}

function updateNotificationBadge() {
  const badge = document.getElementById('notificationBadge');
  if (!badge) return;
  
  if (notificationsState.unreadCount > 0) {
    badge.textContent = notificationsState.unreadCount > 99 ? '99+' : notificationsState.unreadCount;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

// Reminder Management Functions
function openAddReminderModal() {
  document.getElementById('addReminderModal').classList.remove('hidden');
  document.getElementById('addReminderForm').reset();
  
  // Show/hide custom days based on repeat selection
  document.getElementById('reminderRepeat').addEventListener('change', function() {
    const customDays = document.getElementById('customDaysGroup');
    if (this.value === 'custom') {
      customDays.style.display = 'block';
    } else {
      customDays.style.display = 'none';
    }
  });
}

function closeAddReminderModal() {
  document.getElementById('addReminderModal').classList.add('hidden');
}

document.getElementById('addReminderForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const title = document.getElementById('reminderTitleInput').value.trim();
  const type = document.getElementById('reminderType').value;
  const time = document.getElementById('reminderTime').value;
  const repeat = document.getElementById('reminderRepeat').value;
  const customMessage = document.getElementById('reminderMessageInput').value.trim();
  
  // Determine days of week
  let daysOfWeek = [];
  if (repeat === 'daily') {
    daysOfWeek = [0, 1, 2, 3, 4, 5, 6];
  } else if (repeat === 'weekdays') {
    daysOfWeek = [1, 2, 3, 4, 5];
  } else if (repeat === 'weekends') {
    daysOfWeek = [0, 6];
  } else if (repeat === 'custom') {
    const checkboxes = document.querySelectorAll('#customDaysGroup input[type="checkbox"]:checked');
    daysOfWeek = Array.from(checkboxes).map(cb => parseInt(cb.value));
    if (daysOfWeek.length === 0) {
      alert('Please select at least one day');
      return;
    }
  }
  
  // Default messages by type
  const defaultMessages = {
    study: 'Time to start your study session!',
    break: 'Take a break and recharge',
    goal: 'Check your daily goals',
    custom: 'Reminder notification'
  };
  
  const newReminder = {
    id: Date.now(),
    title: title,
    type: type,
    time: time,
    repeat: repeat,
    daysOfWeek: daysOfWeek,
    message: customMessage || defaultMessages[type],
    enabled: true,
    lastTriggered: null
  };
  
  remindersState.reminders.push(newReminder);
  renderRemindersList();
  closeAddReminderModal();
  
  showToastNotification('Reminder added', `${title} will remind you at ${time}`, 'success');
});

function renderRemindersList() {
  const container = document.getElementById('remindersList');
  if (!container) return;
  
  if (remindersState.reminders.length === 0) {
    container.innerHTML = '<div class="empty-state" style="padding: 20px; font-size: 13px;">No reminders yet. Add your first reminder!</div>';
    return;
  }
  
  container.innerHTML = remindersState.reminders.map(reminder => {
    const repeatText = reminder.repeat === 'custom' 
      ? `Custom (${reminder.daysOfWeek.length} days)`
      : reminder.repeat.charAt(0).toUpperCase() + reminder.repeat.slice(1);
    
    return `
      <div class="reminder-list-item">
        <div class="reminder-list-info">
          <div class="reminder-list-title">${escapeHtml(reminder.title)}</div>
          <div class="reminder-list-details">${reminder.time} • ${repeatText}</div>
        </div>
        <div class="reminder-list-actions">
          <label class="reminder-toggle">
            <input type="checkbox" ${reminder.enabled ? 'checked' : ''} onchange="toggleReminder(${reminder.id})">
            <span class="reminder-toggle-slider"></span>
          </label>
          <button class="reminder-delete-btn" onclick="deleteReminder(${reminder.id})">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function toggleReminder(id) {
  const reminder = remindersState.reminders.find(r => r.id === id);
  if (reminder) {
    reminder.enabled = !reminder.enabled;
    showToastNotification(
      reminder.enabled ? 'Reminder enabled' : 'Reminder disabled',
      reminder.title,
      'info'
    );
  }
}

function deleteReminder(id) {
  if (confirm('Delete this reminder?')) {
    remindersState.reminders = remindersState.reminders.filter(r => r.id !== id);
    renderRemindersList();
    showToastNotification('Reminder deleted', 'Reminder has been removed', 'success');
  }
}

// ===============================================
// DATE & QUOTE
// ===============================================

function updateDateDisplay() {
  const dateElement = document.getElementById('dateDisplay');
  const now = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  dateElement.textContent = now.toLocaleDateString('en-US', options);
}

function displayRandomQuote() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById('quoteText').textContent = `"${randomQuote.text}"`;
  document.getElementById('quoteAuthor').textContent = `– ${randomQuote.author}`;
}

// ===============================================
// STATISTICS
// ===============================================

function updateStatistics() {
  const hours = Math.floor(appState.user.focusTimeToday / 60);
  const minutes = appState.user.focusTimeToday % 60;
  document.getElementById('focusTime').textContent = `${hours}:${minutes.toString().padStart(2, '0')}`;
  document.getElementById('streakCount').textContent = appState.user.streak;
  document.getElementById('sessionCount').textContent = appState.user.sessionsCompleted;
}

// ===============================================
// NAVIGATION
// ===============================================

function setupEventListeners() {
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    const profileIcon = document.getElementById('profileIcon');
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown && !dropdown.classList.contains('hidden')) {
      if (!profileIcon.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    }
    
    const notificationBell = document.getElementById('notificationBell');
    const notificationDropdown = document.getElementById('notificationDropdown');
    if (notificationDropdown && !notificationDropdown.classList.contains('hidden')) {
      if (!notificationBell.contains(e.target) && !notificationDropdown.contains(e.target)) {
        notificationDropdown.classList.add('hidden');
      }
    }
  });
  
  // Close profile modal when clicking outside
  document.getElementById('profileModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'profileModal') {
      closeProfile();
    }
  });
  
  // Navigation buttons
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      switchView(view);
    });
  });

  // Timer controls
  document.getElementById('startPauseBtn').addEventListener('click', toggleTimer);
  document.getElementById('resetBtn').addEventListener('click', resetTimer);
  document.getElementById('shortBreakBtn').addEventListener('click', () => setTimerMode('shortBreak'));
  document.getElementById('longBreakBtn').addEventListener('click', () => setTimerMode('longBreak'));

  // Notes
  document.getElementById('saveNoteBtn').addEventListener('click', saveNote);
  document.getElementById('clearNoteBtn').addEventListener('click', clearNoteInput);

  // Settings
  document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
  document.getElementById('fullscreenToggle').addEventListener('change', updateFullscreenSetting);
  document.getElementById('darkModeToggle').addEventListener('change', handleDarkModeToggle);

  // Fullscreen modal buttons
  document.getElementById('resumeFullscreenBtn').addEventListener('click', resumeInFullscreen);
  document.getElementById('resumeWindowedBtn').addEventListener('click', resumeInWindowed);

  // Celebration buttons
  document.getElementById('nextSessionBtn').addEventListener('click', startNextSession);
  document.getElementById('exitFullscreenBtn').addEventListener('click', exitCelebration);
}

function switchView(viewName) {
  // Step 1: Hide ALL views first (including settings)
  hideAllViews();
  
  // Step 2: Update navigation buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-view="${viewName}"]`)?.classList.add('active');

  const viewMap = {
    focus: 'focusView',
    notes: 'notesView',
    history: 'historyView',
    settings: 'settingsView',
    research: 'researchView'
  };

  // Step 3: Show only the selected view
  const targetView = document.getElementById(viewMap[viewName]);
  if (targetView) {
    targetView.classList.add('active');
    targetView.style.display = 'flex';
  }
  
  appState.currentView = viewName;

  // Refresh data for specific views
  if (viewName === 'notes') {
    renderFullNotesList();
  } else if (viewName === 'history') {
    renderFullHistory();
  } else if (viewName === 'settings') {
    loadSettingsToUI();
  } else if (viewName === 'research') {
    renderResearchSources();
    updateResearchStats();
  }
}

// Load current settings into the UI
function loadSettingsToUI() {
  document.getElementById('workDuration').value = appState.settings.workDuration;
  document.getElementById('shortBreakDuration').value = appState.settings.shortBreakDuration;
  document.getElementById('longBreakDuration').value = appState.settings.longBreakDuration;
  
  // Use current user's full name if available
  const displayName = currentUser ? currentUser.fullName : appState.user.name;
  document.getElementById('displayName').value = displayName;
  
  document.getElementById('tabDetection').checked = appState.settings.tabDetectionEnabled;
  document.getElementById('fullscreenToggle').checked = appState.settings.fullscreenEnabled;
  document.getElementById('darkModeToggle').checked = (currentTheme === 'dark');
  
  // Load notification settings
  document.getElementById('toastNotifications').checked = notificationsState.settings.toastEnabled;
  document.getElementById('browserNotifications').checked = notificationsState.settings.browserEnabled;
  document.getElementById('sessionAlerts').checked = notificationsState.settings.sessionAlerts;
  document.getElementById('streakAlerts').checked = notificationsState.settings.streakAlerts;
  document.getElementById('quietHours').checked = notificationsState.settings.quietHoursEnabled;
  document.getElementById('quietHoursStart').value = notificationsState.settings.quietHoursStart;
  document.getElementById('quietHoursEnd').value = notificationsState.settings.quietHoursEnd;
  
  // Show/hide quiet hours settings
  const quietHoursSettings = document.getElementById('quietHoursSettings');
  if (quietHoursSettings) {
    quietHoursSettings.style.display = notificationsState.settings.quietHoursEnabled ? 'block' : 'none';
  }
  
  // Render reminders list
  renderRemindersList();
}

function handleDarkModeToggle() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (!darkModeToggle) return;
  
  const isDark = darkModeToggle.checked;
  currentTheme = isDark ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon();
  
  console.log('Dark mode toggled from settings:', currentTheme);
}

// ===============================================
// TIMER FUNCTIONALITY
// ===============================================

function updateTimerDisplay() {
  const minutes = Math.floor(appState.timer.timeRemaining / 60);
  const seconds = appState.timer.timeRemaining % 60;
  document.getElementById('timerDisplay').textContent = 
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function toggleTimer() {
  if (appState.timer.isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  if (appState.timer.timeRemaining <= 0) {
    resetTimer();
    return;
  }

  appState.timer.isRunning = true;
  document.getElementById('startPauseBtn').textContent = 'Pause';
  document.getElementById('timerStatus').textContent = '';
  
  // Send session start notification
  if (notificationsState.settings.sessionAlerts && !isQuietHours()) {
    const sessionTypes = {
      work: 'Focus session',
      shortBreak: 'Short break',
      longBreak: 'Long break'
    };
    showToastNotification(
      'Session started',
      `${sessionTypes[appState.timer.mode]} is now running`,
      'session',
      '✅'
    );
  }
  
  // Reset popup timer display if popup is open
  if (researchPopupState.isOpen) {
    const timerDisplay = document.getElementById('researchPopupTimer');
    if (timerDisplay) {
      timerDisplay.style.background = '';
      timerDisplay.style.color = '';
      updatePopupTimer();
    }
  }

  // Request fullscreen mode only if enabled in settings
  if (appState.settings.fullscreenEnabled) {
    requestFullscreenMode();
  }

  appState.timer.intervalId = setInterval(() => {
    appState.timer.timeRemaining--;
    updateTimerDisplay();
    updateFullscreenTimer();
    updateProgressBar();
    
    // Update popup timer if open
    if (researchPopupState.isOpen) {
      updatePopupTimer();
    }

    if (appState.timer.timeRemaining <= 0) {
      timerComplete();
    }
  }, 1000);
}

function pauseTimer(showStatus = true) {
  appState.timer.isRunning = false;
  clearInterval(appState.timer.intervalId);
  document.getElementById('startPauseBtn').textContent = 'Start';
  
  if (showStatus) {
    document.getElementById('timerStatus').textContent = '';
  }
}

function resetTimer() {
  const confirmReset = appState.timer.isRunning ? 
    confirm('Are you sure you want to reset the timer?') : true;
  
  if (!confirmReset) return;

  // Exit fullscreen if active
  if (appState.timer.isFullscreen) {
    exitFullscreenMode();
  }

  pauseTimer();
  const durations = {
    work: appState.settings.workDuration,
    shortBreak: appState.settings.shortBreakDuration,
    longBreak: appState.settings.longBreakDuration
  };
  appState.timer.timeRemaining = durations[appState.timer.mode] * 60;
  appState.timer.totalTime = durations[appState.timer.mode] * 60;
  updateTimerDisplay();
  document.getElementById('timerStatus').textContent = '';
}

function setTimerMode(mode) {
  if (appState.timer.isRunning) {
    alert('Please pause the timer before changing modes.');
    return;
  }

  appState.timer.mode = mode;
  const durations = {
    work: appState.settings.workDuration,
    shortBreak: appState.settings.shortBreakDuration,
    longBreak: appState.settings.longBreakDuration
  };
  appState.timer.timeRemaining = durations[mode] * 60;
  appState.timer.totalTime = durations[mode] * 60;
  updateTimerDisplay();
}

function timerComplete() {
  pauseTimer(false);
  appState.timer.timeRemaining = 0;
  updateTimerDisplay();
  updateFullscreenTimer();
  
  // Update popup timer if open
  if (researchPopupState.isOpen) {
    updatePopupTimer();
  }

  // Log session if it was a work session
  if (appState.timer.mode === 'work') {
    logSession(appState.settings.workDuration);
    
    // Send completion notification
    if (notificationsState.settings.sessionAlerts && !isQuietHours()) {
      addNotification({
        type: 'session',
        icon: '🎉',
        title: 'Focus session complete!',
        message: `Great job! You completed a ${appState.settings.workDuration}-minute focus session`,
        timestamp: new Date()
      });
    }
  }

  // Show celebration in fullscreen or normal mode
  if (appState.timer.isFullscreen) {
    showCelebrationScreen();
  } else {
    showCelebration();
    
    // If popup is open, show notification in popup header
    if (researchPopupState.isOpen) {
      const timerDisplay = document.getElementById('researchPopupTimer');
      if (timerDisplay) {
        timerDisplay.textContent = '✅ Session complete!';
        timerDisplay.style.background = 'rgba(76, 175, 80, 0.3)';
        timerDisplay.style.color = '#4CAF50';
      }
    }
    
    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('BuddyOS Timer Complete!', {
        body: `Your ${appState.timer.mode} session is complete!`,
        icon: 'https://via.placeholder.com/128/4FC3F7/FFFFFF?text=B'
      });
    }

    alert(`Timer complete! Great ${appState.timer.mode === 'work' ? 'work' : 'break'} session!`);
  }
}

function showCelebration() {
  // Simple celebration message
  const statusElement = document.getElementById('timerStatus');
  statusElement.textContent = '🎉 Session complete! Great work! 🎉';
  statusElement.style.color = '#4CAF50';
  
  setTimeout(() => {
    statusElement.textContent = '';
  }, 5000);
}

// ===============================================
// SESSION LOGGING
// ===============================================

function logSession(duration) {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const dateString = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  
  const session = {
    time: timeString,
    type: 'Focus',
    date: dateString,
    duration: `${duration} min`,
    timestamp: now
  };

  appState.sessions.unshift(session);
  appState.user.focusTimeToday += duration;
  appState.user.sessionsCompleted++;
  
  // Update current user's data
  if (currentUser) {
    currentUser.focusStats.totalFocusTime += duration;
    currentUser.focusStats.sessionsCompleted++;
    currentUser.sessions = appState.sessions;
    
    // Check for achievements
    checkAchievements();
  }

  updateStatistics();
  renderTimeline();
  renderFullHistory();
}

function checkAchievements() {
  if (!currentUser) return;
  
  const stats = currentUser.focusStats;
  
  // First session milestone
  if (stats.sessionsCompleted === 1) {
    addNotification({
      type: 'achievement',
      icon: '🎉',
      title: 'First Session Complete!',
      message: 'You completed your first focus session. Great start!',
      timestamp: new Date()
    });
  }
  
  // 10 sessions milestone
  if (stats.sessionsCompleted === 10) {
    addNotification({
      type: 'achievement',
      icon: '🏆',
      title: 'Focused Scholar',
      message: '10 focus sessions completed! You\'re building great habits!',
      timestamp: new Date()
    });
  }
  
  // 50 sessions milestone
  if (stats.sessionsCompleted === 50) {
    addNotification({
      type: 'achievement',
      icon: '⭐',
      title: 'Study Master',
      message: '50 focus sessions! You\'re unstoppable!',
      timestamp: new Date()
    });
  }
  
  // 10 hours studied
  if (stats.totalFocusTime >= 600 && stats.totalFocusTime < 610) {
    addNotification({
      type: 'achievement',
      icon: '💪',
      title: '10 Hours Milestone!',
      message: 'You\'ve studied for 10 hours total. Amazing dedication!',
      timestamp: new Date()
    });
  }
  
  // Streak milestones
  if (appState.user.streak === 7 && notificationsState.settings.streakAlerts) {
    addNotification({
      type: 'streak',
      icon: '🔥',
      title: '7-Day Streak!',
      message: 'One week of consistent studying. Keep it up!',
      timestamp: new Date()
    });
  }
  
  if (appState.user.streak === 30 && notificationsState.settings.streakAlerts) {
    addNotification({
      type: 'streak',
      icon: '🔥',
      title: '30-Day Streak!',
      message: 'One month of dedication! You\'re a study champion!',
      timestamp: new Date()
    });
  }
}

// ===============================================
// TAB DETECTION
// ===============================================

function setupTabDetection() {
  window.addEventListener('blur', () => {
    if (appState.settings.tabDetectionEnabled && appState.timer.isRunning) {
      pauseTimer(false);
      appState.timer.pausedByBlur = true;
      
      // Exit fullscreen if active
      if (appState.timer.isFullscreen || isFullscreenMode()) {
        exitFullscreenMode();
      }
      
      showPauseModal();
    }
  });
}

// ===============================================
// KEYBOARD SHORTCUTS
// ===============================================

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Escape: Close research popup first
    if (e.code === 'Escape') {
      if (researchPopupState.isOpen) {
        e.preventDefault();
        closeResearchPopup();
        return;
      }
      
      if (appState.timer.isRunning && appState.currentView === 'focus') {
        pauseTimer();
        return;
      }
    }
    
    // Only handle shortcuts in focus view
    if (appState.currentView !== 'focus') return;

    // Space: Start/Pause
    if (e.code === 'Space' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
      e.preventDefault();
      toggleTimer();
    }

    // R: Reset
    if (e.code === 'KeyR' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
      e.preventDefault();
      resetTimer();
    }
  });
}

// ===============================================
// OBSIDIAN-STYLE NOTE LINKING (BuddyOS)
// ===============================================

// Notes data structure
let notes = appState.notes;
let currentNoteId = null;

function extractLinks(noteContent) {
  const linkRegex = /\[\[([^\[\]|]+)(?:\|([^\[\]]+))?\]\]/g;
  const links = [];
  let match;
  while ((match = linkRegex.exec(noteContent)) !== null) {
    const noteTitle = match[1].trim();
    const displayText = match[2] ? match[2].trim() : noteTitle;
    links.push({
      title: noteTitle,
      displayText: displayText,
      fullMatch: match[0]
    });
  }
  return links;
}

function getNoteByTitle(title) {
  if (!title) return null;
  return notes.find(note => note.title && note.title.toLowerCase() === title.toLowerCase());
}

function updateNoteLinks(noteId) {
  const note = notes.find(n => n.id === noteId);
  if (!note) return;

  const parsedLinks = extractLinks(note.content);
  note.links = parsedLinks.map(link => link.title.toLowerCase());

  // Clean up backlinks in all notes
  notes.forEach(n => {
    n.backlinks = n.backlinks ? n.backlinks.filter(link => link !== note.title?.toLowerCase()) : [];
  });

  // Add backlinks
  note.links.forEach(linkTitle => {
    const linkedNote = getNoteByTitle(linkTitle);
    if (linkedNote) {
      if (!linkedNote.backlinks) linkedNote.backlinks = [];
      if (!linkedNote.backlinks.includes(note.title.toLowerCase())) {
        linkedNote.backlinks.push(note.title.toLowerCase());
      }
    }
  });

  // Populate full linkedNotes objects
  note.linkedNotes = note.links.map(linkTitle => getNoteByTitle(linkTitle)).filter(Boolean);
}

function renderNoteContent(noteContent) {
  let renderedContent = escapeHtml(noteContent);
  const linkRegex = /\[\[([^\[\]|]+)(?:\|([^\[\]]+))?\]\]/g;
  renderedContent = renderedContent.replace(linkRegex, (match, noteTitle, displayText) => {
    const display = displayText ? escapeHtml(displayText.trim()) : escapeHtml(noteTitle.trim());
    const linkedNote = getNoteByTitle(noteTitle);
    if (linkedNote) {
      // Link exists
      return `<a href="#" class="note-link" data-note-id="${linkedNote.id}" title="${escapeHtml(noteTitle)}">${display}</a>`;
    } else {
      // Unresolved link
      return `<span class="note-link-unresolved" data-link-title="${escapeHtml(noteTitle)}" title="Link to '${escapeHtml(noteTitle)}' - Note not found">${display}</span>`;
    }
  });
  return renderedContent;
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('note-link')) {
    e.preventDefault();
    const noteId = e.target.getAttribute('data-note-id');
    openNoteFromLink(noteId);
  } else if (e.target.classList.contains('note-link-unresolved')) {
    e.preventDefault();
    const title = e.target.getAttribute('data-link-title');
    showCreateNoteFromLink(title);
  } else if (e.target.classList.contains('linked-note-item')) {
    e.preventDefault();
    const noteId = e.target.getAttribute('data-note-id');
    openNoteFromLink(noteId);
  } else if (e.target.classList.contains('backlink-item')) {
    e.preventDefault();
    const noteId = e.target.getAttribute('data-note-id');
    openNoteFromLink(noteId);
  } else if (e.target.classList.contains('create-link-note')) {
    e.preventDefault();
    const title = e.target.getAttribute('data-link-title');
    createNoteFromLink(title);
  }
});

function setupLinkAutoComplete(textarea, currentNoteIdGetter, previewRenderer) {
  textarea.addEventListener('input', (e) => {
    const text = textarea.value;
    const caretPos = textarea.selectionStart;
    const beforeCaret = text.substring(0, caretPos);
    const lastBracketMatch = beforeCaret.match(/\[\[([^\[\]|]*)$/);
    if (lastBracketMatch) {
      const searchText = lastBracketMatch[1];
      showLinkSuggestions(searchText, textarea, caretPos, currentNoteIdGetter, previewRenderer);
    } else {
      hideLinkSuggestions();
    }
  });
  textarea.addEventListener('blur', hideLinkSuggestions);
}

function showLinkSuggestions(searchText, textarea, caretPos, currentNoteIdGetter, previewRenderer) {
  const suggestions = notes.filter(n => n.title && n.title.toLowerCase().includes(searchText.toLowerCase()) && searchText.length > 0).slice(0, 5);
  const suggestionsContainer = document.getElementById('linkSuggestionsContainer');
  if (!suggestionsContainer) return;
  suggestionsContainer.innerHTML = '';
  suggestionsContainer.style.position = 'relative';

  if (suggestions.length === 0) {
    hideLinkSuggestions();
    return;
  }
  const list = document.createElement('div');
  list.className = 'link-suggestions';

  suggestions.forEach(note => {
    const item = document.createElement('div');
    item.className = 'link-suggestion-item';
    item.textContent = note.title;
    item.addEventListener('mousedown', e => {
      e.preventDefault();
      // Replace [[searchText]] with [[note.title]]
      const value = textarea.value;
      const beforeLink = value.substring(0, caretPos - searchText.length - 2);
      const afterLink = value.substring(caretPos);
      textarea.value = beforeLink + `[[${note.title}]]` + afterLink;
      // Move caret
      textarea.selectionStart = textarea.selectionEnd = beforeLink.length + note.title.length + 4;
      hideLinkSuggestions();
      if (typeof previewRenderer === 'function') previewRenderer();
      if (typeof currentNoteIdGetter === 'function' && currentNoteIdGetter()) {
        updateNoteLinks(currentNoteIdGetter());
      }
      textarea.focus();
    });
    list.appendChild(item);
  });

  suggestionsContainer.appendChild(list);
}

function hideLinkSuggestions() {
  const suggestionsContainer = document.getElementById('linkSuggestionsContainer');
  if (!suggestionsContainer) return;
  suggestionsContainer.innerHTML = '';
}

function openNoteFromLink(noteId) {
  showNoteDetailPanel(noteId);
}

let isEditingNote = false;

function showNoteDetailPanel(noteId) {
  const panel = document.getElementById('noteDetailPanel');
  if (!panel) return;
  const note = notes.find(n => n.id == noteId);
  if (!note) {
    panel.innerHTML = '<div class="empty-state">Note not found.</div>';
    panel.classList.remove('hidden');
    return;
  }
  currentNoteId = note.id;
  isEditingNote = false;
  updateNoteLinks(note.id);
  panel.classList.remove('hidden');
  renderNoteDetailView(note);
}

function renderNoteDetailView(note) {
  const panel = document.getElementById('noteDetailPanel');
  if (!panel) return;
  
  panel.innerHTML = `
    <div class="card" style="margin-top:24px;margin-bottom:24px;">
      <div class="card__header">
        <h3 id="noteDetailTitle">${escapeHtml(note.title)}</h3>
        <div style="float:right; display: flex; gap: 8px;">
          <button class="btn btn--primary" id="editNoteBtn" onclick="enterNoteEditMode()">✏️ Edit</button>
          <button class="btn btn--outline" onclick="closeNoteDetailPanel()">Close</button>
        </div>
      </div>
      <div class="card__body">
        <div id="noteViewMode">
          <div class="note-view-content" id="noteContentView">${renderNoteContent(note.content)}</div>
          <div class="note-timestamp">Created: ${formatTimestamp(note.createdDate)}<br>Updated: ${formatTimestamp(note.updatedDate)}</div>
        </div>
        <div id="noteEditMode" style="display: none;">
          <div class="form-group" style="margin-bottom: 16px;">
            <label for="editNoteTitle">Title</label>
            <input type="text" id="editNoteTitle" class="form-control" value="${escapeHtml(note.title)}" placeholder="Note title">
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label for="editNoteContent">Content</label>
            <textarea id="editNoteContent" class="form-control" rows="10" placeholder="Type your note content here...\n\nUse [[Note Title]] to link to other notes">${escapeHtml(note.content)}</textarea>
            <div id="editLinkSuggestionsContainer" style="position: relative;"></div>
          </div>
          <div style="display: flex; gap: 12px; margin-bottom: 16px;">
            <button class="btn btn--primary" onclick="saveNoteEdits()">💾 Save</button>
            <button class="btn btn--secondary" onclick="cancelNoteEdits()">Cancel</button>
          </div>
          <div style="padding: 12px; background: var(--color-bg-1); border-radius: 8px; font-size: 13px; color: var(--text-secondary);">
            💡 Tip: Use [[Note Title]] to create links to other notes
          </div>
        </div>
      </div>
      <div class="card__footer">
        <div class="note-links-panel">
          <div class="panel-section">
            <h3>🔗 Linked Notes</h3>
            <div class="linked-notes-list" id="linkedNotesList">
              ${note.linkedNotes && note.linkedNotes.length ? note.linkedNotes.map(ln => `<div class="linked-note-item" data-note-id="${ln.id}">${escapeHtml(ln.title)}</div>`).join('') : `<div class="empty-links">No linked notes</div>`}
            </div>
          </div>
          <div class="panel-section">
            <h3>🔙 Backlinks</h3>
            <div class="backlinks-list" id="backlinksList">
              ${note.backlinks && note.backlinks.length ? note.backlinks.map(title => {
                const backlinkNote = getNoteByTitle(title);
                if (backlinkNote) return `<div class="backlink-item" data-note-id="${backlinkNote.id}">${escapeHtml(backlinkNote.title)}</div>`;
                return '';
              }).join('') : `<div class="empty-links">No backlinks</div>`}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function enterNoteEditMode() {
  const note = notes.find(n => n.id === currentNoteId);
  if (!note) return;
  
  isEditingNote = true;
  
  // Hide view mode, show edit mode
  document.getElementById('noteViewMode').style.display = 'none';
  document.getElementById('noteEditMode').style.display = 'block';
  document.getElementById('editNoteBtn').style.display = 'none';
  
  // Setup autocomplete for the edit textarea
  const textarea = document.getElementById('editNoteContent');
  if (textarea) {
    setupEditLinkAutoComplete(textarea);
    textarea.focus();
  }
}

function setupEditLinkAutoComplete(textarea) {
  textarea.addEventListener('input', (e) => {
    const text = textarea.value;
    const caretPos = textarea.selectionStart;
    const beforeCaret = text.substring(0, caretPos);
    const lastBracketMatch = beforeCaret.match(/\[\[([^\[\]|]*)$/);
    if (lastBracketMatch) {
      const searchText = lastBracketMatch[1];
      showEditLinkSuggestions(searchText, textarea, caretPos);
    } else {
      hideEditLinkSuggestions();
    }
  });
}

function showEditLinkSuggestions(searchText, textarea, caretPos) {
  const suggestions = notes.filter(n => n.id !== currentNoteId && n.title && n.title.toLowerCase().includes(searchText.toLowerCase()) && searchText.length > 0).slice(0, 5);
  const suggestionsContainer = document.getElementById('editLinkSuggestionsContainer');
  if (!suggestionsContainer) return;
  suggestionsContainer.innerHTML = '';

  if (suggestions.length === 0) {
    hideEditLinkSuggestions();
    return;
  }
  
  const list = document.createElement('div');
  list.className = 'link-suggestions';

  suggestions.forEach(note => {
    const item = document.createElement('div');
    item.className = 'link-suggestion-item';
    item.textContent = note.title;
    item.addEventListener('mousedown', e => {
      e.preventDefault();
      const value = textarea.value;
      const beforeLink = value.substring(0, caretPos - searchText.length - 2);
      const afterLink = value.substring(caretPos);
      textarea.value = beforeLink + `[[${note.title}]]` + afterLink;
      textarea.selectionStart = textarea.selectionEnd = beforeLink.length + note.title.length + 4;
      hideEditLinkSuggestions();
      textarea.focus();
    });
    list.appendChild(item);
  });

  suggestionsContainer.appendChild(list);
}

function hideEditLinkSuggestions() {
  const suggestionsContainer = document.getElementById('editLinkSuggestionsContainer');
  if (!suggestionsContainer) return;
  suggestionsContainer.innerHTML = '';
}

function saveNoteEdits() {
  const note = notes.find(n => n.id === currentNoteId);
  if (!note) return;
  
  const newTitle = document.getElementById('editNoteTitle').value.trim();
  const newContent = document.getElementById('editNoteContent').value.trim();
  
  if (!newTitle) {
    alert('Please enter a note title');
    return;
  }
  
  // Update note
  note.title = newTitle;
  note.content = newContent;
  note.updatedDate = new Date();
  
  // Update links
  updateNoteLinks(currentNoteId);
  
  // Update in user data
  appState.notes = notes;
  if (currentUser) {
    currentUser.notes = notes;
  }
  
  // Re-render
  isEditingNote = false;
  renderNoteDetailView(note);
  renderNotesList();
  renderFullNotesList();
  
  showToast('Note saved successfully!', 'success');
}

function cancelNoteEdits() {
  const note = notes.find(n => n.id === currentNoteId);
  if (!note) return;
  
  if (confirm('Discard changes?')) {
    isEditingNote = false;
    renderNoteDetailView(note);
  }
}

function closeNoteDetailPanel() {
  const panel = document.getElementById('noteDetailPanel');
  if (!panel) return;
  panel.classList.add('hidden');
  panel.innerHTML = '';
}

function showCreateNoteFromLink(title) {
  const panel = document.getElementById('noteDetailPanel');
  if (!panel) return;
  panel.classList.remove('hidden');
  panel.innerHTML = `
    <div class="empty-state">
      Note <b>"${escapeHtml(title)}"</b> does not exist.<br>
      <button class="btn btn--primary create-link-note" data-link-title="${escapeHtml(title)}">Create new note</button>
    </div>
  `;
}

function createNoteFromLink(title) {
  const newNote = {
    id: Date.now(),
    title: title,
    content: '',
    createdDate: new Date(),
    updatedDate: new Date(),
    tags: [],
    links: [],
    backlinks: [],
    linkedNotes: []
  };
  notes.unshift(newNote);
  appState.notes = notes;
  if (currentUser) currentUser.notes = notes;
  showNoteDetailPanel(newNote.id);
  renderFullNotesList();
}

function renderFullNotesList() {
  const container = document.getElementById('notesListFull');
  if (!container) return;
  if (!notes || notes.length === 0) {
    container.innerHTML = '<div class="empty-state">No notes yet. Start taking notes to see them here!</div>';
    return;
  }
  container.innerHTML = notes.map(note => `
    <div class="note-item">
      <div class="note-content"><b>${escapeHtml(note.title)}</b><br>${renderNoteContent(note.content)}
        <span class="note-timestamp int">${formatTimestamp(note.updatedDate)}</span>
      </div>
      <div class="note-timestamp">
        <button class="note-delete" onclick="deleteNote(${note.id})">Delete</button>
        <button class="btn btn--outline" onclick="showNoteDetailPanel(${note.id})">Open</button>
      </div>
    </div>
  `).join('');
}

// ENHANCED NOTE CREATION
function saveNote() {
  const noteInput = document.getElementById('notesInput');
  const raw = noteInput.value.trim();
  if (!raw) { alert('Please enter some text before saving.'); return; }
  // If user began with '# title\n' syntax, split title/content
  let title = '', content = raw;
  if (/^#\s?(.+)/.test(raw.split('\n')[0])) {
    const first = raw.split('\n')[0];
    title = first.replace(/^#\s?/, '').trim();
    content = raw.split('\n').slice(1).join('\n');
  } else {
    // Prompt for title
    title = prompt("Enter note title:", raw.substring(0,24));
    if (!title) { alert('Note must have a title!'); return; }
  }
  const note = {
    id: Date.now(),
    title: title,
    content: content,
    createdDate: new Date(),
    updatedDate: new Date(),
    tags: [],
    links: [],
    backlinks: [],
    linkedNotes: []
  };
  notes.unshift(note);
  appState.notes = notes;
  if (currentUser) {
    currentUser.notes = notes;
    currentUser.focusStats.notesCount = notes.length;
  }
  updateNoteLinks(note.id);
  const saveBtn = document.getElementById('saveNoteBtn');
  const originalText = saveBtn.textContent;
  saveBtn.textContent = 'Saving...';
  saveBtn.disabled = true;
  setTimeout(() => {
    saveBtn.textContent = originalText;
    saveBtn.disabled = false;
    noteInput.value = '';
    renderNotesList();
    renderFullNotesList();
  }, 500);
}

function clearNoteInput() {
  const noteInput = document.getElementById('notesInput');
  if (noteInput.value.trim() && !confirm('Clear this note?')) {
    return;
  }
  noteInput.value = '';
}

function deleteNote(noteId) {
  if (!confirm('Delete this note?')) return;
  notes = notes.filter(note => note.id !== noteId);
  appState.notes = notes;
  if (currentUser) {
    currentUser.notes = notes;
    currentUser.focusStats.notesCount = notes.length;
  }
  renderNotesList();
  renderFullNotesList();
  closeNoteDetailPanel();
}

function renderNotesList() {
  const container = document.getElementById('savedNotesList');
  if (!notes || notes.length === 0) {
    container.innerHTML = '<div class="empty-state" style="padding: 20px; font-size: 12px;">No notes yet</div>';
    return;
  }
  container.innerHTML = notes.slice(0, 3).map(note => `
    <div class="mini-note">
      <div class="mini-note-content">${escapeHtml(note.title)}<br>${escapeHtml(note.content.substring(0,40))}</div>
      <div class="mini-note-time">${formatTimestamp(note.updatedDate)}</div>
    </div>
  `).join('');
}

// (renderFullNotesList is replaced above!)


// ===============================================
// TIMELINE FUNCTIONALITY
// ===============================================

function renderTimeline() {
  const container = document.getElementById('timelineList');
  
  if (appState.sessions.length === 0) {
    container.innerHTML = '<div class="empty-state" style="padding: 20px; font-size: 12px;">No sessions yet</div>';
    return;
  }

  container.innerHTML = appState.sessions.slice(0, 5).map(session => `
    <div class="timeline-item">
      <div class="timeline-item-header">
        <span class="timeline-item-time">${session.time}</span>
        <span class="timeline-item-type">${session.type}</span>
      </div>
      <div class="timeline-item-footer">
        <span>${session.date}</span>
        <span>${session.duration}</span>
      </div>
    </div>
  `).join('');
}

function renderFullHistory() {
  const container = document.getElementById('historyListFull');
  
  if (appState.sessions.length === 0) {
    container.innerHTML = '<div class="empty-state">No sessions yet. Complete a focus session to see it here!</div>';
    return;
  }

  container.innerHTML = appState.sessions.map(session => `
    <div class="history-item">
      <div class="history-item-info">
        <div class="history-item-time">${session.time}</div>
        <div class="history-item-type">${session.type}</div>
      </div>
      <div class="history-item-meta">
        <div class="history-item-date">${session.date}</div>
        <div class="history-item-duration">${session.duration}</div>
      </div>
    </div>
  `).join('');

  // Update history stats
  document.getElementById('totalSessions').textContent = appState.user.sessionsCompleted;
  const hours = Math.floor(appState.user.focusTimeToday / 60);
  const minutes = appState.user.focusTimeToday % 60;
  document.getElementById('totalTime').textContent = `${hours}:${minutes.toString().padStart(2, '0')}`;
  
  const avgMinutes = Math.round(appState.user.focusTimeToday / appState.user.sessionsCompleted);
  document.getElementById('avgSession').textContent = `${avgMinutes} min`;
}

// ===============================================
// SETTINGS FUNCTIONALITY
// ===============================================

function saveSettings() {
  const workDuration = parseInt(document.getElementById('workDuration').value);
  const shortBreakDuration = parseInt(document.getElementById('shortBreakDuration').value);
  const longBreakDuration = parseInt(document.getElementById('longBreakDuration').value);
  const displayName = document.getElementById('displayName').value.trim();
  const tabDetection = document.getElementById('tabDetection').checked;
  const fullscreenEnabled = document.getElementById('fullscreenToggle').checked;
  
  // Notification settings
  const toastNotifications = document.getElementById('toastNotifications').checked;
  const browserNotifications = document.getElementById('browserNotifications').checked;
  const sessionAlerts = document.getElementById('sessionAlerts').checked;
  const streakAlerts = document.getElementById('streakAlerts').checked;
  const quietHours = document.getElementById('quietHours').checked;
  const quietHoursStart = document.getElementById('quietHoursStart').value;
  const quietHoursEnd = document.getElementById('quietHoursEnd').value;

  // Validation
  if (workDuration < 1 || workDuration > 60) {
    alert('Work duration must be between 1 and 60 minutes.');
    return;
  }
  if (shortBreakDuration < 1 || shortBreakDuration > 30) {
    alert('Short break must be between 1 and 30 minutes.');
    return;
  }
  if (longBreakDuration < 1 || longBreakDuration > 60) {
    alert('Long break must be between 1 and 60 minutes.');
    return;
  }
  if (!displayName) {
    alert('Please enter a display name.');
    return;
  }

  // Save settings
  appState.settings.workDuration = workDuration;
  appState.settings.shortBreakDuration = shortBreakDuration;
  appState.settings.longBreakDuration = longBreakDuration;
  appState.settings.tabDetectionEnabled = tabDetection;
  appState.settings.fullscreenEnabled = fullscreenEnabled;
  appState.user.name = displayName;
  
  // Save notification settings
  notificationsState.settings.toastEnabled = toastNotifications;
  notificationsState.settings.browserEnabled = browserNotifications;
  notificationsState.settings.sessionAlerts = sessionAlerts;
  notificationsState.settings.streakAlerts = streakAlerts;
  notificationsState.settings.quietHoursEnabled = quietHours;
  notificationsState.settings.quietHoursStart = quietHoursStart;
  notificationsState.settings.quietHoursEnd = quietHoursEnd;
  
  // Request browser notification permission if enabled
  if (browserNotifications && 'Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        showToastNotification('Browser notifications enabled', 'You will now receive desktop notifications', 'success');
      }
    });
  }
  
  // Update current user's name
  if (currentUser) {
    currentUser.fullName = displayName;
    updateUserUI();
  }

  // Update UI
  const firstName = displayName.split(' ')[0];
  document.getElementById('userName').textContent = firstName;
  
  // Reset timer if settings changed
  if (!appState.timer.isRunning) {
    const durations = {
      work: workDuration,
      shortBreak: shortBreakDuration,
      longBreak: longBreakDuration
    };
    appState.timer.timeRemaining = durations[appState.timer.mode] * 60;
    updateTimerDisplay();
  }

  showToastNotification('Settings saved', 'Your settings have been updated successfully', 'success');
}

// Show/hide quiet hours settings
document.getElementById('quietHours')?.addEventListener('change', function() {
  const settingsDiv = document.getElementById('quietHoursSettings');
  if (settingsDiv) {
    settingsDiv.style.display = this.checked ? 'block' : 'none';
  }
});

function updateFullscreenSetting() {
  appState.settings.fullscreenEnabled = document.getElementById('fullscreenToggle').checked;
}

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

function formatTimestamp(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / 60000);
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Request notification permission on load
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

// ===============================================
// CHATBOT FUNCTIONALITY
// ===============================================

function openChat() {
  chatOpen = true;
  const chatWindow = document.getElementById('chatWindow');
  const chatBubble = document.getElementById('chatBubbleBtn');
  
  chatWindow.classList.add('active');
  chatBubble.classList.add('hidden');
  
  // Focus on input
  setTimeout(() => {
    document.getElementById('chatInput').focus();
  }, 100);
  
  // Scroll to bottom
  scrollChatToBottom();
}

function closeChat() {
  chatOpen = false;
  const chatWindow = document.getElementById('chatWindow');
  const chatBubble = document.getElementById('chatBubbleBtn');
  
  chatWindow.classList.remove('active');
  chatBubble.classList.remove('hidden');
}

function handleChatKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  
  if (!message) return;
  
  // Add user message
  addChatMessage(message, 'user');
  input.value = '';
  
  // Show typing indicator
  showTypingIndicator();
  
  // Get bot response after short delay
  setTimeout(() => {
    removeTypingIndicator();
    const response = getBotResponse(message);
    addChatMessage(response, 'bot');
  }, 600);
}

function addChatMessage(text, sender) {
  const messagesContainer = document.getElementById('chatMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  
  const bubble = document.createElement('div');
  bubble.className = `message-bubble ${sender}`;
  bubble.textContent = text;
  
  messageDiv.appendChild(bubble);
  messagesContainer.appendChild(messageDiv);
  
  // Auto scroll to bottom
  scrollChatToBottom();
  
  // Store in history
  chatHistory.push({ text, sender, timestamp: new Date() });
}

function showTypingIndicator() {
  const messagesContainer = document.getElementById('chatMessages');
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message bot typing-indicator';
  typingDiv.innerHTML = `
    <div class="message-bubble bot">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </div>
  `;
  messagesContainer.appendChild(typingDiv);
  scrollChatToBottom();
}

function removeTypingIndicator() {
  const typingDiv = document.querySelector('.typing-indicator');
  if (typingDiv) typingDiv.remove();
}

function scrollChatToBottom() {
  const messagesContainer = document.getElementById('chatMessages');
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getBotResponse(userMessage) {
  const msg = userMessage.toLowerCase().trim();
  
  // Context-aware responses based on user's current state
  if (currentUser) {
    // Check if user has no sessions today
    if (appState.user.sessionsCompleted === 0 && (msg.includes('start') || msg.includes('begin'))) {
      return "🍅 You haven't started any sessions yet today! Click the 'Start' button on the Focus page to begin your first Pomodoro session. You've got this!";
    }
    
    // Check for high streak
    if (appState.user.streak >= 7 && (msg.includes('streak') || msg.includes('progress'))) {
      return `🔥 Wow! Your ${appState.user.streak}-day streak is amazing! You're on fire! Keep up this incredible consistency!`;
    }
    
    // Check if user has been studying long
    if (appState.user.focusTimeToday >= 120 && (msg.includes('tired') || msg.includes('break'))) {
      return `🌟 You've put in ${Math.floor(appState.user.focusTimeToday / 60)} hours today! That's outstanding! Maybe it's time for a longer break? ☕ Rest is part of productivity!`;
    }
  }
  
  // Check for keyword matches
  for (const [keyword, response] of Object.entries(chatbotResponses)) {
    if (msg.includes(keyword)) {
      return response;
    }
  }
  
  // If no keyword match, return default response
  return chatbotResponses.default;
}

function initChatbot() {
  // Add welcome message if chat history is empty
  if (chatHistory.length === 0) {
    chatHistory.push({
      text: "Hey there! 👋 I'm Buddy, your study companion. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    });
  }
}

// ===============================================
// FULLSCREEN FUNCTIONALITY
// ===============================================

// Helper function to request fullscreen with vendor prefixes
async function requestFullscreenMode() {
  try {
    const elem = document.documentElement;
    
    if (elem.requestFullscreen) {
      await elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      await elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      await elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
      await elem.msRequestFullscreen();
    } else {
      throw new Error('Fullscreen API not supported');
    }
    
    appState.timer.isFullscreen = true;
    activateFullscreenView();
    return true;
  } catch (error) {
    console.error('Fullscreen request failed:', error);
    showFullscreenError();
    // Don't stop the timer - continue in normal mode
    return false;
  }
}

// Check if currently in fullscreen
function isFullscreenMode() {
  return document.fullscreenElement || 
         document.webkitFullscreenElement || 
         document.mozFullScreenElement || 
         document.msFullscreenElement;
}

function exitFullscreenMode() {
  try {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  } catch (error) {
    console.error('Exit fullscreen failed:', error);
  }
  
  appState.timer.isFullscreen = false;
  deactivateFullscreenView();
}

function activateFullscreenView() {
  document.body.classList.add('fullscreen-active');
  document.getElementById('fullscreenTimerView').classList.add('active');
  
  // Update fullscreen session type
  const sessionTypes = {
    work: 'FOCUS SESSION',
    shortBreak: 'SHORT BREAK',
    longBreak: 'LONG BREAK'
  };
  document.getElementById('fullscreenSessionType').textContent = sessionTypes[appState.timer.mode];
  
  updateFullscreenTimer();
  updateProgressBar();
}

function deactivateFullscreenView() {
  document.body.classList.remove('fullscreen-active');
  document.getElementById('fullscreenTimerView').classList.remove('active');
}

function updateFullscreenTimer() {
  const minutes = Math.floor(appState.timer.timeRemaining / 60);
  const seconds = appState.timer.timeRemaining % 60;
  document.getElementById('fullscreenTimer').textContent = 
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateProgressBar() {
  const progress = ((appState.timer.totalTime - appState.timer.timeRemaining) / appState.timer.totalTime) * 100;
  document.getElementById('fullscreenProgressFill').style.width = `${progress}%`;
}

function showFullscreenError() {
  const statusElement = document.getElementById('timerStatus');
  statusElement.textContent = 'Note: Fullscreen mode requires permission. Timer will run normally.';
  statusElement.style.color = '#FF9800';
  
  setTimeout(() => {
    statusElement.textContent = '';
  }, 5000);
}

function setupFullscreenHandlers() {
  // Handle fullscreen change events (including ESC key) for all browsers
  const handleFullscreenChange = () => {
    if (!isFullscreenMode() && appState.timer.isFullscreen && appState.timer.isRunning) {
      // User pressed ESC or exited fullscreen manually
      pauseTimer(false);
      appState.timer.isFullscreen = false;
      deactivateFullscreenView();
      
      // Only show modal if fullscreen is enabled in settings
      if (appState.settings.fullscreenEnabled) {
        showPauseModal();
      }
    }
  };
  
  // Add listeners for all vendor prefixes
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('msfullscreenchange', handleFullscreenChange);

  // Handle fullscreen errors
  const handleFullscreenError = () => {
    console.error('Fullscreen error occurred');
    showFullscreenError();
  };
  
  document.addEventListener('fullscreenerror', handleFullscreenError);
  document.addEventListener('webkitfullscreenerror', handleFullscreenError);
  document.addEventListener('mozfullscreenerror', handleFullscreenError);
  document.addEventListener('msfullscreenerror', handleFullscreenError);
}

// ===============================================
// PAUSE MODAL FUNCTIONALITY
// ===============================================

function showPauseModal() {
  const modal = document.getElementById('pauseModal');
  const resumeFullscreenBtn = document.getElementById('resumeFullscreenBtn');
  const resumeWindowedBtn = document.getElementById('resumeWindowedBtn');
  
  // Show/hide buttons based on fullscreen setting
  if (appState.settings.fullscreenEnabled) {
    resumeFullscreenBtn.classList.remove('hidden');
    resumeWindowedBtn.classList.add('hidden');
  } else {
    resumeFullscreenBtn.classList.add('hidden');
    resumeWindowedBtn.classList.remove('hidden');
  }
  
  modal.classList.add('active');
  
  // Update motivational message with time remaining
  const minutes = Math.floor(appState.timer.timeRemaining / 60);
  const motivationalMessages = [
    `Stay focused! You've got this!`,
    `Just ${minutes} minutes left! Keep going!`,
    `You're doing great! Don't break your flow!`,
    `Almost there! Maintain your concentration!`,
    `Every minute counts! Stay committed!`
  ];
  
  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  document.getElementById('modalMotivational').textContent = randomMessage;
}

function hidePauseModal() {
  document.getElementById('pauseModal').classList.remove('active');
}

async function resumeInFullscreen() {
  hidePauseModal();
  appState.timer.pausedByBlur = false;
  
  // Request fullscreen and resume timer
  const fullscreenSuccess = await requestFullscreenMode();
  
  if (!fullscreenSuccess) {
    // If fullscreen fails, show error but continue in windowed mode
    const statusElement = document.getElementById('timerStatus');
    statusElement.textContent = 'Fullscreen mode unavailable. Continuing timer...';
    statusElement.style.color = '#FF9800';
    setTimeout(() => {
      statusElement.textContent = '';
    }, 3000);
  }
  
  // Resume timer regardless of fullscreen success
  setTimeout(() => {
    appState.timer.isRunning = true;
    document.getElementById('startPauseBtn').textContent = 'Pause';
    
    appState.timer.intervalId = setInterval(() => {
      appState.timer.timeRemaining--;
      updateTimerDisplay();
      updateFullscreenTimer();
      updateProgressBar();

      if (appState.timer.timeRemaining <= 0) {
        timerComplete();
      }
    }, 1000);
  }, 300);
}

function resumeInWindowed() {
  hidePauseModal();
  appState.timer.pausedByBlur = false;
  appState.timer.isFullscreen = false;
  
  // Resume timer in windowed mode
  appState.timer.isRunning = true;
  document.getElementById('startPauseBtn').textContent = 'Pause';
  
  appState.timer.intervalId = setInterval(() => {
    appState.timer.timeRemaining--;
    updateTimerDisplay();

    if (appState.timer.timeRemaining <= 0) {
      timerComplete();
    }
  }, 1000);
}

// ===============================================
// CELEBRATION SCREEN
// ===============================================

function showCelebrationScreen() {
  const celebrationScreen = document.getElementById('celebrationScreen');
  celebrationScreen.classList.add('active');
  
  // Update celebration message
  const durations = {
    work: appState.settings.workDuration,
    shortBreak: appState.settings.shortBreakDuration,
    longBreak: appState.settings.longBreakDuration
  };
  
  const duration = durations[appState.timer.mode];
  const sessionType = appState.timer.mode === 'work' ? 'focus' : 'break';
  
  document.getElementById('celebrationMessage').textContent = 
    `You completed a ${duration}-minute ${sessionType} session!`;
  
  document.getElementById('celebrationTime').textContent = 
    `${duration.toString().padStart(2, '0')}:00`;
}

function hideCelebrationScreen() {
  document.getElementById('celebrationScreen').classList.remove('active');
}

function startNextSession() {
  hideCelebrationScreen();
  
  // Reset to work mode
  appState.timer.mode = 'work';
  appState.timer.timeRemaining = appState.settings.workDuration * 60;
  appState.timer.totalTime = appState.settings.workDuration * 60;
  updateTimerDisplay();
  
  // Start timer in fullscreen
  startTimer();
}

function exitCelebration() {
  hideCelebrationScreen();
  exitFullscreenMode();
  
  // Reset timer
  const durations = {
    work: appState.settings.workDuration,
    shortBreak: appState.settings.shortBreakDuration,
    longBreak: appState.settings.longBreakDuration
  };
  appState.timer.timeRemaining = durations[appState.timer.mode] * 60;
  appState.timer.totalTime = durations[appState.timer.mode] * 60;
  updateTimerDisplay();
}

// ===============================================
// RESEARCH DOCK FUNCTIONALITY
// ===============================================

function setupResearchDock() {
  // Add Research button
  document.getElementById('addResearchBtn')?.addEventListener('click', openAddResearchModal);
  
  // Search input
  document.getElementById('researchSearchInput')?.addEventListener('input', handleResearchSearch);
  
  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      setResearchFilter(filter);
    });
  });
  
  // Sort select
  document.getElementById('researchSort')?.addEventListener('change', handleResearchSort);
  
  // Collection items
  document.querySelectorAll('.collection-item').forEach(item => {
    item.addEventListener('click', () => {
      const collection = item.getAttribute('data-collection');
      setResearchCollection(collection);
    });
  });
  
  // Form submit
  document.getElementById('researchForm')?.addEventListener('submit', handleResearchFormSubmit);
  
  // Close modal on background click
  document.getElementById('researchModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'researchModal') {
      closeResearchModal();
    }
  });
  
  document.getElementById('researchDetailModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'researchDetailModal') {
      closeDetailModal();
    }
  });
  
  // Close popup on overlay click
  document.getElementById('researchPopupOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'researchPopupOverlay') {
      closeResearchPopup();
    }
  });
  
  // Add Collection button
  document.getElementById('addCollectionBtn')?.addEventListener('click', openAddCollectionModal);
  
  // Initialize with demo data
  initializeDemoResearch();
  renderResearchSources();
  updateResearchStats();
}

function initializeDemoResearch() {
  // Initialize collections list in sidebar
  renderCollections();
  
  if (researchState.sources.length === 0) {
    researchState.sources = [
      {
        id: Date.now() + 1,
        title: 'Calculus: Early Transcendentals',
        url: 'https://www.stewartcalculus.com/',
        type: 'book',
        author: 'James Stewart',
        notes: 'Comprehensive calculus textbook covering limits, derivatives, and integrals. Great examples and exercises.',
        tags: ['math', 'calculus', 'derivatives'],
        dateAdded: new Date(Date.now() - 86400000 * 5),
        dateAccessed: new Date(),
        starred: true,
        collection: '',
        usageCount: 8
      },
      {
        id: Date.now() + 2,
        title: 'Introduction to Algorithms',
        url: 'https://mitpress.mit.edu/books/introduction-algorithms',
        type: 'book',
        author: 'Thomas H. Cormen',
        notes: 'The bible of algorithms. Covers sorting, searching, graph algorithms, and dynamic programming.',
        tags: ['computer-science', 'algorithms', 'data-structures'],
        dateAdded: new Date(Date.now() - 86400000 * 3),
        dateAccessed: new Date(),
        starred: true,
        collection: '',
        usageCount: 12
      },
      {
        id: Date.now() + 3,
        title: 'Khan Academy: Linear Algebra',
        url: 'https://www.khanacademy.org/math/linear-algebra',
        type: 'video',
        author: 'Khan Academy',
        notes: 'Excellent video series on vectors, matrices, and transformations. Easy to follow explanations.',
        tags: ['math', 'linear-algebra', 'vectors'],
        dateAdded: new Date(Date.now() - 86400000 * 2),
        dateAccessed: new Date(),
        starred: false,
        collection: '',
        usageCount: 5
      },
      {
        id: Date.now() + 4,
        title: 'The Feynman Lectures on Physics',
        url: 'https://www.feynmanlectures.caltech.edu/',
        type: 'website',
        author: 'Richard Feynman',
        notes: 'Classic physics lectures covering mechanics, electromagnetism, and quantum mechanics. Brilliant insights.',
        tags: ['physics', 'mechanics', 'quantum'],
        dateAdded: new Date(Date.now() - 86400000),
        dateAccessed: new Date(),
        starred: false,
        collection: '',
        usageCount: 3
      }
    ];
  }
}

function openAddResearchModal() {
  researchState.editingId = null;
  document.getElementById('researchModalTitle').textContent = 'Add Research Source';
  document.getElementById('saveResearchBtn').textContent = 'Add Source';
  document.getElementById('researchForm').reset();
  clearResearchFormErrors();
  populateCollectionSelect();
  document.getElementById('researchModal').classList.remove('hidden');
}

function closeResearchModal() {
  document.getElementById('researchModal').classList.add('hidden');
  researchState.editingId = null;
}

function openEditResearchModal(id) {
  const source = researchState.sources.find(s => s.id === id);
  if (!source) return;
  
  researchState.editingId = id;
  document.getElementById('researchModalTitle').textContent = 'Edit Research Source';
  document.getElementById('saveResearchBtn').textContent = 'Save Changes';
  
  // Populate form
  document.getElementById('researchTitle').value = source.title;
  document.getElementById('researchURL').value = source.url || '';
  document.getElementById('researchType').value = source.type;
  document.getElementById('researchAuthor').value = source.author || '';
  document.getElementById('researchNotes').value = source.notes || '';
  document.getElementById('researchTags').value = source.tags.join(', ');
  document.getElementById('researchCollection').value = source.collection || '';
  
  clearResearchFormErrors();
  populateCollectionSelect();
  document.getElementById('researchModal').classList.remove('hidden');
}

function populateCollectionSelect() {
  const select = document.getElementById('researchCollection');
  const customCollections = researchState.collections.filter(c => !c.isDefault);
  
  select.innerHTML = '<option value="">No collection</option>';
  customCollections.forEach(col => {
    const option = document.createElement('option');
    option.value = col.id;
    option.textContent = col.name;
    select.appendChild(option);
  });
}

function handleResearchFormSubmit(e) {
  e.preventDefault();
  
  const title = document.getElementById('researchTitle').value.trim();
  const url = document.getElementById('researchURL').value.trim();
  const type = document.getElementById('researchType').value;
  const author = document.getElementById('researchAuthor').value.trim();
  const notes = document.getElementById('researchNotes').value.trim();
  const tagsStr = document.getElementById('researchTags').value.trim();
  const collection = document.getElementById('researchCollection').value;
  
  // Validation
  clearResearchFormErrors();
  let hasError = false;
  
  if (title.length < 3) {
    showResearchFieldError('title', 'Title must be at least 3 characters');
    hasError = true;
  }
  
  if (url && !isValidURL(url)) {
    showResearchFieldError('url', 'Please enter a valid URL');
    hasError = true;
  }
  
  if (!type) {
    showResearchFieldError('type', 'Please select a type');
    hasError = true;
  }
  
  if (hasError) return;
  
  // Parse tags
  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim().toLowerCase()).filter(t => t) : [];
  
  if (researchState.editingId) {
    // Update existing
    const index = researchState.sources.findIndex(s => s.id === researchState.editingId);
    if (index !== -1) {
      researchState.sources[index] = {
        ...researchState.sources[index],
        title,
        url,
        type,
        author,
        notes,
        tags,
        collection
      };
      showToast('Research source updated!', 'success');
    }
  } else {
    // Add new
    const newSource = {
      id: Date.now(),
      title,
      url,
      type,
      author,
      notes,
      tags,
      dateAdded: new Date(),
      dateAccessed: new Date(),
      starred: false,
      collection,
      usageCount: 0
    };
    researchState.sources.unshift(newSource);
    showToast('Research source added!', 'success');
  }
  
  closeResearchModal();
  renderResearchSources();
  updateResearchStats();
}

function clearResearchFormErrors() {
  document.querySelectorAll('#researchForm .error-message').forEach(el => el.textContent = '');
}

function showResearchFieldError(field, message) {
  const errorEl = document.getElementById(field + 'Error');
  if (errorEl) {
    errorEl.textContent = message;
  }
}

function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function handleResearchSearch(e) {
  researchState.searchQuery = e.target.value.toLowerCase();
  renderResearchSources();
}

function setResearchFilter(filter) {
  researchState.currentFilter = filter;
  
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-filter="${filter}"]`)?.classList.add('active');
  
  renderResearchSources();
}

function setResearchCollection(collection) {
  researchState.currentCollection = collection;
  
  // Update active collection
  document.querySelectorAll('.collection-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`[data-collection="${collection}"]`)?.classList.add('active');
  
  renderResearchSources();
}

function handleResearchSort(e) {
  researchState.currentSort = e.target.value;
  renderResearchSources();
}

function getFilteredSources() {
  let filtered = [...researchState.sources];
  
  // Apply search
  if (researchState.searchQuery) {
    filtered = filtered.filter(source => 
      source.title.toLowerCase().includes(researchState.searchQuery) ||
      (source.author && source.author.toLowerCase().includes(researchState.searchQuery)) ||
      (source.notes && source.notes.toLowerCase().includes(researchState.searchQuery)) ||
      source.tags.some(tag => tag.includes(researchState.searchQuery))
    );
  }
  
  // Apply filter
  if (researchState.currentFilter !== 'all') {
    if (researchState.currentFilter === 'favorites') {
      filtered = filtered.filter(source => source.starred);
    } else {
      filtered = filtered.filter(source => source.type === researchState.currentFilter);
    }
  }
  
  // Apply collection
  if (researchState.currentCollection === 'favorites') {
    filtered = filtered.filter(source => source.starred);
  } else if (researchState.currentCollection === 'recent') {
    filtered = filtered.slice(0, 10);
  } else if (researchState.currentCollection !== 'all') {
    // Custom collection
    filtered = filtered.filter(source => source.collection === researchState.currentCollection);
  }
  
  // Apply sort
  switch (researchState.currentSort) {
    case 'alphabetical':
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'type':
      filtered.sort((a, b) => a.type.localeCompare(b.type));
      break;
    case 'used':
      filtered.sort((a, b) => b.usageCount - a.usageCount);
      break;
    case 'recent':
    default:
      filtered.sort((a, b) => b.dateAdded - a.dateAdded);
      break;
  }
  
  return filtered;
}

function renderResearchSources() {
  const grid = document.getElementById('researchGrid');
  const emptyState = document.getElementById('researchEmptyState');
  const filtered = getFilteredSources();
  
  if (filtered.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }
  
  emptyState.classList.add('hidden');
  
  grid.innerHTML = filtered.map(source => `
    <div class="research-card" onclick="openResearchDetail(${source.id})">
      <div class="research-card-header">
        <span class="research-type-badge">
          ${researchTypeIcons[source.type]} ${source.type.charAt(0).toUpperCase() + source.type.slice(1)}
        </span>
        <button class="research-star-btn ${source.starred ? 'starred' : ''}" 
                onclick="event.stopPropagation(); toggleStar(${source.id})">
          ${source.starred ? '⭐' : '☆'}
        </button>
      </div>
      <h3 class="research-title">${escapeHtml(source.title)}</h3>
      ${source.author ? `<div class="research-author">by ${escapeHtml(source.author)}</div>` : ''}
      ${source.notes ? `<div class="research-notes-preview">${escapeHtml(source.notes)}</div>` : ''}
      ${source.tags.length > 0 ? `
        <div class="research-tags">
          ${source.tags.slice(0, 3).map(tag => `<span class="research-tag">#${escapeHtml(tag)}</span>`).join('')}
          ${source.tags.length > 3 ? `<span class="research-tag">+${source.tags.length - 3}</span>` : ''}
        </div>
      ` : ''}
      ${source.url ? `<div class="research-url">${escapeHtml(source.url)}</div>` : ''}
      <div class="research-meta">
        <span>${formatTimestamp(source.dateAdded)}</span>
        <span>Used ${source.usageCount}x</span>
      </div>
      <div class="research-actions" onclick="event.stopPropagation()">
        ${source.url ? `<button class="research-action-btn" onclick="openResearchLink('${escapeHtml(source.url)}', '${escapeHtml(source.title)}')">🔗 Open</button>` : ''}
        <button class="research-action-btn" onclick="openEditResearchModal(${source.id})">Edit</button>
        <button class="research-action-btn delete-btn" onclick="deleteResearchSource(${source.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

function updateResearchStats() {
  const total = researchState.sources.length;
  const favorites = researchState.sources.filter(s => s.starred).length;
  
  // Update stats text
  document.getElementById('researchStatsText').textContent = 
    `${total} research source${total !== 1 ? 's' : ''}`;
  
  // Update collection counts
  document.getElementById('collectionCountAll').textContent = total;
  document.getElementById('collectionCountFavorites').textContent = favorites;
  document.getElementById('collectionCountRecent').textContent = Math.min(10, total);
  
  // Update filter counts
  document.getElementById('countAll').textContent = total;
  
  // Count by type
  const typeCounts = {};
  researchState.sources.forEach(source => {
    typeCounts[source.type] = (typeCounts[source.type] || 0) + 1;
  });
}

function toggleStar(id) {
  const source = researchState.sources.find(s => s.id === id);
  if (source) {
    source.starred = !source.starred;
    renderResearchSources();
    updateResearchStats();
    showToast(source.starred ? 'Added to favorites' : 'Removed from favorites', 'success');
  }
}

// Research Popup State
let researchPopupState = {
  isOpen: false,
  currentURL: '',
  openedAt: null,
  timerInterval: null
};

function openResearchLink(url, title = 'Research Source') {
  if (!url) return;
  
  // Open in popup instead of new tab
  openResearchPopup(url, title);
  
  // Increment usage count
  const source = researchState.sources.find(s => s.url === url);
  if (source) {
    source.usageCount++;
    source.dateAccessed = new Date();
    renderResearchSources();
  }
}

function openResearchPopup(url, title = 'Research Source') {
  const overlay = document.getElementById('researchPopupOverlay');
  const popup = document.getElementById('researchPopup');
  const popupTitle = document.getElementById('researchPopupTitle');
  const popupURL = document.getElementById('researchPopupURL');
  const popupContent = document.getElementById('researchPopupContent');
  const popupLoading = document.getElementById('popupLoading');
  
  // Set state
  researchPopupState.isOpen = true;
  researchPopupState.currentURL = url;
  researchPopupState.openedAt = new Date();
  
  // Update UI
  popupTitle.textContent = title;
  popupURL.value = url;
  
  // Show overlay and popup
  overlay.classList.remove('hidden');
  
  // Clear previous content and show loading
  popupContent.innerHTML = '<div class="popup-loading" id="popupLoading"><div class="popup-loading-spinner"></div><p>Loading content...</p></div>';
  
  // Create iframe
  setTimeout(() => {
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox');
    iframe.setAttribute('allow', 'fullscreen');
    
    // Handle load event
    iframe.onload = () => {
      const loading = document.getElementById('popupLoading');
      if (loading) loading.remove();
    };
    
    // Handle error event
    iframe.onerror = () => {
      showPopupError(url);
    };
    
    // Check if iframe loads after timeout
    setTimeout(() => {
      const loading = document.getElementById('popupLoading');
      if (loading) {
        // Still loading or failed - show error
        showPopupError(url);
      }
    }, 10000); // 10 second timeout
    
    popupContent.appendChild(iframe);
  }, 100);
  
  // Start timer display update
  updatePopupTimer();
  if (researchPopupState.timerInterval) {
    clearInterval(researchPopupState.timerInterval);
  }
  researchPopupState.timerInterval = setInterval(updatePopupTimer, 1000);
  
  // Update footer status
  updatePopupFooterStatus();
  setInterval(updatePopupFooterStatus, 60000); // Update every minute
}

function showPopupError(url) {
  const popupContent = document.getElementById('researchPopupContent');
  popupContent.innerHTML = `
    <div class="popup-error">
      <h3>Unable to load this content</h3>
      <p>This website cannot be displayed in an embedded frame.</p>
      <p><strong>Possible reasons:</strong></p>
      <ul>
        <li>Website blocks embedded viewing (X-Frame-Options)</li>
        <li>Security restrictions</li>
        <li>Invalid URL</li>
      </ul>
      <button class="popup-footer-btn" onclick="window.open('${escapeHtml(url)}', '_blank')">
        ↗️ Open in New Tab
      </button>
      <button class="popup-footer-btn" onclick="copyPopupURL()">
        📋 Copy URL
      </button>
      <button class="popup-footer-btn" onclick="closeResearchPopup()">
        ✕ Close
      </button>
    </div>
  `;
}

function updatePopupTimer() {
  const timerDisplay = document.getElementById('researchPopupTimer');
  if (!timerDisplay || !researchPopupState.isOpen) return;
  
  // Get current timer state
  const timeRemaining = appState.timer.timeRemaining;
  const isRunning = appState.timer.isRunning;
  
  // Format time
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Update display
  if (isRunning) {
    timerDisplay.textContent = `${timeStr} ⏱️`;
    
    // Change color based on time remaining
    timerDisplay.classList.remove('warning', 'critical');
    if (timeRemaining < 60) {
      timerDisplay.classList.add('critical');
    } else if (timeRemaining < 300) {
      timerDisplay.classList.add('warning');
    }
  } else {
    timerDisplay.textContent = `${timeStr} ⏸️ Paused`;
    timerDisplay.classList.remove('warning', 'critical');
  }
}

function updatePopupFooterStatus() {
  const statusEl = document.getElementById('popupFooterStatus');
  if (!statusEl || !researchPopupState.openedAt) return;
  
  const now = new Date();
  const diffMs = now - researchPopupState.openedAt;
  const diffMinutes = Math.floor(diffMs / 60000);
  
  if (diffMinutes < 1) {
    statusEl.textContent = 'Opened just now';
  } else if (diffMinutes === 1) {
    statusEl.textContent = 'Opened 1 minute ago';
  } else if (diffMinutes < 60) {
    statusEl.textContent = `Opened ${diffMinutes} minutes ago`;
  } else {
    const hours = Math.floor(diffMinutes / 60);
    statusEl.textContent = `Opened ${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
}

function closeResearchPopup() {
  const overlay = document.getElementById('researchPopupOverlay');
  
  // Clear timer interval
  if (researchPopupState.timerInterval) {
    clearInterval(researchPopupState.timerInterval);
    researchPopupState.timerInterval = null;
  }
  
  // Reset state
  researchPopupState.isOpen = false;
  researchPopupState.currentURL = '';
  researchPopupState.openedAt = null;
  
  // Hide overlay
  overlay.classList.add('hidden');
  
  // Clear content after animation
  setTimeout(() => {
    const popupContent = document.getElementById('researchPopupContent');
    if (popupContent) {
      popupContent.innerHTML = '<div class="popup-loading" id="popupLoading"><div class="popup-loading-spinner"></div><p>Loading content...</p></div>';
    }
  }, 300);
}

function openPopupInNewTab() {
  if (researchPopupState.currentURL) {
    window.open(researchPopupState.currentURL, '_blank');
  }
}

function copyPopupURL() {
  const urlInput = document.getElementById('researchPopupURL');
  if (urlInput) {
    urlInput.select();
    urlInput.setSelectionRange(0, 99999); // For mobile devices
    
    try {
      document.execCommand('copy');
      showToast('URL copied to clipboard!', 'success');
    } catch (err) {
      // Fallback for browsers that don't support execCommand
      try {
        navigator.clipboard.writeText(researchPopupState.currentURL).then(() => {
          showToast('URL copied to clipboard!', 'success');
        }).catch(() => {
          showToast('Failed to copy URL', 'error');
        });
      } catch (e) {
        showToast('Failed to copy URL', 'error');
      }
    }
  }
}

function deleteResearchSource(id) {
  if (!confirm('Are you sure you want to delete this research source?')) return;
  
  researchState.sources = researchState.sources.filter(s => s.id !== id);
  renderResearchSources();
  updateResearchStats();
  showToast('Research source deleted', 'success');
}

function openResearchDetail(id) {
  const source = researchState.sources.find(s => s.id === id);
  if (!source) return;
  
  // Increment usage count
  source.usageCount++;
  source.dateAccessed = new Date();
  
  const detailBody = document.getElementById('researchDetailBody');
  document.getElementById('detailTitle').textContent = source.title;
  
  detailBody.innerHTML = `
    <div class="research-detail-header">
      <div>
        <h2 class="research-detail-title">${escapeHtml(source.title)}</h2>
        <span class="research-type-badge">
          ${researchTypeIcons[source.type]} ${source.type.charAt(0).toUpperCase() + source.type.slice(1)}
        </span>
      </div>
      <div class="research-detail-actions">
        ${source.url ? `<button class="detail-action-btn" onclick="closeDetailModal(); openResearchLink('${escapeHtml(source.url)}', '${escapeHtml(source.title)}')">🔗 Open Link</button>` : ''}
        <button class="detail-action-btn" onclick="closeDetailModal(); openEditResearchModal(${source.id})">✏️ Edit</button>
        <button class="detail-action-btn" onclick="toggleStar(${source.id}); openResearchDetail(${source.id})">
          ${source.starred ? '⭐' : '☆'} ${source.starred ? 'Unfavorite' : 'Favorite'}
        </button>
      </div>
    </div>
    
    ${source.url ? `
      <div class="research-detail-section">
        <h3>URL</h3>
        <div class="research-detail-info">
          <a href="${escapeHtml(source.url)}" target="_blank" class="research-detail-link">${escapeHtml(source.url)}</a>
        </div>
      </div>
    ` : ''}
    
    ${source.author ? `
      <div class="research-detail-section">
        <h3>Author/Publisher</h3>
        <div class="research-detail-info">${escapeHtml(source.author)}</div>
      </div>
    ` : ''}
    
    ${source.notes ? `
      <div class="research-detail-section">
        <h3>Notes</h3>
        <div class="research-detail-info" style="white-space: pre-wrap;">${escapeHtml(source.notes)}</div>
      </div>
    ` : ''}
    
    ${source.tags.length > 0 ? `
      <div class="research-detail-section">
        <h3>Tags</h3>
        <div class="research-tags">
          ${source.tags.map(tag => `<span class="research-tag">#${escapeHtml(tag)}</span>`).join('')}
        </div>
      </div>
    ` : ''}
    
    <div class="research-detail-section">
      <h3>Statistics</h3>
      <div class="research-detail-info">
        <strong>Date Added:</strong> ${source.dateAdded.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}<br>
        <strong>Last Accessed:</strong> ${formatTimestamp(source.dateAccessed)}<br>
        <strong>Usage Count:</strong> Used ${source.usageCount} time${source.usageCount !== 1 ? 's' : ''}
      </div>
    </div>
  `;
  
  document.getElementById('researchDetailModal').classList.remove('hidden');
  renderResearchSources();
}

function closeDetailModal() {
  document.getElementById('researchDetailModal').classList.add('hidden');
}

// ===============================================
// COLLECTION MANAGEMENT
// ===============================================

function openAddCollectionModal() {
  const modal = createCollectionModal();
  document.body.appendChild(modal);
  modal.style.display = 'flex';
}

function createCollectionModal() {
  const modal = document.createElement('div');
  modal.className = 'research-modal';
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div class="research-modal-content">
      <div class="research-modal-header">
        <h2>Create New Collection</h2>
        <button class="research-modal-close" onclick="closeCollectionModal(this)">&times;</button>
      </div>
      <div class="research-modal-body">
        <form class="collection-form" onsubmit="handleCollectionFormSubmit(event)">
          <div class="form-group">
            <label for="collection-name">Collection Name <span class="required">*</span></label>
            <input 
              type="text" 
              id="collection-name" 
              name="name" 
              class="form-control"
              placeholder="e.g., Math Resources"
              required
            >
            <span class="error-message" id="collectionNameError"></span>
          </div>
          <div class="form-group">
            <label for="collection-color">Color</label>
            <div class="color-picker">
              <input 
                type="color" 
                id="collection-color" 
                name="color" 
                value="#4FC3F7"
              >
              <span class="color-preview" id="collection-color-preview" style="background-color: #4FC3F7;"></span>
            </div>
          </div>
          <div class="research-modal-actions">
            <button type="button" class="btn-cancel" onclick="closeCollectionModal(this)">Cancel</button>
            <button type="submit" class="btn-save">Create Collection</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  // Update color preview
  const colorInput = modal.querySelector('#collection-color');
  const colorPreview = modal.querySelector('#collection-color-preview');
  colorInput.addEventListener('input', (e) => {
    colorPreview.style.backgroundColor = e.target.value;
  });
  
  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeCollectionModal(modal);
    }
  });
  
  return modal;
}

function closeCollectionModal(element) {
  const modal = element.closest ? element.closest('.research-modal') : element;
  if (modal) {
    modal.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => modal.remove(), 300);
  }
}

function handleCollectionFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const name = form.querySelector('#collection-name').value.trim();
  const color = form.querySelector('#collection-color').value;
  
  // Validation
  if (name.length < 2) {
    const errorEl = document.getElementById('collectionNameError');
    if (errorEl) {
      errorEl.textContent = 'Collection name must be at least 2 characters';
    }
    return;
  }
  
  // Check for duplicate names
  const duplicate = researchState.collections.find(
    c => c.name.toLowerCase() === name.toLowerCase()
  );
  if (duplicate) {
    const errorEl = document.getElementById('collectionNameError');
    if (errorEl) {
      errorEl.textContent = 'A collection with this name already exists';
    }
    return;
  }
  
  // Create new collection
  const collection = {
    id: 'collection-' + Date.now(),
    name: name,
    icon: '📁',
    color: color,
    isDefault: false
  };
  
  researchState.collections.push(collection);
  renderCollections();
  populateCollectionSelect();
  
  // Show success message
  showToastNotification('Collection created', `"${name}" has been added`, 'success', '📁');
  
  // Close modal
  closeCollectionModal(form);
}

function renderCollections() {
  const container = document.getElementById('collectionsList');
  if (!container) return;
  
  container.innerHTML = '';
  
  researchState.collections.forEach(collection => {
    const collectionItem = document.createElement('div');
    collectionItem.className = 'collection-item';
    if (researchState.currentCollection === collection.id) {
      collectionItem.classList.add('active');
    }
    collectionItem.setAttribute('data-collection', collection.id);
    
    // Count sources in this collection
    let count = 0;
    if (collection.id === 'all') {
      count = researchState.sources.length;
    } else if (collection.id === 'favorites') {
      count = researchState.sources.filter(s => s.starred).length;
    } else if (collection.id === 'recent') {
      count = Math.min(10, researchState.sources.length);
    } else {
      count = researchState.sources.filter(s => s.collection === collection.id).length;
    }
    
    collectionItem.innerHTML = `
      <span class="collection-icon">${collection.icon}</span>
      <span class="collection-name">${escapeHtml(collection.name)}</span>
      <span class="collection-count" id="collectionCount${collection.id}">${count}</span>
      ${!collection.isDefault ? `<button class="collection-delete-btn" onclick="event.stopPropagation(); deleteCollection('${collection.id}')" title="Delete collection">&times;</button>` : ''}
    `;
    
    collectionItem.addEventListener('click', () => {
      setResearchCollection(collection.id);
    });
    
    container.appendChild(collectionItem);
  });
}

function deleteCollection(collectionId) {
  const collection = researchState.collections.find(c => c.id === collectionId);
  if (!collection) return;
  
  if (collection.isDefault) {
    alert('Cannot delete default collections');
    return;
  }
  
  if (!confirm(`Delete collection "${collection.name}"? Sources will not be deleted.`)) {
    return;
  }
  
  // Remove collection
  researchState.collections = researchState.collections.filter(c => c.id !== collectionId);
  
  // Remove collection from sources
  researchState.sources.forEach(source => {
    if (source.collection === collectionId) {
      source.collection = '';
    }
  });
  
  // Update UI
  renderCollections();
  populateCollectionSelect();
  
  // If currently viewing this collection, switch to all
  if (researchState.currentCollection === collectionId) {
    setResearchCollection('all');
  }
  
  showToastNotification('Collection deleted', `"${collection.name}" has been removed`, 'info');
}

// ===============================================
// START APPLICATION
// ===============================================

// SETUP LINK AUTO-COMPLETE FOR NOTE INPUT
setTimeout(() => {
  const notesInput = document.getElementById('notesInput');
  if (notesInput) {
    setupLinkAutoComplete(
      notesInput,
      () => currentNoteId,
      () => {} // previewRenderer if needed
    );
  }
}, 500);

document.addEventListener('DOMContentLoaded', init);