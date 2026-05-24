'use client';

import Highcharts from 'highcharts';
import 'highcharts/highcharts-more';
import 'highcharts/modules/variable-pie';
import HighchartsReact from 'highcharts-react-official';
import type { Options } from 'highcharts';
import type { MacroHubPoint } from '@/lib/agroVisualData';

type Props = {
  title: string;
  subtitle: string;
  measureLabel: string;
  reserveLabel: string;
  hubs: MacroHubPoint[];
  selectedCode: string;
  onSelect: (code3: string) => void;
};

function sliceColor(rank: number) {
  const palette = ['#0f766e', '#0284c7', '#4f46e5', '#f59e0b', '#ea580c', '#7c3aed'];
  return palette[rank % palette.length];
}

export default function MacroDriversVariablePie({
  title,
  subtitle,
  measureLabel,
  reserveLabel,
  hubs,
  selectedCode,
  onSelect,
}: Props) {
  const pieData = hubs.map((hub, index) => {
    const topDriver = hub.slices.slice().sort((a, b) => b.impact - a.impact)[0];
    const dominantPressure = topDriver?.impact ?? hub.totalPressure;

    return {
      name: hub.country,
      y: dominantPressure,
      z: hub.totalPressure,
      sliced: hub.code3 === selectedCode,
      selected: hub.code3 === selectedCode,
      color: sliceColor(index),
      custom: {
        code3: hub.code3,
        short: hub.code3,
        corridor: hub.corridor,
        topDriver: topDriver?.label ?? '--',
        totalPressure: hub.totalPressure,
      },
    };
  });

  const options: Options = {
    chart: {
      type: 'variablepie',
      backgroundColor: 'transparent',
      height: 540,
      spacingTop: 16,
      spacingBottom: 10,
    },
    title: {
      text: title,
      align: 'center',
      style: {
        color: '#0f172a',
        fontSize: '28px',
        fontWeight: '700',
      },
    },
    subtitle: {
      text: subtitle,
      align: 'center',
      style: {
        color: '#475569',
        fontSize: '13px',
      },
    },
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
              <div>${measureLabel}: <b>${this.y}</b></div>
              <div>${reserveLabel}: <b>${this.custom.totalPressure}</b></div>
              <div>Driver: <b>${this.custom.topDriver}</b></div>
            </div>
          </div>
        `;
      },
    },
    plotOptions: {
      variablepie: {
        minPointSize: 34,
        innerSize: '18%',
        borderColor: '#ffffff',
        borderWidth: 2,
        crisp: true,
        slicedOffset: 12,
        sizeBy: 'area',
        dataLabels: {
          enabled: true,
          format: '{point.custom.short}',
          distance: 12,
          style: {
            color: '#334155',
            textOutline: 'none',
            fontSize: '12px',
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
        data: pieData,
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
