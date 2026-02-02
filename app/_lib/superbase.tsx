import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.SUPERBASE_URL as string;
const supabaseKey = process.env.SUPERBASE_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey)


export async function gql<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const res = await fetch(supabaseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (json.errors) {
    console.error(json.errors);
    throw new Error('GraphQL error');
  }

  return json.data;
}


export default supabase;