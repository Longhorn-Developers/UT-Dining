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
	('00000000-0000-0000-0000-000000000000', '94b1f554-be1d-45a7-a365-aeae287d0101', '{"action":"token_refreshed","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-06-22 03:30:45.388305+00', ''),
	('00000000-0000-0000-0000-000000000000', '8352537e-d3cc-406c-8f97-756ea7c1ce66', '{"action":"login","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-24 06:01:12.294623+00', ''),
	('00000000-0000-0000-0000-000000000000', '9369ff81-f1e5-4084-988e-04e8888c6169', '{"action":"logout","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account"}', '2025-06-24 06:20:10.708941+00', ''),
	('00000000-0000-0000-0000-000000000000', '76f13f1e-6407-4968-a10b-700565a9d677', '{"action":"login","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-24 06:27:55.643575+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c0f90092-d097-47bf-9a00-105e9babfd62', '{"action":"login","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-24 22:46:20.738072+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e979900a-6951-4350-b0e4-e144481da367', '{"action":"token_refreshed","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-06-25 05:20:18.922911+00', ''),
	('00000000-0000-0000-0000-000000000000', '9cda6ae4-e086-4455-ba0b-a6b45afa94f7', '{"action":"token_revoked","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-06-25 05:20:18.92453+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ed17b03a-afa1-4b24-806a-6200a61b0241', '{"action":"token_refreshed","actor_id":"64c1b2ea-9ed0-4273-8356-b6c156ae9d6a","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-06-25 05:20:18.970404+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '64c1b2ea-9ed0-4273-8356-b6c156ae9d6a', 'authenticated', 'authenticated', 'test@test.com', '$2a$06$0./BnpfuDJRQDWHH4OfzoOLK.T9omU2ae3muytlEFJHOzmDQVbkmG', '2025-06-18 22:07:58.136313+00', NULL, '', NULL, '', '2025-06-18 22:07:58.136313+00', '', '', NULL, '2025-06-24 22:46:20.73913+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2025-06-18 22:07:58.136313+00', '2025-06-25 05:20:18.934307+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


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
	('03bf0571-3170-4d0f-8b47-365ea19ca922', '64c1b2ea-9ed0-4273-8356-b6c156ae9d6a', '2025-06-24 06:27:55.646764+00', '2025-06-24 06:27:55.646764+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.65.1', NULL),
	('d70c5cdc-f402-466d-ac92-73e932a0a6e3', '64c1b2ea-9ed0-4273-8356-b6c156ae9d6a', '2025-06-24 22:46:20.739183+00', '2025-06-25 05:20:18.970842+00', NULL, 'aal1', NULL, '2025-06-25 05:20:18.970816', 'Next.js Middleware', '192.168.65.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('03bf0571-3170-4d0f-8b47-365ea19ca922', '2025-06-24 06:27:55.653259+00', '2025-06-24 06:27:55.653259+00', 'password', 'f88e6773-55ee-4f79-acd2-6827918e3d8c'),
	('d70c5cdc-f402-466d-ac92-73e932a0a6e3', '2025-06-24 22:46:20.741359+00', '2025-06-24 22:46:20.741359+00', 'password', 'b15dd388-1f92-42da-8410-8c19c8941481');


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
	('00000000-0000-0000-0000-000000000000', 21, 'tafflqrm7oxn', '64c1b2ea-9ed0-4273-8356-b6c156ae9d6a', false, '2025-06-24 06:27:55.649037+00', '2025-06-24 06:27:55.649037+00', NULL, '03bf0571-3170-4d0f-8b47-365ea19ca922'),
	('00000000-0000-0000-0000-000000000000', 22, 'nmauxbffevgr', '64c1b2ea-9ed0-4273-8356-b6c156ae9d6a', true, '2025-06-24 22:46:20.739911+00', '2025-06-25 05:20:18.925093+00', NULL, 'd70c5cdc-f402-466d-ac92-73e932a0a6e3'),
	('00000000-0000-0000-0000-000000000000', 23, 'glxvjhvivipc', '64c1b2ea-9ed0-4273-8356-b6c156ae9d6a', false, '2025-06-25 05:20:18.929096+00', '2025-06-25 05:20:18.929096+00', 'nmauxbffevgr', 'd70c5cdc-f402-466d-ac92-73e932a0a6e3');


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
	('1193411e-6aba-4941-a611-fc9eb7546757', 'Coffee Shop', '2025-06-19 06:02:38.275971+00', '2025-06-19 06:02:38.275971+00', 2),
	('dc1bae58-29a1-4c1f-829e-d0c3e2ed4479', 'Restaurant', '2025-06-19 06:02:38.275971+00', '2025-06-19 06:02:38.275971+00', 3),
	('131bb0cb-a083-40e2-bbe2-4bc6044dd8a7', 'Convenience Store', '2025-06-19 06:02:38.275971+00', '2025-06-19 06:02:38.275971+00', 4);


--
-- Data for Name: location; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."location" ("id", "name", "colloquial_name", "description", "address", "type_id", "regular_service_hours", "methods_of_payment", "meal_times", "google_maps_link", "apple_maps_link", "image", "created_at", "updated_at", "force_close", "has_menus", "display_order") VALUES
	('640f2995-7a36-44e0-9962-2114596470f8', 'Jesta'' Pizza', 'Jizza''s', 'Build your own pizza with an array of sauces and toppings and find other quick bites on the south side of campus inside Jester Center.

Jesta’ Pizza offers an assortment of options for you to create your ideal pie. Other snacks and beverages are also available for purchase.', '201 E 21st St Austin, TX 78705', 'dc1bae58-29a1-4c1f-829e-d0c3e2ed4479', '{"friday": {"isClosed": false, "timeRanges": [{"open": 1100, "close": 2200}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 1100, "close": 2200}]}, "sunday": {"isClosed": false, "timeRanges": [{"open": 1600, "close": 2200}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 1100, "close": 2200}]}, "saturday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "thursday": {"isClosed": false, "timeRanges": [{"open": 1100, "close": 2200}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 1100, "close": 2200}]}}', '{"Bevo Pay",Credit/Debit,"Dine In Dollars"}', '{}', 'https://maps.app.goo.gl/918gcsqhiFcq2CYS6', 'ttps://maps.apple.com/?address=201%20E%2021st%20St,%20Austin,%20TX%20%2078705,%20United%20States&auid=17503097336762474961&ll=30.282849,-97.736878&lsp=9902&q=Jesta%E2%80%99%20Pizza', '', '2025-06-20 17:42:50.841035+00', '2025-06-24 06:19:57.041+00', false, true, 3),
	('1707eb50-3d85-47ec-b04f-397c6a872614', 'Jester City Market', 'Jarket', 'Grab a bite on the go, shop for the essentials or stop in for a beverage on the ground floor of Jester Center.

Jester City Market has all your convenience store needs including school supplies, snacks and other goods. Stop in to see all we have to offer.', '201 E 21st St Austin, TX 78705', '131bb0cb-a083-40e2-bbe2-4bc6044dd8a7', '{"friday": {"isClosed": false, "timeRanges": [{"open": 1000, "close": 2200}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 1000, "close": 2300}]}, "sunday": {"isClosed": false, "timeRanges": [{"open": 1200, "close": 2300}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 1000, "close": 2300}]}, "saturday": {"isClosed": false, "timeRanges": [{"open": 1200, "close": 2000}]}, "thursday": {"isClosed": false, "timeRanges": [{"open": 1000, "close": 2300}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 1000, "close": 2300}]}}', '{"Bevo Pay",Cash,Credit/Debit,"Dine In Dollars"}', '{"{\"name\": \"Lunch\", \"end_time\": 1800, \"start_time\": 1000}","{\"name\": \"Dinner\", \"end_time\": 2200, \"start_time\": 1900}"}', 'https://maps.app.goo.gl/PrsZA1x88GUqdhhx6', 'https://maps.apple.com/?address=201%20E%2021st%20St,%20Austin,%20TX%20%2078705,%20United%20States&auid=8818684010108699137&ll=30.282849,-97.736878&lsp=9902&q=Jester%20City%20Market', '', '2025-06-20 17:48:09.272069+00', '2025-06-24 06:19:57.207+00', false, true, 5),
	('ed5417c6-2a76-4aea-a0f2-56915d842048', 'Jester Java', NULL, 'Order breakfast tacos, Starbucks coffee and baked goods on the south side of campus, inside Jester Center. 

You’ll find an array of espresso, cold beverages and snacks.', '201 E 21st St Austin, TX 78705', '1193411e-6aba-4941-a611-fc9eb7546757', '{"friday": {"isClosed": true, "timeRanges": [{"open": 730, "close": 1600}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1500}]}, "sunday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1500}]}, "saturday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "thursday": {"isClosed": true, "timeRanges": [{"open": 730, "close": 1600}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1500}]}}', '{"Bevo Pay",Credit/Debit,"Dine In Dollars"}', '{}', 'https://maps.app.goo.gl/CtBnkvwy6qCDNtyi9', 'https://maps.apple.com/?address=201%20E%2021st%20St,%20Austin,%20TX%20%2078705', 'https://housing.utexas.edu/sites/default/files/styles/utexas_image_style_1800w/public/2021-07/Jester%20_Java_Logo_680x454.png.webp?itok=Fgnyii1L', '2025-06-22 01:43:28.99342+00', '2025-06-24 06:42:43.417+00', false, false, 7),
	('1ab2febc-26fc-4249-aeed-e96b199f398f', 'Longhorn Coffee Co.', 'Longhorn Coffee', 'Check out this coffee shop proudly serving Starbucks coffee and other on the go options in the WCP Student Activity Center.

Located at WCP 1.302.', '2201 Speedway, Austin, TX 78712', '1193411e-6aba-4941-a611-fc9eb7546757', '{"friday": {"isClosed": true, "timeRanges": [{"open": 800, "close": 1400}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1400}]}, "sunday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 1400}]}, "saturday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "thursday": {"isClosed": true, "timeRanges": [{"open": 800, "close": 1400}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 1400}]}}', '{"Bevo Pay",Credit/Debit,"Dine In Dollars"}', '{}', '.', 'https://maps.apple.com/?address=2201%20Speedway,%20Austin,%20TX%2078712', 'https://housing.utexas.edu/sites/default/files/styles/utexas_image_style_450w_300h/public/2021-07/Longhorn_Coffee_Co_Logo_680x454.png.webp?itok=Peq67Hth', '2025-06-24 06:27:59.142427+00', '2025-06-24 06:44:21.045+00', false, false, 8),
	('de91ad3b-8fac-4494-9629-a6bb25eea48b', 'JCL Dining', 'JCL', 'Found on the south side of campus, Jester City Limits (JCL) offers a versatile dining experience. JCL is on the ground floor of Jester Center and provides an array of food lines you can choose your meal from.

Jester Center’s energetic atmosphere guarantees a unique meal with a menu created by our talented culinary team.', '201 E 21st St Austin, TX 78705', '20be80f1-7e87-424e-a7b8-801c80aca477', '{"friday": {"isClosed": false, "timeRanges": [{"open": 1030, "close": 1500}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 1030, "close": 2100}]}, "sunday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 1030, "close": 2100}]}, "saturday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "thursday": {"isClosed": false, "timeRanges": [{"open": 1030, "close": 2100}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 1030, "close": 2100}]}}', '{"Bevo Pay",Credit/Debit,"Dine In Dollars"}', '{"{\"name\": \"Lunch\", \"end_time\": 1500, \"start_time\": 1030}","{\"name\": \"Dinner\", \"end_time\": 2100, \"start_time\": 1500}"}', 'https://maps.app.goo.gl/DccikGcpeV4tpZSj7', 'https://maps.apple.com/?address=201%20E%2021st%20St,%20Austin,%20TX%20%2078705,%20United%20States&auid=12474801943275870923&ll=30.282840,-97.736945&lsp=9902&q=Jester%20City%20Limits', '', '2025-06-19 20:41:58.267439+00', '2025-06-24 06:41:47.004+00', true, true, 1),
	('6b33b45f-91b5-4460-bf87-ed1fca65c06f', 'Prufrock''s', NULL, 'Order Starbucks beverages and quick food options on the ground floor of the Perry-Castañeda Library.

Prufrock’s offers hot and cold drink options, pastries and grab and go selections. Give your studying at the library a boost with a trip to Prufrock’s.', '101 E 21st St, Austin, TX 78705', '1193411e-6aba-4941-a611-fc9eb7546757', '{"friday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 2000}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 2000}]}, "sunday": {"isClosed": false, "timeRanges": [{"open": 1200, "close": 2000}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 2000}]}, "saturday": {"isClosed": false, "timeRanges": [{"open": 1000, "close": 1700}]}, "thursday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 2000}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 2000}]}}', '{"Bevo Pay",Cash,Credit/Debit,"Dine In Dollars"}', '{}', 'https://maps.app.goo.gl/', 'https://maps.apple.com/?address=101%20E%2021st%20St,%20Austin,%20TX%2078705', 'https://housing.utexas.edu/sites/default/files/styles/utexas_image_style_450w_300h/public/2021-10/prufrocks_logo.png.webp?itok=0t3Crktg', '2025-06-24 06:30:20.375628+00', '2025-06-24 06:44:42.528+00', true, false, 9),
	('5f6df292-3e7e-41df-bec3-701c674a9c44', 'Up and Atom', 'Up & Atom', 'Power your day with quick bites and Ruta Maya coffee at this conveniently located coffee shop in Welch Hall.

Pair a beverage made from shade-grown Arabica beans with a grab and go item to fuel up for your next class or study session.', '105 E 24th St, Austin, TX 78712', '1193411e-6aba-4941-a611-fc9eb7546757', '{"friday": {"isClosed": false, "timeRanges": [{"open": 730, "close": 1700}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 730, "close": 1700}]}, "sunday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 2300}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 730, "close": 1700}]}, "saturday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 2300}]}, "thursday": {"isClosed": false, "timeRanges": [{"open": 730, "close": 1700}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 730, "close": 1700}]}}', '{"Bevo Pay",Credit/Debit,"Dine In Dollars"}', '{}', 'https://maps.app.goo.gl/', 'https://maps.apple.com/?address=105%20E%2024th%20St,%20Austin,%20TX%2078712', 'https://housing.utexas.edu/sites/default/files/styles/utexas_image_style_450w_300h/public/2022-10/878_up_and_atom_680x454.png.webp?itok=Wkka8edw''', '2025-06-24 06:35:23.06363+00', '2025-06-24 06:45:49.516+00', true, false, 11),
	('7043d5d5-0e50-4944-83c9-5aa1ee0374b1', 'Varsity Grounds', NULL, 'Find premium coffee, freshly brewed teas, pastries, grab and go options and more at this coffee shop located in East Campus Graduate Apartments.

Whether you need a latte to-go between classes or a spot to connect with friends, Varsity Grounds offers the perfect blend of convenience and community.', '2105 Comal St. Austin, TX 78712', '1193411e-6aba-4941-a611-fc9eb7546757', '{"friday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 2000}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 2000}]}, "sunday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 2000}]}, "saturday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 1400}]}, "thursday": {"isClosed": true, "timeRanges": [{"open": 800, "close": 2000}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 2000}]}}', '{"Bevo Pay",Credit/Debit,"Dine In Dollars"}', '{}', 'https://maps.app.goo.gl/', 'https://maps.apple.com/?address=2308%20Whitis%20Ave,%20Austin,%20TX%2078712', 'https://housing.utexas.edu/sites/default/files/styles/utexas_image_style_1000w/public/2025-01/Varsity_Grounds_680x454.png.webp?itok=N5WphCHt', '2025-06-24 06:38:33.576586+00', '2025-06-24 06:47:29.793+00', false, false, 13),
	('2828735d-a58d-4505-b781-13b4c72c4515', 'Littlefield Patio Cafe', 'Littlefield Cafe', 'Discover bistro-style dining, grab and go offerings and coffee options on the northwest side of campus, adjacent to Littlefield Hall.

Littlefield Patio Cafe offers a la carte meal options in addition to Starbucks coffee and drinks, bakery selections and other selections.Enjoy your meal on the namesake patio dining area or inside the cafe.', '2503 Whitis Ave Austin, TX 78705', 'dc1bae58-29a1-4c1f-829e-d0c3e2ed4479', '{"friday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 1500}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 1500}]}, "sunday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 1500}]}, "saturday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "thursday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 1500}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 1500}]}}', '{"Bevo Pay",Credit/Debit,"Dine In Dollars"}', '{"{\"name\": \"Breakfast\", \"end_time\": 1200, \"start_time\": 700}","{\"name\": \"Lunch\", \"end_time\": 1900, \"start_time\": 1200}"}', 'https://maps.app.goo.gl/CtBnkvwy6qCDNtyi9', 'https://maps.apple.com/?address=2503%20Whitis%20Ave,%20Austin,%20TX%20%2078705,%20United%20States&auid=12052977383648341965&ll=30.289327,-97.739752&lsp=9902&q=Littlefield%20Patio%20Cafe', '', '2025-06-20 17:53:49.387869+00', '2025-06-24 06:43:42.461+00', false, true, 6),
	('feb48836-df0e-4bbe-bdc8-b0a64df9c086', 'J2 Dining', 'J2', 'Positioned on the south side of campus, J2 Dining houses a top-9 allergen free line as well as other unique options. 

J2 Dining is located on the second floor of Jester Center and serves a varied menu for you to create your ideal meal. The offerings at J2 include something for everyone.', '201 E 21st St Austin, TX 78705', '20be80f1-7e87-424e-a7b8-801c80aca477', '{"friday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1000}, {"open": 1100, "close": 1400}, {"open": 1630, "close": 2000}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1000}, {"open": 1100, "close": 1400}, {"open": 1630, "close": 2000}]}, "sunday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 1000}, {"open": 1100, "close": 1400}, {"open": 1630, "close": 2000}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1000}, {"open": 1100, "close": 1400}, {"open": 1630, "close": 2000}]}, "saturday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 1000}, {"open": 1100, "close": 1400}, {"open": 1630, "close": 2000}]}, "thursday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 1000}, {"open": 1100, "close": 1400}, {"open": 1630, "close": 2000}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1000}, {"open": 1100, "close": 1400}, {"open": 1630, "close": 2000}]}}', '{"Bevo Pay",Credit/Debit,"Dine In Dollars"}', '{"{\"name\": \"Breakfast\", \"end_time\": 1000, \"start_time\": 700}","{\"name\": \"Lunch\", \"end_time\": 1400, \"start_time\": 1100}","{\"name\": \"Dinner\", \"end_time\": 2000, \"start_time\": 1630}"}', 'https://maps.app.goo.gl/oQJCkYWNgyFkMvFf7', 'https://maps.apple.com/?address=201%20E%2021st%20St,%20Austin,%20TX%20%2078705,%20United%20States&auid=18232725234478875257&ll=30.282849,-97.736878&lsp=9902&q=J2%20Dining', '', '2025-06-19 06:14:47.57904+00', '2025-06-24 06:41:33.033+00', false, true, 0),
	('ccc19373-b308-474c-b0aa-27a85bf7180a', 'Union Coffee House', 'Union Coffee', 'Union Coffee House proudly serves Starbucks coffee and beverages, bakery items and grab and go options.

Located in the second floor food court.', '2308 Whitis Ave, Austin, TX 78712', '1193411e-6aba-4941-a611-fc9eb7546757', '{"friday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 1400}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 1400}]}, "sunday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 1400}]}, "saturday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "thursday": {"isClosed": true, "timeRanges": [{"open": 800, "close": 1400}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 1400}]}}', '{"Bevo Pay",Credit/Debit,"Dine In Dollars"}', '{}', 'https://maps.app.goo.gl/', 'https://maps.apple.com/?address=2308%20Whitis%20Ave,%20Austin,%20TX%2078712', 'https://housing.utexas.edu/sites/default/files/styles/utexas_image_style_450w_300h/public/2021-07/Union_Coffee_House_Logo_680x454.png.webp?itok=WPuAgLry', '2025-06-24 06:32:28.962536+00', '2025-06-24 06:45:34.05+00', false, false, 10),
	('b39abf07-d72f-4d91-9a7f-a447e04ad0c2', 'Kins Dining', 'Kins', 'Serving the northwest side of campus, Kins Dining hosts several serving lines and outdoor patio seating. Kins Dining is in Kinsolving Hall and offers a dining experience where you can piece together your ideal meal from the assortment of food lines and menu specials.

Enjoy your meal inside the dining hall or on the outdoor patio overlooking the Kinsolving garden.', '2605 Whitis Ave Austin, TX 78705', '20be80f1-7e87-424e-a7b8-801c80aca477', '{"friday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 2000}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 2100}]}, "sunday": {"isClosed": false, "timeRanges": [{"open": 900, "close": 1400}, {"open": 1630, "close": 2000}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 2100}]}, "saturday": {"isClosed": false, "timeRanges": [{"open": 900, "close": 1400}, {"open": 1630, "close": 2000}]}, "thursday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 2100}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 2100}]}}', '{"Bevo Pay",Credit/Debit,"Dine In Dollars"}', '{"{\"name\": \"Breakfast\", \"end_time\": 1100, \"start_time\": 700}","{\"name\": \"Lunch\", \"end_time\": 1630, \"start_time\": 1100}","{\"name\": \"Dinner\", \"end_time\": 2000, \"start_time\": 1630}"}', 'https://maps.app.goo.gl/zaxxqbgcuGBgQwBY9', 'https://maps.apple.com/?address=2605%20Whitis%20Ave,%20Austin,%20TX%2078705,%20United%20States&auid=9838945571614486266&ll=30.290260,-97.739890&lsp=9902&q=Kins%20Dining', '', '2025-06-19 20:45:48.782331+00', '2025-06-24 06:41:54.834+00', true, true, 2),
	('29708e40-624a-4ae2-b391-43855055a880', 'Cypress Bend Cafe', NULL, 'Explore this grill and coffee shop all in one located in San Jacinto Residence Hall. Cypress Bend Cafe serves Starbucks coffee and beverages, bakery items and other grab and go options.

In addition, you can choose from a variety of meal options at the grill.', '309 E 21st St Austin, TX 78705', 'dc1bae58-29a1-4c1f-829e-d0c3e2ed4479', '{"friday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1800}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1900}]}, "sunday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1900}]}, "saturday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "thursday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1900}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1900}]}}', '{"Bevo Pay",Credit/Debit,"Dine In Dollars"}', '{"{\"name\": \"Breakfast\", \"end_time\": 1200, \"start_time\": 700}","{\"name\": \"Lunch\", \"end_time\": 1700, \"start_time\": 1200}"}', 'https://maps.app.goo.gl/h3T5ZbVH86rnNfp26', 'https://maps.apple.com/?address=309%20E%2021st%20St,%20Austin,%20TX%2078705,%20United%20States&auid=16696211541944805550&ll=30.283025,-97.734464&lsp=9902&q=Cypress%20Bend%20Cafe', '', '2025-06-20 17:44:58.6854+00', '2025-06-24 06:42:18.29+00', true, true, 4),
	('4ccea6df-abbb-459d-94bf-1d984bd721cf', 'Shake Smart', NULL, 'Find freshly blended protein shakes, cold brew coffee and quick nutritious bites at this Texas Union location of the health food chain.

Make Shake Smart your one-stop shop for pre- and post-gym fuel and a regular destination for when you’re on the go.', '2308 Whitis Ave Austin, TX 78712', '1193411e-6aba-4941-a611-fc9eb7546757', '{"friday": {"isClosed": false, "timeRanges": [{"open": 1000, "close": 1600}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 1000, "close": 1600}]}, "sunday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 1000, "close": 1600}]}, "saturday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "thursday": {"isClosed": true, "timeRanges": [{"open": 1000, "close": 1600}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 1000, "close": 1600}]}}', '{"Bevo Pay",Credit/Debit,"Dine In Dollars"}', '{}', 'https://maps.app.goo.gl/', 'https://maps.apple.com/?address=2308%20Whitis%20Ave,%20Austin,%20TX%2078712', 'https://housing.utexas.edu/sites/default/files/styles/utexas_image_style_1800w/public/2022-02/smart.png.webp?itok=YtA0utb9', '2025-06-24 06:36:47.046073+00', '2025-06-24 06:44:59.865+00', false, false, 12),
	('6d01dc1e-ec37-405d-b53f-0f9a86cf8848', 'Chick-fil-A – Texas Union', NULL, 'Find chicken sandwiches, waffle fries and more at this Texas Union location of the international chain. 

This convenient stop in the heart of campus is perfect for a quick yet substantial bite on the go.', '2308 Whitis Ave Austin, TX 78712 ', 'dc1bae58-29a1-4c1f-829e-d0c3e2ed4479', '{"friday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 1000, "close": 1600}]}, "sunday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 1000, "close": 1600}]}, "saturday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "thursday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 1000, "close": 1600}]}}', '{"Bevo Pay",Cash,Credit/Debit,"Dine In Dollars"}', '{}', '.', 'https://maps.apple.com/?address=2308%20Whitis%20Ave,%20Austin,%20TX%20%2078712,%20United%20States&ll=30.286619,-97.741141&q=2308%20Whitis%20Ave', 'https://housing.utexas.edu/sites/default/files/styles/utexas_image_style_1000w/public/2022-01/chick_fil_a_680x454.png.webp?itok=xweNJS3y', '2025-06-25 05:23:52.698368+00', '2025-06-25 05:23:52.698368+00', false, false, 14),
	('54b15785-b754-44e5-a4a9-10292471fd76', 'Chick-fil-A – WCP', NULL, 'Find chicken sandwiches, waffle fries and more at this WCP Student Activity Center location of the international chain.

This convenient stop near Gregory Gym is perfect for a quick yet substantial bite on the go.', '2201 Speedway Austin, TX 78712', 'dc1bae58-29a1-4c1f-829e-d0c3e2ed4479', '{"friday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 1400}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1400}]}, "sunday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 1400}]}, "saturday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "thursday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 800, "close": 1400}]}}', '{"Bevo Pay",Cash,Credit/Debit,"Dine In Dollars"}', '{}', '.', 'https://maps.apple.com/?address=2201%20Speedway,%20Austin,%20TX%20%2078712,%20United%20States&ll=30.284859,-97.736611&q=2201%20Speedway', 'https://housing.utexas.edu/sites/default/files/styles/utexas_image_style_1000w/public/2022-01/chick_fil_a_680x454.png.webp?itok=xweNJS3y', '2025-06-25 05:25:26.391479+00', '2025-06-25 05:25:26.391479+00', false, false, 15),
	('7a020251-a284-4040-8cc5-b0d583d47fe0', 'One Two Three Sushi', NULL, 'Stop by the WCP Student Activity Center for customizable sushi and other made-to-order Japanese specials. 

Roll your own way to a fresh and filling meal at this convenient location in the center of campus.', '2201 Speedway Austin, TX 78712', 'dc1bae58-29a1-4c1f-829e-d0c3e2ed4479', '{"friday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 1100, "close": 1500}]}, "sunday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 1100, "close": 1500}]}, "saturday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "thursday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "wednesday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}}', '{"Bevo Pay",Credit/Debit,"Dine In Dollars"}', '{}', '.', 'https://maps.apple.com/?address=2201%20Speedway,%20Austin,%20TX%20%2078712,%20United%20States&ll=30.284859,-97.736611&q=2201%20Speedway', 'https://housing.utexas.edu/sites/default/files/styles/utexas_image_style_1000w/public/2022-01/one_two_three_sushi_680x454.png.webp?itok=VpKM8CjL', '2025-06-25 05:28:03.513666+00', '2025-06-25 05:28:03.513666+00', false, false, 17),
	('cdf43858-4b01-47be-be16-7b6125ce7b79', 'La Fonda', NULL, 'La Fonda is your go-to breakfast and lunch spot for fresh street food. Find breakfast tacos, chilaquiles, tortas, signature dishes and more at this food truck conveniently located on 21st and Speedway. 

Whether you’re starting your day or grabbing a quick bite to fuel your studies, La Fonda offers plenty of flavorful snack and meal options.', '2100 Speedway Austin, TX 78712', 'dc1bae58-29a1-4c1f-829e-d0c3e2ed4479', '{"friday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1500}]}, "sunday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1500}]}, "saturday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "thursday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1500}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1500}]}}', '{Credit/Debit,"Dine In Dollars"}', '{}', '.', 'https://maps.apple.com/?address=2100%20Speedway,%20Austin,%20TX%20%2078705,%20United%20States&ll=30.283945,-97.737801&q=2100%20Speedway', 'https://housing.utexas.edu/sites/default/files/styles/utexas_image_style_1000w/public/2025-02/La_Fonda_680x454.png.webp?itok=UnGDsBH2', '2025-06-25 05:26:58.910467+00', '2025-06-25 05:41:02.185+00', false, false, 16),
	('854ebb41-c687-4329-8f28-e71681037160', 'Panda Express', NULL, 'Find American Chinese food fresh from the wok at this Texas Union location of the international chain. 

This quick and easy campus favorite offers a centrally located spot to fuel up throughout the day. ', '2308 Whitis Ave Austin, TX 78712', 'dc1bae58-29a1-4c1f-829e-d0c3e2ed4479', '{"friday": {"isClosed": false, "timeRanges": [{"open": 1100, "close": 1600}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 1100, "close": 1600}]}, "sunday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1000}]}, "tuesday": {"isClosed": false, "timeRanges": [{"open": 1100, "close": 1600}]}, "saturday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "thursday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "wednesday": {"isClosed": false, "timeRanges": [{"open": 1100, "close": 1600}]}}', '{"Bevo Pay",Credit/Debit}', '{}', '.', 'https://maps.apple.com/?address=2308%20Whitis%20Ave,%20Austin,%20TX%20%2078712,%20United%20States&ll=30.286619,-97.741141&q=2308%20Whitis%20Ave', 'https://housing.utexas.edu/sites/default/files/styles/utexas_image_style_1000w/public/2022-03/Panda_Express_680x454.png.webp?itok=2d5OUdqG', '2025-06-25 05:32:14.466761+00', '2025-06-25 05:41:13.365+00', false, false, 18),
	('b7ee00fe-027c-45bf-ab65-72a4ed1fb32f', 'Tower Burgers and Fries', NULL, 'Check out burger, side and beverage options on the west side of campus inside the Texas Union. This location offers a selection of burgers, fries, onion rings, milkshakes and more. 

Get your meal to go or dine inside the Texas Union building or on their patio.', '2308 Whitis Ave Austin, TX 78712', 'dc1bae58-29a1-4c1f-829e-d0c3e2ed4479', '{"friday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1000}]}, "sunday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "tuesday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "saturday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "thursday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "wednesday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}}', '{"Bevo Pay",Credit/Debit,"Dine In Dollars"}', '{}', '.', 'https://maps.apple.com/?address=2308%20Whitis%20Ave,%20Austin,%20TX%20%2078712,%20United%20States&ll=30.286619,-97.741141&q=2308%20Whitis%20Ave', 'https://housing.utexas.edu/sites/default/files/styles/utexas_image_style_1000w/public/2021-09/Tower_Burgers_and_Fries_680x454.png.webp?itok=GTdZR1kx', '2025-06-25 05:35:01.676111+00', '2025-06-25 05:35:04.823+00', true, false, 20),
	('4b326f4a-f53b-450e-b7ad-1e7dd619c984', 'Hook ’em Hut – Texas Union', NULL, 'Stop by and grab refreshments at this mini convenience store located in the Texas Union. Hook ‘em Hut offers grab and go food, beverages and sundries to satisfy your needs and busy schedule.', '2308 Whitis Ave Austin, TX 78712', '131bb0cb-a083-40e2-bbe2-4bc6044dd8a7', '{"friday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1000}]}, "sunday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "tuesday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "saturday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "thursday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "wednesday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}}', '{Credit/Debit,"Bevo Pay","Dine In Dollars"}', '{}', '.', 'https://maps.apple.com/?address=2308%20Whitis%20Ave,%20Austin,%20TX%20%2078712,%20United%20States&ll=30.286619,-97.741141&q=2308%20Whitis%20Ave', 'https://housing.utexas.edu/sites/default/files/styles/utexas_image_style_1000w/public/2021-09/HookEm_Hut_680x454.png.webp?itok=59TSePP8', '2025-06-25 05:36:19.080055+00', '2025-06-25 05:36:23.187+00', true, false, 21),
	('45fc4404-6b43-4523-8bce-4d9d3fc600e5', 'Sabor Tacos y Más', NULL, 'Find an assortment of build your own Tex-Mex options off Speedway at the WCP Student Activity Center.

Sabor Tacos y Más offers a la carte dining items including tacos, burritos, salads, rice bowls and more. ', '2201 Speedway Austin, TX 78712', 'dc1bae58-29a1-4c1f-829e-d0c3e2ed4479', '{"friday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1000}]}, "sunday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "tuesday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "saturday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "thursday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "wednesday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}}', '{"Bevo Pay",Credit/Debit,"Dine In Dollars"}', '{}', '.', 'https://maps.apple.com/?address=2201%20Speedway,%20Austin,%20TX%20%2078712,%20United%20States&ll=30.284859,-97.736611&q=2201%20Speedway', 'https://housing.utexas.edu/sites/default/files/styles/utexas_image_style_450w_300h/public/2022-10/sabor_logo_680x454.png.webp?itok=o895PH2t', '2025-06-25 05:33:57.926275+00', '2025-06-25 05:45:22.402+00', true, false, 19),
	('91ab1867-aaa3-4a5b-a854-08826583a99b', 'Kin''s Market', NULL, 'Shop for groceries, pick up meals on the go and discover other sundries inside the Kinsolving Hall lobby. Kin’s Market has all the essentials so make it your one-stop shop for school supplies, snacks, fresh produce and other necessities. 

When you’re on the northwest side of campus, Kin’s Market is your convenience solution.', '2605 Whitis Ave Austin, TX 78705', '131bb0cb-a083-40e2-bbe2-4bc6044dd8a7', '{"friday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1000}]}, "sunday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "tuesday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "saturday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "thursday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "wednesday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}}', '{"Bevo Pay",Cash,Credit/Debit,"Dine In Dollars"}', '{}', '.', 'https://maps.apple.com/?address=2605%20Whitis%20Ave,%20Austin,%20TX%20%2078705,%20United%20States&ll=30.290334,-97.739766&q=2605%20Whitis%20Ave', 'https://housing.utexas.edu/sites/default/files/styles/utexas_image_style_1000w/public/2021-11/kins_market_680x454.png.webp?itok=eFL02Rl_', '2025-06-25 05:39:02.906811+00', '2025-06-25 05:39:02.906811+00', false, false, 23),
	('9e643458-0bb3-4011-825e-bfa0a948d980', 'Hook ’em Hut – WCP', NULL, 'Pick up refreshments at this mini convenience store located in the WCP Student Activity Center. 

Hook ‘em Hut offers grab and go food, beverages and sundries to satisfy your needs and busy schedule. ', '2201 Speedway Austin, TX 78712', '131bb0cb-a083-40e2-bbe2-4bc6044dd8a7', '{"friday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "monday": {"isClosed": false, "timeRanges": [{"open": 700, "close": 1000}]}, "sunday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "tuesday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "saturday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "thursday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}, "wednesday": {"isClosed": true, "timeRanges": [{"open": 700, "close": 1000}]}}', '{"Bevo Pay",Credit/Debit,"Dine In Dollars"}', '{}', '.', 'https://maps.apple.com/?address=2201%20Speedway,%20Austin,%20TX%20%2078712,%20United%20States&ll=30.284859,-97.736611&q=2201%20Speedway', 'https://housing.utexas.edu/sites/default/files/styles/utexas_image_style_1000w/public/2021-09/HookEm_Hut_680x454.png.webp?itok=59TSePP8', '2025-06-25 05:37:59.572022+00', '2025-06-25 05:42:02.802+00', true, false, 22);


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

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 23, true);


--
-- Name: allergens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."allergens_id_seq"', 1376, true);


--
-- Name: food_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."food_item_id_seq"', 1376, true);


--
-- Name: menu_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."menu_category_id_seq"', 205, true);


--
-- Name: menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."menu_id_seq"', 25, true);


--
-- Name: nutrition_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."nutrition_id_seq"', 1376, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
