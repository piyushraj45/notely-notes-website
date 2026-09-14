import "./header.css";
export default function Header({ darkMode, setDarkMode, search, setSearch, user, onLogout }) {
  const letter = (user?.name?.[0] || user?.username?.[0] || user?.email?.[0] || "U").toUpperCase();
  const displayName = user?.name || user?.username || user?.email?.split('@')[0] || "User";
  return (
    <header className="header">
      <div className="header-inner">
        <h2 style={{fontWeight:800}}>Notely</h2>
        <div className="search-center">
          <span className="search-icon">⌕</span>
          <input className="inp search-inp" placeholder="Search notes..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
          <button className="btn-circle" onClick={()=>setDarkMode(!darkMode)}>{darkMode? '☀️' : '🌙'}</button>
          <div className="avatar-pill">
            <div className="avatar-circle">{letter}</div>
            <span style={{fontSize:'13px', fontWeight:600}}>{displayName}</span>
            <button onClick={onLogout} style={{background:'none', border:'none', cursor:'pointer', opacity:.5, marginLeft:'4px'}}>✕</button>
          </div>
        </div>
      </div>
    </header>
  )
}