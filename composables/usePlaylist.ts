import type { Playlist, Track } from '~/types'

export const usePlaylist = () => {
  const fetchPlaylist = async () => {
    const config = useRuntimeConfig()

    const { data } = await useFetch<Playlist>(() => `${config.public.jamendoApiUrl}/?client_id=${config.public.jamendoApiClientKey}&format=jsonpretty&search=ambient`)

    return (data.value?.results || []) as Track[]
  }

  return {
    fetchPlaylist
  }
}
