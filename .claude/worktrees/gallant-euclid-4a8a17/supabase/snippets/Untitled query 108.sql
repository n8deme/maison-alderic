-- Mise a jour emails realistes (auth.users + profiles)
UPDATE auth.users SET email = 'elise.vandenbroucke@techscale.be', encrypted_password = crypt('Demo2026!', gen_salt('bf')), email_confirmed_at = COALESCE(email_confirmed_at, now()) WHERE email = 'kev+client-techscale@n8de.me';
UPDATE auth.users SET email = 'pierre.vandenberghe@bih.be', encrypted_password = crypt('Demo2026!', gen_salt('bf')), email_confirmed_at = COALESCE(email_confirmed_at, now()) WHERE email = 'kev+client-industrial@n8de.me';
UPDATE auth.users SET email = 'c.dehennin@familyoffice-hennin.be', encrypted_password = crypt('Demo2026!', gen_salt('bf')), email_confirmed_at = COALESCE(email_confirmed_at, now()) WHERE email = 'kev+client-family@n8de.me';
UPDATE auth.users SET email = 't.mertens@mertenscapital.be', encrypted_password = crypt('Demo2026!', gen_salt('bf')), email_confirmed_at = COALESCE(email_confirmed_at, now()) WHERE email = 'kev+client-entrepreneur@n8de.me';
UPDATE auth.users SET email = 'c.dubois@distribution-group.be', encrypted_password = crypt('Demo2026!', gen_salt('bf')), email_confirmed_at = COALESCE(email_confirmed_at, now()) WHERE email = 'kev+client-juridique@n8de.me';

UPDATE profiles SET email = 'elise.vandenbroucke@techscale.be' WHERE id = 'c0000001-2222-4222-8222-000000000001';
UPDATE profiles SET email = 'pierre.vandenberghe@bih.be' WHERE id = 'c0000002-2222-4222-8222-000000000002';
UPDATE profiles SET email = 'c.dehennin@familyoffice-hennin.be' WHERE id = 'c0000003-2222-4222-8222-000000000003';
UPDATE profiles SET email = 't.mertens@mertenscapital.be' WHERE id = 'c0000004-2222-4222-8222-000000000004';
UPDATE profiles SET email = 'c.dubois@distribution-group.be' WHERE id = 'c0000005-2222-4222-8222-000000000005';

SELECT email FROM auth.users WHERE email NOT LIKE 'kev+%' AND email NOT LIKE '%maison-alderic%' ORDER BY email;