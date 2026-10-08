import { useState, type FormEvent } from 'react';
import { Badge, Button, Card, Table, TextField, type Column } from '@harbor/ui';
import { PageHeader } from '../components/PageHeader';
import { ErrorState, LoadingBlock } from '../components/states';
import { useFetch } from '../lib/useFetch';
import { dayLabel } from '../lib/format';

type Place = { name: string; admin1?: string; country: string; latitude: number; longitude: number };
type Forecast = {
  current: { temperature_2m: number; apparent_temperature: number; relative_humidity_2m: number; wind_speed_10m: number };
  daily: { time: string[]; temperature_2m_max: number[]; temperature_2m_min: number[]; precipitation_probability_max: number[] };
};
type Row = { day: string; high: string; low: string; rain: number };

const DEFAULT_PLACE: Place = { name: 'Phoenix', admin1: 'Arizona', country: 'United States', latitude: 33.4484, longitude: -112.074 };
const label = (p: Place) => [p.name, p.admin1, p.country].filter(Boolean).join(', ');

const columns: Column<Row>[] = [
  { key: 'day', header: 'Day' },
  { key: 'high', header: 'High', align: 'end' },
  { key: 'low', header: 'Low', align: 'end' },
  { key: 'rain', header: 'Chance of rain', render: (r) => <Badge variant={r.rain >= 50 ? 'warning' : 'brand'}>{r.rain}%</Badge> },
];

export function Weather() {
  const [place, setPlace] = useState(DEFAULT_PLACE);
  const [text, setText] = useState('');
  const [searched, setSearched] = useState('');

  const search = useFetch<{ results?: Place[] }>(
    searched ? `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searched)}&count=5` : null,
  );
  const forecast = useFetch<Forecast>(
    `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
      '&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m' +
      '&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
      '&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto',
  );

  function onSearch(e: FormEvent) { e.preventDefault(); setSearched(text.trim().length > 1 ? text.trim() : ''); }
  function choose(p: Place) { setPlace(p); setSearched(''); setText(''); }

  const rows: Row[] = forecast.data
    ? forecast.data.daily.time.map((t, i) => ({
        day: dayLabel(t),
        high: `${Math.round(forecast.data!.daily.temperature_2m_max[i])}°F`,
        low: `${Math.round(forecast.data!.daily.temperature_2m_min[i])}°F`,
        rain: forecast.data!.daily.precipitation_probability_max[i] ?? 0,
      }))
    : [];

  return (
    <>
      <PageHeader title="Weather" description={`Current conditions and the 7-day forecast for ${label(place)}.`} />

      <form className="search" onSubmit={onSearch}>
        <TextField label="Search for a city" value={text} onChange={(e) => setText(e.target.value)} helperText="Type at least 2 letters, then search." />
        <Button type="submit" variant="secondary">Search</Button>
      </form>

      {searched && (
        <Card title="Search results">
          {search.loading && <LoadingBlock label="Searching cities" rows={2} />}
          {search.error && <ErrorState title="Couldn’t search cities" message={search.error} onRetry={search.retry} />}
          {search.data && !search.data.results?.length && <p className="muted">No cities match “{searched}”. Check the spelling or try a larger nearby city.</p>}
          {search.data?.results && (
            <ul className="results">
              {search.data.results.map((p) => (
                <li key={`${p.latitude},${p.longitude}`}><Button variant="ghost" size="sm" onClick={() => choose(p)}>{label(p)}</Button></li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {forecast.loading && <LoadingBlock label="Loading forecast" rows={4} />}
      {forecast.error && <ErrorState title="Couldn’t load the forecast" message={forecast.error} onRetry={forecast.retry} />}
      {forecast.data && (
        <>
          <div className="grid">
            <Card title={place.name} description="Right now"><p className="stat">{Math.round(forecast.data.current.temperature_2m)}°F</p></Card>
            <Card title="Feels like"><p className="stat">{Math.round(forecast.data.current.apparent_temperature)}°F</p></Card>
            <Card title="Humidity"><p className="stat">{forecast.data.current.relative_humidity_2m}%</p></Card>
            <Card title="Wind"><p className="stat">{Math.round(forecast.data.current.wind_speed_10m)} mph</p></Card>
          </div>
          <Table caption="7-day forecast" columns={columns} rows={rows} getRowId={(r) => r.day} emptyMessage="No forecast is available for this place." />
        </>
      )}
    </>
  );
}
