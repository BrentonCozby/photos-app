import { useMutation, useQueryClient } from 'vue-query'
import * as PhotoService from '@/services/photoService'
import { I_PhotoUpdate } from '@/types'

/**
 * Updates a photo
 * @param args.photoData - the data for a new photo
 */
export const useUpdatePhotoMutation = () => {
  const queryClient = useQueryClient()

  async function mutationFunction(args: {
    photoData: I_PhotoUpdate
  }) {
    const { photoData } = args

    return PhotoService.patchOne({ photoData })
  }

  return useMutation(mutationFunction, {
    onSuccess() {
      queryClient.invalidateQueries('photos')
    },
  })
}
