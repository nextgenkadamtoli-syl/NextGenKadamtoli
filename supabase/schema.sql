-- Supabase > SQL Editor-এ পুরোটা পেস্ট করে Run করুন
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text, phone text, area text,
  created_at timestamptz default now()
);
create table events (
  id bigserial primary key,
  organizer_id uuid references profiles(id) default auth.uid(),
  title text not null, category text not null,
  description text, location text, starts_at timestamptz,
  volunteers_needed int default 0, fund_goal int default 0,
  created_at timestamptz default now()
);
create table rsvps (
  event_id bigint references events(id) on delete cascade,
  user_id uuid references profiles(id) default auth.uid(),
  status text default 'going',
  primary key (event_id, user_id)
);
create table blood_donors (
  user_id uuid primary key references profiles(id) default auth.uid(),
  blood_group text not null, last_donated date,
  area text, phone text, available boolean default true
);
create table blood_requests (
  id bigserial primary key,
  requester_id uuid references profiles(id) default auth.uid(),
  blood_group text not null, bags int default 1,
  hospital text, contact text, needed_by date,
  created_at timestamptz default now()
);
create table posts (
  id bigserial primary key,
  author_id uuid references profiles(id) default auth.uid(),
  body text not null, created_at timestamptz default now()
);

-- নতুন ইউজার সাইনআপ করলে অটো প্রোফাইল তৈরি
create function handle_new_user() returns trigger as $$
begin
  insert into profiles(id, full_name) values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end; $$ language plpgsql security definer;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- Row Level Security (নিরাপত্তা)
alter table profiles enable row level security;
alter table events enable row level security;
alter table rsvps enable row level security;
alter table blood_donors enable row level security;
alter table blood_requests enable row level security;
alter table posts enable row level security;

create policy "read all" on events for select using (true);
create policy "read all" on posts for select using (true);
create policy "read all" on blood_requests for select using (true);
create policy "read all" on rsvps for select using (true);
create policy "login to read donors" on blood_donors for select using (auth.role()='authenticated');
create policy "own profile read" on profiles for select using (true);
create policy "own profile edit" on profiles for update using (auth.uid()=id);
create policy "create event" on events for insert with check (auth.uid()=organizer_id);
create policy "edit own event" on events for update using (auth.uid()=organizer_id);
create policy "rsvp" on rsvps for insert with check (auth.uid()=user_id);
create policy "cancel rsvp" on rsvps for delete using (auth.uid()=user_id);
create policy "donor insert" on blood_donors for insert with check (auth.uid()=user_id);
create policy "donor update" on blood_donors for update using (auth.uid()=user_id);
create policy "request insert" on blood_requests for insert with check (auth.uid()=requester_id);
create policy "post insert" on posts for insert with check (auth.uid()=author_id);
