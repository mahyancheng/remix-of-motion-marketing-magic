CREATE POLICY "Allow authenticated insert on LeadzapTable"
  ON public."LeadzapTable"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on LeadzapTable"
  ON public."LeadzapTable"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on LeadzapTable"
  ON public."LeadzapTable"
  FOR DELETE
  TO authenticated
  USING (true);