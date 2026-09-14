import "./modal.css";
import { useState, useEffect } from "react";

// Note banane / edit karne ka Modal component
export default function NoteModal({ open, onClose, onSave, note }) {
  // State - title, content, tag ke liye
  const [title, setTitle] = useState(""); 
  const [content, setContent] = useState("");
  const [tag, setTag] = useState(""); // TAG ka state - e.g. C++, Work

  // Jab modal open ho ya edit ke liye note aaye to purana data load karo
  useEffect(()=>{ 
    if(note){ 
      // Edit mode hai - purane note ka data fill karo
      setTitle(note.title); 
      setContent(note.content);
      setTag(note.tag || ""); // purana tag load hoga, nahi hai to khali
    } else {
      // New Note mode hai - sab khali karo
      setTitle(""); 
      setContent("");
      setTag("");
    }
  }, [note, open]); // note ya open change hote hi chalega

  // Agar open=false hai to modal dikhana hi nahi
  if(!open) return null;

  // Form submit (Enter ya Save button se) handle karega
  const handleSubmit = (e) => {
    e.preventDefault(); // page reload rokna
    // App.jsx ko data bhej rahe hain, agar tag khali hai to "General" save hoga
    onSave({title, content, tag: tag || "General"});
    onClose(); // save ke baad modal band karo
  }

  return (
    // Background - click karne pe modal band hoga
    <div className="modal-bg" onClick={onClose}>
      {/* Modal box - ispe click karne se band nahi hoga (stopPropagation) */}
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <h3>{note ? 'Edit Note' : 'New Note'}</h3>

        {/* Form - Enter dabane se handleSubmit chalega */}
        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <input 
            className="inp" 
            placeholder="Title" 
            value={title} 
            onChange={e=>setTitle(e.target.value)} 
            required // khali nahi chod sakte
          />

          {/* Content Textarea */}
          <textarea 
            className="inp" 
            style={{minHeight:'120px', resize:'none'}} 
            placeholder="Content..." 
            value={content} 
            onChange={e=>setContent(e.target.value)}
            required 
          />

          {/* TAG INPUT - yahan user C++, Work, Personal likhega */}
          <input 
            className="inp" 
            placeholder="#Tag e.g. C++, Work, Personal" 
            value={tag} 
            onChange={e=>setTag(e.target.value)} 
          />
          
          {/* Save Button - type=submit se Enter bhi kaam karega */}
          <button type="submit" className="btn-black">Save</button>
        </form>
      </div>
    </div>
  )
}