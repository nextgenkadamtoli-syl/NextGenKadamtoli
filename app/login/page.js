"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
export default function Login() {
  const r = useRouter();
  const [mode, setMode] = useState("in");
  const [f, setF] = useState({ email: "", password: "", name: "" });
  const [msg, setMsg] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    const { error } = mode === "in"
      ? await supabase.auth.signInWithPassword({ email: f.email, password: f.password })
      : await supabase.auth.signUp({ email: f.email, password: f.password, options: { data: { full_name: f.name } } });
    if (error) return setMsg(error.message);
    if (mode === "up") return setMsg("ইমেইলে পাঠানো লিংকে ক্লিক করে অ্যাকাউন্ট নিশ্চিত করুন।");
    r.push("/");
  };
  return (<>
    <h2>{mode === "in" ? "লগইন" : "নতুন অ্যাকাউন্ট"}</h2>
    <form className="card" onSubmit={submit}>
      {mode === "up" && <input required placeholder="পুরো নাম" value={f.name} onChange={set("name")} />}
      <input required type="email" placeholder="ইমেইল" value={f.email} onChange={set("email")} />
      <input required type="password" minLength={6} placeholder="পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)" value={f.password} onChange={set("password")} />
      <button>{mode === "in" ? "লগইন করুন" : "অ্যাকাউন্ট খুলুন"}</button>
      {msg && <span className="msg">{msg}</span>}
      <a href="#" onClick={(e) => { e.preventDefault(); setMode(mode === "in" ? "up" : "in"); }}>
        {mode === "in" ? "অ্যাকাউন্ট নেই? নতুন খুলুন" : "অ্যাকাউন্ট আছে? লগইন করুন"}</a>
    </form>
  </>);
}
