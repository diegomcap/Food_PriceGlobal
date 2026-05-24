'use client';

import Highcharts from 'highcharts';
import 'highcharts/highcharts-more';
import 'highcharts/modules/variable-pie';
import HighchartsReact from 'highcharts-react-official';
import type { Options } from 'highcharts';
import { formatPercent } from '@/lib/marketOverview';
import type { DriverSlice } from '@/lib/agroVisualData';

type Props = {
  titleImpact: string;
  titleChange: string;
  titlePrice: string;
  slices: DriverSlice[];
};

function driverColor(symbol: DriverSlice['id']) {
  switch (symbol) {
    case 'CL=F':
      return '#f97316';
    case 'NG=F':
      return '#38bdf8';
    case 'GC=F':
      return '#facc15';
    default:
      return '#22c55e';
  }
}

export default function MacroDriversVariablePie({
  titleImpact,
  titleChange,
  titlePrice,
  slices,
}: Props) {
  const options: Options = {
    chart: {
      type: 'variablepie',
      backgroundColor: 'transparent',
      height: 360,
    },
    title: undefined,
    credits: { enabled: false },
    exporting: { enabled: false },
    tooltip: {
      useHTML: true,
      pointFormatter: function (this: any) {
        return `
          <div style="min-width:180px">
            <div style="font-size:13px;font-weight:700;margin-bottom:8px">${this.name}</div>
            <div style="font-size:12px;line-height:1.7">
              <div>${titleImpact}: <b>${this.y}</b></div>
              <div>${titleChange}: <b>${formatPercent(this.custom.change)}</b></div>
              <div>${titlePrice}: <b>${this.custom.price.toFixed(2)} ${this.custom.unit}</b></div>
            </div>
          </div>
        `;
      },
    },
    plotOptions: {
      variablepie: {
        minPointSize: 24,
        innerSize: '18%',
        borderColor: 'rgba(15,23,42,0.12)',
        borderWidth: 2,
        dataLabels: {
          enabled: true,
          format: '{point.name}',
          style: {
            color: '#e2e8f0',
            textOutline: 'none',
            fontSize: '12px',
          },
        },
      },
    },
    series: [
      {
        type: 'variablepie',
        data: slices.map((slice) => ({
          name: slice.label,
          y: slice.impact,
          z: slice.z,
          color: driverColor(slice.id),
          custom: {
            change: slice.change,
            price: slice.price,
            unit: slice.unit,
          },
        })),
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
