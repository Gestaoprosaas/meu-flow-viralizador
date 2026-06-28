-- CREATE FUNCTION TO RESET LIMITS MONTHLY
-- This function resets text, image, and video credits based on the active plan.
create or replace function public.reset_monthly_credits()
returns void as $$
begin
  update public.profiles
  set
    credits_text = case
      when plan = 'starter' then 50
      when plan = 'pro' then 200
      when plan = 'agency' then 999
      else 10 -- free
    end,
    credits_image = case
      when plan = 'starter' then 30
      when plan = 'pro' then 100
      when plan = 'agency' then 500
      else 5 -- free
    end,
    credits_video = case
      when plan = 'starter' then 3
      when plan = 'pro' then 15
      when plan = 'agency' then 60
      else 0 -- free
    end;
end;
$$ language plpgsql security definer;
