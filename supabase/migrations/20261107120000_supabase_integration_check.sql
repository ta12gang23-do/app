-- Safe no-op migration used to verify the Supabase GitHub integration.
-- It makes no schema changes; the branching workflow records its version in
-- supabase_migrations.schema_migrations when it runs.

select 1;
