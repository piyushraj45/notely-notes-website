import "./modal.css";
export default function DeleteModal({ open, onClose, onConfirm }) {
  if(!open) return null;
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal delete-modal" onClick={e=>e.stopPropagation()}>
        <h3>Delete note?</h3><p style={{opacity:.6, fontSize:'14px', marginTop:'8px'}}>This action cannot be undone.</p>
        <div style={{display:'flex', gap:'10px', marginTop:'18px'}}>
          <button className="inp" style={{margin:0, cursor:'pointer'}} onClick={onClose}>Cancel</button>
          <button className="btn-black" style={{margin:0}} onClick={()=>{onConfirm(); onClose();}}>Delete</button>
        </div>
      </div>
    </div>
  )
}