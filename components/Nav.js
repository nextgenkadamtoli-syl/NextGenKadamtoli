"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
export default function Nav() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);
  const close = () => setOpen(false);
  return (
    <header className="site"><div className="wrap">
      <Link className="brand" href="/" onClick={close}><img src="/icons/icon-192.png" alt="" />NextGen Kadamtoli</Link>
      <button className="burger" aria-label="মেনু" onClick={() => setOpen(!open)}>{open ? "✕" : "☰"}</button>
      <nav className={"links" + (open ? " open" : "")} onClick={close}>
        <Link href="/events">ইভেন্ট</Link>
        <Link href="/blood">রক্তদান</Link>
        {user ? <>
          <Link href="/dashboard">ড্যাশবোর্ড</Link>
          <Link href="/profile">প্রোফাইল</Link>
          <a href="#" onClick={(e) => { e.preventDefault(); supabase.auth.signOut().then(() => { window.location.href = "/"; }); }}>লগআউট</a>
        </> : <Link className="cta" href="/login">লগইন / যোগ দিন</Link>}
      </nav>
    </div></header>
  );
}
