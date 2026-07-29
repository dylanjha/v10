import { createPlayer, PlayButton, SeekButton, Time, TimeSlider } from '@videojs/react';
import { Video, videoFeatures } from '@videojs/react/video';

const Player = createPlayer({ features: videoFeatures });

export default function BasicUsage() {
  return (
    <Player.Provider>
      <Player.Container className="media-container">
        <Video src="{{VJS10_DEMO_VIDEO_MP4}}" muted playsInline />
        <div className="controls">
          <PlayButton
            className="control-button"
            render={(props, state) => (
              <button {...props}>{state.ended ? 'Replay' : state.paused ? 'Play' : 'Pause'}</button>
            )}
          />
          <SeekButton seconds={-10} className="control-button" render={(props) => <button {...props}>-10s</button>} />
          <SeekButton seconds={10} className="control-button" render={(props) => <button {...props}>+10s</button>} />
          <Time.Group className="time-group">
            <Time.Value type="current" />
            <Time.Separator />
            <Time.Value type="duration" />
          </Time.Group>
        </div>
        <TimeSlider.Root className="media-time-slider">
          <TimeSlider.Track className="media-slider-track">
            <TimeSlider.Buffer className="media-slider-buffer" />
            <TimeSlider.Fill className="media-slider-fill" />
          </TimeSlider.Track>
          <TimeSlider.Thumb className="media-slider-thumb" />
        </TimeSlider.Root>
      </Player.Container>
    </Player.Provider>
  );
}
