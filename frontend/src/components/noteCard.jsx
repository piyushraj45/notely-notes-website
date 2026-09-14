import "./noteCard.css";
export default function NoteCard({ note, onEdit, onDelete, onTogglePin }) {
  return (
    <div className={`card ${note.pinned ? 'pinned' : ''}`}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        {/* TAG FIX - jo likhega wo CAPITAL me dikhega */}
        <span className="tag">{note.tag ? note.tag.toUpperCase() : 'GENERAL'}</span>
        <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
          {note.pinned && <span style={{fontSize:'10px', fontWeight:'bold', color:'#f59e0b'}}>📌 PINNED</span>}
          <span className="date">{new Date(note.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <h3 className="card-title">{note.title}</h3>
      <p className="card-content">{note.content}</p>
      <div style={{display:'flex', gap:'8px', marginTop:'16px'}}>
        <button className="icon-btn" onClick={()=>onTogglePin(note)} title={note.pinned ? "Unpin" : "Pin"} style={{opacity: note.pinned ? 1 : 0.5}}>
          📌
        </button>
        <button className="icon-btn" onClick={()=>onEdit(note)}>✎</button>
        <button className="icon-btn" onClick={()=>onDelete(note)}>🗑️</button>
      </div>
    </div>
  )
}