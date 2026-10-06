"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
const CATS = ["রক্তদান ক্যাম্প", "ব্লাড গ্রুপিং", "বৃক্ষরোপণ", "বর্জ্য ব্যবস্থাপনা", "খেলাধুলা", "অন্যান্য"];
export default function NewEvent() {
  const r = useRouter();
  const [f, setF] = useState({ title: "", category: CATS[0], description: "", location: "", starts_at: "", volunteers_needed: 0, fund_goal: 0 });
  const [msg, setMsg] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("events").insert({ ...f, starts_at: f.starts_at || null });
    if (error) return setMsg("ইভেন্ট তৈরি করতে আগে লগইন করুন।");
    r.push("/events");
  };
  return (<>
    <h2>নতুন ইভেন্ট</h2>
    <form className="card" onSubmit={submit}>
      <input required placeholder="ইভেন্টের নাম" value={f.title} onChange={set("title")} />
      <select value={f.category} onChange={set("category")}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
      <textarea rows={3} placeholder="বিবরণ" value={f.description} onChange={set("description")} />
      <input placeholder="স্থান" value={f.location} onChange={set("location")} />
      <input type="datetime-local" value={f.starts_at} onChange={set("starts_at")} />
      <input type="number" min="0" placeholder="কতজন স্বেচ্ছাসেবক লাগবে" value={f.volunteers_needed} onChange={set("volunteers_needed")} />
      <input type="number" min="0" placeholder="তহবিলের লক্ষ্য (টাকা)" value={f.fund_goal} onChange={set("fund_goal")} />
      <button>ইভেন্ট প্রকাশ করুন</button>{msg && <span className="msg">{msg}</span>}
    </form>
  </>);
}
