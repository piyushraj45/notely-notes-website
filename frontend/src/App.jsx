import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/header.jsx";
import NoteCard from "./components/noteCard.jsx";
import NoteModal from "./components/noteModal.jsx";
import DeleteModal from "./components/deleteModal.jsx";
import AuthPage from "./components/AuthPage.jsx";
import API from "./api/api.js";

function App() {
  // Dark mode on/off ke liye
  const [darkMode, setDarkMode] = useState(false);
  // Saare notes ka array
  const [notes, setNotes] = useState([]);
  // Search box ka text
  const [search, setSearch] = useState("");
  // Login user ka data - localStorage se load ho raha hai
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  // JWT token - login ke baad milta hai
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  // New/Edit Note wala modal open hai ya nahi
  const [isModalOpen, setModalOpen] = useState(false);
  // Kaunsa note edit ho raha hai, null hai to New Note
  const [editingNote, setEditingNote] = useState(null);
  // Kaunsa note delete karna hai
  const [deleteNote, setDeleteNote] = useState(null);
  // Toast message - Saved, Deleted etc
  const [toast, setToast] = useState("");

  // 2 sec ke liye toast dikhana
  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""), 2000); };

  // Backend se saare notes laana - GET /api/notes
  const fetchNotes = async () => {
    try{
      const {data}=await API.get("/notes");
      setNotes(data);
    }catch(e){
      // Agar token expire ho gaya ho to logout kar do
      if(e.response?.status === 401){
        handleLogout();
      }
    }
  };

  // Token milte hi notes fetch karo - login ke baad
  useEffect(()=>{ if(token) fetchNotes(); }, [token]);

  // Login / Register ka function - AuthPage se call hota hai
  const handleAuth = async (form, isLogin) => {
    try{
      const url = isLogin? "/auth/login" : "/auth/register";
      const {data} = await API.post(url, form);
      // Token aur user ko localStorage me save karo
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      showToast("Welcome!");
    }catch(err){
      const msg = err.response?.data?.msg || err.response?.data?.message || "Error";
      showToast(msg);
      throw err; // AuthPage me error dikhane ke liye throw karna zaroori hai
    }
  };

  // Logout - sab clear
  const handleLogout = () => { localStorage.clear(); setToken(null); setUser(null); setNotes([]); };

  // Note Save karna - New aur Edit dono yahi hota hai
  const handleSave = async ({title, content, tag}) => {
    if(!title ||!content) return showToast("Fill all fields");
    try{
      if(editingNote){
        // Edit mode - PUT /api/notes/:id
        const {data}=await API.put(`/notes/${editingNote._id}`, {title, content, tag});
        setNotes(notes.map(n=>n._id===data._id? data : n)); // purane array me update
      }
      else{
        // New mode - POST /api/notes
        const {data}=await API.post("/notes", {title, content, tag});
        setNotes([data,...notes]); // sabse upar naya note add
      }
      showToast("Saved!"); setEditingNote(null);
    }catch{ showToast("Save failed"); }
  };

  // Note Delete karna - DELETE /api/notes/:id
  const handleDelete = async () => {
    try{
      await API.delete(`/notes/${deleteNote._id}`);
      setNotes(notes.filter(n=>n._id!==deleteNote._id)); // array se hata do
      setDeleteNote(null);
      showToast("Deleted");
    }catch{}
  };

  // Pin / Unpin karna - PATCH /api/notes/pin/:id
  const togglePin = async (note) => {
    try{
      const {data}=await API.patch(`/notes/pin/${note._id}`);
      setNotes(prev => {
        const updated = prev.map(n=>n._id===data._id? data : n);
        // Pinned wale notes ko upar sort karo
        return [...updated].sort((a,b) => (b.pinned?1:0) - (a.pinned?1:0));
      });
      showToast(data.pinned? "Pinned 📌" : "Unpinned");
    }catch(e){
      showToast("Pin failed");
      console.log(e);
    }
  };

  // Search filter - title, content, aur TAG se bhi search
  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase()) ||
    n.tag?.toLowerCase().includes(search.toLowerCase())
  );

  // Agar token nahi hai to Login page dikhao - yehi Private Route hai
  if(!token) return <AuthPage onLogin={handleAuth} darkMode={darkMode} />;

  // Agar token hai to Home page dikhao
  return (
    <div className={darkMode? "dark-mode" : ""}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} search={search} setSearch={setSearch} user={user} onLogout={handleLogout} />
      <main style={{maxWidth:'1100px', margin:'24px auto', padding:'0 24px'}}>
        <div className="grid">
          {/* filtered notes ko map karke NoteCard dikhao */}
          {filtered.map(note => <NoteCard key={note._id} note={note} onEdit={(n)=>{setEditingNote(n); setModalOpen(true);}} onDelete={setDeleteNote} onTogglePin={togglePin} />)}
        </div>
        {filtered.length===0 && <p style={{textAlign:'center', opacity:.5, marginTop:'60px'}}>No notes found</p>}
      </main>
      {/* + wala FAB button - New Note ke liye */}
      <button className="fab" onClick={()=>{setEditingNote(null); setModalOpen(true);}}>+</button>
      <NoteModal open={isModalOpen} onClose={()=>setModalOpen(false)} onSave={handleSave} note={editingNote} />
      <DeleteModal open={!!deleteNote} onClose={()=>setDeleteNote(null)} onConfirm={handleDelete} />
      {toast && <div className="toast-right">{toast}</div>}
    </div>
  );
}
export default App;