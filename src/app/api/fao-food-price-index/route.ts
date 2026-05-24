const FAO_CSV_URL = 'https://www.fao.org/media/docs/worldfoodsituationlibraries/default-document-library/food_price_indices_data.csv?sfvrsn=523ebd2a_79&download=true';

export const revalidate = 43200;

type FaoRecord = {
  date: string;
  food: number;
  meat: number;
  dairy: number;
  cereals: number;
  oils: number;
  sugar: number;
};

function parseCsv(csv: string): FaoRecord[] {
  return csv
    .split(/\r?\n/)
    .filter((line) => /^\d{4}-\d{2},/.test(line))
    .map((line) => {
      const [date, food, meat, dairy, cereals, oils, sugar] = line.split(',');

      return {
        date,
        food: Number(food),
        meat: Number(meat),
        dairy: Number(dairy),
        cereals: Number(cereals),
        oils: Number(oils),
        sugar: Number(sugar),
      };
    })
    .filter((record) => Object.values(record).every((value) => value !== '' && !Number.isNaN(value)));
}

export async function GET() {
  try {
    const response = await fetch(FAO_CSV_URL, {
      next: { revalidate },
      headers: {
        Accept: 'text/csv,text/plain;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`FAO request failed with status ${response.status}`);
    }

    const csv = await response.text();
    const records = parseCsv(csv);

    if (records.length < 13) {
      throw new Error('Insufficient FAO data to build index response');
    }

    const latest = records[records.length - 1];
    const previous = records[records.length - 2];
    const series = records.slice(-12);

    return Response.json({
      latest,
      previous,
      series,
      source: 'fao-csv',
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to fetch FAO food price index:', error);

    return Response.json(
      { error: 'Unable to fetch FAO food price index data right now.' },
      { status: 500 }
    );
  }
}
