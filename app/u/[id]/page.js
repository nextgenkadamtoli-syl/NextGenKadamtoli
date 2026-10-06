"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function PublicProfile() {
  const { id } = useParams();
  const [p, setP] = useState(undefined);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      const [a, b, c] = await Promise.all([
        supabase.from("profiles").select("full_name, area, bio, created_at").eq("id", id).maybeSingle(),
        supabase.from("events").select("id, title, category, starts_at").eq("organizer_id", id).order("starts_at", { ascending: false }).limit(10),
        supabase.from("posts").select("id, body, created_at").eq("author_id", id).order("created_at", { ascending: false }).limit(10),
      ]);
      setP(a.data || null); setEvents(b.data || []); setPosts(c.data || []);
    })();
  }, [id]);

  if (p === undefined) return <p style={{ padding: "32px 0" }}>লোড হচ্ছে…</p>;
  if (p === null) return <p style={{ padding: "32px 0" }}>এই সদস্যকে পাওয়া যায়নি।</p>;
  return (<>
    <section className="hero" style={{ paddingBottom: 8 }}>
      <div className="avatar">{(p.full_name || "স")[0]}</div>
      <h1 style={{ fontSize: "clamp(1.6rem,5vw,2.4rem)" }}>{p.full_name || "সদস্য"}</h1>
      <p>{p.area && <>📍 {p.area} · </>}সদস্য হয়েছেন {new Date(p.created_at).toLocaleDateString("bn-BD")}</p>
      {p.bio && <p>{p.bio}</p>}
    </section>
    <h2>আয়োজিত ইভেন্ট</h2>
    <div className="grid">
      {events.map((e) => (<div className="card" key={e.id}><span className="tag">{e.category}</span><h3>{e.title}</h3>
        <small>{e.starts_at && new Date(e.starts_at).toLocaleDateString("bn-BD")}</small></div>))}
      {!events.length && <p>কোনো ইভেন্ট নেই।</p>}
    </div>
    <h2>পোস্ট</h2>
    <div className="grid">
      {posts.map((x) => (<div className="card" key={x.id}><p>{x.body}</p>
        <small>{new Date(x.created_at).toLocaleDateString("bn-BD")}</small></div>))}
      {!posts.length && <p>কোনো পোস্ট নেই।</p>}
    </div>
  </>);
}
