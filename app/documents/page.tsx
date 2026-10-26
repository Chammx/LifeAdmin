
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Filter,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";

type DocumentRecord = {
  id: string;
  name: string;
  provider: string;
  category: string;
  expiry: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
};

const STORAGE_KEY = "lifeadmin-documents";
const DB_NAME = "lifeadmin-files";
const DB_STORE = "documents";
const CATEGORIES = ["Insurance", "Warranty", "Bills", "Identity", "Other"];

function openFileDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveFile(id: string, file: File) {
  const db = await openFileDB();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readwrite");
    tx.objectStore(DB_STORE).put(file, id);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

async function deleteFile(id: string) {
  const db = await openFileDB();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readwrite");
    tx.objectStore(DB_STORE).delete(id);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

async function getFile(id: string): Promise<Blob | undefined> {
  const db = await openFileDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readonly");
    const request = tx.objectStore(DB_STORE).get(id);

    request.onsuccess = () => resolve(request.result as Blob | undefined);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

function getDays(expiry: string) {
  if (!expiry) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(`${expiry}T00:00:00`);
  return Math.ceil((date.getTime() - today.getTime()) / 86400000);
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const [newCategory, setNewCategory] = useState("Insurance");
  const [expiry, setExpiry] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setDocuments(JSON.parse(stored));
    } catch {
      setError("Could not load saved documents.");
    } finally {
      setReady(true);
    }
  }, []);

  function persist(next: DocumentRecord[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setDocuments(next);
  }

  const filtered = useMemo(
    () =>
      documents.filter((doc) => {
        const matchesSearch =
          `${doc.name} ${doc.provider} ${doc.category}`
            .toLowerCase()
            .includes(query.toLowerCase());

        return (
          matchesSearch &&
          (category === "All" || doc.category === category)
        );
      }),
    [documents, query, category]
  );

  const days = documents.map((doc) => getDays(doc.expiry));
  const expiring = days.filter((day) => day !== null && day >= 0 && day <= 30).length;
  const expired = days.filter((day) => day !== null && day < 0).length;

  function closeModal() {
    setUploadOpen(false);
    setName("");
    setProvider("");
    setNewCategory("Insurance");
    setExpiry("");
    setFile(null);
    setError("");
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please choose a document file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("The file must be 10 MB or smaller.");
      return;
    }

    if (expiry && getDays(expiry) === null) {
      setError("Please enter a valid expiry date.");
      return;
    }

    setSaving(true);

    const id = crypto.randomUUID();
    const record: DocumentRecord = {
      id,
      name: name.trim(),
      provider: provider.trim() || "Not specified",
      category: newCategory,
      expiry,
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      fileSize: file.size,
      createdAt: new Date().toISOString(),
    };

    try {
      await saveFile(id, file);
      persist([record, ...documents]);
      closeModal();
    } catch {
      try {
        await deleteFile(id);
      } catch {
        // The file may not have been written.
      }
      setError("Could not save this document. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function downloadDocument(doc: DocumentRecord) {
    try {
      const blob = await getFile(doc.id);

      if (!blob) {
        setError("The stored file could not be found.");
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.fileName;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Could not open this file.");
    }
  }

  async function removeDocument(doc: DocumentRecord) {
    if (!window.confirm(`Delete "${doc.name}" and its stored file?`)) return;

    try {
      await deleteFile(doc.id);
      persist(documents.filter((item) => item.id !== doc.id));
      setError("");
    } catch {
      setError("Could not delete the document.");
    }
  }

  return (
    <main className="documents-page">
      <header className="documents-header">
        <div>
          <Link href="/dashboard" className="back">
            <ArrowLeft size={16} />
            Dashboard
          </Link>
          <h1>Documents</h1>
          <p>Your important documents, organized in one place.</p>
        </div>

        <button className="add-document" onClick={() => setUploadOpen(true)}>
          <Plus size={18} />
          Add document
        </button>
      </header>

      <section className="document-toolbar">
        <div className="document-search">
          <Search size={17} />
          <input
            placeholder="Search documents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="filters">
          {["All", ...CATEGORIES].map((item) => (
            <button
              key={item}
              className={category === item ? "selected" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
          <Filter size={15} />
        </div>
      </section>

      <section className="document-summary">
        <Summary number={String(documents.length)} label="Total documents" />
        <Summary number={String(expiring)} label="Expiring in 30 days" />
        <Summary number={String(expired)} label="Expired" />
        <Summary
          number={String(documents.length - expiring - expired)}
          label="Not expiring soon"
        />
      </section>

      {error && <p role="alert">{error}</p>}

      {!ready ? (
        <p>Loading documents...</p>
      ) : (
        <section className="document-grid">
          {filtered.map((doc) => {
            const remaining = getDays(doc.expiry);

            return (
              <article className="document-card" key={doc.id}>
                <div className="document-top">
                  <div className="file-icon">
                    <FileText size={22} />
                  </div>
                  <button
                    className="more"
                    aria-label={`Delete ${doc.name}`}
                    onClick={() => void removeDocument(doc)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="document-info">
                  <span className="category">{doc.category}</span>
                  <h2>{doc.name}</h2>
                  <p>{doc.provider}</p>
                </div>

                <div className="document-date">
                  <div>
                    <CalendarDays size={14} />
                    <span>{doc.expiry ? "Expires" : "No expiry date"}</span>
                  </div>
                  <strong>
                    {doc.expiry
                      ? new Date(`${doc.expiry}T00:00:00`).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" }
                        )
                      : "—"}
                  </strong>
                </div>

                {remaining !== null && (
                  <div className={remaining <= 30 ? "expiry urgent" : "expiry"}>
                    <span>
                      {remaining < 0
                        ? `${Math.abs(remaining)} days overdue`
                        : `${remaining} days remaining`}
                    </span>
                  </div>
                )}

                <button
                  className="add-document"
                  onClick={() => void downloadDocument(doc)}
                >
                  <Upload size={15} />
                  Download file
                </button>
              </article>
            );
          })}

          <button
            className="empty-upload"
            onClick={() => setUploadOpen(true)}
          >
            <div><Upload size={23} /></div>
            <strong>Upload another document</strong>
            <span>PDF, JPG or PNG · Max 10 MB</span>
          </button>

          {filtered.length === 0 && (
            <p>No documents found. Try another search or add a document.</p>
          )}
        </section>
      )}

      {uploadOpen && (
        <div className="upload-modal" onClick={closeModal}>
          <div
            className="upload-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={closeModal} aria-label="Close">
              <X size={18} />
            </button>

            <div className="modal-icon"><Upload size={25} /></div>
            <small>NEW DOCUMENT</small>
            <h2>Upload a document</h2>
            <p>Add a file and its important details.</p>

            <form onSubmit={handleSave}>
              <label>
                Document name *
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vehicle insurance"
                />
              </label>

              <label>
                Provider
                <input
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="e.g. ICICI Lombard"
                />
              </label>

              <label>
                Category *
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  {CATEGORIES.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label>
                Expiry date
                <input
                  type="date"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                />
              </label>

              <label className="drop-zone">
                <input
                  type="file"
                  required
                  accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                <Upload size={24} />
                <strong>{file ? file.name : "Choose a file"}</strong>
                <span>
                  {file
                    ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                    : "PDF, JPG or PNG · Max 10 MB"}
                </span>
              </label>

              {error && <p role="alert">{error}</p>}

              <div className="security-note">
                <ShieldCheck size={17} />
                <span>Stored in this browser on this device.</span>
              </div>

              <button className="add-document" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save document"}
              </button>
              <button className="cancel" type="button" onClick={closeModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function Summary({ number, label }: { number: string; label: string }) {
  return (
    <div className="summary">
      <strong>{number}</strong>
      <span>{label}</span>
    </div>
  );
}
