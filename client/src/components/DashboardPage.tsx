import { useEffect, useState, useRef } from 'react';
import { fetchFiles } from '../api';
import { FileDetailsModal } from './FileDetailsModal';
import { toast } from 'react-toastify';

type FileItem = {
  _id: string;
  filename: string;
  status: string;
  result: string | null;
  uploadedAt: string;
  scannedAt: string | null;
};


export default function DashboardPage({ refreshKey }: { refreshKey: number }) {

  const [files, setFiles] = useState<FileItem[]>([]);

  //-- Add filter based on status
  const [filter, setFilter] = useState<'all'|'clean'|'infected'>('all');

  //-- New state for selected file to show in modal
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  //-- State to hold selected page number for pagination
  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 10; // Number of items to show per page

  //-- Ref to keep track of files on previous fetch
  const previousFilesRef = useRef<Record<string, FileItem>>({});

  
  useEffect(() => {
    //---  Fetch files async function
    async function loadFiles() {
      const res = await fetchFiles(); //--- API call to fetch file data
      const newFiles = res.data;

      // Show toast for newly scanned files that were previously pending
      newFiles.forEach((file: FileItem) => {
        const prevFile = previousFilesRef.current[file._id]; //--- Look up previous version of this file

        //--- If the file existed before and was previously pending, but is now scanned
        if (
          prevFile &&
          prevFile.status === 'pending' &&
          file.status === 'scanned'
        ) {
          // Show toast notification
          toast.success(
            `File "${file.filename}" scanned successfully: ${
              file.result === 'infected' ? 'Infected' : 'Clean'
            }`
          );
        }
      });

      // Update state and previous files ref
      setFiles(newFiles);
      previousFilesRef.current = newFiles.reduce((acc: any, file: FileItem) => {
        acc[file._id] = file;
        return acc;
      }, {});
    }

    // Initial load and polling setup
    loadFiles();
    const timer = setInterval(loadFiles, 4000);

    return () => clearInterval(timer);
  }, [refreshKey]);

  //-- Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  //-- to fetch files initially and then poll for updates every 4 seconds
  // useEffect(() => {
  //   // initial fetch
  //   fetchFiles().then(res => setFiles(res.data));
  //   // Poll every 4 seconds for updates
  //   const timer = setInterval(() => 
  //     fetchFiles()
  //     .then(res => setFiles(res.data)),
  //      4000);

  //   return () => clearInterval(timer); // Cleanup timer on unmount or when refreshKey changes
  // }, [refreshKey]);

  //-- Filter files based on selected filter
  const filteredFiles = files.filter(f => {
    //  console.log(`Filtering file ${f.filename} result:`, f.result); //-- Testing purpose
    if (filter === 'all') return true;
    return f.result === filter;
  });

  //-- Pagination logic
  //--- Calculate total pages needed for pagination, rounded up
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  //--- Calculate start and end indices of files for current page slice
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  //-- Extract only the files to show on the current page
  const currentFiles = filteredFiles.slice(indexOfFirstItem, indexOfLastItem);

  return (
     <div className="min-h-screen bg-slate-900/20 backdrop-blur-md rounded-2xl text-white p-6 font-sans">
      
      {/* Filter buttons */}
      <div className="mb-4 space-x-2 ">
          <h2 className="text-3xl text-center font-mono mb-4">Dashboard</h2>
        <button
         onClick={() => setFilter('all')} 
         className={`px-4 py-2 rounded-xl ${
            filter === 'all' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-600'
          }`}>
            All
          </button>

        <button
         onClick={() => setFilter('clean')} 
         className={`px-4 py-2 rounded-xl ${
            filter === 'clean' ? 'bg-green-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-600'
          }`}>
            Clean
          </button>
        <button
         onClick={() => setFilter('infected')} 
         className={`px-4 py-2 rounded-xl ${
            filter === 'infected' ? 'bg-red-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-600'
          }`}>
            Infected
          </button>
      </div>


      {/* main section */}
      <div className="overflow-x-auto rounded-xl">

        {filteredFiles.length === 0 ? (
          <p>
            No files matching filter.
          </p>

      ) : (

        <table className="w-full table-auto text-sm bg-gray-950 rounded-xl shadow-lg">

          <thead className="bg-slate-950 text-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Filename</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Result</th>
              <th className="px-4 py-3 text-left">Uploaded</th>
              <th className="px-4 py-3 text-left">Scanned</th>
            </tr>
          </thead>

          <tbody>
            {currentFiles.map((f) => (
              <tr key={f._id} className="border-t border-gray-700">
                <td className="px-4 py-2">
                  {f.filename}
                </td>
                <td className="px-4 py-2">
                  {f.status === 'pending' ? (
                    <span className="text-yellow-400 font-medium">Pending</span>
                  ) : (
                    <span className="text-blue-400 font-medium">Scanned</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {f.status === 'pending' ? (
                    '--'
                  ) : (
                    <span
                      className={`font-medium ${
                        f.result === 'infected' ? 'text-red-500' : 'text-green-400'
                      }`}
                    >
                      {f.result === 'infected' ? 'Infected' : 'Clean'}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">{new Date(f.uploadedAt).toLocaleString()}</td>
                <td className="px-4 py-2">
                  {f.scannedAt ? new Date(f.scannedAt).toLocaleString() : '--'}
                </td>

                <td className="px-4 py-2">
                  <button
                    onClick={() => setSelectedFile(f)}
                    className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 text-white"
                  >
                    View Details
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center py-4 space-x-1">

        {/* Previous button - disabled on first page */}
        <button
          onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-s-xl ${currentPage === 1 ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
        >Previous</button>

        {/* Numbered page buttons */}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-green-500' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
          >{i + 1}</button>
        ))}

        {/* Next button - disabled on last page */}
        <button
          onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-br-xl ${currentPage === totalPages ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
         >Next
        </button>
      </div>

      {/* Add File Details */}
      <FileDetailsModal file={selectedFile} onClose={() => setSelectedFile(null)} />
    </div>
  );
}
