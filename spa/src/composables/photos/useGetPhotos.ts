import { computed } from 'vue'
import { useQuery, UseQueryOptions } from 'vue-query'
import { useAuthService } from '../auth'
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
  const { isAuthenticated } = useAuthService()
  const queryKey = ['photos', id]

  const queryOptions: UseQueryOptions = {
    enabled: computed(() => isAuthenticated.value),
  }

  async function queryFunction() {
    if (id) {
      const photo = await PhotosApi.getOne({ id })

      return [photo]
    }

    return PhotosApi.getMany({ params })
  }

  return useQuery(queryKey, queryFunction, queryOptions)
}
