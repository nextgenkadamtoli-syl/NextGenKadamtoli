-- আগে থেকে schema.sql চালানো থাকলে শুধু এই ফাইলটি Supabase > SQL Editor-এ Run করুন
alter table profiles add column if not exists bio text;

create policy "own profile insert" on profiles for insert with check (auth.uid()=id);
create policy "delete own event" on events for delete using (auth.uid()=organizer_id);
create policy "delete own post" on posts for delete using (auth.uid()=author_id);
create policy "edit own post" on posts for update using (auth.uid()=author_id);
create policy "delete own request" on blood_requests for delete using (auth.uid()=requester_id);
create policy "edit own request" on blood_requests for update using (auth.uid()=requester_id);
create policy "donor delete" on blood_donors for delete using (auth.uid()=user_id);
