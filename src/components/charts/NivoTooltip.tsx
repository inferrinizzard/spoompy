import { type BarTooltipProps } from '@nivo/bar';
import { type SliceTooltipProps } from '@nivo/line';

import store from '@/redux/store';
import { formatDate } from '@/utils/dateFormat';

interface ColourSquareProps {
  colour: string;
}

const ColourSquare: React.FC<ColourSquareProps> = ({ colour }) => (
  <div
    style={{
      height: '1rem',
      width: '1rem',
      aspectRatio: '1',
      backgroundColor: colour,
    }}
  />
);

const tooltipStyle = {
  background: 'white',
  padding: '9px 12px',
  border: '1px solid #ccc',
};

export const NivoSliceTooltip: React.FC<SliceTooltipProps> = ({ slice }) => {
  const playlists = store.getState().playlist.playlists;

  return (
    <div style={tooltipStyle}>
      <div>{formatDate(slice.points[0].data.x as Date, 'day')}</div>
      <table>
        {slice.points.map(point => (
          <tr key={`slice-tooltip-${point.id}`}>
            <td>
              <ColourSquare colour={point.serieColor} />
            </td>
            <td>{playlists[point.serieId].name}</td>
            <td>
              <b>{point.index}</b>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export const NivoBarTooltip = <T,>(props: BarTooltipProps<T>) => {
  const playlists = store.getState().playlist.playlists;

  return (
    <div style={{ ...tooltipStyle, display: 'flex', gap: '0.5rem' }}>
      <div>
        <ColourSquare colour={props.color} />
      </div>
      <div>{playlists[props.indexValue].name}</div>
      <div>-</div>
      <div>
        <b>{props.value}</b>
      </div>
    </div>
  );
};
