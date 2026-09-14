import "./AuthPage.css";
import { useState } from "react";

// Login / Signup page ka component
export default function AuthPage({ onLogin, darkMode }) {
  // isLogin=true -> Login form, false -> Signup form
  const [isLogin, setIsLogin] = useState(true);
  // Password dikhana / chupana ke liye
  const [showPass, setShowPass] = useState(false);
  // Form ka data - name, email, password
  const [form, setForm] = useState({name:"", email:"", password:""});
  // Error message show karne ke liye
  const [error, setError] = useState("");
  // Loading - button pe "Please wait..." dikhane ke liye
  const [loading, setLoading] = useState(false);

  // Form submit - Enter ya button click se chalega
  const submit = async (e)=>{ 
    e.preventDefault(); // page reload rokna - Enter ka main logic yahi hai
    setError(""); // purana error hatao
    setLoading(true); // loading start
    try {
      // App.jsx ke handleAuth ko call kar rahe hain (login/register API)
      await onLogin(form, isLogin); 
    } catch (err) {
      // agar backend se error aaya to yahan show karo
      const msg = err?.response?.data?.msg || err?.response?.data?.message || "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false); // loading band
    }
  };

  return (
    // Dark mode class add kar rahe hain
    <div className={`login-wrap ${darkMode ? 'dark-mode' : ''}`}>
      <div className="login-card">
        <h1 style={{fontWeight:800, fontSize:'28px'}}>Notely</h1>
        <p style={{opacity:.6, marginTop:'6px', fontSize:'14px'}}>{isLogin ? 'Welcome back' : 'Create account'}</p>
        
        {/* Agar error hai to red box me dikhao */}
        {error && <p style={{background:'#ffeaea', color:'#d00', padding:'8px 10px', borderRadius:'8px', fontSize:'13px', marginTop:'12px'}}>{error}</p>}

        {/* FORM - Enter yahan kaam karta hai */}
        <form onSubmit={submit}>
          {/* Signup me hi Name dikhega, Login me nahi */}
          {!isLogin && <input className="inp" placeholder="Name" required value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />}
          
          {/* Email Input */}
          <input className="inp" placeholder="Email" type="email" required value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          
          {/* Password Input + Eye Icon */}
          <div style={{position:'relative', display:'flex', alignItems:'center'}}>
            <input 
              className="inp" 
              placeholder="Password" 
              type={showPass ? "text" : "password"} // showPass true to text, nahi to password
              required 
              value={form.password} 
              onChange={e=>setForm({...form, password:e.target.value})} 
              style={{paddingRight:'40px', width:'100%'}}
            />
            {/* Eye icon - click pe password show/hide */}
            <span onClick={()=>setShowPass(!showPass)} style={{position:'absolute', right:'12px', cursor:'pointer', fontSize:'18px', userSelect:'none'}}>
              {showPass ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Submit Button - type=submit se Enter bhi kaam karega */}
          <button className="btn-black" type="submit" disabled={loading}>{loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign up')}</button>
        </form>
        
        {/* Login <-> Signup switch karne ka text */}
        <p style={{marginTop:'16px', fontSize:'13px'}}>
          <span style={{opacity:.6}}>{isLogin ? "Don't have account? " : "Already have account? "}</span>
          <span style={{fontWeight:700, cursor:'pointer', textDecoration:'underline'}} onClick={()=>{setIsLogin(!isLogin); setError("");}}>{isLogin ? 'Sign up' : 'Login'}</span>
        </p>
      </div>
    </div>
  )
}