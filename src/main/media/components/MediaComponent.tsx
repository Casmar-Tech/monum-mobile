import {useState, useEffect} from 'react';
import MediaExpanded from './MediaExpanded';
import MediaBubble from './MediaBubble';
import TrackPlayer, {
  Event,
  State,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {useTabMapStore} from '../../../zustand/TabMapStore';
import {useMainStore} from '../../../zustand/MainStore';
import {getPlaybackState} from 'react-native-track-player/lib/trackPlayer';

export default function MediaComponent() {
  const expandedMediaDetail = useTabMapStore(
    state => state.tabMap.expandedMediaDetail,
  );
  const statePlayer = useMainStore(state => state.main.statePlayer);
  const setStatePlayer = useMainStore(state => state.setStatePlayer);

  const progress = useProgress();

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
      const currentTrackIndex = await TrackPlayer.getActiveTrackIndex();
      if (currentTrackIndex) {
        const state = (await getPlaybackState()).state;
        const track = await TrackPlayer.getTrack(currentTrackIndex);
        const {title, rating} = track || {};
        setTrackRating(rating || 0);
        setTrackTitle(title);
        setStatePlayer(state);
        setCurrentTrack(currentTrackIndex);
      }
    }
    getTrack();
  }, []);

  return (
    currentTrack !== null &&
    trackTitle &&
    statePlayer !== State.None &&
    (expandedMediaDetail ? (
      <MediaExpanded
        trackRating={trackRating}
        trackTitle={trackTitle}
        progress={progress}
        currentTrack={currentTrack}
      />
    ) : (
      <MediaBubble
        trackTitle={trackTitle}
        progress={progress}
        currentTrack={currentTrack}
      />
    ))
  );
}
