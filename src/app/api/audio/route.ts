import { NextResponse } from 'next/server';
import ytSearch from 'yt-search';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const results = await ytSearch(query);
    const videos = results.videos.slice(0, 5).map(v => ({
      id: v.videoId,
      title: v.title,
      thumbnail: v.thumbnail,
      seconds: v.seconds,
      timestamp: v.timestamp,
      author: v.author.name
    }));
    return NextResponse.json(videos);
  } catch (error) {
    console.error('yt-search error:', error);
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}
