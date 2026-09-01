import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-m3-surface dark:bg-m3-surface-dark text-m3-onSurface flex items-center justify-center p-6 font-arabic" dir="rtl">
          <div className="bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-3xl p-8 shadow-m3-4 max-w-lg w-full text-center space-y-6">
            <div className="w-16 h-16 bg-amber-500/15 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-m3-1">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-m3-onSurface">حدث تنبيه في التطبيق</h2>
              <p className="text-sm text-m3-onSurface-variant leading-relaxed">
                تم استعادة نظام التطبيق بنجاح لمنع توقف الشاشة. يمكنك تحديث الصفحة أو العودة للرئيسية.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-600 dark:text-red-300 font-mono text-right overflow-x-auto dir-ltr">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 px-6 py-3 bg-m3-primary text-white rounded-full font-bold text-sm shadow-m3-2 hover:bg-m3-primary/90 transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة تحميل التطبيق</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex items-center gap-2 px-6 py-3 bg-m3-surface-dim text-m3-onSurface rounded-full font-bold text-sm hover:bg-m3-surface-high transition cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>الصفحة الرئيسية</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
