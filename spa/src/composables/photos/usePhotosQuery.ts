import { computed } from 'vue'
import { useQuery, UseQueryOptions } from 'vue-query'
import { useAuthStore } from '@/stores'
import * as PhotoService from '@/services/photoService'

/**
 * Get one or many photos. Returns one photo if the `id` param is passed.
 * @param [args.id] - a photo id
 */
export const usePhotosQuery = (args?: {
  id?: string
  params?: {[key: string]: any}
}) => {
  const { id, params } = args || {}
  const authStore = useAuthStore()
  const queryKey = ['photos', id]

  const queryOptions: UseQueryOptions = {
    enabled: computed(() => authStore.isAuthenticated),
  }

  async function queryFunction() {
    if (id) {
      const photo = await PhotoService.getOne({ id })

      return [photo]
    }

    return PhotoService.getMany({ params })
  }

  return useQuery(queryKey, queryFunction, queryOptions)
}
