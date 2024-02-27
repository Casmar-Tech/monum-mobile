import React, {useState, useEffect} from 'react';
import MediaExpanded from './MediaExpanded';
import MediaBubble from './MediaBubble';
import TrackPlayer, {
  Event,
  State,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {useApplicationStore} from '../../../zustand/ApplicationStore';

export default function MediaComponent() {
  const expandedMediaDetail = useApplicationStore(
    state => state.application.expandedMediaDetail,
  );
  const statePlayer = useApplicationStore(
    state => state.application.statePlayer,
  );
  const setStatePlayer = useApplicationStore(state => state.setStatePlayer);

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
