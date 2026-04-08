CREATE TABLE public."LeadzapTable" (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '',
  "imageUrl" TEXT DEFAULT '',
  tags JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT false,
  "publishedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public."LeadzapTable" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on LeadzapTable"
  ON public."LeadzapTable"
  FOR SELECT
  TO anon, authenticated
  USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public."LeadzapTable";