import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  play: (episodes: Episode) => void;
  setPlayingState: (state: boolean) => void;
  playList: (list: Episode[], index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  clearPlayerState: () => void;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps ={
  children: ReactNode;
}

export function PlayerContextProvider({children}: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  
  const hasPrevious = currentEpisodeIndex > 0
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length


  function play(episode: Episode){
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number){
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay(){
    setIsPlaying(!isPlaying);
  }

  function toggleLoop(){
    setIsLooping(!isLooping);
  }

  function toggleShuffle(){
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state);
  }

  function playNext(){
    const nextEpisodeIndex = currentEpisodeIndex + 1

    if(isShuffling){
       const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
       setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    } else if (hasNext) {
      setCurrentEpisodeIndex(nextEpisodeIndex)
    }
  }

  function playPrevious(){
    if (hasPrevious){
      setCurrentEpisodeIndex(previousEpisodeIndex)
    }
  }

  function clearPlayerState(){
    setEpisodeList = [];
    setCurrentEpisodeIndex = 0;
  }

  return (
    <PlayerContext.Provider 
      value={{ 
        episodeList, 
        currentEpisodeIndex,
        play,
        isPlaying,
        isLooping,
        isShuffling,
        playList,
        togglePlay,
        playNext, 
        playPrevious,
        setPlayingState,
        hasPrevious,
        hasNext,
        toggleLoop,
        toggleShuffle,
        clearPlayerState
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}