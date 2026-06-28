-- Supabase RPC SQL migrations for Credit check and consumption
-- You can run these definitions directly inside your Supabase SQL Editor on https://supabase.com

-- 1. check_credits: Verifies if a user has at least 1 credit of a specified type ('text', 'image', or 'video')
CREATE OR REPLACE FUNCTION check_credits(user_id UUID, credit_type VARCHAR)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_credits INT;
BEGIN
    IF credit_type = 'text' THEN
        SELECT credits_text INTO v_credits FROM profiles WHERE id = user_id;
    ELSIF credit_type = 'image' THEN
        SELECT credits_image INTO v_credits FROM profiles WHERE id = user_id;
    ELSIF credit_type = 'video' THEN
        SELECT credits_video INTO v_credits FROM profiles WHERE id = user_id;
    ELSE
        RETURN FALSE;
    END IF;

    RETURN COALESCE(v_credits, 0) > 0;
END;
$$;

-- 2. decrement_credit: Consumes 1 credit of a specified type from user's profiles balance if remaining count is sufficient
CREATE OR REPLACE FUNCTION decrement_credit(user_id UUID, credit_type VARCHAR)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_credits INT;
BEGIN
    IF credit_type = 'text' THEN
        SELECT credits_text INTO v_credits FROM profiles WHERE id = user_id;
        IF COALESCE(v_credits, 0) > 0 THEN
            UPDATE profiles SET credits_text = credits_text - 1 WHERE id = user_id;
            RETURN TRUE;
        END IF;
    ELSIF credit_type = 'image' THEN
        SELECT credits_image INTO v_credits FROM profiles WHERE id = user_id;
        IF COALESCE(v_credits, 0) > 0 THEN
            UPDATE profiles SET credits_image = credits_image - 1 WHERE id = user_id;
            RETURN TRUE;
        END IF;
    ELSIF credit_type = 'video' THEN
        SELECT credits_video INTO v_credits FROM profiles WHERE id = user_id;
        IF COALESCE(v_credits, 0) > 0 THEN
            UPDATE profiles SET credits_video = credits_video - 1 WHERE id = user_id;
            RETURN TRUE;
        END IF;
    END IF;

    RETURN FALSE;
END;
$$;
