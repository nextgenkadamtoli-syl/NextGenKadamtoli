"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
export default function Home() {
  const [posts, setPosts] = useState([]);
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState("");
  const load = async () => {
    const { data } = await supabase.from("posts").select("*, profiles(full_name)").order("created_at", { ascending: false }).limit(20);
    setPosts(data || []);
  };
  useEffect(() => { load(); }, []);
  const submit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("posts").insert({ body });
    if (error) return setMsg("পোস্ট করতে আগে লগইন করুন।");
    setBody(""); setMsg(""); load();
  };
  return (<>
    <section className="hero">
      <h1>একসাথে করি, একসাথে গড়ি।</h1>
      <p>কদমতলীর রক্তদান, বৃক্ষরোপণ, পরিচ্ছন্নতা ও খেলাধুলার উদ্যোগ এক জায়গায়। ইভেন্ট খুঁজুন, স্বেচ্ছাসেবক হন, পাশে দাঁড়ান।</p>
      <p><Link className="btn" href="/events/new">ইভেন্ট তৈরি করুন</Link> <Link className="btn" style={{background:"var(--red)"}} href="/blood">রক্ত খুঁজুন</Link></p>
    </section>
    <h2>এলাকার আপডেট</h2>
    <form className="card" onSubmit={submit}>
      <textarea required rows={3} value={body} onChange={(e) => setBody(e.target.value)} placeholder="আজ কী সামাজিক কাজ হলো?" />
      <button>পোস্ট করুন</button>{msg && <span className="msg">{msg}</span>}
    </form>
    <div className="grid" style={{marginTop:16}}>
      {posts.map((p) => (<div className="card" key={p.id}>
        <b>{p.profiles?.full_name || "সদস্য"}</b><p>{p.body}</p>
        <small>{new Date(p.created_at).toLocaleDateString("bn-BD")}</small></div>))}
      {!posts.length && <p>এখনো কোনো পোস্ট নেই। প্রথম পোস্টটি আপনিই করুন।</p>}
    </div>
  </>);
}
