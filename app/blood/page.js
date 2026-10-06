"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
const G = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
export default function Blood() {
  const [group, setGroup] = useState("");
  const [donors, setDonors] = useState([]);
  const [reqs, setReqs] = useState([]);
  const [msg, setMsg] = useState("");
  const [d, setD] = useState({ blood_group: "O+", area: "", phone: "" });
  const [q, setQ] = useState({ blood_group: "O+", bags: 1, hospital: "", contact: "" });
  const loadReqs = async () => {
    const { data } = await supabase.from("blood_requests").select("*").order("created_at", { ascending: false }).limit(10);
    setReqs(data || []);
  };
  useEffect(() => { loadReqs(); }, []);
  const search = async () => {
    let qy = supabase.from("blood_donors").select("*, profiles(full_name)").eq("available", true);
    if (group) qy = qy.eq("blood_group", group);
    const { data, error } = await qy;
    if (error) return setMsg("ডোনার তালিকা দেখতে লগইন করুন।");
    setMsg(""); setDonors(data || []);
  };
  const regDonor = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("blood_donors").upsert(d);
    setMsg(error ? "ডোনার হতে লগইন করুন।" : "ধন্যবাদ! আপনি ডোনার তালিকায় যুক্ত হয়েছেন।");
  };
  const reqBlood = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("blood_requests").insert(q);
    if (error) return setMsg("অনুরোধ পাঠাতে লগইন করুন।");
    setMsg(""); loadReqs();
  };
  return (<>
    <h2>জরুরি রক্তের অনুরোধ</h2>
    <div className="grid">
      {reqs.map((r) => (<div className="card" key={r.id}>
        <span className="tag red">{r.blood_group}</span> {r.bags} ব্যাগ<br />
        {r.hospital}<br /><small>যোগাযোগ: {r.contact}</small></div>))}
      {!reqs.length && <p>এই মুহূর্তে কোনো অনুরোধ নেই।</p>}
    </div>
    {msg && <p className="msg">{msg}</p>}
    <h2>ডোনার খুঁজুন</h2>
    <select value={group} onChange={(e) => setGroup(e.target.value)}>
      <option value="">সব গ্রুপ</option>{G.map((g) => <option key={g}>{g}</option>)}</select>{" "}
    <button onClick={search}>খুঁজুন</button>
    <div className="grid" style={{marginTop:12}}>
      {donors.map((x) => (<div className="card" key={x.user_id}>
        <span className="tag red">{x.blood_group}</span> <b>{x.profiles?.full_name}</b><br />
        <small>{x.area} · {x.phone}</small></div>))}
    </div>
    <div className="grid">
      <div><h2>রক্তদাতা হিসেবে নিবন্ধন</h2>
        <form className="card" onSubmit={regDonor}>
          <select value={d.blood_group} onChange={(e) => setD({ ...d, blood_group: e.target.value })}>{G.map((g) => <option key={g}>{g}</option>)}</select>
          <input required placeholder="এলাকা" value={d.area} onChange={(e) => setD({ ...d, area: e.target.value })} />
          <input required placeholder="ফোন নম্বর" value={d.phone} onChange={(e) => setD({ ...d, phone: e.target.value })} />
          <button>ডোনার হই</button></form></div>
      <div><h2>রক্ত দরকার</h2>
        <form className="card" onSubmit={reqBlood}>
          <select value={q.blood_group} onChange={(e) => setQ({ ...q, blood_group: e.target.value })}>{G.map((g) => <option key={g}>{g}</option>)}</select>
          <input type="number" min="1" value={q.bags} onChange={(e) => setQ({ ...q, bags: e.target.value })} />
          <input required placeholder="হাসপাতাল" value={q.hospital} onChange={(e) => setQ({ ...q, hospital: e.target.value })} />
          <input required placeholder="যোগাযোগের নম্বর" value={q.contact} onChange={(e) => setQ({ ...q, contact: e.target.value })} />
          <button className="red">অনুরোধ পাঠান</button></form></div>
    </div>
  </>);
}
