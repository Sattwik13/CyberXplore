
type FileItem = {
  _id: string;
  filename: string;
  status: string;
  result: string | null;
  uploadedAt: string;
  scannedAt: string | null;
};

type ModalProps = {
  file: FileItem | null;
  onClose: () => void;
};

export function FileDetailsModal({ file, onClose }: ModalProps) {
  if (!file) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-md  bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose} // Close if overlay clicked
    >

      <div
        className="bg-slate-950/30 backdrop-blur-md rounded-2xl p-6 w-11/12 max-w-md text-blue-50"
        onClick={e => e.stopPropagation()} // Prevent close on modal click
      >
        <h2 className="text-3xl text-center font-mono mb-4">Details</h2>
        <p>
          <strong>Filename : </strong>
          <span className="font-mono">
            {file.filename}
          </span> 
        </p>
        <p>
          <strong>Status : </strong>
          <span className="font-mono">
            {file.status === 'pending' ? 'Pending' : 'Scanned'}
          </span> 
        </p>
        <p>
          <strong>Result : </strong>{' '}
          <span className="font-mono">
            {file.status === 'pending' ? '--' : (file.result === 'infected' ? 'Infected' : 'Clean')}
          </span>
        </p>
        <p>
          <strong>Uploaded At : </strong>
          <span className="font-mono">
            {new Date(file.uploadedAt).toLocaleString()}
          </span>
        </p>
        <p>
          <strong>Scanned At : </strong>{' '}
          <span className="font-mono">
            {file.scannedAt ? new Date(file.scannedAt).toLocaleString() : '--'}
          </span>  
        </p>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-blue-700 rounded hover:bg-blue-800"
        >
          Close
        </button>
      </div>
    </div>
  );
}
