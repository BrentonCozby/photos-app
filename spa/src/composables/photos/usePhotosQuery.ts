import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

import { I_Photo } from '@/models'
import * as PhotoService from '@/services/photoService'
import { useAuthStore } from '@/stores'

/**
 * Get one or many photos. Returns one photo if the `id` param is passed.
 * @param [args.id] - a photo id
 */
export const usePhotosQuery = (args?: {
  id?: string
  params?: { [key: string]: any }
}) => {
  const { id, params } = args || {}
  const authStore = useAuthStore()

  async function queryFunction(): Promise<I_Photo[]> {
    if (id) {
      const photo = await PhotoService.getOne({ id })

      return [photo]
    }

    return PhotoService.getMany({ params })
  }

  return useQuery({
    queryKey: ['photos', id],
    queryFn: queryFunction,
    enabled: computed(() => authStore.isAuthenticated),
  })
}
