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
    <section className="landing">
      <div>
        <h1>একসাথে করি, একসাথে গড়ি।</h1>
        <p>কদমতলীর রক্তদান, বৃক্ষরোপণ, পরিচ্ছন্নতা ও খেলাধুলার উদ্যোগ এক জায়গায়। ইভেন্ট খুঁজুন, স্বেচ্ছাসেবক হন, পাশে দাঁড়ান।</p>
        <div className="actions">
          <Link className="btn" href="/events/new">ইভেন্ট তৈরি করুন</Link>
          <Link className="btn red" href="/blood">রক্ত খুঁজুন</Link>
        </div>
      </div>
      <div className="tiles">
        <Link className="tile" href="/blood"><span>🩸</span>রক্তদান</Link>
        <Link className="tile" href="/events"><span>🌳</span>বৃক্ষরোপণ</Link>
        <Link className="tile" href="/events"><span>♻️</span>পরিচ্ছন্নতা</Link>
        <Link className="tile" href="/events"><span>⚽</span>খেলাধুলা</Link>
      </div>
    </section>

    <h2>কীভাবে যোগ দেবেন</h2>
    <div className="steps">
      <div className="step"><i>১</i><h3>অ্যাকাউন্ট খুলুন</h3><p>ইমেইল দিয়ে বিনামূল্যে নিবন্ধন করে নিজের ড্যাশবোর্ড পান।</p></div>
      <div className="step"><i>২</i><h3>ইভেন্ট বা রক্তদানে যুক্ত হন</h3><p>এলাকার ইভেন্টে "আমি যাব" দিন বা রক্তদাতা হিসেবে নিবন্ধন করুন।</p></div>
      <div className="step"><i>৩</i><h3>নিজের উদ্যোগ শুরু করুন</h3><p>স্বেচ্ছাসেবক ও তহবিলের লক্ষ্যসহ নতুন ইভেন্ট তৈরি করুন।</p></div>
    </div>

    <h2>এলাকার আপডেট</h2>
    <div className="split">
      <form className="card" onSubmit={submit}>
        <textarea required rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="আজ কী সামাজিক কাজ হলো?" />
        <button>পোস্ট করুন</button>{msg && <span className="msg">{msg}</span>}
      </form>
      <div className="grid">
        {posts.map((p) => (<div className="card" key={p.id}>
          <b>{p.profiles?.full_name || "সদস্য"}</b><p>{p.body}</p>
          <small>{new Date(p.created_at).toLocaleDateString("bn-BD")}</small></div>))}
        {!posts.length && <p>এখনো কোনো পোস্ট নেই। প্রথম পোস্টটি আপনিই করুন।</p>}
      </div>
    </div>
  </>);
}
