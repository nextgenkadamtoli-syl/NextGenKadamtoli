"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
export default function Nav() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);
  return (
    <nav><div className="wrap">
      <b><Link href="/">NextGen Kadamtoli</Link></b>
      <Link href="/events">ইভেন্ট</Link>
      <Link href="/blood">রক্তদান</Link>
      {user ? <>
        <Link href="/dashboard">ড্যাশবোর্ড</Link>
        <Link href="/profile">প্রোফাইল</Link>
        <a href="#" onClick={(e) => { e.preventDefault(); supabase.auth.signOut().then(() => { window.location.href = "/"; }); }}>লগআউট</a>
      </> : <Link href="/login">লগইন</Link>}
    </div></nav>
  );
}
