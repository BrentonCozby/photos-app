import { useMutation, useQueryClient } from 'vue-query'

import { I_PhotoNew } from '@/models'
import * as PhotoService from '@/services/photoService'

/**
 * Create a new photo
 * @param args.photoData - the data for a new photo
 */
export const useCreatePhotoMutation = () => {
  const queryClient = useQueryClient()

  async function mutationFunction(args: {
    photoData: I_PhotoNew
  }) {
    const { photoData } = args

    return PhotoService.postOne({ photoData })
  }

  return useMutation(mutationFunction, {
    onSuccess() {
      queryClient.invalidateQueries('photos')
    },
  })
}
