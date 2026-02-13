import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const BUCKET = "movie-stills";

async function seed() {
  const { data: files, error } = await supabase.storage.from(BUCKET).list();

  if (error) {
    console.error("Error listing files: ", error);
    return;
  }

  const rows = files.map((file) => ({
    title: file.name.replace(/\.[^/.]+$/, ""),
    url: `${process.env.VITE_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${file.name}`,
  }));

  const { error: insertError } = await supabase
    .from("movie_stills")
    .insert(rows);

  if (insertError) {
    console.error("Error inserting rows:", insertError);
  } else {
    console.log(`Inserted ${rows.length} rows`);
  }
}

seed();
