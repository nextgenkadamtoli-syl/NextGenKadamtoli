"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRequireUser } from "../../lib/useUser";

export default function Profile() {
  const user = useRequireUser();
  const [f, setF] = useState({ full_name: "", area: "", bio: "" });
  const [loaded, setLoaded] = useState(false);
  const [msg, setMsg] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, area, bio").eq("id", user.id).maybeSingle()
      .then(({ data }) => { if (data) setF({ full_name: data.full_name || "", area: data.area || "", bio: data.bio || "" }); setLoaded(true); });
  }, [user]);

  const save = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("profiles").upsert({ id: user.id, ...f });
    setMsg(error ? "সেভ হয়নি: " + error.message : "প্রোফাইল সেভ হয়েছে।");
  };

  if (!user || !loaded) return <p style={{ padding: "32px 0" }}>লোড হচ্ছে…</p>;
  return (<>
    <h2>আমার প্রোফাইল</h2>
    <form className="card" onSubmit={save}>
      <label><small>ইমেইল (পরিবর্তনযোগ্য নয়)</small>
        <input disabled value={user.email} style={{ width: "100%" }} /></label>
      <label><small>পুরো নাম</small>
        <input required value={f.full_name} onChange={set("full_name")} style={{ width: "100%" }} /></label>
      <label><small>এলাকা / ওয়ার্ড</small>
        <input value={f.area} onChange={set("area")} placeholder="যেমন: কদমতলী, ওয়ার্ড ৫" style={{ width: "100%" }} /></label>
      <label><small>আমার সম্পর্কে</small>
        <textarea rows={4} maxLength={300} value={f.bio} onChange={set("bio")} placeholder="কোন কাজে আগ্রহী, কী দক্ষতা আছে…" style={{ width: "100%" }} /></label>
      <button>সেভ করুন</button>
      {msg && <span className="msg">{msg}</span>}
      <small>নাম, এলাকা ও পরিচিতি পাবলিক প্রোফাইলে সবাই দেখতে পাবে। ফোন নম্বর ও রক্তের গ্রুপ এখানে দেখানো হয় না।</small>
    </form>
    <p style={{ marginTop: 12 }}>
      <Link className="btn" href="/dashboard">← ড্যাশবোর্ড</Link>{" "}
      <Link className="btn ghost" href={"/u/" + user.id}>পাবলিক প্রোফাইল দেখুন</Link></p>
  </>);
}
