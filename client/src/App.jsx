import { useEffect } from 'react';
import { useSelector } from 'react-redux';

function App() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Nexarion Global Exports
              </h1>
              <p className="text-emerald-400 text-sm mt-1">Premium Import Export Solutions</p>
            </div>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-white">Welcome, {user?.name}</span>
                <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-sm">
                  {user?.role}
                </span>
              </div>
            ) : (
              <div className="flex gap-3">
                <button className="px-6 py-2 bg-white text-slate-800 rounded-lg font-semibold hover:bg-emerald-400 hover:text-white transition-all">
                  Login
                </button>
                <button className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-all">
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-slate-800 mb-6 animate-fadeInUp">
            Welcome to Nexarion
          </h2>
          <p className="text-xl text-slate-600 mb-8 animate-fadeInUp">
            Your trusted partner in global import-export solutions
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Global Reach</h3>
              <p className="text-slate-600">Connect with suppliers and buyers worldwide</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">B2B Platform</h3>
              <p className="text-slate-600">Professional trade solutions for businesses</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Fast & Secure</h3>
              <p className="text-slate-600">Quick processing with secure transactions</p>
            </div>
          </div>

          <div className="mt-12 p-8 bg-emerald-50 rounded-xl border-2 border-emerald-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              🎉 Setup Complete!
            </h3>
            <div className="text-left max-w-2xl mx-auto space-y-2 text-slate-700">
              <p>✅ <strong>Vite 7.2.4</strong> - Lightning fast development</p>
              <p>✅ <strong>React 19.2.0</strong> - Latest React features</p>
              <p>✅ <strong>Redux Toolkit</strong> - State management configured</p>
              <p>✅ <strong>React Router</strong> - Routing ready</p>
              <p>✅ <strong>Axios</strong> - API integration setup</p>
              <p>✅ <strong>Tailwind CSS</strong> - Styled as per import_export.html</p>
              <p>✅ <strong>Proxy configured</strong> - Backend at localhost:5000</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 Nexarion Global Exports. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

