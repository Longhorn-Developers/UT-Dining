SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'd9e69bd4-22fa-42ce-ba95-9ee862fb98f1', '{"action":"login","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-18 22:09:02.327981+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd26d7b39-c218-4c82-ac08-e8e9fd0be269', '{"action":"token_refreshed","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-06-18 23:09:49.033024+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e4b4780d-bc73-4b5a-9728-92f8ff209787', '{"action":"token_revoked","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-06-18 23:09:49.034919+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f17e0c45-7077-4ff3-8cef-dd1d0a0bb4a4', '{"action":"login","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-18 23:12:21.855847+00', ''),
	('00000000-0000-0000-0000-000000000000', '8ba2550a-d950-439a-bd72-2551f275f1c5', '{"action":"login","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-18 23:12:41.498376+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e853db5b-ff42-49fc-a0ec-fb26950c7c81', '{"action":"login","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-18 23:12:53.973548+00', ''),
	('00000000-0000-0000-0000-000000000000', '022b7091-f2fb-475a-88ce-eb1a10bff320', '{"action":"login","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-18 23:16:19.981165+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e416e3b3-b227-4170-ab66-92682e6c06a8', '{"action":"login","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-18 23:17:11.240626+00', ''),
	('00000000-0000-0000-0000-000000000000', '263c8634-3159-4081-b7d2-e555dcb3fd26', '{"action":"login","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-18 23:19:52.725829+00', ''),
	('00000000-0000-0000-0000-000000000000', 'afd8d2a2-9eba-4daa-86ec-e6712e6cd6cc', '{"action":"login","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-19 06:19:58.101372+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cd3b850b-be7b-48b4-a060-8c1e715cbf15', '{"action":"logout","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account"}', '2025-06-19 06:20:21.995088+00', ''),
	('00000000-0000-0000-0000-000000000000', '4348d756-4eb1-4c6b-8f2c-f806aef1f6b6', '{"action":"login","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-19 06:20:26.117525+00', ''),
	('00000000-0000-0000-0000-000000000000', '8f2c043d-9f19-473e-8964-43d2186692c4', '{"action":"token_refreshed","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-06-19 14:32:51.94827+00', ''),
	('00000000-0000-0000-0000-000000000000', '7f5b6d1e-595d-438a-a296-1ba4245cc691', '{"action":"token_revoked","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-06-19 14:32:51.949225+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fcda2342-3f64-42a9-9058-2b598747b454', '{"action":"token_refreshed","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-06-19 14:32:51.990464+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b795e491-52fa-4514-83a7-30bbcc0011cb', '{"action":"token_refreshed","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-06-19 17:41:04.672158+00', ''),
	('00000000-0000-0000-0000-000000000000', '5b4b1e8e-ad53-4797-8060-e6879a9b470a', '{"action":"token_revoked","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-06-19 17:41:04.672678+00', ''),
	('00000000-0000-0000-0000-000000000000', '4e168d75-652b-497d-ab94-850209820bbf', '{"action":"token_refreshed","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-06-19 20:36:01.264988+00', ''),
	('00000000-0000-0000-0000-000000000000', '1f93163c-bf59-4c4b-9abe-7f6544e2d909', '{"action":"token_revoked","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-06-19 20:36:01.266598+00', ''),
	('00000000-0000-0000-0000-000000000000', '225f4cc1-1579-4ded-bffc-38e3fea49be7', '{"action":"token_refreshed","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-06-19 20:36:01.305422+00', ''),
	('00000000-0000-0000-0000-000000000000', '390713f9-f225-469a-bb4a-257219d5b87b', '{"action":"login","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-19 20:36:28.84239+00', ''),
	('00000000-0000-0000-0000-000000000000', '088e40f1-a1da-4a1d-a982-3cde1a15ac7b', '{"action":"token_refreshed","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-06-20 16:39:57.885303+00', ''),
	('00000000-0000-0000-0000-000000000000', '31dba9e0-671c-402e-8940-b30af0eb8f16', '{"action":"token_revoked","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-06-20 16:39:57.88663+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ddf54d13-53fd-44ae-a9cc-2d69c28f6fcd', '{"action":"token_refreshed","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-06-20 16:39:57.930604+00', ''),
	('00000000-0000-0000-0000-000000000000', '07ea699e-5313-43dd-a393-b7e387f8c7fe', '{"action":"token_refreshed","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-06-20 17:42:50.599515+00', ''),
	('00000000-0000-0000-0000-000000000000', '64f37cbc-b8fd-4b0c-917a-82eec247112a', '{"action":"token_revoked","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-06-20 17:42:50.600546+00', ''),
	('00000000-0000-0000-0000-000000000000', '5ba437c6-0995-4bae-b0f2-1aa0de9b8532', '{"action":"login","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-21 16:19:05.683688+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b97575a8-9782-4a1e-b4e2-1389e61737c2', '{"action":"login","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-22 01:33:15.408545+00', ''),
	('00000000-0000-0000-0000-000000000000', '73228c88-1e98-4c6e-82b7-21ed536b3269', '{"action":"token_refreshed","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-06-22 03:30:45.337898+00', ''),
	('00000000-0000-0000-0000-000000000000', '1b231dc7-c616-4b41-b61a-abdf6d7cdf27', '{"action":"token_revoked","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-06-22 03:30:45.339305+00', ''),
	('00000000-0000-0000-0000-000000000000', '94b1f554-be1d-45a7-a365-aeae287d0101', '{"action":"token_refreshed","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-06-22 03:30:45.388305+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '64c1b2ea-9ed0-4273-8356-b6c156ae9d6a', 'authenticated', 'authenticated', 'test@test.com', '$2a$06$0./BnpfuDJRQDWHH4OfzoOLK.T9omU2ae3muytlEFJHOzmDQVbkmG', '2025-06-18 22:07:58.136313+00', NULL, '', NULL, '', '2025-06-18 22:07:58.136313+00', '', '', NULL, '2025-06-22 01:33:15.409935+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2025-06-18 22:07:58.136313+00', '2025-06-22 03:30:45.345299+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('64c1b2ea-9ed0-4273-8356-b6c156ae9d6a', '64c1b2ea-9ed0-4273-8356-b6c156ae9d6a', '{"sub": "64c1b2ea-9ed0-4273-8356-b6c156ae9d6a", "email": "test@test.com"}', 'email', '2025-06-18 22:07:58.136313+00', '2025-06-18 22:07:58.136313+00', '2025-06-18 22:07:58.136313+00', '8246f2d7-e8e8-4ccb-9142-99eb11c1abb1');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('c38b8b9f-0a9a-4333-b2b0-f72a9f4d2932', '64c1b2ea-9ed0-4273-8356-b6c156ae9d6a', '2025-06-19 20:36:28.843909+00', '2025-06-19 20:36:28.843909+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.65.1', NULL),
	('0937535b-ba0a-4b08-915f-6d52a967ca73', '64c1b2ea-9ed0-4273-8356-b6c156ae9d6a', '2025-06-19 06:20:26.117942+00', '2025-06-20 17:42:50.603524+00', NULL, 'aal1', NULL, '2025-06-20 17:42:50.603473', 'Next.js Middleware', '192.168.65.1', NULL),
	('5e24285b-859d-4318-8f4e-b42f7de9eb41', '64c1b2ea-9ed0-4273-8356-b6c156ae9d6a', '2025-06-21 16:19:05.685502+00', '2025-06-21 16:19:05.685502+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.65.1', NULL),
	('bacae7aa-602f-423f-8529-0d49f87a4e3d', '64c1b2ea-9ed0-4273-8356-b6c156ae9d6a', '2025-06-22 01:33:15.410053+00', '2025-06-22 03:30:45.388809+00', NULL, 'aal1', NULL, '2025-06-22 03:30:45.388778', 'Next.js Middleware', '192.168.65.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('0937535b-ba0a-4b08-915f-6d52a967ca73', '2025-06-19 06:20:26.118912+00', '2025-06-19 06:20:26.118912+00', 'password', '90144265-1941-4b31-bfff-2f1e7863d21c'),
	('c38b8b9f-0a9a-4333-b2b0-f72a9f4d2932', '2025-06-19 20:36:28.846717+00', '2025-06-19 20:36:28.846717+00', 'password', '2d96b156-d329-4014-9d2a-5deaabea42ab'),
	('5e24285b-859d-4318-8f4e-b42f7de9eb41', '2025-06-21 16:19:05.688463+00', '2025-06-21 16:19:05.688463+00', 'password', '0fe8c8d2-b166-4545-a9e0-a788a9565fce'),
	('bacae7aa-602f-423f-8529-0d49f87a4e3d', '2025-06-22 01:33:15.413966+00', '2025-06-22 01:33:15.413966+00', 'password', 'da4f8d3e-2416-4b43-8871-00778c215330');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 10, 'vzcycqcxvsvo', '64c1b2ea-9ed0-4273-8356-b6c156ae9d6a', true, '2025-06-19 06:20:26.118289+00', '2025-06-19 14:32:51.949665+00', NULL, '0937535b-ba0a-4b08-915f-6d52a967ca73'),
	('00000000-0000-0000-0000-000000000000', 11, '3u7jbkghh7ar', '64c1b2ea-9ed0-4273-8356-b6c156ae9d6a', true, '2025-06-19 14:32:51.951206+00', '2025-06-19 17:41:04.672878+00', 'vzcycqcxvsvo', '0937535b-ba0a-4b08-915f-6d52a967ca73'),
	('00000000-0000-0000-0000-000000000000', 12, 'jgbllkylve42', '64c1b2ea-9ed0-4273-8356-b6c156ae9d6a', true, '2025-06-19 17:41:04.673194+00', '2025-06-19 20:36:01.266854+00', '3u7jbkghh7ar', '0937535b-ba0a-4b08-915f-6d52a967ca73'),
	('00000000-0000-0000-0000-000000000000', 14, 'oppiamtysc3c', '64c1b2ea-9ed0-4273-8356-b6c156ae9d6a', false, '2025-06-19 20:36:28.845373+00', '2025-06-19 20:36:28.845373+00', NULL, 'c38b8b9f-0a9a-4333-b2b0-f72a9f4d2932'),
	('00000000-0000-0000-0000-000000000000', 13, 'vl4dbgguofgz', '64c1b2ea-9ed0-4273-8356-b6c156ae9d6a', true, '2025-06-19 20:36:01.267248+00', '2025-06-20 16:39:57.886819+00', 'jgbllkylve42', '0937535b-ba0a-4b08-915f-6d52a967ca73'),
	('00000000-0000-0000-0000-000000000000', 15, '5zgdk2udkylu', '64c1b2ea-9ed0-4273-8356-b6c156ae9d6a', true, '2025-06-20 16:39:57.888474+00', '2025-06-20 17:42:50.600745+00', 'vl4dbgguofgz', '0937535b-ba0a-4b08-915f-6d52a967ca73'),
	('00000000-0000-0000-0000-000000000000', 16, 'jgu4m454ww3w', '64c1b2ea-9ed0-4273-8356-b6c156ae9d6a', false, '2025-06-20 17:42:50.601444+00', '2025-06-20 17:42:50.601444+00', '5zgdk2udkylu', '0937535b-ba0a-4b08-915f-6d52a967ca73'),
	('00000000-0000-0000-0000-000000000000', 17, 'sinigax7nbb5', '64c1b2ea-9ed0-4273-8356-b6c156ae9d6a', false, '2025-06-21 16:19:05.686464+00', '2025-06-21 16:19:05.686464+00', NULL, '5e24285b-859d-4318-8f4e-b42f7de9eb41'),
	('00000000-0000-0000-0000-000000000000', 18, 'jkiyhxxx3j24', '64c1b2ea-9ed0-4273-8356-b6c156ae9d6a', true, '2025-06-22 01:33:15.411524+00', '2025-06-22 03:30:45.339503+00', NULL, 'bacae7aa-602f-423f-8529-0d49f87a4e3d'),
	('00000000-0000-0000-0000-000000000000', 19, 'dwvcwcu2uw5x', '64c1b2ea-9ed0-4273-8356-b6c156ae9d6a', false, '2025-06-22 03:30:45.342896+00', '2025-06-22 03:30:45.342896+00', 'jkiyhxxx3j24', 'bacae7aa-602f-423f-8529-0d49f87a4e3d');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: allergens; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: location_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."location_type" ("id", "name", "created_at", "updated_at", "display_order") VALUES
	('20be80f1-7e87-424e-a7b8-801c80aca477', 'Dining Hall', '2025-06-19 06:02:38.275971+00', '2025-06-19 06:02:38.275971+00', 1),
	('dc1bae58-29a1-4c1f-829e-d0c3e2ed4479', 'Restaurant', '2025-06-19 06:02:38.275971+00', '2025-06-19 06:02:38.275971+00', 2),
	('131bb0cb-a083-40e2-bbe2-4bc6044dd8a7', 'Convenience Store', '2025-06-19 06:02:38.275971+00', '2025-06-19 06:02:38.275971+00', 3),
	('1193411e-6aba-4941-a611-fc9eb7546757', 'Coffee Shop', '2025-06-19 06:02:38.275971+00', '2025-06-19 06:02:38.275971+00', 4);


--
-- Data for Name: location; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."location" ("id", "name", "colloquial_name", "description", "address", "type_id", "regular_service_hours", "methods_of_payment", "meal_times", "google_maps_link", "apple_maps_link", "image", "created_at", "updated_at", "force_close", "has_menus") VALUES
	('de91ad3b-8fac-4494-9629-a6bb25eea48b', 'JCL Dining', 'JCL', 'Found on the south side of campus, Jester City Limits (JCL) offers a versatile dining experience. JCL is on the ground floor of Jester Center and provides an array of food lines you can choose your meal from.

Jester Center’s energetic atmosphere guarantees a unique meal with a menu created by our talented culinary team.', '201 E 21st St Austin, TX 78705', '20be80f1-7e87-424e-a7b8-801c80aca477', '{"friday": {"isClosed": false, "timeRanges": [{"open": 1030, "close": 1500}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 1030, "close": 2100}]}, "sunday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 1030, "close": 2100}]}, "saturday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "thursday": {"isClosed": false, "timeRanges": [{"open": 1030, "close": 2100}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 1030, "close": 2100}]}}', '{"Bevo Pay",Credit/Debit,"Dine In Dollars"}', '{"{\"name\": \"Lunch\", \"end_time\": 1500, \"start_time\": 1030}","{\"name\": \"Dinner\", \"end_time\": 2100, \"start_time\": 1500}"}', 'https://maps.app.goo.gl/DccikGcpeV4tpZSj7', 'https://maps.apple.com/?address=201%20E%2021st%20St,%20Austin,%20TX%20%2078705,%20United%20States&auid=12474801943275870923&ll=30.282840,-97.736945&lsp=9902&q=Jester%20City%20Limits', '', '2025-06-19 20:41:58.267439+00', '2025-06-22 01:33:42.359+00', false, true),
	('640f2995-7a36-44e0-9962-2114596470f8', 'Jesta'' Pizza', 'Jizza''s', 'Build your own pizza with an array of sauces and toppings and find other quick bites on the south side of campus inside Jester Center.

Jesta’ Pizza offers an assortment of options for you to create your ideal pie. Other snacks and beverages are also available for purchase.', '201 E 21st St Austin, TX 78705', 'dc1bae58-29a1-4c1f-829e-d0c3e2ed4479', '{"friday": {"isClosed": false, "timeRanges": [{"open": 1100, "close": 2200}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 1100, "close": 2200}]}, "sunday": {"isClosed": false, "timeRanges": [{"open": 1600, "close": 2200}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 1100, "close": 2200}]}, "saturday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "thursday": {"isClosed": false, "timeRanges": [{"open": 1100, "close": 2200}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 1100, "close": 2200}]}}', '{"Bevo Pay",Credit/Debit,"Dine In Dollars"}', '{}', 'https://maps.app.goo.gl/918gcsqhiFcq2CYS6', 'ttps://maps.apple.com/?address=201%20E%2021st%20St,%20Austin,%20TX%20%2078705,%20United%20States&auid=17503097336762474961&ll=30.282849,-97.736878&lsp=9902&q=Jesta%E2%80%99%20Pizza', '', '2025-06-20 17:42:50.841035+00', '2025-06-22 01:33:54.974+00', false, true),
	('feb48836-df0e-4bbe-bdc8-b0a64df9c086', 'J2 Dining', 'J2', 'Positioned on the south side of campus, J2 Dining houses a top-9 allergen free line as well as other unique options. 

J2 Dining is located on the second floor of Jester Center and serves a varied menu for you to create your ideal meal. The offerings at J2 include something for everyone.', '201 E 21st St Austin, TX 78705', '20be80f1-7e87-424e-a7b8-801c80aca477', '{"friday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 2000}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 2100}]}, "sunday": {"isClosed": false, "timeRanges": [{"open": 900, "close": 1400}, {"open": 1630, "close": 2000}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 2100}]}, "saturday": {"isClosed": false, "timeRanges": [{"open": 900, "close": 1400}, {"open": 1630, "close": 2000}]}, "thursday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 2100}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 2100}]}}', '{"Bevo Pay",Credit/Debit,"Dine In Dollars"}', '{"{\"name\": \"Breakfast\", \"end_time\": 900, \"start_time\": 700}","{\"name\": \"Lunch\", \"end_time\": 1330, \"start_time\": 1100}","{\"name\": \"Dinner\", \"end_time\": 2000, \"start_time\": 1730}"}', 'https://maps.app.goo.gl/oQJCkYWNgyFkMvFf7', 'https://maps.apple.com/?address=201%20E%2021st%20St,%20Austin,%20TX%20%2078705,%20United%20States&auid=18232725234478875257&ll=30.282849,-97.736878&lsp=9902&q=J2%20Dining', '', '2025-06-19 06:14:47.57904+00', '2025-06-22 01:33:25.905+00', false, true),
	('1707eb50-3d85-47ec-b04f-397c6a872614', 'Jester City Market', 'Jarket', 'Grab a bite on the go, shop for the essentials or stop in for a beverage on the ground floor of Jester Center.

Jester City Market has all your convenience store needs including school supplies, snacks and other goods. Stop in to see all we have to offer.', '201 E 21st St Austin, TX 78705', '131bb0cb-a083-40e2-bbe2-4bc6044dd8a7', '{"friday": {"isClosed": false, "timeRanges": [{"open": 1000, "close": 2200}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 1000, "close": 2300}]}, "sunday": {"isClosed": false, "timeRanges": [{"open": 1200, "close": 2300}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 1000, "close": 2300}]}, "saturday": {"isClosed": false, "timeRanges": [{"open": 1200, "close": 2000}]}, "thursday": {"isClosed": false, "timeRanges": [{"open": 1000, "close": 2300}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 1000, "close": 2300}]}}', '{"Bevo Pay",Cash,Credit/Debit,"Dine In Dollars"}', '{"{\"name\": \"Lunch\", \"end_time\": 1800, \"start_time\": 1000}","{\"name\": \"Dinner\", \"end_time\": 2200, \"start_time\": 1900}"}', 'https://maps.app.goo.gl/PrsZA1x88GUqdhhx6', 'https://maps.apple.com/?address=201%20E%2021st%20St,%20Austin,%20TX%20%2078705,%20United%20States&auid=8818684010108699137&ll=30.282849,-97.736878&lsp=9902&q=Jester%20City%20Market', '', '2025-06-20 17:48:09.272069+00', '2025-06-22 01:34:14.229+00', false, true),
	('b39abf07-d72f-4d91-9a7f-a447e04ad0c2', 'Kins Dining', 'Kins', 'Serving the northwest side of campus, Kins Dining hosts several serving lines and outdoor patio seating. Kins Dining is in Kinsolving Hall and offers a dining experience where you can piece together your ideal meal from the assortment of food lines and menu specials.

Enjoy your meal inside the dining hall or on the outdoor patio overlooking the Kinsolving garden.', '2605 Whitis Ave Austin, TX 78705', '20be80f1-7e87-424e-a7b8-801c80aca477', '{"friday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 2000}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 2100}]}, "sunday": {"isClosed": false, "timeRanges": [{"open": 900, "close": 1400}, {"open": 1630, "close": 2000}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 2100}]}, "saturday": {"isClosed": false, "timeRanges": [{"open": 900, "close": 1400}, {"open": 1630, "close": 2000}]}, "thursday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 2100}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 2100}]}}', '{"Bevo Pay",Credit/Debit,"Dine In Dollars"}', '{"{\"name\": \"Breakfast\", \"end_time\": 1100, \"start_time\": 700}","{\"name\": \"Lunch\", \"end_time\": 1630, \"start_time\": 1100}","{\"name\": \"Dinner\", \"end_time\": 2000, \"start_time\": 1630}"}', 'https://maps.app.goo.gl/zaxxqbgcuGBgQwBY9', 'https://maps.apple.com/?address=2605%20Whitis%20Ave,%20Austin,%20TX%2078705,%20United%20States&auid=9838945571614486266&ll=30.290260,-97.739890&lsp=9902&q=Kins%20Dining', '', '2025-06-19 20:45:48.782331+00', '2025-06-22 01:33:49.78+00', false, true),
	('29708e40-624a-4ae2-b391-43855055a880', 'Cypress Bend Cafe', NULL, 'Explore this grill and coffee shop all in one located in San Jacinto Residence Hall. Cypress Bend Cafe serves Starbucks coffee and beverages, bakery items and other grab and go options.

In addition, you can choose from a variety of meal options at the grill.', '309 E 21st St Austin, TX 78705', 'dc1bae58-29a1-4c1f-829e-d0c3e2ed4479', '{"friday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1800}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1900}]}, "sunday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1900}]}, "saturday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "thursday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1900}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1900}]}}', '{"Bevo Pay",Credit/Debit,"Dine In Dollars"}', '{"{\"name\": \"Breakfast\", \"end_time\": 1200, \"start_time\": 700}","{\"name\": \"Lunch\", \"end_time\": 1700, \"start_time\": 1200}"}', 'https://maps.app.goo.gl/h3T5ZbVH86rnNfp26', 'https://maps.apple.com/?address=309%20E%2021st%20St,%20Austin,%20TX%2078705,%20United%20States&auid=16696211541944805550&ll=30.283025,-97.734464&lsp=9902&q=Cypress%20Bend%20Cafe', '', '2025-06-20 17:44:58.6854+00', '2025-06-22 01:34:03.192+00', false, true),
	('2828735d-a58d-4505-b781-13b4c72c4515', 'Littlefield Patio Cafe', NULL, 'Discover bistro-style dining, grab and go offerings and coffee options on the northwest side of campus, adjacent to Littlefield Hall.

Littlefield Patio Cafe offers a la carte meal options in addition to Starbucks coffee and drinks, bakery selections and other selections.Enjoy your meal on the namesake patio dining area or inside the cafe.', '2503 Whitis Ave Austin, TX 78705', 'dc1bae58-29a1-4c1f-829e-d0c3e2ed4479', '{"friday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1800}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1900}]}, "sunday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1900}]}, "saturday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "thursday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1900}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1900}]}}', '{"Bevo Pay",Credit/Debit,"Dine In Dollars"}', '{"{\"name\": \"Breakfast\", \"end_time\": 1200, \"start_time\": 700}","{\"name\": \"Lunch\", \"end_time\": 1900, \"start_time\": 1200}"}', 'https://maps.app.goo.gl/CtBnkvwy6qCDNtyi9', 'https://maps.apple.com/?address=2503%20Whitis%20Ave,%20Austin,%20TX%20%2078705,%20United%20States&auid=12052977383648341965&ll=30.289327,-97.739752&lsp=9902&q=Littlefield%20Patio%20Cafe', '', '2025-06-20 17:53:49.387869+00', '2025-06-22 01:34:30.926+00', false, true),
	('ed5417c6-2a76-4aea-a0f2-56915d842048', 'Jester Java', NULL, 'Order breakfast tacos, Starbucks coffee and baked goods on the south side of campus, inside Jester Center. 

You’ll find an array of espresso, cold beverages and snacks.', '201 E 21st St Austin, TX 78705', '1193411e-6aba-4941-a611-fc9eb7546757', '{"friday": {"isClosed": false, "timeRanges": [{"open": 730, "close": 1600}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 730, "close": 1600}]}, "sunday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 730, "close": 1600}]}, "saturday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "thursday": {"isClosed": false, "timeRanges": [{"open": 730, "close": 1600}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 730, "close": 1600}]}}', '{"Bevo Pay",Credit/Debit,"Dine In Dollars"}', '{"{\"name\": \"Breakfast\", \"end_time\": 1100, \"start_time\": 730}","{\"name\": \"Lunch\", \"end_time\": 1600, \"start_time\": 1100}"}', 'https://maps.app.goo.gl/CtBnkvwy6qCDNtyi9', 'https://maps.apple.com/?address=201%20E%2021st%20St,%20Austin,%20TX%20%2078705', 'https://housing.utexas.edu/sites/default/files/styles/utexas_image_style_1800w/public/2021-07/Jester%20_Java_Logo_680x454.png.webp?itok=Fgnyii1L', '2025-06-22 01:43:28.99342+00', '2025-06-22 03:31:01.095+00', false, false);


--
-- Data for Name: menu; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: menu_category; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: food_item; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: nutrition; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 19, true);


--
-- Name: allergens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."allergens_id_seq"', 704, true);


--
-- Name: food_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."food_item_id_seq"', 704, true);


--
-- Name: menu_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."menu_category_id_seq"', 105, true);


--
-- Name: menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."menu_id_seq"', 11, true);


--
-- Name: nutrition_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."nutrition_id_seq"', 704, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
