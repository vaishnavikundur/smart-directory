import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Download, AlertCircle, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { useUiStore } from '../stores/uiStore';
import { useImportContacts } from '../hooks/useContacts';
import { contactsApi } from '../api/contacts';

type TabType = 'import' | 'export';

export const ImportExportModal: React.FC = () => {
  const { activeModal, closeModal } = useUiStore();
  const [activeTab, setActiveTab] = useState<TabType>('import');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  
  const [importResult, setImportResult] = useState<{
    success: boolean;
    imported: number;
    failedCount: number;
    failedRows: { row: number; error: string }[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const importMutation = useImportContacts();

  const isOpen = activeModal === 'import' || activeModal === 'export';

  // Toggle active tab on mount
  React.useEffect(() => {
    if (activeModal === 'import' || activeModal === 'export') {
      setActiveTab(activeModal);
      // Reset state
      setCsvFile(null);
      setPreviewData([]);
      setPreviewHeaders([]);
      setParseError(null);
      setImportResult(null);
    }
  }, [activeModal]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setParseError('Please upload a valid CSV file.');
      return;
    }

    setCsvFile(file);
    setParseError(null);
    setImportResult(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.error(results.errors);
          setParseError('Failed to parse CSV file structure.');
          return;
        }

        const data = results.data;
        if (data.length === 0) {
          setParseError('CSV file is empty.');
          return;
        }

        setPreviewHeaders(Object.keys(data[0] as any));
        setPreviewData(data.slice(0, 5)); // Show first 5 rows as preview
      },
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async () => {
    if (!csvFile) return;

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const parsedContacts = results.data.map((row: any) => {
          // Standardize CSV column mappings
          const tags = row.tags
            ? row.tags
                .split(',')
                .map((t: string) => t.trim())
                .filter(Boolean)
            : [];
          return {
            name: row.name || row.Name || '',
            email: row.email || row.Email || undefined,
            phone: row.phone || row.Phone || undefined,
            company: row.company || row.Company || undefined,
            address: row.address || row.Address || undefined,
            tags,
          };
        }).filter((c: any) => c.name); // Require at least a name

        if (parsedContacts.length === 0) {
          setParseError('No valid contacts found. Please check your CSV format.');
          return;
        }

        try {
          const res = await importMutation.mutateAsync(parsedContacts);
          setImportResult({
            success: true,
            imported: res.imported,
            failedCount: res.failed?.length || 0,
            failedRows: res.failed || [],
          });
        } catch (err: any) {
          setParseError(err.response?.data?.message || 'Failed to import contacts.');
        }
      },
    });
  };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const response = await contactsApi.exportContacts(format);
      
      const blob = new Blob([response], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contacts_export_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      closeModal();
    } catch (err) {
      console.error('Failed to export contacts', err);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative z-10 w-full max-w-2xl p-6 md:p-8 overflow-hidden shadow-2xl bg-[var(--bg-card)] rounded-apple-lg border border-[var(--border-soft)]"
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          {/* Title */}
          <div className="mb-6">
            <h2 className="text-[28px] font-semibold tracking-apple-tight text-[var(--text-primary)]">Import & Export</h2>
            <p className="text-[14px] text-[var(--text-secondary)] mt-1">Bulk transfer your contacts via CSV or JSON formats.</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[var(--border-soft)] mb-6">
            <button
              onClick={() => {
                setActiveTab('import');
                setParseError(null);
                setImportResult(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 font-medium text-[14px] transition-all border-b-2 -mb-[1px] ${
                activeTab === 'import'
                  ? 'border-[var(--text-primary)] text-[var(--text-primary)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Upload size={16} /> Import CSV
            </button>
            <button
              onClick={() => {
                setActiveTab('export');
                setParseError(null);
                setImportResult(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 font-medium text-[14px] transition-all border-b-2 -mb-[1px] ${
                activeTab === 'export'
                  ? 'border-[var(--text-primary)] text-[var(--text-primary)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Download size={16} /> Export Contacts
            </button>
          </div>

          {/* Tab content panels */}
          <div className="min-h-[220px]">
            {activeTab === 'import' ? (
              <div className="space-y-4">
                {/* Results Screen */}
                {importResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-[var(--border-soft)] space-y-3"
                  >
                    <div className="flex items-center gap-2 text-green-500 font-semibold">
                      <CheckCircle2 size={18} /> Import completed successfully!
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-3 border-y border-[var(--border-hard)] text-[14px]">
                      <div>
                        <span className="text-[var(--text-secondary)]">Imported Rows:</span>{' '}
                        <strong className="text-[var(--text-primary)] text-lg ml-1">{importResult.imported}</strong>
                      </div>
                      <div>
                        <span className="text-[var(--text-secondary)]">Failed Rows:</span>{' '}
                        <strong className={`${importResult.failedCount > 0 ? 'text-red-500' : 'text-[var(--text-primary)]'} text-lg ml-1`}>
                          {importResult.failedCount}
                        </strong>
                      </div>
                    </div>

                    {importResult.failedCount > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block">
                          Failure Logs
                        </span>
                        <div className="max-h-28 overflow-y-auto space-y-1 pr-1 border border-[var(--border-hard)] bg-[var(--bg-page)] p-2.5 rounded-xl">
                          {importResult.failedRows.map((fail, idx) => (
                            <div key={idx} className="text-[12px] text-red-500 flex items-start gap-1">
                              <span className="font-semibold flex-shrink-0">Row {fail.row}:</span>
                              <span>{fail.error}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => setImportResult(null)}
                        className="btn-secondary py-2 text-[14px]"
                      >
                        Upload Another File
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Main Upload Dropzone */}
                {!importResult && (
                  <>
                    {!csvFile ? (
                      <div
                        onClick={triggerFileInput}
                        className="border border-dashed border-[var(--border-hard)] hover:border-[var(--text-secondary)] rounded-2xl p-8 text-center cursor-pointer transition-colors bg-[var(--bg-page)] group flex flex-col items-center justify-center min-h-[180px]"
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept=".csv"
                          className="hidden"
                        />
                        <Upload className="w-10 h-10 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors mb-3" />
                        <h3 className="font-medium text-[var(--text-primary)]">Drag and drop or select a CSV file</h3>
                        <p className="text-[12px] text-[var(--text-secondary)] mt-1 max-w-xs leading-relaxed">
                          Your CSV should have columns: <code>name</code>, <code>email</code>, <code>phone</code>,{' '}
                          <code>company</code>, <code>address</code>, <code>tags</code>
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* File detail */}
                        <div className="flex items-center justify-between p-3.5 bg-[var(--bg-page)] rounded-xl border border-[var(--border-hard)]">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[var(--border-soft)] text-[var(--text-primary)] rounded-lg">
                              <FileText size={20} />
                            </div>
                            <div>
                              <h4 className="font-medium text-[14px] text-[var(--text-primary)]">{csvFile.name}</h4>
                              <p className="text-[12px] text-[var(--text-secondary)]">{(csvFile.size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setCsvFile(null);
                              setPreviewData([]);
                            }}
                            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>

                        {/* Preview panel */}
                        {previewData.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[12px] font-semibold text-[var(--text-secondary)] tracking-wider uppercase flex items-center gap-1">
                              Previewing Top {previewData.length} Rows <ChevronRight size={14} />
                            </span>
                            <div className="overflow-x-auto border border-[var(--border-hard)] rounded-xl max-h-48">
                              <table className="w-full text-left border-collapse text-[12px]">
                                <thead>
                                  <tr className="bg-[var(--border-soft)] border-b border-[var(--border-hard)] text-[var(--text-secondary)] font-medium">
                                    {previewHeaders.map((header) => (
                                      <th key={header} className="p-2.5 capitalize">{header}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {previewData.map((row, idx) => (
                                    <tr key={idx} className="border-b border-[var(--border-hard)] hover:bg-[var(--border-soft)] text-[var(--text-primary)]">
                                      {previewHeaders.map((header) => (
                                        <td key={header} className="p-2.5 truncate max-w-[120px]">{row[header] || '-'}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Import Trigger */}
                        <div className="flex justify-end gap-3 pt-2">
                          <button
                            onClick={() => {
                              setCsvFile(null);
                              setPreviewData([]);
                            }}
                            className="btn-secondary py-2 px-4 text-[14px]"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleImport}
                            disabled={importMutation.isPending}
                            className="btn-primary py-2 px-5 text-[14px] flex items-center justify-center min-w-[100px]"
                          >
                            {importMutation.isPending ? (
                              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                              'Import Now'
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {parseError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[12px] text-red-500 flex items-center gap-2 mt-2">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <span>{parseError}</span>
                  </div>
                )}
              </div>
            ) : (
              // Export panel
              <div className="space-y-6 pt-4 flex flex-col justify-center items-center text-center">
                <div className="p-3 bg-[var(--border-soft)] text-[var(--text-primary)] rounded-full mb-2">
                  <Download size={32} />
                </div>
                <div>
                  <h3 className="text-[18px] font-semibold text-[var(--text-primary)] tracking-apple-tight">Export your Contact List</h3>
                  <p className="text-[14px] text-[var(--text-secondary)] mt-1 max-w-sm leading-relaxed">
                    Download all your contacts and associated metadata. Select a structured file format below.
                  </p>
                </div>

                <div className="flex gap-4 w-full max-w-md pt-2">
                  <button
                    onClick={() => handleExport('csv')}
                    className="flex-1 p-5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-hard)] hover:border-[var(--text-primary)] transition-all flex flex-col items-center gap-2 group"
                  >
                    <span className="px-3 py-1 text-[12px] font-semibold tracking-widest text-[var(--text-primary)] bg-[var(--border-soft)] rounded-apple-pill">CSV</span>
                    <span className="font-medium text-[14px] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Comma Separated</span>
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    className="flex-1 p-5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-hard)] hover:border-[var(--text-primary)] transition-all flex flex-col items-center gap-2 group"
                  >
                    <span className="px-3 py-1 text-[12px] font-semibold tracking-widest text-[var(--text-primary)] bg-[var(--border-soft)] rounded-apple-pill">JSON</span>
                    <span className="font-medium text-[14px] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Raw Data Format</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default ImportExportModal;
