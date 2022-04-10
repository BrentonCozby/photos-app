import { computed } from 'vue'
import { useQuery, UseQueryOptions } from 'vue-query'
import { useAuthStore } from '@/stores'
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
  const authStore = useAuthStore()
  const queryKey = ['photos', id]

  const queryOptions: UseQueryOptions = {
    enabled: computed(() => authStore.isAuthenticated),
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
