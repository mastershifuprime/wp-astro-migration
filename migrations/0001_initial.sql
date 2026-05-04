-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Workspaces (top-level tenant unit)
CREATE TABLE IF NOT EXISTS workspaces (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  slug        TEXT        NOT NULL UNIQUE,
  plan        TEXT        NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  doc_count   INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Users (mirrors Clerk; clerk_id is the authoritative identity)
CREATE TABLE IF NOT EXISTS users (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id     TEXT        NOT NULL UNIQUE,
  email        TEXT        NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Workspace membership with RBAC
CREATE TABLE IF NOT EXISTS workspace_members (
  workspace_id UUID        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id      UUID        NOT NULL REFERENCES users(id)      ON DELETE CASCADE,
  role         TEXT        NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'viewer')),
  joined_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (workspace_id, user_id)
);

-- Documents (core content unit)
CREATE TABLE IF NOT EXISTS documents (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  author_id    UUID        NOT NULL REFERENCES users(id),
  parent_id    UUID        REFERENCES documents(id),
  title        TEXT        NOT NULL DEFAULT 'Untitled',
  content      JSONB,
  content_text TEXT,
  embedding    vector(1536),
  tags         TEXT[]      NOT NULL DEFAULT '{}',
  ai_summary   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Full-text search index (keyword search fallback)
CREATE INDEX IF NOT EXISTS documents_fts_idx ON documents
  USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content_text, '')));

-- pgvector IVFFlat index for semantic similarity search
-- NOTE: rebuild with higher lists after the document corpus exceeds ~10k rows
CREATE INDEX IF NOT EXISTS documents_embedding_idx ON documents
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Workspace index on documents for efficient per-workspace queries
CREATE INDEX IF NOT EXISTS documents_workspace_idx ON documents (workspace_id, updated_at DESC);

-- Migration tracking (used by scripts/migrate.ts)
CREATE TABLE IF NOT EXISTS _migrations (
  id         SERIAL      PRIMARY KEY,
  name       TEXT        NOT NULL UNIQUE,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
