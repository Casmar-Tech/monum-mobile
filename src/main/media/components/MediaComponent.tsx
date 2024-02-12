import {useState, useEffect} from 'react';

import MediaExpanded from './MediaExpanded';
import MediaBubble from './MediaBubble';
import IPlace from '../../../shared/interfaces/IPlace';
import TrackPlayer, {
  Event,
  State,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';

interface MediaBubbleProps {
  mediaPlace: IPlace;
}

export default function MediaComponent({mediaPlace}: MediaBubbleProps) {
  const [expandedDetail, setExpandedDetail] = useState(false);

  const progress = useProgress();

  const [statePlayer, setStatePlayer] = useState(State.Paused);
  useTrackPlayerEvents([Event.PlaybackState], async event => {
    setStatePlayer(event.state);
  });

  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [trackTitle, setTrackTitle] = useState<string>();
  const [trackRating, setTrackRating] = useState<number>(0);
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const {title, rating} = track || {};
      setTrackTitle(title);
      setTrackRating(rating || 0);
      setCurrentTrack(event.nextTrack);
    }
  });

  useEffect(() => {
    async function getTrack() {
      const currentTrack = await TrackPlayer.getCurrentTrack();
      if (currentTrack !== null) {
        const state = await TrackPlayer.getState();
        const track = await TrackPlayer.getTrack(currentTrack);
        const {title, rating} = track || {};
        setTrackRating(rating || 0);
        setTrackTitle(title);
        setStatePlayer(state);
        setCurrentTrack(currentTrack);
      }
    }
    getTrack();
  }, []);

  return (
    currentTrack !== null &&
    trackTitle &&
    statePlayer !== State.None &&
    (expandedDetail ? (
      <MediaExpanded
        mediaPlace={mediaPlace}
        setExpandedDetail={setExpandedDetail}
        trackRating={trackRating}
        trackTitle={trackTitle}
        progress={progress}
        statePlayer={statePlayer}
        currentTrack={currentTrack}
      />
    ) : (
      <MediaBubble
        mediaPlace={mediaPlace}
        setExpandedDetail={setExpandedDetail}
        trackTitle={trackTitle}
        progress={progress}
        statePlayer={statePlayer}
        currentTrack={currentTrack}
      />
    ))
  );
}
