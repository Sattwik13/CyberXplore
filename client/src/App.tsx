import { useState } from 'react';
import UploadPage from './components/UploadPage';
import DashboardPage from './components/DashboardPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-bold text-green-400 mb-2">CyberXplore Secure File Upload</h1>
          <p className="text-gray-400 font-mono text-sm">Upload and scan files with real-time status updates</p>
        </header>

        {/* Upload Section */}
        <section className="bg-slate-950 p-6 rounded-2xl shadow">
          <h2 className="text-2xl text-center font-mono mb-4">Uploader</h2>
          <UploadPage onUpload={() => setRefresh(v => v + 1)} />
        </section>

        {/* Dashboard Section */}
        <section className="bg-slate-950/10 p-6 rounded shadow">
          {/* <h2 className="text-3xl text-center font-mono mb-4">Dashboard</h2> */}
          <DashboardPage refreshKey={refresh} />
        </section>

      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}

export default App;
