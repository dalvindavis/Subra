export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
  
    if (!query) {
      return new Response(JSON.stringify({ results: [] }), {
        headers: { "Content-Type": "application/json" },
      });
    }
  
    const res = await fetch(
      `https://api.themoviedb.org/3/search/tv?api_key=3cbef81f947b81e0413f1ff7fdd0900c&query=${encodeURIComponent(query)}&page=1`
    );
    const data = await res.json();
  
    const results = (data.results || []).slice(0, 5).map((show: any) => ({
      id: show.id,
      name: show.name,
      year: show.first_air_date?.split("-")[0] || "",
      poster: show.poster_path
        ? `https://image.tmdb.org/t/p/w92${show.poster_path}`
        : null,
    }));
  
    return new Response(JSON.stringify({ results }), {
      headers: { "Content-Type": "application/json" },
    });
  }