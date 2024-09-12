
/**
 * This composable handles fetching the playlist data from the Jamendo API.
 * - `fetchPlaylist`: Fetches a list of tracks from the API using the `jamendoApiUrl` and `jamendoApiClientKey` from the runtime configuration.
 * - The fetched data is returned as an array of `Track` objects .
 * - This function can be used in other components or stores to retrieve the playlist.
 */
import type { Playlist, Track } from '~/types'

export const usePlaylist = () => {
  const fetchPlaylist = async () => {
    const config = useRuntimeConfig()

    const { data } = await useFetch<Playlist>(() => `${config.public.jamendoApiUrl}/?client_id=${config.public.jamendoApiClientKey}&format=jsonpretty&limit=200&offset=0`)

    return (data.value?.results || []) as Track[]
  }

  return {
    fetchPlaylist
  }
}
