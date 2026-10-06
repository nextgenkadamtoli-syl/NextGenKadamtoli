import Link from "next/link";
export default function Footer() {
  return (
    <footer className="foot"><div className="wrap">
      <div><b>NextGen Kadamtoli</b>একসাথে করি, একসাথে গড়ি। কদমতলীর রক্তদান, বৃক্ষরোপণ, পরিচ্ছন্নতা ও খেলাধুলার উদ্যোগ এক জায়গায়।</div>
      <div><b>পেজ</b><Link href="/events">ইভেন্ট</Link><Link href="/blood">রক্তদান</Link><Link href="/dashboard">ড্যাশবোর্ড</Link></div>
      <div><b>অ্যাকাউন্ট</b><Link href="/login">লগইন</Link><Link href="/profile">প্রোফাইল</Link><Link href="/events/new">ইভেন্ট তৈরি</Link></div>
      <div className="copy">© {new Date().getFullYear()} NextGen Kadamtoli</div>
    </div></footer>
  );
}
