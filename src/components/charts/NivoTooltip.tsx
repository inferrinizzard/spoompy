import { type SliceTooltipProps } from '@nivo/line';

import store from '@/redux/store';

const tooltipStyle = {
  background: 'white',
  padding: '9px 12px',
  border: '1px solid #ccc',
};

export const NivoSliceTooltip: React.FC<SliceTooltipProps> = ({ slice }) => {
  const playlists = store.getState().playlist.playlists;

  return (
    <div style={tooltipStyle}>
      <div>{slice.points[0].data.x.toString()}</div>
      <table>
        {slice.points.map(point => (
          <tr key={`slice-tooltip-${point.id}`}>
            <td>
              <div
                style={{
                  height: '1rem',
                  width: '1rem',
                  aspectRatio: '1',
                  backgroundColor: point.serieColor,
                }}
              />
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
