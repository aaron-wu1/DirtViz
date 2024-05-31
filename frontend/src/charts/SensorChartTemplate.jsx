import { React } from 'react';
import 'chartjs-adapter-luxon';
import PropTypes from 'prop-types';
import ChartWrapper from './ChartWrapper';
import { chartPlugins } from './plugins';
import { getMaxAxisAndStepValues } from './alignAxis';

export default function SensorChartTemplate({ data }) {
  const { leftYMax, leftYStep } = getMaxAxisAndStepValues(data.datasets, [], 8, .2);
  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        position: 'bottom',
        title: {
          display: true,
          text: 'Time',
        },
        type: 'time',
        ticks: {
          autoSkip: false,
          autoSkipPadding: 50,
          maxRotation: 0,
          major: {
            enabled: true,
          },
        },
        time: {
          displayFormats: {
            hour: 'hh:mm a',
            day: 'D',
          },
        },
      },
      leafAxis: {
        position: 'left',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Leaf Wetness (V)',
        },
        min: 0,
        max: 1.6,
      },
    },
    plugins: structuredClone(chartPlugins),
  };

  return <ChartWrapper id='vwc' data={data} options={chartOptions} />;
}

SensorChartTemplate.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
};
