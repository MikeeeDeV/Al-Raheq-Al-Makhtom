import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { testSupabaseDatabaseConnection, syncUserProgressToSupabase } from '../services/supabaseClient';
import {
  User,
  Settings,
  ShieldCheck,
  Volume2,
  VolumeX,
  Target,
  CloudUpload,
  LogOut,
  LogIn,
  Save,
  Check,
  RefreshCw,
  Download,
  Moon,
  Sun,
  Coffee,
  Sparkles,
  BookOpen,
  Award,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const SettingsView: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    setAuthModalOpen,
    logoutUser,
    readingTheme,
    setReadingTheme,
    currentPage,
    totalPages,
    answeredQuestions,
    streak,
  } = useAppStore();

  const [nameInput, setNameInput] = useState(userProfile.name || 'القارئ الزائر');
  const [emailInput, setEmailInput] = useState(userProfile.email || '');
  const [dailyGoal, setDailyGoal] = useState(userProfile.dailyGoalPages || 5);
  const [flipSound, setFlipSound] = useState(userProfile.enableFlipSound ?? true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');

  const totalAnswered = Object.keys(answeredQuestions).length;
  const correctCount = Object.values(answeredQuestions).filter((a) => a.isCorrect).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = nameInput.trim() ? `القارئ ${nameInput.trim().replace(/^القارئ\s+/, '')}` : 'القارئ الزائر';
    updateUserProfile({
      name: cleanName,
      email: emailInput.trim(),
      dailyGoalPages: dailyGoal,
      enableFlipSound: flipSound,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCloudSync = async () => {
    setIsSyncing(true);
    setSyncStatusMsg('');
    await syncUserProgressToSupabase({
      current_page: currentPage,
      answered_questions_count: totalAnswered,
      correct_answers_count: correctCount,
      streak_days: streak,
      updated_at: new Date().toISOString(),
    });
    const dbTest = await testSupabaseDatabaseConnection();
    setIsSyncing(false);
    if (dbTest.success) {
      setSyncStatusMsg(`تمت المزامنة بنجاح وحفظ بيانات التقدم بالسحاب! (${dbTest.latencyMs}ms)`);
    } else {
      setSyncStatusMsg('تم حفظ البيانات محلياً وجاهزة للمزامنة السحابية.');
    }
  };

  const handleExportDataJson = () => {
    const state = useAppStore.getState();
    const backupObj = {
      userProfile: state.userProfile,
      currentPage: state.currentPage,
      bookmarks: state.bookmarks,
      answeredQuestions: state.answeredQuestions,
      streak: state.streak,
      readingStartDate: state.readingStartDate,
      readingEndDate: state.readingEndDate,
      exportedAt: new Date().toISOString(),
    };

    const jsonStr = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `بيانات_القارئ_الرحيق_المختوم_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 font-arabic dir-rtl">
      {/* Profile Top Banner Card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/30"
      >
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-right">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl flex items-center justify-center text-amber-300 text-2xl font-black shadow-lg border border-emerald-400/40 shrink-0">
              {userProfile.avatarUrl ? (
                <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-full h-full rounded-3xl object-cover" />
              ) : (
                <User className="w-9 h-9" />
              )}
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black">{userProfile.name || 'القارئ الزائر'}</h1>
                {userProfile.isLoggedIn && (
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full text-[11px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> موثق
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-200/80 font-light mt-1">
                {userProfile.email ? userProfile.email : 'حساب قارئ مخصص — منصة الرحيق المختوم'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {userProfile.isLoggedIn ? (
              <button
                onClick={() => logoutUser()}
                className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-2xl text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول السريع</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2-Cols: Settings Form */}
        <div className="md:col-span-2 space-y-6">
          {/* Section 1: General Profile Info Form */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant/30 rounded-3xl p-6 shadow-md space-y-4"
          >
            <div className="flex items-center gap-2 text-m3-onSurface font-bold border-b border-m3-outline-variant/20 pb-3">
              <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>بيانات حساب القارئ</span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-m3-onSurface mb-1.5">
                  اسم القارئ الرسمي:
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="أدخل اسمك (مثال: أحمد وسيصبح: القارئ أحمد)"
                  className="w-full px-4 py-2.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-xs font-bold focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-m3-onSurface mb-1.5">
                  البريد الإلكتروني:
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
                >
                  {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
                  <span>{isSaved ? 'تم حفظ التغييرات!' : 'حفظ بيانات القارئ'}</span>
                </button>
              </div>
            </form>
          </motion.div>

          {/* Section 2: Reading Preferences & Daily Target */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant/30 rounded-3xl p-6 shadow-md space-y-4"
          >
            <div className="flex items-center gap-2 text-m3-onSurface font-bold border-b border-m3-outline-variant/20 pb-3">
              <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>ورد القراءة والهدف اليومي</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-m3-onSurface mb-2">
                  عدد الصفحات المستهدفة يومياً (الورد اليومي):
                </label>

                <div className="grid grid-cols-4 gap-2">
                  {[3, 5, 10, 15].map((pages) => (
                    <button
                      key={pages}
                      type="button"
                      onClick={() => {
                        setDailyGoal(pages);
                        updateUserProfile({ dailyGoalPages: pages });
                      }}
                      className={`py-2.5 rounded-2xl text-xs font-bold transition border cursor-pointer ${dailyGoal === pages
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                          : 'bg-m3-surface-container dark:bg-m3-surface-darkContainer border-m3-outline-variant/20 text-m3-onSurface-variant hover:border-emerald-500/40'
                        }`}
                    >
                      <span>{pages} صفحات/يوم</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Page Sound Effect */}
              <div className="flex items-center justify-between p-3.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer rounded-2xl border border-m3-outline-variant/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    {flipSound ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-m3-onSurface">صوت تقليب الورق</p>
                    <p className="text-[11px] text-m3-onSurface-variant">تشغيل مؤثر تقليب صفحات الكتاب القارئ</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const val = !flipSound;
                    setFlipSound(val);
                    updateUserProfile({ enableFlipSound: val });
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 ${flipSound ? 'bg-emerald-600' : 'bg-slate-400 dark:bg-slate-700'
                    }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${flipSound ? 'translate-x-0' : '-translate-x-6'
                      }`}
                  />
                </button>
              </div>

              {/* Reader Theme Switcher */}
              <div>
                <label className="block text-xs font-bold text-m3-onSurface mb-2">
                  نمط خلفية القارئ الافتراضية:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'paper', label: 'ورقي', icon: Coffee, class: 'bg-[#FBF8F1] text-amber-900 border-amber-300' },
                    { id: 'sepia', label: 'دافئ', icon: Sun, class: 'bg-[#F4ECD8] text-amber-950 border-amber-400' },
                    { id: 'night', label: 'ليلي', icon: Moon, class: 'bg-[#121B2A] text-slate-100 border-slate-700' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setReadingTheme(t.id as any)}
                      className={`p-3 rounded-2xl text-xs font-bold transition border flex items-center justify-center gap-2 cursor-pointer ${t.class} ${readingTheme === t.id ? 'ring-2 ring-emerald-500 shadow-md' : 'opacity-80 hover:opacity-100'
                        }`}
                    >
                      <t.icon className="w-4 h-4" />
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right 1-Col: Cloud Sync & Data Management */}
        <div className="space-y-6">
          {/* Cloud Sync & Supabase Card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant/30 rounded-3xl p-6 shadow-md space-y-4"
          >
            <div className="flex items-center gap-2 text-m3-onSurface font-bold border-b border-m3-outline-variant/20 pb-3">
              <CloudUpload className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>المزامنة السحابية</span>
            </div>

            <p className="text-xs text-m3-onSurface-variant leading-relaxed font-light">
              احفظ تقدمك الحالي في قراءة صفحات الكتاب وإجابات المسابقات على خادم Supabase السحابي المشفّر.
            </p>

            {syncStatusMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl font-bold">
                {syncStatusMsg}
              </div>
            )}

            <button
              onClick={handleCloudSync}
              disabled={isSyncing}
              className="w-full py-3 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 text-amber-300 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'جاري المزامنة...' : 'مزامنة التقدم الآن'}</span>
            </button>
          </motion.div>

          {/* Backup & Export Data Card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant/30 rounded-3xl p-6 shadow-md space-y-4"
          >
            <div className="flex items-center gap-2 text-m3-onSurface font-bold border-b border-m3-outline-variant/20 pb-3">
              <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>تصدير نسخة احتياطية</span>
            </div>

            <p className="text-xs text-m3-onSurface-variant leading-relaxed font-light">
              قم بتنزيل سجل إجاباتك وعلاماتك المرجعية كملف JSON آمن تحتفظ به على جهازك.
            </p>

            <button
              onClick={handleExportDataJson}
              className="w-full py-3 border border-m3-outline-variant/40 hover:bg-m3-surface-variant text-m3-onSurface font-bold rounded-2xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>تحميل ملف البيانات (JSON)</span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
