import { useState } from 'react';
import { Badge, Table, Tabs, type Column } from '@harbor/ui';
import { PageHeader } from '../components/PageHeader';
import { ErrorState, LoadingBlock } from '../components/states';
import { useAsync } from '../lib/useAsync';

type Filter = 'airing' | 'popular' | 'upcoming';
type Media = { id: number; title: { romaji: string; english: string | null }; format: string | null; averageScore: number | null; episodes: number | null; status: string };
type Row = { id: string; pos: number; title: string; format: string; score: string; episodes: string; status: string };

const QUERY = `query ($sort: [MediaSort], $status: MediaStatus) {
  Page(page: 1, perPage: 10) {
    media(type: ANIME, sort: $sort, status: $status, isAdult: false) {
      id title { romaji english } format averageScore episodes status
    }
  }
}`;
const variables: Record<Filter, { sort: string[]; status?: string }> = {
  airing: { sort: ['TRENDING_DESC'], status: 'RELEASING' },
  popular: { sort: ['POPULARITY_DESC'] },
  upcoming: { sort: ['POPULARITY_DESC'], status: 'NOT_YET_RELEASED' },
};
const captions: Record<Filter, string> = { airing: 'Trending anime airing now', popular: 'Most popular anime', upcoming: 'Most anticipated upcoming anime' };
const statusLabels: Record<string, string> = { RELEASING: 'Airing', FINISHED: 'Finished', NOT_YET_RELEASED: 'Not yet released', CANCELLED: 'Cancelled', HIATUS: 'On hiatus' };
const formatLabels: Record<string, string> = { TV: 'TV', TV_SHORT: 'TV short', MOVIE: 'Movie', SPECIAL: 'Special', OVA: 'OVA', ONA: 'ONA', MUSIC: 'Music' };

async function loadAnime(filter: Filter, signal: AbortSignal): Promise<Media[]> {
  const res = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query: QUERY, variables: variables[filter] }),
  });
  if (!res.ok) throw new Error(res.status === 429 ? 'AniList is limiting requests right now. Wait a minute.' : `The server answered with status ${res.status}.`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data.Page.media as Media[];
}

const statusBadge = (label: string) => (
  <Badge variant={label === 'Airing' ? 'success' : label === 'Not yet released' ? 'brand' : label === 'On hiatus' ? 'warning' : 'neutral'}>{label}</Badge>
);
const columns: Column<Row>[] = [
  { key: 'pos', header: '#', align: 'end' },
  { key: 'title', header: 'Title' },
  { key: 'format', header: 'Format' },
  { key: 'score', header: 'Score (of 100)', align: 'end' },
  { key: 'episodes', header: 'Episodes', align: 'end' },
  { key: 'status', header: 'Status', render: (r) => statusBadge(r.status) },
];

function AnimeList({ filter }: { filter: Filter }) {
  const { data, error, loading, retry } = useAsync(`anilist:${filter}`, (signal) => loadAnime(filter, signal));
  if (loading) return <LoadingBlock label="Loading anime" rows={5} />;
  if (error || !data) return <ErrorState title="Couldn’t load anime" message={error ?? 'No data came back.'} onRetry={retry} />;
  const rows: Row[] = data.map((m, i) => ({
    id: String(m.id), pos: i + 1, title: m.title.english ?? m.title.romaji,
    format: m.format ? formatLabels[m.format] ?? m.format : '—',
    score: m.averageScore?.toString() ?? '—', episodes: m.episodes?.toString() ?? '—',
    status: statusLabels[m.status] ?? m.status,
  }));
  return <Table caption={captions[filter]} columns={columns} rows={rows} getRowId={(r) => r.id} emptyMessage="Nothing to show for this list yet." />;
}

export function Anime() {
  const [tab, setTab] = useState<string>('airing');
  return (
    <>
      <PageHeader title="Anime" description="Top lists from the AniList API." />
      <Tabs
        aria-label="Anime lists"
        value={tab}
        onValueChange={setTab}
        tabs={[
          { id: 'airing', label: 'Airing now', panel: <AnimeList filter="airing" /> },
          { id: 'popular', label: 'Most popular', panel: <AnimeList filter="popular" /> },
          { id: 'upcoming', label: 'Upcoming', panel: <AnimeList filter="upcoming" /> },
        ]}
      />
    </>
  );
}