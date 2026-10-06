"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRequireUser } from "../../lib/useUser";

const bn = (n) => Number(n).toLocaleString("bn-BD");
const day = (d) => new Date(d).toLocaleDateString("bn-BD");

export default function Dashboard() {
  const user = useRequireUser();
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    if (!user) return;
    const uid = user.id;
    const [p, ev, rs, ps, br, dn] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
      supabase.from("events").select("*, rsvps(user_id)").eq("organizer_id", uid).order("starts_at"),
      supabase.from("rsvps").select("event_id, events(id, title, category, location, starts_at)").eq("user_id", uid),
      supabase.from("posts").select("*").eq("author_id", uid).order("created_at", { ascending: false }),
      supabase.from("blood_requests").select("*").eq("requester_id", uid).order("created_at", { ascending: false }),
      supabase.from("blood_donors").select("*").eq("user_id", uid).maybeSingle(),
    ]);
    setData({
      profile: p.data, events: ev.data || [], rsvps: rs.data || [],
      posts: ps.data || [], requests: br.data || [], donor: dn.data,
    });
  }, [user]);
  useEffect(() => { load(); }, [load]);

  const act = async (q, ok) => {
    const { error } = await q;
    setMsg(error ? "কাজটি সম্পন্ন হয়নি: " + error.message : ok || "");
    load();
  };
  const del = (table, col, id, label) => {
    if (!confirm(label + " মুছে ফেলবেন?")) return;
    act(supabase.from(table).delete().eq(col, id), "মুছে ফেলা হয়েছে।");
  };

  if (!data) return <p style={{ padding: "32px 0" }}>লোড হচ্ছে…</p>;
  const { profile, events, rsvps, posts, requests, donor } = data;
  const name = profile?.full_name || user.email;
  const nextDonate = donor?.last_donated
    ? new Date(new Date(donor.last_donated).getTime() + 90 * 864e5) : null;

  return (<>
    <section className="hero" style={{ paddingBottom: 8 }}>
      <h1 style={{ fontSize: "clamp(1.6rem,5vw,2.4rem)" }}>স্বাগতম, {name}</h1>
      <p><Link className="btn" href="/profile">প্রোফাইল এডিট</Link>{" "}
        <Link className="btn ghost" href={"/u/" + user.id}>আমার পাবলিক প্রোফাইল</Link></p>
    </section>
    {msg && <p className="msg">{msg}</p>}

    <div className="stats">
      <div className="stat"><b>{bn(events.length)}</b><span>আমার ইভেন্ট</span></div>
      <div className="stat"><b>{bn(rsvps.length)}</b><span>যোগ দিচ্ছি</span></div>
      <div className="stat"><b>{bn(posts.length)}</b><span>পোস্ট</span></div>
      <div className="stat"><b>{bn(requests.length)}</b><span>রক্তের অনুরোধ</span></div>
    </div>

    <h2>রক্তদাতা স্ট্যাটাস</h2>
    <div className="card">
      {donor ? (<>
        <span className="tag red">{donor.blood_group}</span> <b>{donor.area}</b> · <small>{donor.phone}</small>
        <p>বর্তমান অবস্থা: <b>{donor.available ? "রক্ত দিতে প্রস্তুত" : "এখন প্রস্তুত নয়"}</b></p>
        <p style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={() => act(supabase.from("blood_donors").update({ available: !donor.available }).eq("user_id", user.id))}>
            {donor.available ? "প্রস্তুত নই হিসেবে চিহ্নিত করুন" : "আবার প্রস্তুত হিসেবে চিহ্নিত করুন"}</button>
          <label><small>সর্বশেষ রক্তদান: </small>
            <input type="date" value={donor.last_donated || ""} max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => act(supabase.from("blood_donors").update({ last_donated: e.target.value || null }).eq("user_id", user.id))} /></label>
        </p>
        {nextDonate && <small>সাধারণ নিয়মে আবার রক্ত দিতে পারবেন: {day(nextDonate)} এর পর (আনুমানিক ৩ মাস)। নিশ্চিত হতে চিকিৎসকের পরামর্শ নিন।</small>}
      </>) : (
        <p>আপনি এখনো ডোনার তালিকায় নেই। <Link href="/blood"><u>ডোনার হিসেবে নিবন্ধন করুন</u></Link></p>
      )}
    </div>

    <h2>আমি যে ইভেন্টে যাচ্ছি</h2>
    <div className="grid">
      {rsvps.map((r) => r.events && (<div className="card" key={r.event_id}>
        <span className="tag">{r.events.category}</span><h3>{r.events.title}</h3>
        <small>{r.events.location} · {r.events.starts_at && new Date(r.events.starts_at).toLocaleString("bn-BD")}</small><br />
        <button className="ghost" onClick={() => act(supabase.from("rsvps").delete().eq("event_id", r.event_id).eq("user_id", user.id), "অংশগ্রহণ বাতিল হয়েছে।")}>যাব না</button>
      </div>))}
      {!rsvps.length && <p>কোনো ইভেন্টে নিবন্ধন করেননি। <Link href="/events"><u>ইভেন্ট দেখুন</u></Link></p>}
    </div>

    <h2>আমার আয়োজিত ইভেন্ট</h2>
    <div className="grid">
      {events.map((e) => (<div className="card" key={e.id}>
        <span className="tag">{e.category}</span><h3>{e.title}</h3>
        <small>{e.location} · {e.starts_at && new Date(e.starts_at).toLocaleString("bn-BD")}</small><br />
        <small>যোগ দিচ্ছেন: {bn(e.rsvps.length)} / স্বেচ্ছাসেবক লাগবে: {bn(e.volunteers_needed)}</small><br />
        <button className="red" onClick={() => del("events", "id", e.id, "ইভেন্টটি")}>মুছুন</button>
      </div>))}
      {!events.length && <p>এখনো ইভেন্ট করেননি। <Link href="/events/new"><u>নতুন ইভেন্ট তৈরি করুন</u></Link></p>}
    </div>

    <h2>আমার রক্তের অনুরোধ</h2>
    <div className="grid">
      {requests.map((r) => (<div className="card" key={r.id}>
        <span className="tag red">{r.blood_group}</span> {bn(r.bags)} ব্যাগ<br />
        {r.hospital}<br /><small>{day(r.created_at)}</small><br />
        <button className="red" onClick={() => del("blood_requests", "id", r.id, "অনুরোধটি")}>প্রয়োজন মিটেছে / মুছুন</button>
      </div>))}
      {!requests.length && <p>কোনো সক্রিয় অনুরোধ নেই।</p>}
    </div>

    <h2>আমার পোস্ট</h2>
    <div className="grid">
      {posts.map((p) => (<div className="card" key={p.id}>
        <p>{p.body}</p><small>{day(p.created_at)}</small><br />
        <button className="red" onClick={() => del("posts", "id", p.id, "পোস্টটি")}>মুছুন</button>
      </div>))}
      {!posts.length && <p>এখনো কোনো পোস্ট নেই।</p>}
    </div>
  </>);
}
