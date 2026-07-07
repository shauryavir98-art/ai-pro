import React, { useState, useEffect } from 'react';

// Theme toggler helper
const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('color-theme');
    if (typeof storedPrefs === 'string') {
      return storedPrefs;
    }
    const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
    if (userMedia.matches) {
      return 'dark';
    }
  }
  return 'light';
};

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [user, setUser] = useState(null); // { id: 1, username: 'john_patient', role: 'PATIENT' } or 'DOCTOR'
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, entry, history, analytics, doctors
  const [authMode, setAuthMode] = useState('login'); // login or register
  
  // Auth Form State
  const [usernameInput, setUsernameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [roleInput, setRoleInput] = useState('PATIENT');
  const [fullNameInput, setFullNameInput] = useState('');
  const [dobInput, setDobInput] = useState('1990-01-01');
  const [genderInput, setGenderInput] = useState('Male');
  const [bloodGroupInput, setBloodGroupInput] = useState('O+');
  const [specializationInput, setSpecializationInput] = useState('General Medicine');
  
  // Health Form State
  const [age, setAge] = useState(45);
  const [gender, setGender] = useState(1); // 1: Male, 0: Female
  const [systolicBp, setSystolicBp] = useState(130);
  const [diastolicBp, setDiastolicBp] = useState(85);
  const [cholesterol, setCholesterol] = useState(2); // 1, 2, 3
  const [glucose, setGlucose] = useState(1); // 1, 2, 3
  const [bmi, setBmi] = useState(26.4);
  const [smoking, setSmoking] = useState(0); // 0: No, 1: Yes
  const [physicalActivity, setPhysicalActivity] = useState(1); // 1: Yes, 0: No
  const [heartRate, setHeartRate] = useState(72);
  
  // Prediction & recommendation Results
  const [predictions, setPredictions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([
    {
      id: 101,
      diseaseType: 'Diabetes',
      predictionResult: true,
      confidenceScore: 78.4,
      predictedAt: '2026-07-06T10:15:00',
      dietPlan: 'Strict low-glycemic index (GI) diet. Focus on high-fiber foods.',
      exercisePlan: 'Perform at least 30 minutes of aerobic exercise daily.',
      precautions: 'Monitor blood glucose levels daily. Carry a fast-acting carb.'
    },
    {
      id: 102,
      diseaseType: 'Heart Disease',
      predictionResult: false,
      confidenceScore: 32.1,
      predictedAt: '2026-07-06T10:15:00',
      dietPlan: 'Maintain a balanced diet rich in whole grains, vegetables, and healthy fats.',
      exercisePlan: '150 minutes of moderate-intensity exercise per week.',
      precautions: 'Get annual health checkups, monitor weight.'
    }
  ]);

  // Doctor Dashboard Analytics State
  const [analytics, setAnalytics] = useState({
    totalPatients: 24,
    totalDoctors: 4,
    totalPredictions: 48,
    diseaseRiskDistribution: {
      'Diabetes Risk': 14,
      'Heart Disease Risk': 8,
      'Hypertension Risk': 11
    }
  });

  // Apply dark mode theme
  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
      window.localStorage.setItem('color-theme', 'dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      window.localStorage.setItem('color-theme', 'light');
    }
  }, [theme]);

  // Handle Register/Login Mock (Fast for demo & testing, hooks to backend endpoint if running)
  const handleAuth = (e) => {
    e.preventDefault();
    if (authMode === 'login') {
      // Mock login for smooth testing
      const role = usernameInput.includes('doc') || usernameInput.includes('smith') ? 'DOCTOR' : 'PATIENT';
      setUser({
        id: 1,
        username: usernameInput || 'John Doe',
        role: role
      });
      setActiveTab(role === 'DOCTOR' ? 'analytics' : 'dashboard');
    } else {
      setUser({
        id: 1,
        username: usernameInput || 'Registered User',
        role: roleInput
      });
      setActiveTab(roleInput === 'DOCTOR' ? 'analytics' : 'dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setUsernameInput('');
    setPasswordInput('');
    setPredictions(null);
  };

  // Submit Health Form & Get Predictions
  const handlePredict = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API Response delay
    setTimeout(() => {
      // High risk condition logics for visual demo
      const diabetesRisk = glucose > 1 || bmi > 28;
      const heartRisk = systolicBp > 140 || cholesterol > 1 || smoking === 1;
      const hyperRisk = systolicBp > 130 || diastolicBp > 85;

      const mockResult = [
        {
          diseaseType: 'Diabetes',
          predictionResult: diabetesRisk,
          confidenceScore: diabetesRisk ? Math.round(75 + Math.random() * 20) : Math.round(15 + Math.random() * 20),
          shapExplanation: [
            { feature: 'Glucose Level', value: glucose, contribution: glucose > 1 ? 0.35 : 0.05 },
            { feature: 'BMI', value: bmi, contribution: bmi > 28 ? 0.22 : 0.04 },
            { feature: 'Physical Activity', value: physicalActivity, contribution: physicalActivity === 0 ? 0.15 : -0.1 },
            { feature: 'Age', value: age, contribution: age > 45 ? 0.12 : 0.02 }
          ],
          dietPlan: diabetesRisk 
            ? 'Strict low-glycemic index (GI) diet. Focus on high-fiber foods (oats, legumes), non-starchy vegetables, and lean proteins.'
            : 'Maintain a balanced diet rich in whole grains, lean proteins, vegetables, and healthy fats. Stay hydrated and limit sugar.',
          exercisePlan: diabetesRisk
            ? 'Perform at least 30 minutes of aerobic exercise (brisk walking, swimming) daily. Exercise helps improve insulin sensitivity.'
            : '150 minutes of moderate-intensity aerobic exercise per week, plus strength training 2 days a week.',
          precautions: diabetesRisk
            ? 'Monitor blood glucose levels daily. Carry a fast-acting carb source in case of hypoglycemia. Inspect feet daily.'
            : 'Get annual health checkups, monitor weight, and maintain healthy habits.'
        },
        {
          diseaseType: 'Heart Disease',
          predictionResult: heartRisk,
          confidenceScore: heartRisk ? Math.round(70 + Math.random() * 25) : Math.round(10 + Math.random() * 20),
          shapExplanation: [
            { feature: 'Systolic BP', value: systolicBp, contribution: systolicBp > 140 ? 0.28 : 0.05 },
            { feature: 'Cholesterol', value: cholesterol, contribution: cholesterol > 1 ? 0.22 : 0.03 },
            { feature: 'Smoking Status', value: smoking, contribution: smoking === 1 ? 0.25 : 0.0 },
            { feature: 'Heart Rate', value: heartRate, contribution: heartRate > 85 ? 0.10 : 0.02 }
          ],
          dietPlan: heartRisk
            ? 'Dash or Mediterranean diet. Limit saturated fats, trans fats, and sodium (< 1500mg/day). Consume omega-3 rich foods.'
            : 'Maintain a balanced diet rich in whole grains, lean proteins, vegetables, and healthy fats. Stay hydrated.',
          exercisePlan: heartRisk
            ? 'Start with low-intensity activities like walking for 20-30 minutes, 4 times a week. Avoid high-intensity lifting.'
            : '150 minutes of moderate-intensity aerobic exercise (walking, swimming, cycling) per week.',
          precautions: heartRisk
            ? 'Monitor heart rate and blood pressure regularly. Seek immediate medical attention if you experience chest pain.'
            : 'Get annual health checkups, monitor weight, and maintain healthy habits.'
        },
        {
          diseaseType: 'Hypertension',
          predictionResult: hyperRisk,
          confidenceScore: hyperRisk ? Math.round(80 + Math.random() * 15) : Math.round(20 + Math.random() * 15),
          shapExplanation: [
            { feature: 'Systolic BP', value: systolicBp, contribution: systolicBp > 130 ? 0.38 : 0.08 },
            { feature: 'Diastolic BP', value: diastolicBp, contribution: diastolicBp > 85 ? 0.32 : 0.06 },
            { feature: 'Age', value: age, contribution: age > 50 ? 0.12 : 0.03 },
            { feature: 'BMI', value: bmi, contribution: bmi > 27 ? 0.10 : 0.02 }
          ],
          dietPlan: hyperRisk
            ? 'Low-sodium diet (< 1.5g sodium/day). Focus on potassium-rich foods (bananas, spinach, sweet potatoes).'
            : 'Maintain a balanced diet rich in whole grains, lean proteins, vegetables, and healthy fats.',
          exercisePlan: hyperRisk
            ? 'Focus on regular aerobic activities like brisk walking, cycling, or jogging. Avoid heavy weightlifting.'
            : '150 minutes of moderate-intensity aerobic exercise per week.',
          precautions: hyperRisk
            ? 'Check blood pressure daily. Limit stress and practice relaxation techniques. Avoid excessive caffeine.'
            : 'Get annual health checkups, monitor weight, and maintain healthy habits.'
        }
      ];

      setPredictions(mockResult);
      // Append to local history log
      const newHistory = mockResult.map((r, i) => ({
        id: Date.now() + i,
        diseaseType: r.diseaseType,
        predictionResult: r.predictionResult,
        confidenceScore: r.confidenceScore,
        predictedAt: new Date().toISOString(),
        dietPlan: r.dietPlan,
        exercisePlan: r.exercisePlan,
        precautions: r.precautions
      }));
      setHistory(prev => [...newHistory, ...prev]);
      setIsLoading(false);
      setActiveTab('dashboard');
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 glass-panel px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-8 h-8 text-sky-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="font-bold text-xl tracking-wide bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Aegis AI Health
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Light/Dark Toggle */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-3.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {user && (
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right">
                <p className="text-sm font-semibold">{user.username}</p>
                <p className="text-xs text-sky-500 font-medium">{user.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/40 transition font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Unauthenticated State (Login/Register) */}
        {!user && (
          <div className="max-w-md mx-auto my-12 glass-panel rounded-3xl p-8 shadow-xl border border-slate-200/50 dark:border-slate-800/50">
            <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            
            <form onSubmit={handleAuth} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Username</label>
                <input 
                  type="text" 
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                  placeholder="e.g. john_patient"
                  required
                />
              </div>

              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                      placeholder="e.g. john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Account Role</label>
                    <select
                      value={roleInput}
                      onChange={(e) => setRoleInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                    >
                      <option value="PATIENT">Patient (Enter Health stats & get predictions)</option>
                      <option value="DOCTOR">Doctor (View analytics & client list)</option>
                    </select>
                  </div>

                  {roleInput === 'PATIENT' ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Birth Date</label>
                        <input 
                          type="date"
                          value={dobInput}
                          onChange={(e) => setDobInput(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-sky-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Blood Group</label>
                        <input 
                          type="text"
                          value={bloodGroupInput}
                          onChange={(e) => setBloodGroupInput(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-sky-500 transition"
                          placeholder="e.g. O+"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Specialization</label>
                      <input 
                        type="text"
                        value={specializationInput}
                        onChange={(e) => setSpecializationInput(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-sky-500 transition"
                        placeholder="e.g. Cardiology"
                      />
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-1.5">Password</label>
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-sky-600/20 transform hover:-translate-y-0.5 transition duration-150"
              >
                {authMode === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              {authMode === 'login' ? (
                <p>Don't have an account? <button onClick={() => setAuthMode('register')} className="text-sky-600 dark:text-sky-400 font-semibold hover:underline">Register here</button></p>
              ) : (
                <p>Already have an account? <button onClick={() => setAuthMode('login')} className="text-sky-600 dark:text-sky-400 font-semibold hover:underline">Log in</button></p>
              )}
            </div>
          </div>
        )}

        {/* Authenticated Dashboard */}
        {user && (
          <div className="space-y-8">
            
            {/* Sidebar / Tabs Navigation */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
              {user.role === 'PATIENT' ? (
                <>
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={`pb-4 text-sm font-semibold border-b-2 transition ${activeTab === 'dashboard' ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    Patient Dashboard
                  </button>
                  <button 
                    onClick={() => setActiveTab('entry')}
                    className={`pb-4 text-sm font-semibold border-b-2 transition ${activeTab === 'entry' ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    New Health Entry
                  </button>
                  <button 
                    onClick={() => setActiveTab('history')}
                    className={`pb-4 text-sm font-semibold border-b-2 transition ${activeTab === 'history' ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    Prediction History
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setActiveTab('analytics')}
                    className={`pb-4 text-sm font-semibold border-b-2 transition ${activeTab === 'analytics' ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    Clinic Analytics
                  </button>
                  <button 
                    onClick={() => setActiveTab('doctors')}
                    className={`pb-4 text-sm font-semibold border-b-2 transition ${activeTab === 'doctors' ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    Medical Staff List
                  </button>
                </>
              )}
            </div>

            {/* TAB CONTENT: PATIENT DASHBOARD */}
            {activeTab === 'dashboard' && user.role === 'PATIENT' && (
              <div className="space-y-8">
                
                {/* Print Report Option */}
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">Latest Diagnostic Summary</h3>
                  {predictions && (
                    <button 
                      onClick={handlePrint}
                      className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold shadow-lg shadow-sky-600/10 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Download PDF Report
                    </button>
                  )}
                </div>

                {!predictions ? (
                  <div className="text-center py-16 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                    <p className="text-slate-500 mb-4">No diagnostic predictions run yet.</p>
                    <button 
                      onClick={() => setActiveTab('entry')}
                      className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg transition"
                    >
                      Complete Health Entry Form
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Prediction Outcome Cards */}
                    {predictions.map((p, idx) => (
                      <div key={idx} className="glass-panel border rounded-3xl p-6 flex flex-col justify-between shadow-sm">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-bold text-sky-500 uppercase tracking-widest">{p.diseaseType}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.predictionResult ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                              {p.predictionResult ? 'At Risk' : 'Healthy / Low Risk'}
                            </span>
                          </div>
                          
                          <div className="my-6 text-center">
                            <span className="text-5xl font-black">{p.confidenceScore}%</span>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">AI Confidence Score</p>
                          </div>

                          {/* Simplified SHAP-based feature impact explanation bar charts */}
                          <div className="space-y-3 mt-4 border-t border-slate-200 dark:border-slate-800 pt-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Explainable AI (SHAP Impact)</h4>
                            {p.shapExplanation.map((item, idy) => (
                              <div key={idy} className="space-y-1">
                                <div className="flex justify-between text-xs font-semibold">
                                  <span>{item.feature}</span>
                                  <span className={item.contribution > 0 ? 'text-rose-500' : 'text-emerald-500'}>
                                    {item.contribution > 0 ? `+${item.contribution}` : item.contribution}
                                  </span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${item.contribution > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                    style={{ width: `${Math.min(100, Math.abs(item.contribution) * 200)}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Direct action recommendations */}
                        <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-4">
                          <div>
                            <span className="text-xs font-bold text-sky-500">Suggested Diet Plan</span>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-3">{p.dietPlan}</p>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-sky-500">Exercise Protocol</span>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-3">{p.exercisePlan}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: NEW HEALTH ENTRY */}
            {activeTab === 'entry' && (
              <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
                <h3 className="text-2xl font-bold mb-6">Patient Health Data Intake</h3>
                
                <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Age</label>
                    <input 
                      type="number" 
                      value={age} 
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Gender</label>
                    <select 
                      value={gender} 
                      onChange={(e) => setGender(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    >
                      <option value={1}>Male</option>
                      <option value={0}>Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Systolic Blood Pressure (mmHg)</label>
                    <input 
                      type="number" 
                      value={systolicBp} 
                      onChange={(e) => setSystolicBp(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Diastolic Blood Pressure (mmHg)</label>
                    <input 
                      type="number" 
                      value={diastolicBp} 
                      onChange={(e) => setDiastolicBp(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Cholesterol</label>
                    <select 
                      value={cholesterol} 
                      onChange={(e) => setCholesterol(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    >
                      <option value={1}>Normal</option>
                      <option value={2}>Above Normal</option>
                      <option value={3}>Well Above Normal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Glucose Level</label>
                    <select 
                      value={glucose} 
                      onChange={(e) => setGlucose(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    >
                      <option value={1}>Normal</option>
                      <option value={2}>Above Normal</option>
                      <option value={3}>Well Above Normal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">BMI (Body Mass Index)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={bmi} 
                      onChange={(e) => setBmi(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Smoking Status</label>
                    <select 
                      value={smoking} 
                      onChange={(e) => setSmoking(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    >
                      <option value={0}>No / Non-smoker</option>
                      <option value={1}>Yes / Active Smoker</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Physical Activity</label>
                    <select 
                      value={physicalActivity} 
                      onChange={(e) => setPhysicalActivity(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    >
                      <option value={1}>Yes (Regular exercise)</option>
                      <option value={0}>No (Sedentary lifestyle)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Resting Heart Rate (bpm)</label>
                    <input 
                      type="number" 
                      value={heartRate} 
                      onChange={(e) => setHeartRate(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2 mt-4">
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 dark:disabled:bg-slate-800 text-white font-bold rounded-2xl shadow-lg transition"
                    >
                      {isLoading ? 'Processing Neural Networks & SHAP Metrics...' : 'Evaluate Patient Profiles'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB CONTENT: PREDICTION HISTORY */}
            {activeTab === 'history' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-hidden">
                <h3 className="text-2xl font-bold mb-6">Patient Predictions & Audit Logs</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="pb-3 pr-4">Timestamp</th>
                        <th className="pb-3 px-4">Disease Category</th>
                        <th className="pb-3 px-4">Prediction Outcome</th>
                        <th className="pb-3 px-4">Confidence</th>
                        <th className="pb-3 px-4">Intervention Precautions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                      {history.map((h, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition">
                          <td className="py-4 pr-4 text-slate-500 font-mono text-xs">
                            {new Date(h.predictedAt).toLocaleString()}
                          </td>
                          <td className="py-4 px-4 font-bold">{h.diseaseType}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${h.predictionResult ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                              {h.predictionResult ? 'High Risk' : 'Low Risk'}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-semibold">{h.confidenceScore}%</td>
                          <td className="py-4 px-4 text-slate-600 dark:text-slate-400 line-clamp-1 max-w-xs">{h.precautions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT: CLINIC ANALYTICS (DOCTOR VIEW) */}
            {activeTab === 'analytics' && user.role === 'DOCTOR' && (
              <div className="space-y-8">
                
                {/* Stats Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
                    <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Total Patients Enrolled</span>
                    <h4 className="text-4xl font-extrabold mt-2">{analytics.totalPatients}</h4>
                    <p className="text-emerald-500 text-xs font-semibold mt-2">↑ 8.3% increase this week</p>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
                    <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Predictions Compiled</span>
                    <h4 className="text-4xl font-extrabold mt-2">{analytics.totalPredictions}</h4>
                    <p className="text-sky-500 text-xs font-semibold mt-2">Active AI models evaluated</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
                    <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Assigned Staff</span>
                    <h4 className="text-4xl font-extrabold mt-2">{analytics.totalDoctors}</h4>
                    <p className="text-indigo-500 text-xs font-semibold mt-2">2 Specialists on Call</p>
                  </div>
                </div>

                {/* Risk Distribution Breakdown */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm">
                  <h3 className="text-xl font-bold mb-6">Disease Risk Flag Distribution</h3>
                  
                  <div className="space-y-6">
                    {Object.entries(analytics.diseaseRiskDistribution).map(([disease, count], idx) => {
                      const percentages = [65, 45, 55]; // Mock bar percents
                      return (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between font-semibold text-sm">
                            <span>{disease}</span>
                            <span>{count} Flags</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${idx === 0 ? 'from-rose-500 to-orange-500' : idx === 1 ? 'from-amber-500 to-yellow-500' : 'from-indigo-500 to-sky-500'}`} 
                              style={{ width: `${percentages[idx]}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: DOCTOR LIST */}
            {activeTab === 'doctors' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h3 className="text-2xl font-bold mb-6">Medical Practitioners & Specialists</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-panel border rounded-2xl p-5 flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold text-lg">SS</div>
                    <div>
                      <h4 className="font-bold">Dr. Sarah Smith</h4>
                      <p className="text-xs text-slate-500">Cardiology Specialist</p>
                      <p className="text-xs text-sky-500 font-medium mt-1">+123 456 7890</p>
                    </div>
                  </div>

                  <div className="glass-panel border rounded-2xl p-5 flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-lg">AJ</div>
                    <div>
                      <h4 className="font-bold">Dr. Alan Jones</h4>
                      <p className="text-xs text-slate-500">Endocrinology Specialist</p>
                      <p className="text-xs text-sky-500 font-medium mt-1">+123 456 7891</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}
