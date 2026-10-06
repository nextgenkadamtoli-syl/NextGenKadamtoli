"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase";

// লগইন ছাড়া ঢুকলে /login-এ পাঠিয়ে দেয়
export function useRequireUser() {
  const r = useRouter();
  const [user, setUser] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) r.replace("/login");
      else setUser(data.session.user);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) r.replace("/login");
    });
    return () => sub.subscription.unsubscribe();
  }, [r]);
  return user;
}
