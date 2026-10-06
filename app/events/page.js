"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Events() {
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState("");
  const load = async () => {
    const { data } = await supabase.from("events").select("*, rsvps(user_id)").order("starts_at");
    setList(data || []);
  };
  useEffect(() => { load(); }, []);
  const join = async (id) => {
    const { error } = await supabase.from("rsvps").insert({ event_id: id });
    setMsg(error ? "অংশ নিতে লগইন করুন (অথবা আপনি আগেই নিবন্ধিত)।" : "");
    load();
  };
  return (<>
    <h2>সব ইভেন্ট</h2>
    <p><Link className="btn" href="/events/new">+ নতুন ইভেন্ট</Link> {msg && <span className="msg">{msg}</span>}</p>
    <div className="grid" style={{marginTop:12}}>
      {list.map((e) => (<div className="card" key={e.id}>
        <span className="tag">{e.category}</span><h3>{e.title}</h3>
        <p>{e.description}</p>
        <small>{e.location} · {e.starts_at && new Date(e.starts_at).toLocaleString("bn-BD")}</small><br />
        <small>স্বেচ্ছাসেবক লাগবে: {e.volunteers_needed} · যোগ দিচ্ছেন: {e.rsvps.length} · তহবিল লক্ষ্য: ৳{e.fund_goal}</small><br />
        <button onClick={() => join(e.id)}>আমি যাব</button>
      </div>))}
      {!list.length && <p>এখনো কোনো ইভেন্ট নেই।</p>}
    </div>
  </>);
}
