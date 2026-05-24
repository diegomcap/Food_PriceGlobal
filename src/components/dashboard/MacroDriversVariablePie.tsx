'use client';

import Highcharts from 'highcharts';
import 'highcharts/highcharts-more';
import 'highcharts/modules/variable-pie';
import HighchartsReact from 'highcharts-react-official';
import type { Options } from 'highcharts';
import type { MacroHubPoint } from '@/lib/agroVisualData';

type Props = {
  titlePressure: string;
  titleTopDriver: string;
  titleCorridor: string;
  hubs: MacroHubPoint[];
  selectedCode: string;
  onSelect: (code3: string) => void;
};

function sliceColor(rank: number) {
  const palette = ['#0f766e', '#0284c7', '#4f46e5', '#f59e0b', '#ea580c', '#7c3aed'];
  return palette[rank % palette.length];
}

export default function MacroDriversVariablePie({
  titlePressure,
  titleTopDriver,
  titleCorridor,
  hubs,
  selectedCode,
  onSelect,
}: Props) {
  const selectedIndex = Math.max(
    hubs.findIndex((hub) => hub.code3 === selectedCode),
    0
  );

  const options: Options = {
    chart: {
      type: 'variablepie',
      backgroundColor: 'transparent',
      height: 500,
    },
    title: undefined,
    credits: { enabled: false },
    exporting: { enabled: false },
    legend: { enabled: false },
    tooltip: {
      useHTML: true,
      pointFormatter: function (this: any) {
        return `
          <div style="min-width:220px;color:#0f172a">
            <div style="font-size:13px;font-weight:700;margin-bottom:8px">${this.name}</div>
            <div style="font-size:12px;line-height:1.7">
              <div>${titlePressure}: <b>${this.y}</b></div>
              <div>${titleTopDriver}: <b>${this.custom.topDriver}</b></div>
              <div>${titleCorridor}: <b>${this.custom.corridor}</b></div>
            </div>
          </div>
        `;
      },
    },
    plotOptions: {
      variablepie: {
        minPointSize: 18,
        innerSize: '12%',
        borderColor: 'rgba(255,255,255,0.95)',
        borderWidth: 2,
        slicedOffset: 10,
        dataLabels: {
          enabled: true,
          format: '{point.custom.short}',
          distance: 14,
          style: {
            color: '#334155',
            textOutline: 'none',
            fontSize: '11px',
            fontWeight: '700',
          },
        },
        point: {
          events: {
            click: function (this: any) {
              if (this.custom.code3) {
                onSelect(this.custom.code3);
              }
            },
          },
        },
      },
      series: {
        dataLabels: {
          crop: false,
          overflow: 'allow',
        },
      },
    },
    series: [
      {
        type: 'variablepie',
        data: hubs.map((hub, index) => {
          const topDriver = hub.slices.slice().sort((a, b) => b.impact - a.impact)[0];

          return {
            name: hub.country,
            y: hub.totalPressure,
            z: topDriver?.impact ?? hub.totalPressure,
            sliced: index === selectedIndex,
            selected: index === selectedIndex,
            color: sliceColor(index),
          custom: {
              code3: hub.code3,
              corridor: hub.corridor,
              topDriver: topDriver?.label ?? '--',
              short: hub.code3,
            },
          };
        }),
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
