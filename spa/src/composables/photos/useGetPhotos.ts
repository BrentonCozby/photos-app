import { computed } from 'vue'
import { useQuery, UseQueryOptions } from 'vue-query'
import { useAuth0 } from '@auth0/auth0-vue'
import * as PhotosApi from '@/services/photosApi'

/**
 * Get one or many photos. Returns one photo if the `id` param is passed.
 * @param [args.id] - a photo id
 */
export const useGetPhotos = ({
  id,
  params,
}: {
  id?: string
  params?: {[key: string]: any}
} = {}) => {
  const auth0 = useAuth0()
  const queryKey = ['photos', id]

  const queryOptions: UseQueryOptions = {
    enabled: computed(() => !!auth0.isAuthenticated.value),
  }

  async function queryFunction() {
    const accessToken = await auth0.getAccessTokenSilently()

    if (id) {
      const photo = await PhotosApi.getOne({ accessToken, id })

      return [photo]
    }

    return PhotosApi.getMany({ accessToken, params })
  }

  return useQuery(queryKey, queryFunction, queryOptions)
}
